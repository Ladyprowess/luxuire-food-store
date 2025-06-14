import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, ShoppingBag, Truck, CircleCheck as CheckCircle, MapPin, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import { useOrders } from '@/contexts/OrdersContext';

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'history'>('active');
  const { getActiveOrders, getOrderHistory } = useOrders();

  const activeOrders = getActiveOrders();
  const orderHistory = getOrderHistory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'shopping': return '#2196F3';
      case 'purchased': return '#4CAF50';
      case 'delivery': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#999999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'shopping': return ShoppingBag;
      case 'purchased': return Package;
      case 'delivery': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const renderOrder = (order: any) => {
    const StatusIcon = getStatusIcon(order.status);
    const statusColor = getStatusColor(order.status);

    return (
      <TouchableOpacity 
        key={order.id} 
        style={styles.orderCard}
        onPress={() => router.push(`/order-tracking?id=${order.id}`)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
            <StatusIcon size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.statusText}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.slice(0, 2).map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <Image source={{ uri: item.product.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.deliveryInfo}>
            <MapPin size={14} color="#666666" strokeWidth={2} />
            <Text style={styles.deliveryText}>
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </Text>
          </View>
          <Text style={styles.orderTotal}>₦{order.total.toLocaleString()}</Text>
        </View>

        {order.estimatedDelivery && order.status !== 'delivered' && (
          <View style={styles.estimatedDelivery}>
            <Text style={styles.estimatedText}>
              Est. Delivery: {order.estimatedDelivery}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.tabActive]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.tabTextActive]}>
            History ({orderHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.ordersContainer}>
        {selectedTab === 'active' ? (
          activeOrders.length > 0 ? (
            activeOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyState}>
              <Clock size={48} color="#CCCCCC" strokeWidth={1} />
              <Text style={styles.emptyStateText}>No active orders</Text>
              <Text style={styles.emptyStateSubtext}>
                When you place an order, you'll see real-time tracking here
              </Text>
              <TouchableOpacity 
                style={styles.shopNowButton}
                onPress={() => router.push('/(tabs)/browse')}
              >
                <Text style={styles.shopNowButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          orderHistory.length > 0 ? (
            orderHistory.map(renderOrder)
          ) : (
            <View style={styles.emptyState}>
              <Package size={48} color="#CCCCCC" strokeWidth={1} />
              <Text style={styles.emptyStateText}>No order history</Text>
              <Text style={styles.emptyStateSubtext}>
                Your completed orders will appear here
              </Text>
              <TouchableOpacity 
                style={styles.shopNowButton}
                onPress={() => router.push('/(tabs)/browse')}
              >
                <Text style={styles.shopNowButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#B3C33E',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  orderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  itemQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  moreItems: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B3C33E',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  orderTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#B3C33E',
  },
  estimatedDelivery: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  estimatedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B3C33E',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  shopNowButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});