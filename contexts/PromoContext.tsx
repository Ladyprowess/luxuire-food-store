import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  userSpecific?: string; // User ID for personalized codes
}

interface PromoContextType {
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string, orderTotal: number) => Promise<{ success: boolean; message: string; discount?: number }>;
  removePromoCode: () => void;
  getAvailablePromoCodes: () => PromoCode[];
  createPersonalizedPromo: (userId: string, discountValue: number) => Promise<PromoCode>;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

// Default promo codes
const defaultPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: '10% off your first order',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 2000,
    maxDiscount: 1000,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 1000,
    usedCount: 0,
    isActive: true,
  },
  {
    id: '2',
    code: 'FRESH500',
    description: '₦500 off orders above ₦5000',
    discountType: 'fixed',
    discountValue: 500,
    minimumOrder: 5000,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 500,
    usedCount: 0,
    isActive: true,
  },
  {
    id: '3',
    code: 'WEEKEND15',
    description: '15% off weekend orders',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrder: 3000,
    maxDiscount: 2000,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 200,
    usedCount: 0,
    isActive: true,
  },
];

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(defaultPromoCodes);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const data = await AsyncStorage.getItem('promoCodes');
      if (data) {
        const savedCodes = JSON.parse(data);
        // Merge with default codes, avoiding duplicates
        const mergedCodes = [...defaultPromoCodes];
        savedCodes.forEach((savedCode: PromoCode) => {
          if (!mergedCodes.find(code => code.id === savedCode.id)) {
            mergedCodes.push(savedCode);
          }
        });
        setPromoCodes(mergedCodes);
      }
    } catch (error) {
      console.error('Error loading promo codes:', error);
    }
  };

  const savePromoCodes = async (codes: PromoCode[]) => {
    try {
      await AsyncStorage.setItem('promoCodes', JSON.stringify(codes));
    } catch (error) {
      console.error('Error saving promo codes:', error);
    }
  };

  const applyPromoCode = async (
    code: string, 
    orderTotal: number
  ): Promise<{ success: boolean; message: string; discount?: number }> => {
    const promoCode = promoCodes.find(
      promo => promo.code.toLowerCase() === code.toLowerCase() && promo.isActive
    );

    if (!promoCode) {
      return { success: false, message: 'Invalid promo code' };
    }

    if (new Date() > promoCode.expiryDate) {
      return { success: false, message: 'Promo code has expired' };
    }

    if (promoCode.usedCount >= promoCode.usageLimit) {
      return { success: false, message: 'Promo code usage limit reached' };
    }

    if (orderTotal < promoCode.minimumOrder) {
      return { 
        success: false, 
        message: `Minimum order of ₦${promoCode.minimumOrder.toLocaleString()} required` 
      };
    }

    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (orderTotal * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else {
      discount = promoCode.discountValue;
    }

    // Update usage count
    const updatedCodes = promoCodes.map(code => 
      code.id === promoCode.id 
        ? { ...code, usedCount: code.usedCount + 1 }
        : code
    );
    
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);
    setAppliedPromo(promoCode);

    return { 
      success: true, 
      message: `Promo code applied! You saved ₦${discount.toLocaleString()}`,
      discount 
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const getAvailablePromoCodes = () => {
    return promoCodes.filter(promo => 
      promo.isActive && 
      new Date() <= promo.expiryDate &&
      promo.usedCount < promo.usageLimit
    );
  };

  const createPersonalizedPromo = async (userId: string, discountValue: number): Promise<PromoCode> => {
    const newPromo: PromoCode = {
      id: `personal_${Date.now()}`,
      code: `PERSONAL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      description: `Personal discount - ${discountValue}% off`,
      discountType: 'percentage',
      discountValue,
      minimumOrder: 1000,
      maxDiscount: 5000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
      userSpecific: userId,
    };

    const updatedCodes = [...promoCodes, newPromo];
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);

    return newPromo;
  };

  return (
    <PromoContext.Provider value={{
      promoCodes,
      appliedPromo,
      applyPromoCode,
      removePromoCode,
      getAvailablePromoCodes,
      createPersonalizedPromo,
    }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (context === undefined) {
    throw new Error('usePromo must be used within a PromoProvider');
  }
  return context;
}