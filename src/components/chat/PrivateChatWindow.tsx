
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { ChatRoom, ChatMessage } from '@/types/chat';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import SecureMessageInput from '@/components/security/SecureMessageInput';

interface PrivateChatWindowProps {
  chatRoom: ChatRoom | null;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onBackToList?: () => void;
  isLoading?: boolean;
}

const PrivateChatWindow: React.FC<PrivateChatWindowProps> = ({
  chatRoom,
  messages,
  currentUserId,
  onSendMessage,
  onBackToList,
  isLoading
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get other participant info with security checks
  const getOtherParticipant = () => {
    if (!chatRoom || !currentUserId) return null;
    
    const otherUserId = chatRoom.participant_a === currentUserId 
      ? chatRoom.participant_b 
      : chatRoom.participant_a;
    
    // Try to get participant info from localStorage (cached profile data)
    try {
      const participantInfo = localStorage.getItem(`profile_${otherUserId}`);
      if (participantInfo) {
        const parsed = JSON.parse(participantInfo);
        return {
          id: otherUserId,
          name: parsed.full_name || parsed.name || 'Пользователь',
          avatar: parsed.avatar_url || null,
          role: parsed.role || null
        };
      }
    } catch (error) {
      console.error('Error loading participant info:', error);
    }
    
    return {
      id: otherUserId,
      name: 'Пользователь',
      avatar: null,
      role: null
    };
  };

  const otherParticipant = getOtherParticipant();

  if (!chatRoom) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">Выберите чат для начала общения</p>
          <p className="text-sm">Или найдите преподавателя и начните новый диалог</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        {onBackToList && (
          <Button variant="ghost" size="sm" onClick={onBackToList} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherParticipant?.avatar || undefined} />
          <AvatarFallback>
            {otherParticipant?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{otherParticipant?.name || 'Пользователь'}</h3>
          {otherParticipant?.role && (
            <p className="text-sm text-muted-foreground">
              {otherParticipant.role === 'teacher' ? 'Учитель' : 
               otherParticipant.role === 'school' ? 'Школа' : 
               otherParticipant.role}
            </p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading && messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Загрузка сообщений...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="mb-2">Пока нет сообщений</p>
              <p className="text-sm">Отправьте первое сообщение, чтобы начать общение</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {format(new Date(message.created_at), 'HH:mm', { locale: ru })}
                      {isOwn && (
                        <span className="ml-1">
                          {message.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Secure Message Input */}
      <div className="p-4 border-t">
        <SecureMessageInput 
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder="Напишите сообщение..."
        />
      </div>
    </div>
  );
};

export default PrivateChatWindow;
