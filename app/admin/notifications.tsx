import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, ShoppingBag, Tag, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react-native';

// Mock notifications data - in a real app, this would come from a context or API
const initialNotifications = [
  {
    id: '1',
    title: 'New Order Placed',
    message: 'Order #LX311514 has been placed and is awaiting processing.',
    type: 'order',
    orderId: 'LX311514',
    read: false,
    createdAt: new Date(2025, 5, 15, 17, 51, 51),
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Payment of ₦5,000 has been received for order #LX311514.',
    type: 'order',
    orderId: 'LX311514',
    read: false,
    createdAt: new Date(2025, 5, 15, 17, 52, 30),
  },
  {
    id: '3',
    title: 'New User Registered',
    message: 'A new user has registered: John Doe (john.doe@example.com).',
    type: 'system',
    read: true,
    createdAt: new Date(2025, 5, 15, 16, 30, 0),
  },
  {
    id: '4',
    title: 'Low Stock Alert',
    message: 'Fresh Ugu Leaves is running low on stock (only 5 units left).',
    type: 'system',
    read: true,
    createdAt: new Date(2025, 5, 15, 15, 45, 0),
  },
  {
    id: '5',
    title: 'Promo Code Created',
    message: 'New promo code "SUMMER25" has been created and is now active.',
    type: 'promotion',
    read: true,
    createdAt: new Date(2025, 5, 15, 14, 20, 0),
  },
];

export default function AdminNotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch new notifications here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string, read: boolean) => {
    const color = read ? '#999999' : '#B3C33E';
    
    switch (type) {
      case 'order':
        return <ShoppingBag size={24} color={color} strokeWidth={2} />;
      case 'promotion':
        return <Tag size={24} color={color} strokeWidth={2} />;
      case 'system':
        return <AlertCircle size={24} color={color} strokeWidth={2} />;
      default:
        return <Bell size={24} color={color} strokeWidth={2} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.notificationCount}>
          <Bell size={16} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.notificationCountText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={markAllAsRead}
            >
              <CheckCircle size={16} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.actionButtonText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={clearAllNotifications}
            >
              <Trash2 size={16} color="#FF4444" strokeWidth={2} />
              <Text style={[styles.actionButtonText, styles.deleteText]}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => {
                markAsRead(notification.id);
                if (notification.type === 'order' && notification.orderId) {
                  router.push(`/admin/orders?id=${notification.orderId}`);
                }
              }}
            >
              <View style={styles.notificationIcon}>
                {getNotificationIcon(notification.type, notification.read)}
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadNotificationTitle
                  ]}>
                    {notification.title}
                  </Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                  >
                    <Trash2 size={16} color="#999999" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <View style={styles.notificationFooter}>
                  <View style={styles.notificationTime}>
                    <Clock size={12} color="#999999" strokeWidth={2} />
                    <Text style={styles.notificationTimeText}>
                      {formatTime(notification.createdAt)}
                    </Text>
                  </View>
                  {!notification.read && (
                    <TouchableOpacity 
                      style={styles.markReadButton}
                      onPress={() => markAsRead(notification.id)}
                    >
                      <Text style={styles.markReadButtonText}>Mark as read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color="#CCCCCC" strokeWidth={1} />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>
              You'll receive notifications about orders, users, and system events here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationCountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B3C33E',
    marginLeft: 4,
  },
  deleteText: {
    color: '#FF4444',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unreadNotification: {
    backgroundColor: '#F0F7E6',
  },
  notificationIcon: {
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  unreadNotificationTitle: {
    color: '#7A9C2A',
  },
  deleteButton: {
    padding: 4,
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  markReadButton: {
    padding: 4,
  },
  markReadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B3C33E',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});