/*
  # Create referrals and promo codes tables

  1. New Tables
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid, foreign key)
      - `referred_id` (uuid, foreign key)
      - `referral_code` (text)
      - `points_earned` (integer)
      - `status` (text)
      - `created_at` (timestamp)

    - `referral_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `code` (text, unique)
      - `link` (text)
      - `total_referrals` (integer)
      - `total_points` (integer)
      - `total_earnings` (decimal)
      - `created_at` (timestamp)

    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `description` (text)
      - `discount_type` (text) - percentage/fixed
      - `discount_value` (decimal)
      - `minimum_order` (decimal)
      - `max_discount` (decimal, optional)
      - `usage_limit` (integer)
      - `used_count` (integer)
      - `is_active` (boolean)
      - `user_specific` (uuid, optional) - for personalized codes
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

    - `promo_code_usage`
      - `id` (uuid, primary key)
      - `promo_code_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `order_id` (text, foreign key)
      - `discount_amount` (decimal)
      - `used_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Appropriate access policies
*/

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  points_earned integer DEFAULT 1,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  link text NOT NULL,
  total_referrals integer DEFAULT 0,
  total_points integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL,
  minimum_order decimal(10,2) DEFAULT 0.00,
  max_discount decimal(10,2),
  usage_limit integer DEFAULT 1000,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  user_specific uuid REFERENCES users(id),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Promo code usage table
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_amount decimal(10,2) NOT NULL,
  used_at timestamptz DEFAULT now(),
  UNIQUE(promo_code_id, user_id, order_id)
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Referral policies
CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Users can read own referral codes"
  ON referral_codes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Promo code policies
CREATE POLICY "Anyone can read active promo codes"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can read own promo usage"
  ON promo_code_usage FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can manage referrals"
  ON referrals FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert promo usage"
  ON promo_code_usage FOR INSERT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, expires_at);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_usage_user ON promo_code_usage(user_id);