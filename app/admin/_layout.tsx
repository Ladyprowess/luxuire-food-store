import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is admin (you can implement your own admin check logic)
    if (!user || !isAdmin(user)) {
      router.replace('/auth');
    }
  }, [user]);

  const isAdmin = (user: any) => {
    // For demo purposes, check if email contains 'admin' or specific admin emails
    const adminEmails = ['admin@luxuire.com', 'support@luxuire.com', 'luxuireng@gmail.com'];
    return adminEmails.includes(user?.email?.toLowerCase()) || user?.email?.includes('admin');
  };

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="products" />
      <Stack.Screen name="users" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}