
export interface Message {
  id: number;
  senderId: number | string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}
