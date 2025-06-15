export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  addresses: Address[];
  defaultAddressId?: string;
  preferredPaymentMethod?: 'online' | 'cash' | 'wallet';
  walletBalance?: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  priceRange: string;
  inStock: boolean;
  attributes: {
    size?: string;
    weight?: string;
    quality?: string;
    color?: string;
    brand?: string;
    origin?: string;
    packaging?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  priceRange: string;
  currentPrice: number;
  image: string;
  images?: string[]; // Multiple product images
  lastBought?: string;
  rating: number;
  inStock: boolean;
  fresh: boolean;
  description?: string;
  variations?: ProductVariation[];
  attributes: {
    origin?: string;
    brand?: string;
    quality?: string;
    organic?: boolean;
    processed?: boolean;
    shelfLife?: string;
    storage?: string;
    nutritionalInfo?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
  };
  tags?: string[];
  relatedProducts?: string[]; // Product IDs
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariation?: ProductVariation;
  quantity: number;
  specialRequest?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  status: 'pending' | 'shopping' | 'purchased' | 'delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentMethod: string;
  specialInstructions?: string;
  createdAt: Date;
  estimatedDelivery?: string;
  agent?: string;
  agentPhone?: string;
  trackingSteps: TrackingStep[];
  customOrderData?: {
    itemNames?: string;
    quantity?: string;
    description?: string;
    deliveryTime?: string;
    budget?: string;
    isCustomOrder?: boolean;
  };
  payForMeLink?: string;
  paymentReference?: string; // Store Paystack payment reference
}

export interface TrackingStep {
  step: string;
  completed: boolean;
  time: string;
  current?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  read: boolean;
  createdAt: Date;
  orderId?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}