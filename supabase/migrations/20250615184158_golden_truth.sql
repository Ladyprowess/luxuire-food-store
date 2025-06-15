-- =====================================================
-- COMPLETE LUXUIRE DATABASE MIGRATION
-- Run this ONCE in your Supabase SQL Editor
-- =====================================================

-- Drop existing objects if they exist (cleanup)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP POLICY "Users can read own data" ON users;
DROP POLICY "Users can insert own data" ON users;
DROP POLICY "Anyone can read categories" ON categories;
DROP POLICY "Anyone can read products" ON products;
DROP POLICY "Anyone can read product variations" ON product_variations;
DROP POLICY "Users can manage own orders" ON orders;
DROP POLICY "Users can read own order items" ON order_items;
DROP POLICY "Users can read own order tracking" ON order_tracking;


-- Create the updated_at trigger function FIRST
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  name text NOT NULL,
  profile_image text,
  preferred_payment_method text DEFAULT 'online' CHECK (preferred_payment_method IN ('online', 'cash', 'wallet')),
  wallet_balance decimal(10,2) DEFAULT 0.00,
  default_address_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. ADDRESSES TABLE
-- =====================================================
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

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint to users table (now that addresses exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_users_default_address'
  ) THEN
    ALTER TABLE users 
    ADD CONSTRAINT fk_users_default_address 
    FOREIGN KEY (default_address_id) REFERENCES addresses(id);
  END IF;
END $$;

