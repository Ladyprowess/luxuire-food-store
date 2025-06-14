import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductVariation } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variation?: ProductVariation | null) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpecialRequest: (itemId: string, request: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1, variation?: ProductVariation | null) => {
    setItems(currentItems => {
      // Check if the same product with the same variation already exists
      const existingItem = currentItems.find(item => 
        item.product.id === product.id && 
        item.selectedVariation?.id === variation?.id
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.selectedVariation?.id === variation?.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, {
        id: Date.now().toString(),
        product,
        selectedVariation: variation || undefined,
        quantity,
        specialRequest: '',
      }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateSpecialRequest = (itemId: string, request: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, specialRequest: request } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.selectedVariation ? item.selectedVariation.price : item.product.currentPrice;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateSpecialRequest,
      clearCart,
      getCartTotal,
      getCartItemsCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}