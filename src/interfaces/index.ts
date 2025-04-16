// src/interfaces/index.ts

export interface User {
  client_id: string;
  db_name: string;
  db_user: string;
  created_at: string;
}

export interface UserFormData {
  dbName: string;
  dbUser: string;
  dbPassword: string;
}

export interface UserConfig {
  clientId: string;
  dbName: string;
  accessToken: string;
  apiUrl: string;
}

export interface SyncLog {
  id: number;
  client_id: string;
  sync_date: string;
  records_synced: number;
  status: string;
  message: string;
  db_name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}
