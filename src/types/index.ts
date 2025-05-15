import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'pothole' | 'street-light' | 'water-leak' | 'garbage' | 'sidewalk' | 'park' | 'safety' | 'other';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  work_completed?: boolean;
  location: string;
  lat: number;
  lng: number;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  upvotes_count?: number;
  comments_count?: number;
  has_upvoted?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  issue_id: string;
  user_id: string;
  created_at: string;
  author?: Profile;
}

export interface Database {
  public: {
    Tables: {
      issues: {
        Row: Issue;
        Insert: Omit<Issue, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Issue, 'id' | 'created_at' | 'updated_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
      upvotes: {
        Row: {
          id: string;
          issue_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
}