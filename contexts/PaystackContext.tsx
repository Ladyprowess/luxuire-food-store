import React, { createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';

interface PaystackContextType {
  initializePayment: (amount: number, email: string, onSuccess: () => void, onCancel: () => void) => void;
  publicKey: string;
}

const PaystackContext = createContext<PaystackContextType | undefined>(undefined);

const PAYSTACK_PUBLIC_KEY = 'pk_test_uBGqk1VY8jvNrSNQE'; // Your public key

export function PaystackProvider({ children }: { children: ReactNode }) {
  const initializePayment = (
    amount: number, 
    email: string, 
    onSuccess: () => void, 
    onCancel: () => void
  ) => {
    if (Platform.OS === 'web') {
      // Web implementation using Paystack Popup
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: amount * 100, // Convert to kobo
          currency: 'NGN',
          ref: `luxuire_${Date.now()}`,
          callback: function(response: any) {
            console.log('Payment successful:', response);
            onSuccess();
          },
          onClose: function() {
            console.log('Payment cancelled');
            onCancel();
          }
        });
        handler.openIframe();
      };
      document.head.appendChild(script);
    } else {
      // For mobile, we'll use a fallback or show instructions
      console.log('Mobile payment would be handled by react-native-paystack-webview');
      // In a real implementation, you would use the PaystackWebView component
      onSuccess(); // For demo purposes
    }
  };

  return (
    <PaystackContext.Provider value={{
      initializePayment,
      publicKey: PAYSTACK_PUBLIC_KEY,
    }}>
      {children}
    </PaystackContext.Provider>
  );
}

export function usePaystack() {
  const context = useContext(PaystackContext);
  if (context === undefined) {
    throw new Error('usePaystack must be used within a PaystackProvider');
  }
  return context;
}