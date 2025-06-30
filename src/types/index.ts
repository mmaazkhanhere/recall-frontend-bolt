export interface KnowledgeBase {
  id: number;
  title: string;
  tags: string[];
  image: string;
}

export interface IQueryResponse {
  knowledge_base: string;
  query: string;
  response: string;
  video_path: string;
  image_path: string[];
  start_time: number;
  end_time: number;
}

export interface KnowledgeBaseResponse {
  id: string;
  title: string;
  tags: [string];
  image: string;
  video_path: string;
  introduction: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  url: string;
  knowledgeBaseId: string;
  transcription?: string;
  createdAt: string;
}

export interface ChatMessage {
  id?: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  videoTimestamp?: number;
  videoPath?: string;
  feedback?: "positive" | "negative";
  feedbackComment?: string;
  // Add fields needed for query feedback
  originalQuery?: string;
  knowledgeBaseId?: string; // Keep as string for now, will convert to int when needed
}

export interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  duration: {
    min?: number;
    max?: number;
  };
}

export interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: Theme;
    language: string;
  };
}

export interface Feedback {
  messageId: string;
  type: "positive" | "negative";
  comment?: string;
  timestamp: string;
  userId?: string;
}