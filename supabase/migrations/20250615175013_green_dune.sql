/*
  # Create addresses table

  1. New Tables
    - `addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `label` (text) - e.g., "Home", "Office"
      - `street` (text)
      - `city` (text)
      - `state` (text)
      - `is_default` (boolean)
      - `latitude` (decimal, optional)
      - `longitude` (decimal, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `addresses` table
    - Add policies for users to manage their own addresses
*/

CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  is_default boolean DEFAULT false,
  latitude decimal(10,8),
  longitude decimal(11,8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON addresses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Add foreign key constraint to users table
ALTER TABLE users 
ADD CONSTRAINT fk_users_default_address 
FOREIGN KEY (default_address_id) REFERENCES addresses(id);

-- Create updated_at trigger
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);