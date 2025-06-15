import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  getNotificationsByType: (type: 'order' | 'promotion' | 'system') => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await AsyncStorage.getItem('notifications');
      if (data) {
        // Parse the stored notifications and ensure dates are properly converted
        const parsedNotifications = JSON.parse(data).map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (newNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications);

    // In a real app, you might also want to trigger a push notification here
    console.log('New notification added:', newNotification);
  };

  const markAsRead = async (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, read: true })
    );
    
    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications);
  };

  const deleteNotification = async (id: string) => {
    const updatedNotifications = notifications.filter(notification => 
      notification.id !== id
    );
    
    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
    await saveNotifications([]);
  };

  const getNotificationsByType = (type: 'order' | 'promotion' | 'system') => {
    return notifications.filter(notification => notification.type === type);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      getNotificationsByType,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}