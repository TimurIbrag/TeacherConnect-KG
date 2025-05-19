
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, Paperclip, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Mock data for chat conversations
const mockConversations = [
  {
    id: 1,
    name: 'Анна Иванова',
    role: 'Учитель математики',
    avatar: '',
    lastMessage: 'Здравствуйте! Я заинтересована в вашей вакансии.',
    timestamp: '10:45',
    unread: 2,
  },
  {
    id: 2,
    name: 'Школа №5',
    role: 'Частная школа',
    avatar: '',
    lastMessage: 'Спасибо за ваш отклик. Можем ли мы назначить интервью?',
    timestamp: 'Вчера',
    unread: 0,
  },
  {
    id: 3,
    name: 'Михаил Петров',
    role: 'Учитель английского',
    avatar: '',
    lastMessage: 'Какой у вас опыт работы с старшеклассниками?',
    timestamp: '25 мая',
    unread: 0,
  },
];

// Mock messages for a selected conversation
const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: 'Здравствуйте! Я заинтересована в вашей вакансии учителя математики.',
    timestamp: '10:30',
    read: true,
  },
  {
    id: 2,
    senderId: 'currentUser',
    content: 'Здравствуйте! Спасибо за интерес к нашей школе. Какой у вас опыт преподавания?',
    timestamp: '10:35',
    read: true,
  },
  {
    id: 3,
    senderId: 1,
    content: 'У меня 5 лет опыта преподавания математики в средней школе. Я также имею опыт подготовки учеников к ОРТ.',
    timestamp: '10:42',
    read: true,
  },
  {
    id: 4,
    senderId: 1,
    content: 'Могу ли я узнать больше о вакансии? Какая нагрузка предполагается?',
    timestamp: '10:45',
    read: false,
  },
];

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    } else {
      // Redirect to login if not logged in
      navigate('/login');
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к сообщениям",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle conversation selection
  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    // Mark messages as read
    setMessages(prevMessages => 
      prevMessages.map(msg => ({ ...msg, read: true }))
    );
    // Update conversations to remove unread count
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === id ? { ...conv, unread: 0 } : conv
      )
    );
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      senderId: 'currentUser',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected conversation details
  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Сообщения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(80vh-120px)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <Input
              placeholder="Поиск контактов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
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
        </Card>
        
        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentConversation?.avatar} alt={currentConversation?.name} />
                    <AvatarFallback>{currentConversation?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentConversation?.name}</h3>
                    <p className="text-xs text-muted-foreground">{currentConversation?.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
              </CardContent>
              
              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Напишите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Выберите чат, чтобы начать общение
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
