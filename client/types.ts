export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  lastModified: number;
}

export enum AIView {
  None = 'NONE',
  Chat = 'CHAT',
  Actions = 'ACTIONS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type AIProcessingState = 'idle' | 'loading' | 'success' | 'error';
