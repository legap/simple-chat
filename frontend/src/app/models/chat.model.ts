export interface ChatListItem {
  id: number;
  name: string;
  memberCount: number;
  lastMessage?: {
    content: string;
    sentAt: Date;
  };
}

export interface Chat {
  id: number;
  name: string;
  createdAt: Date;
}