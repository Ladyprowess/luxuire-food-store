import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useOrders } from '@/contexts/OrdersContext';
import { ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react-native';

interface AdminOrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated?: () => void;
}

export default function AdminOrderStatusUpdater({ 
  orderId, 
  currentStatus,
  onStatusUpdated
}: AdminOrderStatusUpdaterProps) {
  const { updateOrderStatus } = useOrders();

  const getNextStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'shopping';
      case 'shopping': return 'purchased';
      case 'purchased': return 'delivery';
      case 'delivery': return 'delivered';
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shopping': return ShoppingBag;
      case 'purchased': return Package;
      case 'delivery': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'shopping': return 'Mark as Shopping';
      case 'purchased': return 'Mark as Purchased';
      case 'delivery': return 'Mark as Out for Delivery';
      case 'delivered': return 'Mark as Delivered';
      default: return 'Update Status';
    }
  };

  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus(currentStatus);
    
    if (!nextStatus) {
      Alert.alert('Error', 'Cannot update status further');
      return;
    }

    Alert.alert(
      'Update Order Status',
      `Are you sure you want to update this order to "${nextStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: () => {
            updateOrderStatus(orderId, nextStatus);
            
            // Create notification for admin
            try {
              // We'll handle notifications through the OrdersContext instead
              // This avoids the dependency on NotificationContext
              console.log(`Order #${orderId} has been updated from "${currentStatus}" to "${nextStatus}"`);
            } catch (error) {
              console.error('Failed to create notification:', error);
            }
            
            Alert.alert('Success', `Order status updated to ${nextStatus}`);
            
            if (onStatusUpdated) {
              onStatusUpdated();
            }
          }
        }
      ]
    );
  };

  const nextStatus = getNextStatus(currentStatus);
  
  if (!nextStatus) {
    return (
      <View style={styles.container}>
        <Text style={styles.completedText}>Order completed</Text>
      </View>
    );
  }

  const StatusIcon = getStatusIcon(nextStatus);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.updateButton}
        onPress={handleUpdateStatus}
      >
        <StatusIcon size={16} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.updateButtonText}>{getStatusText(nextStatus)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  },
});