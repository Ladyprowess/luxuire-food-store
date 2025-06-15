/*
  # Create orders and related tables

  1. New Tables
    - `orders`
      - `id` (text, primary key) - Custom format like "LX123456"
      - `user_id` (uuid, foreign key)
      - `subtotal` (decimal)
      - `delivery_fee` (decimal)
      - `service_fee` (decimal)
      - `total` (decimal)
      - `status` (text)
      - `payment_method` (text)
      - `payment_reference` (text)
      - `delivery_address` (jsonb)
      - `special_instructions` (text)
      - `estimated_delivery` (text)
      - `agent_name` (text)
      - `agent_phone` (text)
      - `pay_for_me_link` (text)
      - `custom_order_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (text, foreign key)
      - `product_id` (uuid, foreign key)
      - `variation_id` (uuid, foreign key, optional)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)
      - `special_request` (text)
      - `created_at` (timestamp)

    - `order_tracking`
      - `id` (uuid, primary key)
      - `order_id` (text, foreign key)
      - `step` (text)
      - `completed` (boolean)
      - `current` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own orders
*/

-- Orders table
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

-- Order items table
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

-- Order tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  step text NOT NULL,
  completed boolean DEFAULT false,
  current boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- Users can only access their own orders
CREATE POLICY "Users can manage own orders"
  ON orders FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own order tracking"
  ON order_tracking FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Admin policies for order management
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage order tracking"
  ON order_tracking FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);