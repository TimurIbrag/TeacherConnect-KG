
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import { Conversation, Message } from '@/types/messages';

// Mock data for chat conversations
const mockConversations: Conversation[] = [
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
const mockMessages: Message[] = [
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
  const [searchQuery, setSearchQuery] = useState('');

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
  const handleSendMessage = (newMessage: string) => {
    const newMsg = {
      id: Date.now(),
      senderId: 'currentUser',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    
    setMessages([...messages, newMsg]);
  };

  // Get the selected conversation details
  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Сообщения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(80vh-120px)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <ConversationList 
            conversations={conversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectConversation={handleSelectConversation}
          />
        </Card>
        
        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col">
          <ChatWindow 
            selectedConversation={selectedConversation}
            currentConversation={currentConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
