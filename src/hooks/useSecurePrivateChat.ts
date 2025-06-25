
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText } from '@/lib/security';

interface ChatRoom {
  id: string;
  participant_a: string;
  participant_b: string;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  unread_count?: number;
}

interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read: boolean;
}

export const useSecurePrivateChat = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Security: Only proceed if user is authenticated
  const isAuthenticated = user && profile;

  // Initialize chat data with proper authentication
  useEffect(() => {
    const initializeChat = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user's chat rooms with last message info
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select(`
            *,
            chat_messages!inner (
              id,
              text,
              created_at,
              sender_id,
              read
            )
          `)
          .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (roomsError) throw roomsError;

        // Process rooms and get last messages
        const processedRooms: ChatRoom[] = [];
        const messagesByRoom: Record<string, ChatMessage[]> = {};

        for (const room of roomsData || []) {
          // Get all messages for this room
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_room_id', room.id)
            .order('created_at', { ascending: true });

          if (messagesError) throw messagesError;

          messagesByRoom[room.id] = messagesData || [];

          // Find last message and unread count
          const lastMessage = messagesData && messagesData.length > 0 
            ? messagesData[messagesData.length - 1] 
            : undefined;

          const unreadCount = messagesData?.filter(
            msg => !msg.read && msg.sender_id !== user.id
          ).length || 0;

          processedRooms.push({
            id: room.id,
            participant_a: room.participant_a,
            participant_b: room.participant_b,
            created_at: room.created_at,
            updated_at: room.updated_at,
            last_message: lastMessage,
            unread_count: unreadCount,
          });
        }

        setChatRooms(processedRooms);
        setMessages(messagesByRoom);
        setIsConnected(true);
        
        console.log('Secure private chat initialized for user:', user.id);
      } catch (error) {
        console.error('Failed to initialize secure chat:', error);
        toast({
          title: "Ошибка подключения",
          description: "Не удалось загрузить чаты. Попробуйте обновить страницу.",
          variant: "destructive",
        });
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // Set up real-time subscription for new messages
    if (isAuthenticated) {
      const channel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages'
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage;
            setMessages(prev => ({
              ...prev,
              [newMessage.chat_room_id]: [
                ...(prev[newMessage.chat_room_id] || []),
                newMessage
              ]
            }));

            // Update chat room's last message
            setChatRooms(prev => 
              prev.map(room => 
                room.id === newMessage.chat_room_id 
                  ? { 
                      ...room, 
                      last_message: newMessage,
                      unread_count: newMessage.sender_id !== user.id 
                        ? (room.unread_count || 0) + 1 
                        : room.unread_count 
                    }
                  : room
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, user, toast]);

  // Secure message sending with validation
  const sendMessage = useCallback(async (chatRoomId: string, text: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для отправки сообщений.",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim()) return;

    try {
      // Security: Sanitize input
      const sanitizedText = sanitizeText(text);
      
      if (sanitizedText.length === 0) {
        throw new Error('Сообщение содержит недопустимые символы');
      }

      if (sanitizedText.length > 5000) {
        throw new Error('Сообщение слишком длинное (максимум 5000 символов)');
      }

      // Security: Verify user can send messages to this room
      const chatRoom = chatRooms.find(room => room.id === chatRoomId);
      if (!chatRoom || (chatRoom.participant_a !== user.id && chatRoom.participant_b !== user.id)) {
        throw new Error('У вас нет доступа к этому чату');
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: chatRoomId,
          sender_id: user.id,
          text: sanitizedText,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Secure message sent:', data);
    } catch (error: any) {
      console.error('Failed to send secure message:', error);
      toast({
        title: "Ошибка отправки",
        description: error.message || "Сообщение не отправлено. Попробуйте еще раз.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isAuthenticated, user, chatRooms, toast]);

  // Enhanced chat room creation with mock teacher support
  const createChatRoom = useCallback(async (otherUserId: string) => {
    if (!isAuthenticated) {
      throw new Error('Требуется авторизация');
    }

    try {
      // Handle mock teachers differently
      if (otherUserId.startsWith('mock_teacher_')) {
        // For mock teachers, we need to create a special chat room that works with mock data
        const chatRoomId = `chat_${[user.id, otherUserId].sort().join('_')}`;
        
        // Check if chat room already exists
        const existingRoom = chatRooms.find(room => room.id === chatRoomId);
        if (existingRoom) {
          return existingRoom.id;
        }

        // Create mock chat room entry in Supabase with special handling
        const { data, error } = await supabase
          .from('chat_rooms')
          .insert({
            id: chatRoomId,
            participant_a: user.id,
            participant_b: otherUserId, // This will be our mock teacher ID
          })
          .select()
          .single();

        if (error) {
          // If there's a foreign key constraint error, it's expected for mock teachers
          // We'll create a local-only chat room
          console.log('Creating local chat room for mock teacher:', error);
          
          const mockRoom: ChatRoom = {
            id: chatRoomId,
            participant_a: user.id,
            participant_b: otherUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            unread_count: 0,
          };

          // Add to local state
          setChatRooms(prev => [mockRoom, ...prev]);
          setMessages(prev => ({ ...prev, [mockRoom.id]: [] }));

          console.log('Mock chat room created locally:', mockRoom);
          return mockRoom.id;
        }

        // Add to local state if created successfully
        setChatRooms(prev => [data, ...prev]);
        setMessages(prev => ({ ...prev, [data.id]: [] }));

        console.log('Mock chat room created in Supabase:', data);
        return data.id;
      }

      // For real users, validate they exist and have compatible role
      const { data: otherProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', otherUserId)
        .single();

      if (profileError) throw new Error('Пользователь не найден');

      // Security: Ensure different roles (teacher <-> school only)
      if (!profile || !otherProfile) {
        throw new Error('Профили пользователей не найдены');
      }

      const allowedCombinations = [
        ['teacher', 'school'],
        ['school', 'teacher']
      ];

      const isValidCombination = allowedCombinations.some(
        ([role1, role2]) => 
          (profile.role === role1 && otherProfile.role === role2)
      );

      if (!isValidCombination) {
        throw new Error('Сообщения доступны только между учителями и школами');
      }

      // Generate deterministic chat room ID
      const participants = [user.id, otherUserId].sort();
      const chatRoomId = `chat_${participants.join('_')}`;

      // Check if chat room already exists
      const existingRoom = chatRooms.find(room => room.id === chatRoomId);
      if (existingRoom) {
        return existingRoom.id;
      }

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          id: chatRoomId,
          participant_a: participants[0],
          participant_b: participants[1],
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setChatRooms(prev => [data, ...prev]);
      setMessages(prev => ({ ...prev, [data.id]: [] }));

      console.log('Secure chat room created:', data);
      return data.id;
    } catch (error: any) {
      console.error('Failed to create secure chat room:', error);
      toast({
        title: "Ошибка создания чата",
        description: error.message || "Не удалось создать новый чат.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isAuthenticated, user, profile, chatRooms, toast]);

  // Secure message read marking
  const markMessagesAsRead = useCallback(async (chatRoomId: string) => {
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('chat_room_id', chatRoomId)
        .neq('sender_id', user.id);

      if (error) throw error;

      // Update local state
      setMessages(prev => ({
        ...prev,
        [chatRoomId]: (prev[chatRoomId] || []).map(msg => 
          msg.sender_id !== user.id ? { ...msg, read: true } : msg
        ),
      }));

      setChatRooms(prev => 
        prev.map(room => 
          room.id === chatRoomId 
            ? { ...room, unread_count: 0 }
            : room
        )
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [isAuthenticated, user]);

  // Get or create chat room securely
  const getOrCreateChatRoom = useCallback(async (chatRoomId: string) => {
    if (!isAuthenticated) return null;

    // Check if the chat room already exists
    const existingRoom = chatRooms.find(room => room.id === chatRoomId);
    if (existingRoom) {
      return existingRoom;
    }

    // Extract participants from chat room ID
    const participants = chatRoomId.replace('chat_', '').split('_');
    const otherUserId = participants.find(id => id !== user.id);
    
    if (otherUserId) {
      try {
        await createChatRoom(otherUserId);
        return chatRooms.find(room => room.id === chatRoomId) || null;
      } catch (error) {
        console.error('Failed to create chat room from ID:', error);
        return null;
      }
    }

    return null;
  }, [isAuthenticated, user, chatRooms, createChatRoom]);

  return {
    chatRooms,
    messages,
    isLoading,
    isConnected: isConnected && isAuthenticated,
    sendMessage,
    createChatRoom,
    markMessagesAsRead,
    getOrCreateChatRoom,
    isAuthenticated,
  };
};
