import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  BarChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react-native';

export default function AdminAnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('week');
  
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Week';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <Text style={styles.timeRangeLabel}>{getTimeRangeLabel()}</Text>
        <View style={styles.timeRangeButtons}>
          {['day', 'week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.timeRangeButtonText,
                timeRange === range && styles.timeRangeButtonTextActive
              ]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <DollarSign size={20} color="#B3C33E" strokeWidth={2} />
                <View style={styles.metricTrend}>
                  <ArrowUpRight size={16} color="#4CAF50" strokeWidth={2} />
                  <Text style={[styles.metricTrendText, styles.trendUp]}>12%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>₦125,000</Text>
              <Text style={styles.metricLabel}>Revenue</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <ShoppingBag size={20} color="#B3C33E" strokeWidth={2} />
                <View style={styles.metricTrend}>
                  <ArrowUpRight size={16} color="#4CAF50" strokeWidth={2} />
                  <Text style={[styles.metricTrendText, styles.trendUp]}>8%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>42</Text>
              <Text style={styles.metricLabel}>Orders</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Users size={20} color="#B3C33E" strokeWidth={2} />
                <View style={styles.metricTrend}>
                  <ArrowUpRight size={16} color="#4CAF50" strokeWidth={2} />
                  <Text style={[styles.metricTrendText, styles.trendUp]}>5%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>15</Text>
              <Text style={styles.metricLabel}>New Users</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <DollarSign size={20} color="#B3C33E" strokeWidth={2} />
                <View style={styles.metricTrend}>
                  <ArrowDownRight size={16} color="#FF4444" strokeWidth={2} />
                  <Text style={[styles.metricTrendText, styles.trendDown]}>3%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>₦2,976</Text>
              <Text style={styles.metricLabel}>Avg. Order</Text>
            </View>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenue</Text>
            <TouchableOpacity>
              <Calendar size={20} color="#666666" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <BarChart size={48} color="#CCCCCC" strokeWidth={1} />
              <Text style={styles.chartPlaceholderText}>Revenue Chart</Text>
            </View>
          </View>
        </View>

        {/* Order Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusChart}>
              <PieChart size={100} color="#B3C33E" strokeWidth={2} />
            </View>
            <View style={styles.orderStatusLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.legendLabel}>Pending (12)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.legendLabel}>Shopping (8)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.legendLabel}>Delivery (5)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendLabel}>Delivered (17)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          <View style={styles.topProductsContainer}>
            {[
              { name: 'Fresh Ugu Leaves', sales: 42, revenue: 42000 },
              { name: 'Local Rice (Ofada)', sales: 38, revenue: 68400 },
              { name: 'Fresh Tomatoes', sales: 35, revenue: 87500 },
              { name: 'Palm Oil', sales: 30, revenue: 45000 },
              { name: 'Fresh Fish (Tilapia)', sales: 28, revenue: 61600 },
            ].map((product, index) => (
              <View key={index} style={styles.topProductItem}>
                <View style={styles.topProductRank}>
                  <Text style={styles.topProductRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topProductInfo}>
                  <Text style={styles.topProductName}>{product.name}</Text>
                  <View style={styles.topProductStats}>
                    <Text style={styles.topProductStat}>
                      <Text style={styles.topProductStatLabel}>Sales:</Text> {product.sales}
                    </Text>
                    <Text style={styles.topProductStat}>
                      <Text style={styles.topProductStatLabel}>Revenue:</Text> ₦{product.revenue.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {[
              { type: 'order', message: 'New order #LX311514 placed', time: '2 hours ago' },
              { type: 'user', message: 'New user registered: John Doe', time: '5 hours ago' },
              { type: 'payment', message: 'Payment of ₦5,000 received', time: '6 hours ago' },
              { type: 'order', message: 'Order #LX311490 delivered', time: '1 day ago' },
              { type: 'product', message: 'Product "Fresh Ugu Leaves" updated', time: '2 days ago' },
            ].map((activity, index) => {
              let Icon;
              switch (activity.type) {
                case 'order': Icon = ShoppingBag; break;
                case 'user': Icon = Users; break;
                case 'payment': Icon = DollarSign; break;
                case 'product': Icon = Package; break;
                default: Icon = Calendar;
              }
              
              return (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityMessage}>{activity.message}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin')}
        >
          <TrendingUp size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Dashboard</Text>
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
  timeRangeContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  timeRangeLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#B3C33E',
  },
  timeRangeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  timeRangeButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginLeft: 2,
  },
  trendUp: {
    color: '#4CAF50',
  },
  trendDown: {
    color: '#FF4444',
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  chartContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  orderStatusChart: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderStatusLegend: {
    flex: 1,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
  },
  topProductsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topProductRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B3C33E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topProductRankText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  topProductStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topProductStat: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  topProductStatLabel: {
    fontFamily: 'Inter-Medium',
    color: '#999999',
  },
  activityContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B3C33E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
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