/*
  # Create issues table and related schemas

  1. New Tables
    - `issues`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `status` (text)
      - `location` (text)
      - `lat` (float8)
      - `lng` (float8)
      - `image_url` (text, optional)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `issues` table
    - Add policies for CRUD operations
*/

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  location text NOT NULL,
  lat float8 NOT NULL,
  lng float8 NOT NULL,
  image_url text,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all issues" 
  ON issues FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create issues" 
  ON issues FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues" 
  ON issues FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own issues" 
  ON issues FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();