-- =====================================================
-- 3. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id),
  unit text NOT NULL,
  price_range text NOT NULL,
  current_price decimal(10,2) NOT NULL,
  image text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  in_stock boolean DEFAULT true,
  fresh boolean DEFAULT false,
  description text,
  attributes jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  related_products uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. PRODUCT VARIATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  price_range text,
  in_stock boolean DEFAULT true,
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtotal decimal(10,2) NOT NULL DEFAULT 0.00,
  delivery_fee decimal(10,2) NOT NULL DEFAULT 0.00,
  service_fee decimal(10,2) NOT NULL DEFAULT 0.00,
  total decimal(10,2) NOT NULL DEFAULT 0.00,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shopping', 'purchased', 'delivery', 'delivered', 'cancelled')),
  payment_method text NOT NULL,
  payment_reference text,
  delivery_address jsonb NOT NULL,
  special_instructions text,
  estimated_delivery text,
  agent_name text,
  agent_phone text,
  pay_for_me_link text,
  custom_order_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  variation_id uuid REFERENCES product_variations(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  special_request text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. ORDER TRACKING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  step text NOT NULL,
  completed boolean DEFAULT false,
  current boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. PAYMENTS TABLE
-- =====================================================
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

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. WALLET TRANSACTIONS TABLE
-- =====================================================
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

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. REFERRALS TABLE
-- =====================================================
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

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 12. REFERRAL CODES TABLE
-- =====================================================
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

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 13. PROMO CODES TABLE
-- =====================================================
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

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 14. PROMO CODE USAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_amount decimal(10,2) NOT NULL,
  used_at timestamptz DEFAULT now(),
  UNIQUE(promo_code_id, user_id, order_id)
);

ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 15. FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 16. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('order', 'promotion', 'system')),
  read boolean DEFAULT false,
  order_id text REFERENCES orders(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Addresses policies
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Products policies (public read)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read product variations"
  ON product_variations FOR SELECT TO anon, authenticated
  USING (true);

-- Orders policies
CREATE POLICY "Users can manage own orders"
  ON orders FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Users can read own order tracking"
  ON order_tracking FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Payment policies
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert payments"
  ON payments FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update payments"
  ON payments FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Wallet policies
CREATE POLICY "Users can read own wallet transactions"
  ON wallet_transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert wallet transactions"
  ON wallet_transactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Other policies
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can send notifications"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Users can read own referral codes"
  ON referral_codes FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read active promo codes"
  ON promo_codes FOR SELECT TO authenticated
  USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can read own promo usage"
  ON promo_code_usage FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert promo usage"
  ON promo_code_usage FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON addresses(user_id, is_default);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_fresh ON products(fresh);
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON product_variations(product_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Wallet indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Other indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert categories
INSERT INTO categories (name, icon, color) VALUES
('Vegetables', '🥬', '#fff0f5'),
('Grains', '🌾', '#fef3ed'),
('Spices', '🌶️', '#e5faf3'),
('Seafoods', '🐟', '#f0f9ff'),
('Fruits', '🍊', '#fff0f5'),
('Groceries', '📦', '#fef3ed'),
('Frozen Foods', '🧊', '#e5faf3'),
('Bakery', '🍞', '#f0f9ff'),
('Diary', '🥛', '#fff0f5'),
('Beverages', '🥤', '#fef3ed'),
('Biscuit', '🍪', '#e5faf3'),
('Snacks', '🥜', '#f0f9ff')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  name, category_id, unit, price_range, current_price, image, rating, in_stock, fresh, description,
  attributes, tags
) VALUES
(
  'Fresh Ugu Leaves',
  (SELECT id FROM categories WHERE name = 'Vegetables'),
  'per bunch',
  '₦800-1200',
  1000,
  'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
  4.8,
  true,
  true,
  'Fresh green leafy vegetables, perfect for Nigerian soups and stews.',
  '{"origin": "Local Farm", "quality": "Premium", "organic": true, "shelfLife": "3-5 days", "storage": "Refrigerate"}',
  '{"Fresh", "Organic", "Local", "Leafy Green"}'
),
(
  'Local Rice (Ofada)',
  (SELECT id FROM categories WHERE name = 'Grains'),
  'per derica',
  '₦1500-2000',
  1800,
  'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
  4.9,
  true,
  true,
  'Premium quality local rice, unpolished and nutritious.',
  '{"origin": "Ogun State", "brand": "Ofada Premium", "quality": "Grade A", "organic": true, "processed": false}',
  '{"Local", "Unpolished", "Premium", "Nutritious"}'
),
(
  'Fresh Tomatoes',
  (SELECT id FROM categories WHERE name = 'Vegetables'),
  'per basket',
  '₦2000-3000',
  2500,
  'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
  4.7,
  true,
  true,
  'Fresh, ripe tomatoes perfect for stews and sauces.',
  '{"origin": "Jos Plateau", "quality": "Grade A", "organic": false, "shelfLife": "5-7 days"}',
  '{"Fresh", "Ripe", "Cooking"}'
),
(
  'Palm Oil',
  (SELECT id FROM categories WHERE name = 'Groceries'),
  'per liter',
  '₦1200-1800',
  1500,
  'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400',
  4.7,
  true,
  false,
  'Pure red palm oil, essential for authentic Nigerian cooking.',
  '{"origin": "Cross River State", "quality": "Pure", "organic": true, "processed": false}',
  '{"Pure", "Traditional", "Cooking Oil"}'
),
(
  'Fresh Fish (Tilapia)',
  (SELECT id FROM categories WHERE name = 'Seafoods'),
  'per kg',
  '₦1800-2500',
  2200,
  'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400',
  4.8,
  true,
  true,
  'Fresh tilapia fish, cleaned and ready to cook.',
  '{"origin": "Local Fish Farm", "quality": "Premium", "organic": false}',
  '{"Fresh", "Protein", "Cleaned"}'
)
ON CONFLICT DO NOTHING;

-- Insert default promo codes
INSERT INTO promo_codes (
  code, description, discount_type, discount_value, minimum_order, max_discount, 
  usage_limit, expires_at
) VALUES
(
  'WELCOME10',
  '10% off your first order',
  'percentage',
  10,
  2000,
  1000,
  1000,
  '2025-12-31 23:59:59'
),
(
  'FRESH500',
  '₦500 off orders above ₦5000',
  'fixed',
  500,
  5000,
  NULL,
  500,
  '2025-12-31 23:59:59'
),
(
  'WEEKEND15',
  '15% off weekend orders',
  'percentage',
  15,
  3000,
  2000,
  200,
  '2025-12-31 23:59:59'
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Your Luxuire database is now ready!
-- All tables, relationships, security policies, and sample data have been created.