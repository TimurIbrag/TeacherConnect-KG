
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: number;
  senderId: number | string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatWindowProps {
  selectedConversation: number | null;
  currentConversation: Conversation | undefined;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  selectedConversation, 
  currentConversation, 
  messages, 
  onSendMessage 
}) => {
  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Выберите чат, чтобы начать общение
      </div>
    );
  }

  return (
    <>
      <ChatHeader conversation={currentConversation} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatWindow;
