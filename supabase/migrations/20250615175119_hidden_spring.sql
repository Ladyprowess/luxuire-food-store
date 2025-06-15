/*
  # Seed initial data

  1. Categories
  2. Sample products
  3. Default promo codes
*/

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

-- Insert sample products (you can add more based on your data/products.ts)
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