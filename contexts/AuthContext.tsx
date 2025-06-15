import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists with this email (simulate database check)
      const existingUserData = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = existingUserData ? JSON.parse(existingUserData) : [];
      
      const existingUser = registeredUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        return false; // User not found
      }
      
      // Create user data with all stored information
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        profileImage: existingUser.profileImage,
        addresses: existingUser.addresses || [],
        defaultAddressId: existingUser.defaultAddressId,
        preferredPaymentMethod: existingUser.preferredPaymentMethod || 'online',
        walletBalance: existingUser.walletBalance || 0,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists with this phone (simulate database check)
      const existingUserData = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = existingUserData ? JSON.parse(existingUserData) : [];
      
      const existingUser = registeredUsers.find((u: any) => u.phone === phone);
      
      if (!existingUser) {
        return false; // User not found
      }
      
      // Create user data with all stored information
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        profileImage: existingUser.profileImage,
        addresses: existingUser.addresses || [],
        defaultAddressId: existingUser.defaultAddressId,
        preferredPaymentMethod: existingUser.preferredPaymentMethod || 'online',
        walletBalance: existingUser.walletBalance || 0,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userId = Date.now().toString();
      
      // Create user data with default payment method and wallet
      const userData: User = {
        id: userId,
        name,
        email,
        phone,
        addresses: [],
        preferredPaymentMethod: 'online',
        walletBalance: 0,
      };

      // Save to registered users list (simulate database)
      const existingUserData = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = existingUserData ? JSON.parse(existingUserData) : [];
      registeredUsers.push(userData);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Set as current user
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      
      // Update in registered users list
      const existingUserData = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = existingUserData ? JSON.parse(existingUserData) : [];
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex] = updatedUser;
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithPhone,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}