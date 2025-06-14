import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { Linking } from 'react-native';

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

// Email notification function
const sendEmailNotification = async (type: string, data: any) => {
  const subject = encodeURIComponent(`Luxuire ${type} Notification`);
  let body = '';
  
  switch (type) {
    case 'Registration':
      body = encodeURIComponent(`New user registration:%0D%0A%0D%0AName: ${data.name}%0D%0AEmail: ${data.email}%0D%0APhone: ${data.phone}%0D%0ARegistration Time: ${new Date().toLocaleString()}`);
      break;
    case 'Login':
      body = encodeURIComponent(`User login:%0D%0A%0D%0AEmail/Phone: ${data.identifier}%0D%0ALogin Time: ${new Date().toLocaleString()}`);
      break;
    case 'Profile Update':
      body = encodeURIComponent(`Profile updated:%0D%0A%0D%0AUser: ${data.name}%0D%0AEmail: ${data.email}%0D%0APhone: ${data.phone}%0D%0AUpdate Time: ${new Date().toLocaleString()}`);
      break;
  }
  
  const emailUrl = `mailto:luxuireng@gmail.com?cc=support@luxuire.com&subject=${subject}&body=${body}`;
  
  // In a real app, you would send this to your backend API
  // For now, we'll just log it or optionally open email client
  console.log('Email notification:', emailUrl);
};

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
      
      // Create user data with only the information they registered with
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        profileImage: existingUser.profileImage,
        addresses: existingUser.addresses || [],
        defaultAddressId: existingUser.defaultAddressId,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Send email notification
      await sendEmailNotification('Login', { identifier: email });
      
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
      
      // Create user data with only the information they registered with
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        profileImage: existingUser.profileImage,
        addresses: existingUser.addresses || [],
        defaultAddressId: existingUser.defaultAddressId,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Send email notification
      await sendEmailNotification('Login', { identifier: phone });
      
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
      
      // Create user data with only the information provided during registration
      const userData: User = {
        id: userId,
        name,
        email,
        phone,
        addresses: [],
      };

      // Save to registered users list (simulate database)
      const existingUserData = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = existingUserData ? JSON.parse(existingUserData) : [];
      registeredUsers.push(userData);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Set as current user
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Send email notification
      await sendEmailNotification('Registration', { name, email, phone });
      
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
      
      // Send email notification
      await sendEmailNotification('Profile Update', updatedUser);
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
    throw new error('useAuth must be used within an AuthProvider');
  }
  return context;
}