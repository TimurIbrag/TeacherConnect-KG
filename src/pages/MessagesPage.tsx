
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import PrivateChatList from '@/components/chat/PrivateChatList';
import PrivateChatWindow from '@/components/chat/PrivateChatWindow';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();

  // Security: Check authentication properly
  useEffect(() => {
    if (!loading && (!user || !profile)) {
      navigate('/login');
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к сообщениям",
        variant: "destructive",
      });
    }
  }, [user, profile, loading, navigate, toast]);

  const {
    chatRooms,
    messages,
    isLoading,
    isConnected,
    sendMessage,
    markMessagesAsRead,
    getOrCreateChatRoom,
    isAuthenticated,
  } = useSecurePrivateChat();

  // Handle chat selection with security checks
  const handleSelectChat = async (selectedChatRoomId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Ошибка доступа",
        description: "Необходима авторизация для доступа к чату",
        variant: "destructive",
      });
      return;
    }

    await markMessagesAsRead(selectedChatRoomId);
    if (window.innerWidth < 768) {
      navigate(`/messages/${selectedChatRoomId}`);
    }
  };

  // Handle sending message with security validation
  const handleSendMessage = async (text: string) => {
    if (!chatRoomId || !isAuthenticated) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Проверьте подключение.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Ensure the chat room exists and user has access
      await getOrCreateChatRoom(chatRoomId);
      await sendMessage(chatRoomId, text);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: "Ошибка отправки",
        description: error.message || "Сообщение не отправлено. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  // Get current chat room with security validation
  const currentChatRoom = chatRoomId 
    ? chatRooms.find(room => room.id === chatRoomId)
    : null;

  // Ensure chat room exists for authenticated users
  useEffect(() => {
    if (chatRoomId && !currentChatRoom && isAuthenticated && !isLoading) {
      getOrCreateChatRoom(chatRoomId);
    }
  }, [chatRoomId, currentChatRoom, isAuthenticated, isLoading, getOrCreateChatRoom]);

  // Get messages for current chat room
  const currentMessages = chatRoomId ? (messages[chatRoomId] || []) : [];

  // Handle back to list (mobile)
  const handleBackToList = () => {
    navigate('/messages');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
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
                currentUserId={user?.id || ''}
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
              currentUserId={user?.id || ''}
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
