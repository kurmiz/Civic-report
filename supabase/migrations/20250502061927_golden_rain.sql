/*
  # Create upvotes table

  1. New Tables
    - `upvotes`
      - `id` (uuid, primary key)
      - `issue_id` (uuid, references issues)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `upvotes` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(issue_id, user_id)
);

-- Enable RLS
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all upvotes" 
  ON upvotes FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create upvotes" 
  ON upvotes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes" 
  ON upvotes FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);