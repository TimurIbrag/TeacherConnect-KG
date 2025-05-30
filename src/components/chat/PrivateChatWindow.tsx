
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatRoom } from '@/types/chat';

interface PrivateChatWindowProps {
  chatRoom: ChatRoom | null;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => Promise<void>;
  onBackToList?: () => void;
  isLoading?: boolean;
}

const PrivateChatWindow: React.FC<PrivateChatWindowProps> = ({
  chatRoom,
  messages,
  currentUserId,
  onSendMessage,
  onBackToList,
  isLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipantId = (room: ChatRoom) => {
    return room.participant_a === currentUserId ? room.participant_b : room.participant_a;
  };

  if (!chatRoom) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p>Выберите чат для начала общения</p>
        </div>
      </div>
    );
  }

  const otherParticipantId = getOtherParticipantId(chatRoom);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        {onBackToList && (
          <Button variant="ghost" size="icon" onClick={onBackToList} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt="Participant" />
          <AvatarFallback>
            {otherParticipantId.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium">Участник {otherParticipantId.slice(-4)}</h3>
          <p className="text-xs text-muted-foreground">
            {isLoading ? 'Подключение...' : 'В сети'}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Начните общение, отправив первое сообщение</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.created_at)}
                    </span>
                    {isOwnMessage && (
                      <span className="text-xs opacity-70">
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isSending}
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatWindow;
