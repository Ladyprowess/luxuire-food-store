import React, { createContext, useContext, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';

interface PaystackContextType {
  initializePayment: (
    amount: number, 
    email: string, 
    orderId: string,
    userId: string,
    onSuccess: (reference: string) => void, 
    onCancel: () => void
  ) => void;
  publicKey: string;
}

const PaystackContext = createContext<PaystackContextType | undefined>(undefined);

const PAYSTACK_PUBLIC_KEY = 'pk_test_uBGqk1VY8jvNrSNQE'; // Using test key for development

export function PaystackProvider({ children }: { children: ReactNode }) {
  const initializePayment = (
    amount: number, 
    email: string, 
    orderId: string,
    userId: string,
    onSuccess: (reference: string) => void, 
    onCancel: () => void
  ) => {
    // Generate secure payment reference
    const reference = `luxuire_${orderId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

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
          ref: reference,
          metadata: {
            custom_fields: [
              {
                display_name: "Order ID",
                variable_name: "order_id",
                value: orderId
              },
              {
                display_name: "User ID",
                variable_name: "user_id",
                value: userId
              }
            ]
          },
          callback: function(response: any) {
            console.log('Payment successful:', response);
            onSuccess(response.reference);
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
      
      // For demo purposes, simulate a payment
      Alert.alert(
        'Demo Payment',
        `This is a demo payment simulation for mobile.\n\nAmount: ₦${amount.toLocaleString()}\nReference: ${reference}`,
        [
          { text: 'Cancel', onPress: onCancel, style: 'cancel' },
          { 
            text: 'Simulate Success', 
            onPress: () => {
              // Simulate payment processing delay
              Alert.alert(
                'Processing Payment',
                'Please wait while we process your payment...',
                [],
                { cancelable: false }
              );
              
              setTimeout(() => {
                console.log('Mobile payment simulation completed successfully');
                onSuccess(reference);
              }, 2000);
            }
          }
        ]
      );
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