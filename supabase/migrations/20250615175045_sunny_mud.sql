/*
  # Create payments and wallet tables

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_id` (text, foreign key, optional)
      - `reference` (text, unique)
      - `amount` (decimal)
      - `currency` (text)
      - `status` (text)
      - `payment_method` (text)
      - `gateway` (text) - e.g., "paystack"
      - `gateway_response` (jsonb)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)

    - `wallet_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text) - credit/debit
      - `amount` (decimal)
      - `description` (text)
      - `reference` (text)
      - `status` (text)
      - `related_payment_id` (uuid, foreign key, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own payment data
*/

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id text REFERENCES orders(id),
  reference text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  payment_method text NOT NULL,
  gateway text DEFAULT 'paystack',
  gateway_response jsonb DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  reference text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  related_payment_id uuid REFERENCES payments(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own payment data
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own wallet transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert payments (for webhook processing)
CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  TO authenticated
  USING (true);

CREATE POLICY "System can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Users can insert wallet transactions (for wallet funding)
CREATE POLICY "Users can insert wallet transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all wallet transactions"
  ON wallet_transactions FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);