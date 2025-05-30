
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChatRoom } from '@/types/chat';

interface PrivateChatListProps {
  chatRooms: ChatRoom[];
  currentUserId: string;
  onSelectChat: (chatRoomId: string) => void;
  selectedChatId?: string;
}

const PrivateChatList: React.FC<PrivateChatListProps> = ({
  chatRooms,
  currentUserId,
  onSelectChat,
  selectedChatId,
}) => {
  const navigate = useNavigate();

  const getOtherParticipant = (room: ChatRoom) => {
    const isParticipantA = room.participant_a === currentUserId;
    return isParticipantA ? room.participant_b : room.participant_a;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <div className="text-muted-foreground mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Нет активных чатов</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Начните общение, нажав кнопку "Написать" в профиле учителя или школы
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chatRooms.map((room) => {
        const otherParticipantId = getOtherParticipant(room);
        const isSelected = selectedChatId === room.id;
        
        return (
          <div
            key={room.id}
            onClick={() => {
              onSelectChat(room.id);
              navigate(`/messages/${room.id}`);
            }}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-3",
              isSelected && "bg-muted"
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt="Participant" />
                <AvatarFallback>
                  {otherParticipantId.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {room.unread_count && room.unread_count > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {room.unread_count > 99 ? '99+' : room.unread_count}
                </Badge>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">
                  {/* Placeholder for participant name */}
                  Участник {otherParticipantId.slice(-4)}
                </h3>
                {room.last_message && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimestamp(room.last_message.created_at)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {room.last_message?.text || 'Начать общение...'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrivateChatList;
