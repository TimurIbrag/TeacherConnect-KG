
export interface ChatRoom {
  id: string;
  participant_a: string; // teacher user_id
  participant_b: string; // school user_id
  created_at: string;
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'teacher' | 'school';
  avatar?: string;
}
