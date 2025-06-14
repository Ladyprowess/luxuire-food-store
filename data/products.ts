import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Ugu Leaves',
    category: 'Vegetables',
    unit: 'per bunch',
    priceRange: '₦800-1200',
    currentPrice: 1000,
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.8,
    inStock: true,
    fresh: true,
    description: 'Fresh green leafy vegetables, perfect for Nigerian soups and stews.',
    variations: [
      {
        id: 'ugu-small',
        name: 'Small Bunch',
        price: 800,
        priceRange: '₦700-900',
        inStock: true,
        attributes: {
          size: 'Small',
          weight: '200g',
          quality: 'Premium'
        }
      },
      {
        id: 'ugu-large',
        name: 'Large Bunch',
        price: 1200,
        priceRange: '₦1000-1400',
        inStock: true,
        attributes: {
          size: 'Large',
          weight: '400g',
          quality: 'Premium'
        }
      }
    ],
    attributes: {
      origin: 'Local Farm',
      quality: 'Premium',
      organic: true,
      shelfLife: '3-5 days',
      storage: 'Refrigerate',
      nutritionalInfo: {
        calories: 22,
        protein: 3.2,
        carbs: 2.8,
        fat: 0.2,
        fiber: 2.8
      }
    },
    tags: ['Fresh', 'Organic', 'Local', 'Leafy Green'],
    relatedProducts: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Local Rice (Ofada)',
    category: 'Grains',
    unit: 'per derica',
    priceRange: '₦1500-2000',
    currentPrice: 1800,
    image: 'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    inStock: true,
    fresh: true,
    description: 'Premium quality local rice, unpolished and nutritious.',
    attributes: {
      origin: 'Ogun State',
      brand: 'Ofada Premium',
      quality: 'Grade A',
      organic: true,
      processed: false,
      shelfLife: '12 months',
      storage: 'Cool, dry place',
      nutritionalInfo: {
        calories: 365,
        protein: 7.1,
        carbs: 77.2,
        fat: 0.7,
        fiber: 1.3
      }
    },
    tags: ['Local', 'Unpolished', 'Premium', 'Nutritious'],
    relatedProducts: ['1', '13', '15']
  },
  {
    id: '3',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    unit: 'per basket',
    priceRange: '₦2000-3000',
    currentPrice: 2500,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: true,
    description: 'Fresh, ripe tomatoes perfect for stews and sauces.',
    attributes: {
      origin: 'Jos Plateau',
      quality: 'Grade A',
      organic: false,
      shelfLife: '5-7 days',
      storage: 'Room temperature',
      nutritionalInfo: {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fat: 0.2,
        fiber: 1.2
      }
    },
    tags: ['Fresh', 'Ripe', 'Cooking'],
    relatedProducts: ['1', '4', '5']
  },
  {
    id: '4',
    name: 'Dried Pepper (Ata Gungun)',
    category: 'Spices',
    unit: 'per cup',
    priceRange: '₦500-800',
    currentPrice: 650,
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: false,
    description: 'Spicy dried peppers, essential for Nigerian cuisine.',
    attributes: {
      origin: 'Northern Nigeria',
      quality: 'Premium',
      organic: true,
      processed: true,
      shelfLife: '18 months',
      storage: 'Cool, dry place'
    },
    tags: ['Spicy', 'Dried', 'Traditional'],
    relatedProducts: ['24', '25', '26']
  },
  {
    id: '5',
    name: 'Fresh Fish (Tilapia)',
    category: 'Seafoods',
    unit: 'per kg',
    priceRange: '₦1800-2500',
    currentPrice: 2200,
    image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    inStock: true,
    fresh: true,
    description: 'Fresh tilapia fish, cleaned and ready to cook.',
    attributes: {
      origin: 'Local Fish Farm',
      quality: 'Premium',
      organic: false,
      shelfLife: '1-2 days',
      storage: 'Refrigerate immediately'
    },
    tags: ['Fresh', 'Protein', 'Cleaned'],
    relatedProducts: ['10', '12', '14']
  },
  {
    id: '6',
    name: 'Sweet Oranges',
    category: 'Fruits',
    unit: 'per dozen',
    priceRange: '₦800-1200',
    currentPrice: 1000,
    image: 'https://images.pexels.com/photos/1414122/pexels-photo-1414122.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: true,
    description: 'Sweet, juicy oranges packed with vitamin C.',
    attributes: {
      origin: 'Benue State',
      quality: 'Grade A',
      organic: false,
      shelfLife: '7-10 days',
      storage: 'Cool place',
      nutritionalInfo: {
        calories: 47,
        protein: 0.9,
        carbs: 11.8,
        fat: 0.1,
        fiber: 2.4
      }
    },
    tags: ['Sweet', 'Vitamin C', 'Juicy'],
    relatedProducts: ['8', '27', '28']
  },
  {
    id: '7',
    name: 'Palm Oil',
    category: 'Groceries',
    unit: 'per liter',
    priceRange: '₦1200-1800',
    currentPrice: 1500,
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: false,
    description: 'Pure red palm oil, essential for authentic Nigerian cooking.',
    attributes: {
      origin: 'Cross River State',
      quality: 'Pure',
      organic: true,
      processed: false,
      shelfLife: '24 months',
      storage: 'Cool, dry place'
    },
    tags: ['Pure', 'Traditional', 'Cooking Oil'],
    relatedProducts: ['13', '15', '22']
  },
  {
    id: '8',
    name: 'Plantain',
    category: 'Fruits',
    unit: 'per bunch',
    priceRange: '₦600-1000',
    currentPrice: 800,
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: true,
    description: 'Fresh plantains, perfect for frying or boiling.',
    attributes: {
      origin: 'Ogun State',
      quality: 'Grade A',
      organic: false,
      shelfLife: '5-7 days',
      storage: 'Room temperature'
    },
    tags: ['Fresh', 'Versatile', 'Staple'],
    relatedProducts: ['6', '32', '35']
  },
  {
    id: '9',
    name: 'Yam Tuber',
    category: 'Vegetables',
    unit: 'per tuber',
    priceRange: '₦1500-2500',
    currentPrice: 2000,
    image: 'https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    inStock: true,
    fresh: true,
    description: 'Fresh yam tubers, perfect for pounding or boiling.',
    attributes: {
      origin: 'Benue State',
      quality: 'Premium',
      organic: true,
      shelfLife: '2-3 weeks',
      storage: 'Cool, dry place'
    },
    tags: ['Fresh', 'Premium', 'Staple'],
    relatedProducts: ['1', '3', '8']
  },
  {
    id: '10',
    name: 'Stockfish',
    category: 'Seafoods',
    unit: 'per piece',
    priceRange: '₦800-1500',
    currentPrice: 1200,
    image: 'https://images.pexels.com/photos/8844895/pexels-photo-8844895.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: false,
    description: 'Dried stockfish, adds rich flavor to soups and stews.',
    attributes: {
      origin: 'Norway (Imported)',
      quality: 'Premium',
      processed: true,
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Dried', 'Imported', 'Flavor'],
    relatedProducts: ['5', '12', '14']
  },
  {
    id: '11',
    name: 'Frozen Chicken',
    category: 'Frozen Foods',
    unit: 'per kg',
    priceRange: '₦2500-3500',
    currentPrice: 3000,
    image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: false,
    description: 'Premium frozen chicken, perfect for various dishes.',
    attributes: {
      origin: 'Local Farm',
      quality: 'Grade A',
      processed: true,
      shelfLife: '12 months frozen',
      storage: 'Keep frozen'
    },
    tags: ['Frozen', 'Premium', 'Protein'],
    relatedProducts: ['5', '12', '14']
  },
  {
    id: '12',
    name: 'Fresh Prawns',
    category: 'Seafoods',
    unit: 'per kg',
    priceRange: '₦4000-6000',
    currentPrice: 5000,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    inStock: true,
    fresh: true,
    description: 'Fresh prawns, perfect for special occasions and delicious meals.',
    attributes: {
      origin: 'Lagos Coast',
      quality: 'Premium',
      organic: false,
      shelfLife: '1-2 days',
      storage: 'Keep refrigerated'
    },
    tags: ['Fresh', 'Premium', 'Seafood'],
    relatedProducts: ['5', '10', '11']
  },
  {
    id: '13',
    name: 'Garri (White)',
    category: 'Groceries',
    unit: 'per derica',
    priceRange: '₦800-1200',
    currentPrice: 1000,
    image: 'https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: false,
    description: 'Quality white garri, perfect for eba and other Nigerian dishes.',
    attributes: {
      origin: 'Ogun State',
      quality: 'Premium',
      processed: true,
      shelfLife: '6 months',
      storage: 'Cool, dry place'
    },
    tags: ['Processed', 'Staple', 'Traditional'],
    relatedProducts: ['2', '7', '15']
  },
  {
    id: '14',
    name: 'Frozen Fish (Mackerel)',
    category: 'Frozen Foods',
    unit: 'per carton',
    priceRange: '₦8000-12000',
    currentPrice: 10000,
    image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: false,
    description: 'Premium frozen mackerel fish, rich in omega-3.',
    attributes: {
      origin: 'Atlantic Ocean',
      quality: 'Premium',
      processed: true,
      shelfLife: '12 months frozen',
      storage: 'Keep frozen'
    },
    tags: ['Frozen', 'Omega-3', 'Imported'],
    relatedProducts: ['5', '10', '11']
  },
  {
    id: '15',
    name: 'Beans (Brown)',
    category: 'Groceries',
    unit: 'per derica',
    priceRange: '₦1200-1800',
    currentPrice: 1500,
    image: 'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: false,
    description: 'Quality brown beans, perfect for moi moi and akara.',
    attributes: {
      origin: 'Plateau State',
      quality: 'Grade A',
      organic: true,
      shelfLife: '12 months',
      storage: 'Cool, dry place',
      nutritionalInfo: {
        calories: 347,
        protein: 21.6,
        carbs: 63.0,
        fat: 1.2,
        fiber: 15.5
      }
    },
    tags: ['Protein', 'Fiber', 'Traditional'],
    relatedProducts: ['2', '7', '13']
  },
  // BAKERY PRODUCTS
  {
    id: '16',
    name: 'Fresh Bread (Sliced)',
    category: 'Bakery',
    unit: 'per loaf',
    priceRange: '₦400-600',
    currentPrice: 500,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: true,
    description: 'Fresh sliced bread, perfect for breakfast and sandwiches.',
    attributes: {
      origin: 'Local Bakery',
      quality: 'Fresh',
      shelfLife: '3-5 days',
      storage: 'Room temperature'
    },
    tags: ['Fresh', 'Sliced', 'Breakfast'],
    relatedProducts: ['17', '18', '19']
  },
  {
    id: '17',
    name: 'Agege Bread',
    category: 'Bakery',
    unit: 'per loaf',
    priceRange: '₦300-500',
    currentPrice: 400,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    inStock: true,
    fresh: true,
    description: 'Traditional Nigerian bread, soft and delicious.',
    attributes: {
      origin: 'Lagos',
      quality: 'Traditional',
      shelfLife: '2-3 days',
      storage: 'Room temperature'
    },
    tags: ['Traditional', 'Soft', 'Nigerian'],
    relatedProducts: ['16', '18', '19']
  },
  {
    id: '18',
    name: 'Meat Pie',
    category: 'Bakery',
    unit: 'per piece',
    priceRange: '₦200-400',
    currentPrice: 300,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: true,
    description: 'Delicious meat pie with seasoned beef filling.',
    attributes: {
      origin: 'Local Bakery',
      quality: 'Fresh',
      shelfLife: '1-2 days',
      storage: 'Refrigerate'
    },
    tags: ['Fresh', 'Meat', 'Snack'],
    relatedProducts: ['16', '17', '33']
  },
  // DAIRY PRODUCTS
  {
    id: '19',
    name: 'Fresh Milk',
    category: 'Diary',
    unit: 'per liter',
    priceRange: '₦800-1200',
    currentPrice: 1000,
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: true,
    description: 'Fresh cow milk, rich in calcium and nutrients.',
    attributes: {
      origin: 'Local Dairy',
      quality: 'Fresh',
      shelfLife: '3-5 days',
      storage: 'Refrigerate',
      nutritionalInfo: {
        calories: 42,
        protein: 3.4,
        carbs: 5.0,
        fat: 1.0,
        fiber: 0
      }
    },
    tags: ['Fresh', 'Calcium', 'Dairy'],
    relatedProducts: ['20', '21', '16']
  },
  {
    id: '20',
    name: 'Yogurt',
    category: 'Diary',
    unit: 'per cup',
    priceRange: '₦300-500',
    currentPrice: 400,
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: true,
    description: 'Creamy yogurt, perfect for healthy snacking.',
    attributes: {
      origin: 'Local Dairy',
      quality: 'Fresh',
      shelfLife: '7-10 days',
      storage: 'Refrigerate'
    },
    tags: ['Fresh', 'Healthy', 'Probiotic'],
    relatedProducts: ['19', '21', '6']
  },
  {
    id: '21',
    name: 'Cheese (Local)',
    category: 'Diary',
    unit: 'per pack',
    priceRange: '₦600-1000',
    currentPrice: 800,
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    inStock: true,
    fresh: true,
    description: 'Fresh local cheese, perfect for cooking and snacking.',
    attributes: {
      origin: 'Local Dairy',
      quality: 'Fresh',
      shelfLife: '5-7 days',
      storage: 'Refrigerate'
    },
    tags: ['Fresh', 'Local', 'Cooking'],
    relatedProducts: ['19', '20', '16']
  },
  // ADDITIONAL GRAINS
  {
    id: '22',
    name: 'Wheat Flour',
    category: 'Grains',
    unit: 'per kg',
    priceRange: '₦600-900',
    currentPrice: 750,
    image: 'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: false,
    description: 'Quality wheat flour for baking and cooking.',
    attributes: {
      origin: 'Nigeria',
      quality: 'Grade A',
      processed: true,
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Baking', 'Cooking', 'Flour'],
    relatedProducts: ['2', '23', '16']
  },
  {
    id: '23',
    name: 'Semolina',
    category: 'Grains',
    unit: 'per kg',
    priceRange: '₦800-1200',
    currentPrice: 1000,
    image: 'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: false,
    description: 'Premium semolina for making semovita and other dishes.',
    attributes: {
      origin: 'Nigeria',
      quality: 'Premium',
      processed: true,
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Premium', 'Semovita', 'Grain'],
    relatedProducts: ['2', '22', '13']
  },
  // ADDITIONAL SPICES
  {
    id: '24',
    name: 'Curry Powder',
    category: 'Spices',
    unit: 'per pack',
    priceRange: '₦200-400',
    currentPrice: 300,
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: false,
    description: 'Aromatic curry powder for flavoring dishes.',
    attributes: {
      origin: 'India (Imported)',
      quality: 'Premium',
      processed: true,
      shelfLife: '24 months',
      storage: 'Cool, dry place'
    },
    tags: ['Aromatic', 'Imported', 'Spice'],
    relatedProducts: ['4', '25', '26']
  },
  {
    id: '25',
    name: 'Ginger (Fresh)',
    category: 'Spices',
    unit: 'per kg',
    priceRange: '₦1000-1500',
    currentPrice: 1200,
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: true,
    description: 'Fresh ginger root, perfect for cooking and health benefits.',
    attributes: {
      origin: 'Plateau State',
      quality: 'Fresh',
      organic: true,
      shelfLife: '2-3 weeks',
      storage: 'Cool, dry place'
    },
    tags: ['Fresh', 'Organic', 'Health'],
    relatedProducts: ['4', '24', '26']
  },
  // BEVERAGES
  {
    id: '26',
    name: 'Zobo Leaves',
    category: 'Beverages',
    unit: 'per pack',
    priceRange: '₦300-500',
    currentPrice: 400,
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: true,
    description: 'Fresh hibiscus leaves for making zobo drink.',
    attributes: {
      origin: 'Northern Nigeria',
      quality: 'Fresh',
      organic: true,
      shelfLife: '6 months',
      storage: 'Cool, dry place'
    },
    tags: ['Fresh', 'Hibiscus', 'Healthy'],
    relatedProducts: ['27', '28', '25']
  },
  {
    id: '27',
    name: 'Palm Wine',
    category: 'Beverages',
    unit: 'per bottle',
    priceRange: '₦500-800',
    currentPrice: 650,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    inStock: true,
    fresh: true,
    description: 'Fresh palm wine, traditional Nigerian beverage.',
    attributes: {
      origin: 'Cross River State',
      quality: 'Fresh',
      organic: true,
      shelfLife: '1-2 days',
      storage: 'Refrigerate'
    },
    tags: ['Fresh', 'Traditional', 'Alcoholic'],
    relatedProducts: ['26', '28', '6']
  },
  {
    id: '28',
    name: 'Kunu Drink',
    category: 'Beverages',
    unit: 'per bottle',
    priceRange: '₦200-400',
    currentPrice: 300,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: true,
    description: 'Traditional northern Nigerian drink made from grains.',
    attributes: {
      origin: 'Northern Nigeria',
      quality: 'Fresh',
      organic: true,
      shelfLife: '2-3 days',
      storage: 'Refrigerate'
    },
    tags: ['Fresh', 'Traditional', 'Healthy'],
    relatedProducts: ['26', '27', '2']
  },
  // BISCUITS
  {
    id: '29',
    name: 'Digestive Biscuits',
    category: 'Biscuit',
    unit: 'per pack',
    priceRange: '₦300-500',
    currentPrice: 400,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    inStock: true,
    fresh: false,
    description: 'Crunchy digestive biscuits, perfect for tea time.',
    attributes: {
      origin: 'Nigeria',
      brand: 'Digestive Plus',
      quality: 'Premium',
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Crunchy', 'Tea Time', 'Digestive'],
    relatedProducts: ['30', '31', '19']
  },
  {
    id: '30',
    name: 'Cabin Biscuits',
    category: 'Biscuit',
    unit: 'per pack',
    priceRange: '₦200-350',
    currentPrice: 250,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: false,
    description: 'Classic cabin biscuits, great for snacking.',
    attributes: {
      origin: 'Nigeria',
      brand: 'Cabin',
      quality: 'Classic',
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Classic', 'Snacking', 'Affordable'],
    relatedProducts: ['29', '31', '33']
  },
  {
    id: '31',
    name: 'Shortbread Biscuits',
    category: 'Biscuit',
    unit: 'per pack',
    priceRange: '₦400-600',
    currentPrice: 500,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: false,
    description: 'Buttery shortbread biscuits, premium quality.',
    attributes: {
      origin: 'Nigeria',
      brand: 'Premium',
      quality: 'Premium',
      shelfLife: '12 months',
      storage: 'Cool, dry place'
    },
    tags: ['Buttery', 'Premium', 'Quality'],
    relatedProducts: ['29', '30', '19']
  },
  // SNACKS
  {
    id: '32',
    name: 'Plantain Chips',
    category: 'Snacks',
    unit: 'per pack',
    priceRange: '₦300-500',
    currentPrice: 400,
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    inStock: true,
    fresh: false,
    description: 'Crispy plantain chips, perfect for snacking.',
    attributes: {
      origin: 'Nigeria',
      quality: 'Crispy',
      processed: true,
      shelfLife: '6 months',
      storage: 'Cool, dry place'
    },
    tags: ['Crispy', 'Snack', 'Plantain'],
    relatedProducts: ['8', '33', '34']
  },
  {
    id: '33',
    name: 'Chin Chin',
    category: 'Snacks',
    unit: 'per pack',
    priceRange: '₦200-400',
    currentPrice: 300,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    inStock: true,
    fresh: false,
    description: 'Traditional Nigerian snack, crunchy and sweet.',
    attributes: {
      origin: 'Nigeria',
      quality: 'Traditional',
      processed: true,
      shelfLife: '6 months',
      storage: 'Cool, dry place'
    },
    tags: ['Traditional', 'Crunchy', 'Sweet'],
    relatedProducts: ['32', '34', '18']
  },
  {
    id: '34',
    name: 'Groundnut (Roasted)',
    category: 'Snacks',
    unit: 'per cup',
    priceRange: '₦150-300',
    currentPrice: 200,
    image: 'https://images.pexels.com/photos/1580617/pexels-photo-1580617.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    inStock: true,
    fresh: false,
    description: 'Roasted groundnuts, healthy and delicious snack.',
    attributes: {
      origin: 'Northern Nigeria',
      quality: 'Roasted',
      processed: true,
      shelfLife: '3 months',
      storage: 'Cool, dry place',
      nutritionalInfo: {
        calories: 567,
        protein: 25.8,
        carbs: 16.1,
        fat: 49.2,
        fiber: 8.5
      }
    },
    tags: ['Roasted', 'Healthy', 'Protein'],
    relatedProducts: ['32', '33', '15']
  },
  {
    id: '35',
    name: 'Boli (Roasted Plantain)',
    category: 'Snacks',
    unit: 'per piece',
    priceRange: '₦100-200',
    currentPrice: 150,
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    inStock: true,
    fresh: true,
    description: 'Freshly roasted plantain, popular Nigerian street snack.',
    attributes: {
      origin: 'Nigeria',
      quality: 'Fresh',
      processed: false,
      shelfLife: '1 day',
      storage: 'Consume immediately'
    },
    tags: ['Fresh', 'Street Food', 'Popular'],
    relatedProducts: ['8', '32', '6']
  },
];

export const categories = [
  { id: 'all', name: 'All', icon: '🛒', color: '#B3C33E' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: '#fff0f5' },
  { id: 'grains', name: 'Grains', icon: '🌾', color: '#fef3ed' },
  { id: 'spices', name: 'Spices', icon: '🌶️', color: '#e5faf3' },
  { id: 'seafoods', name: 'Seafoods', icon: '🐟', color: '#f0f9ff' },
  { id: 'fruits', name: 'Fruits', icon: '🍊', color: '#fff0f5' },
  { id: 'groceries', name: 'Groceries', icon: '📦', color: '#fef3ed' },
  { id: 'frozen-foods', name: 'Frozen Foods', icon: '🧊', color: '#e5faf3' },
  { id: 'bakery', name: 'Bakery', icon: '🍞', color: '#f0f9ff' },
  { id: 'diary', name: 'Diary', icon: '🥛', color: '#fff0f5' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#fef3ed' },
  { id: 'biscuit', name: 'Biscuit', icon: '🍪', color: '#e5faf3' },
  { id: 'snacks', name: 'Snacks', icon: '🥜', color: '#f0f9ff' },
];