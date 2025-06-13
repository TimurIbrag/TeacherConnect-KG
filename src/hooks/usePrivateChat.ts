
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatRoom, ChatMessage } from '@/types/chat';

// Mock data for development - replace with real API calls
const mockChatRooms: ChatRoom[] = [
  {
    id: 'room1',
    participant_a: 'teacher1',
    participant_b: 'school1',
    created_at: new Date().toISOString(),
    last_message: {
      id: 'msg1',
      chat_room_id: 'room1',
      sender_id: 'school1',
      text: 'Здравствуйте! Интересует ваша кандидатура на позицию учителя математики.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    unread_count: 1,
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  room1: [
    {
      id: 'msg1',
      chat_room_id: 'room1',
      sender_id: 'school1',
      text: 'Здравствуйте! Интересует ваша кандидатура на позицию учителя математики.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
  ],
};

export const usePrivateChat = (currentUserId: string) => {
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize chat data
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Filter chat rooms where current user is a participant
        const userChatRooms = mockChatRooms.filter(
          room => room.participant_a === currentUserId || room.participant_b === currentUserId
        );
        
        setChatRooms(userChatRooms);
        setMessages(mockMessages);
        setIsConnected(true);
        
        console.log('Private chat initialized for user:', currentUserId);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: "Ошибка подключения",
          description: "Не удалось загрузить чаты. Попробуйте обновить страницу.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      initializeChat();
    }
  }, [currentUserId, toast]);

  // Send message function
  const sendMessage = useCallback(async (chatRoomId: string, text: string) => {
    if (!text.trim()) return;

    try {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        chat_room_id: chatRoomId,
        sender_id: currentUserId,
        text: text.trim(),
        created_at: new Date().toISOString(),
        read: true,
      };

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [chatRoomId]: [...(prev[chatRoomId] || []), newMessage],
      }));

      // Update chat room's last message
      setChatRooms(prev => 
        prev.map(room => 
          room.id === chatRoomId 
            ? { ...room, last_message: newMessage }
            : room
        )
      );

      console.log('Message sent:', newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Ошибка отправки",
        description: "Сообщение не отправлено. Попробуйте еще раз.",
        variant: "destructive",
      });
      throw error;
    }
  }, [currentUserId, toast]);

  // Create new chat room
  const createChatRoom = useCallback(async (otherUserId: string) => {
    try {
      // Check if chat room already exists
      const existingRoom = chatRooms.find(room => 
        (room.participant_a === currentUserId && room.participant_b === otherUserId) ||
        (room.participant_a === otherUserId && room.participant_b === currentUserId)
      );

      if (existingRoom) {
        return existingRoom.id;
      }

      // Create new chat room
      const newRoom: ChatRoom = {
        id: `chat_${[currentUserId, otherUserId].sort().join('_')}`,
        participant_a: currentUserId,
        participant_b: otherUserId,
        created_at: new Date().toISOString(),
        unread_count: 0,
      };

      setChatRooms(prev => [newRoom, ...prev]);
      setMessages(prev => ({ ...prev, [newRoom.id]: [] }));

      console.log('New chat room created:', newRoom);
      return newRoom.id;
    } catch (error) {
      console.error('Failed to create chat room:', error);
      toast({
        title: "Ошибка создания чата",
        description: "Не удалось создать новый чат. Попробуйте еще раз.",
        variant: "destructive",
      });
      throw error;
    }
  }, [currentUserId, chatRooms, toast]);

  // Mark messages as read
  const markMessagesAsRead = useCallback((chatRoomId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatRoomId]: (prev[chatRoomId] || []).map(msg => ({ ...msg, read: true })),
    }));

    setChatRooms(prev => 
      prev.map(room => 
        room.id === chatRoomId 
          ? { ...room, unread_count: 0 }
          : room
      )
    );
  }, []);

  // Get or create chat room for a specific chat ID
  const getOrCreateChatRoom = useCallback(async (chatRoomId: string) => {
    // Check if the chat room already exists
    const existingRoom = chatRooms.find(room => room.id === chatRoomId);
    if (existingRoom) {
      return existingRoom;
    }

    // Extract participants from chat room ID (format: chat_userId1_userId2)
    const participants = chatRoomId.replace('chat_', '').split('_');
    const otherUserId = participants.find(id => id !== currentUserId);
    
    if (otherUserId) {
      // Create new chat room
      const newRoom: ChatRoom = {
        id: chatRoomId,
        participant_a: currentUserId,
        participant_b: otherUserId,
        created_at: new Date().toISOString(),
        unread_count: 0,
      };

      setChatRooms(prev => [newRoom, ...prev]);
      setMessages(prev => ({ ...prev, [chatRoomId]: [] }));

      console.log('Chat room created from ID:', newRoom);
      return newRoom;
    }

    return null;
  }, [currentUserId, chatRooms]);

  return {
    chatRooms,
    messages,
    isLoading,
    isConnected,
    sendMessage,
    createChatRoom,
    markMessagesAsRead,
    getOrCreateChatRoom,
  };
};
