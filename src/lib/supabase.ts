import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect to Supabase.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      models: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          file_path: string;
          size_bytes: number;
          framework: string | null;
          format: string | null;
          tags: string[] | null;
          downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          file_path: string;
          size_bytes: number;
          framework?: string | null;
          format?: string | null;
          tags?: string[] | null;
          downloads?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          file_path?: string;
          size_bytes?: number;
          framework?: string | null;
          format?: string | null;
          tags?: string[] | null;
          downloads?: number;
          created_at?: string;
        };
      };
    };
  };
};