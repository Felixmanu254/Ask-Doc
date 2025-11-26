export type ViewState = 'companion' | 'mood' | 'journal' | 'resources' | 'insights';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MoodEntry {
  id: string;
  mood: string; // emoji or identifier
  intensity: number;
  note: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  content: string;
  timestamp: number;
}

export enum MoodType {
  Happy = 'Happy',
  Calm = 'Calm',
  Neutral = 'Neutral',
  Sad = 'Sad',
  Anxious = 'Anxious',
  Angry = 'Angry'
}

export interface ResourceLink {
  title: string;
  description: string;
  url: string;
  category: 'Emergency' | 'Education' | 'Tools';
}