/*
  # Create comments table

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `issue_id` (uuid, references issues)
      - `user_id` (uuid, references auth.users)
      - `text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `comments` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all comments" 
  ON comments FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);