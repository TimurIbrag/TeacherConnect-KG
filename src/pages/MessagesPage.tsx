
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PrivateChatList from '@/components/chat/PrivateChatList';
import PrivateChatWindow from '@/components/chat/PrivateChatWindow';
import { usePrivateChat } from '@/hooks/usePrivateChat';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setCurrentUserId(userData.email || 'current_user');
    } else {
      navigate('/login');
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к сообщениям",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const {
    chatRooms,
    messages,
    isLoading,
    isConnected,
    sendMessage,
    markMessagesAsRead,
    getOrCreateChatRoom,
  } = usePrivateChat(currentUserId);

  // Handle chat selection
  const handleSelectChat = (selectedChatRoomId: string) => {
    markMessagesAsRead(selectedChatRoomId);
    if (window.innerWidth < 768) {
      // On mobile, navigate to the chat room
      navigate(`/messages/${selectedChatRoomId}`);
    }
  };

  // Handle sending message
  const handleSendMessage = async (text: string) => {
    if (!chatRoomId) return;
    
    // Make sure the chat room exists
    await getOrCreateChatRoom(chatRoomId);
    await sendMessage(chatRoomId, text);
  };

  // Get current chat room
  const currentChatRoom = chatRoomId 
    ? chatRooms.find(room => room.id === chatRoomId)
    : null;

  // If chat room doesn't exist yet, create it
  useEffect(() => {
    if (chatRoomId && !currentChatRoom && currentUserId) {
      getOrCreateChatRoom(chatRoomId);
    }
  }, [chatRoomId, currentChatRoom, currentUserId, getOrCreateChatRoom]);

  // Get messages for current chat room
  const currentMessages = chatRoomId ? (messages[chatRoomId] || []) : [];

  // Handle back to list (mobile)
  const handleBackToList = () => {
    navigate('/messages');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Приватные сообщения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(80vh-120px)]">
        {/* Chat List - Hidden on mobile when viewing a specific chat */}
        <div className={`md:col-span-1 ${chatRoomId ? 'hidden md:block' : ''}`}>
          <Card className="h-full overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Активные чаты</h2>
              {!isConnected && (
                <p className="text-xs text-muted-foreground mt-1">
                  Подключение...
                </p>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <PrivateChatList 
                chatRooms={chatRooms}
                currentUserId={currentUserId}
                selectedChatId={chatRoomId}
                onSelectChat={handleSelectChat}
              />
            </div>
          </Card>
        </div>
        
        {/* Chat Window - Full width on mobile when viewing a specific chat */}
        <div className={`md:col-span-2 ${chatRoomId ? '' : 'hidden md:block'}`}>
          <Card className="h-full flex flex-col">
            <PrivateChatWindow 
              chatRoom={currentChatRoom}
              messages={currentMessages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onBackToList={handleBackToList}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
