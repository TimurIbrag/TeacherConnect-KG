
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatHeaderProps {
  conversation: Conversation | undefined;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  if (!conversation) return null;
  
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">{conversation.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
