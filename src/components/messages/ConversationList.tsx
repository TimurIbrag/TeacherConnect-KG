
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: number | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectConversation: (id: number) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  onSelectConversation,
}) => {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск контактов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "p-4 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                selectedConversation === conv.id && "bg-muted"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conv.avatar} alt={conv.name} />
                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{conv.name}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conv.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.role}</p>
                <p className="text-sm truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <div className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Нет результатов поиска
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationList;
