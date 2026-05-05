export type UserRole = "admin" | "user";
export type DocumentStatus = "pending" | "processing" | "ready" | "failed";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  google_id: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  document_count: number;
  created_at: string;
}

export interface Document {
  id: string;
  name: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  group_id: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
}

export interface SourceChunk {
  document_name: string;
  content: string;
  chunk_index: number;
}

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  sources: SourceChunk[] | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AdminStats {
  total_users: number;
  total_groups: number;
  total_documents: number;
  total_queries: number;
}

export interface ApiError {
  detail: string;
}
