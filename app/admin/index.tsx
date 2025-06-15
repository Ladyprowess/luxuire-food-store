import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  Bell, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react-native';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });

  const { orders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const calculateStats = () => {
    const today = new Date().toDateString();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const activeOrders = orders.filter(order => 
      ['shopping', 'purchased', 'delivery'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    ).length;

    setStats({
      totalOrders,
      pendingOrders,
      activeOrders,
      completedOrders,
      totalRevenue,
      todayOrders,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    calculateStats();
    setRefreshing(false);
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/admin/notifications')}
        >
          <Bell size={24} color="#333333" strokeWidth={2} />
          {stats.pendingOrders > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{stats.pendingOrders}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.primaryCard]}>
              <View style={styles.statIcon}>
                <ShoppingBag size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statNumber}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            
            <View style={[styles.statCard, styles.warningCard]}>
              <View style={styles.statIcon}>
                <Clock size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
              <Text style={styles.statLabel}>Pending Orders</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.infoCard]}>
              <View style={styles.statIcon}>
                <Truck size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statNumber}>{stats.activeOrders}</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </View>
            
            <View style={[styles.statCard, styles.successCard]}>
              <View style={styles.statIcon}>
                <DollarSign size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statNumber}>₦{stats.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/orders')}
            >
              <ShoppingBag size={32} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Manage Orders</Text>
              {stats.pendingOrders > 0 && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>{stats.pendingOrders}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/products')}
            >
              <Package size={32} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/users')}
            >
              <Users size={32} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Users</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/analytics')}
            >
              <DollarSign size={32} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/admin/orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order) => {
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
                    <Text style={styles.orderId}>#{order.id}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.orderStatus, { backgroundColor: statusColor }]}>
                    <StatusIcon size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.orderStatusText}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.orderDetail}>
                    <Text style={styles.orderDetailLabel}>Items:</Text>
                    <Text style={styles.orderDetailValue}>{order.items.length}</Text>
                  </View>
                  <View style={styles.orderDetail}>
                    <Text style={styles.orderDetailLabel}>Total:</Text>
                    <Text style={styles.orderDetailValue}>₦{order.total.toLocaleString()}</Text>
                  </View>
                  <View style={styles.orderDetail}>
                    <Text style={styles.orderDetailLabel}>Payment:</Text>
                    <Text style={styles.orderDetailValue}>{order.paymentMethod}</Text>
                  </View>
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => router.push(`/admin/orders?id=${order.id}`)}
                  >
                    <Text style={styles.actionButtonText}>Manage</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          {recentOrders.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent orders</Text>
            </View>
          )}
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>New Orders:</Text>
              <Text style={styles.summaryValue}>{stats.todayOrders}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending Orders:</Text>
              <Text style={styles.summaryValue}>{stats.pendingOrders}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Active Orders:</Text>
              <Text style={styles.summaryValue}>{stats.activeOrders}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => router.push('/admin')}
        >
          <DollarSign size={24} color="#B3C33E" strokeWidth={2} />
          <Text style={[styles.navItemText, styles.navItemTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin/orders')}
        >
          <ShoppingBag size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin/products')}
        >
          <Package size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin/users')}
        >
          <Users size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Users</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#B3C33E',
  },
  warningCard: {
    backgroundColor: '#FF9800',
  },
  infoCard: {
    backgroundColor: '#2196F3',
  },
  successCard: {
    backgroundColor: '#4CAF50',
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#B3C33E',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginTop: 8,
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderDetailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  orderDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#B3C33E',
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#B3C33E',
    marginTop: -2,
  },
  navItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  navItemTextActive: {
    fontFamily: 'Inter-Medium',
    color: '#B3C33E',
  },
});