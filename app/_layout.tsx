import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { ReferralProvider } from '@/contexts/ReferralContext';
import { PromoProvider } from '@/contexts/PromoContext';
import { PaystackProvider } from '@/contexts/PaystackContext';

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' && SplashScreen) {
      SplashScreen.preventAutoHideAsync();
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (Platform.OS !== 'web' && SplashScreen) {
        SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <PaystackProvider>
        <ReferralProvider>
          <PromoProvider>
            <CartProvider>
              <LocationProvider>
                <FavoritesProvider>
                  <OrdersProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="auth" />
                      <Stack.Screen name="onboarding" />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="location-picker" />
                      <Stack.Screen name="notifications" />
                      <Stack.Screen name="help-center" />
                      <Stack.Screen name="product-details" />
                      <Stack.Screen name="checkout" />
                      <Stack.Screen name="custom-basket" />
                      <Stack.Screen name="favorites" />
                      <Stack.Screen name="promo-codes" />
                      <Stack.Screen name="referral" />
                      <Stack.Screen name="order-tracking" />
                      <Stack.Screen name="ai-reminder" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                  </OrdersProvider>
                </FavoritesProvider>
              </LocationProvider>
            </CartProvider>
          </PromoProvider>
        </ReferralProvider>
      </PaystackProvider>
    </AuthProvider>
  );
}