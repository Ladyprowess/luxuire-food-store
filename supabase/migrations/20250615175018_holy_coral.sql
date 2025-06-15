/*
  # Create products and related tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category_id` (uuid, foreign key)
      - `unit` (text)
      - `price_range` (text)
      - `current_price` (decimal)
      - `image` (text)
      - `images` (jsonb, array of image URLs)
      - `rating` (decimal)
      - `in_stock` (boolean)
      - `fresh` (boolean)
      - `description` (text)
      - `attributes` (jsonb)
      - `tags` (text array)
      - `related_products` (uuid array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_variations`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `name` (text)
      - `price` (decimal)
      - `price_range` (text)
      - `in_stock` (boolean)
      - `attributes` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for products and categories
    - Admin-only write access
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Products table
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

-- Product variations table
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

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read product variations"
  ON product_variations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write policies (you'll need to implement admin role)
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage product variations"
  ON product_variations FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_fresh ON products(fresh);
CREATE INDEX idx_product_variations_product ON product_variations(product_id);