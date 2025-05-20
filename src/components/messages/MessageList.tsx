
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  senderId: number | string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => (
        <div 
          key={msg.id}
          className={cn(
            "flex",
            msg.senderId === 'currentUser' ? "justify-end" : "justify-start"
          )}
        >
          <div 
            className={cn(
              "max-w-[80%] p-3 rounded-lg",
              msg.senderId === 'currentUser' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted rounded-tl-none"
            )}
          >
            <p>{msg.content}</p>
            <div className={cn(
              "flex items-center gap-1 text-xs mt-1",
              msg.senderId === 'currentUser' ? "justify-end" : ""
            )}>
              <span>{msg.timestamp}</span>
              {msg.senderId === 'currentUser' && (
                <span>
                  {msg.read ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
