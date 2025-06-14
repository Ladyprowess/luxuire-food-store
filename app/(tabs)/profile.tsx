import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, MapPin, CreditCard, Bell, Heart, RotateCcw, Users, CircleHelp as HelpCircle, Settings, LogOut, ChevronRight, Star, Gift, CreditCard as Edit, Tag, Zap } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/contexts/ReferralContext';
import { useOrders } from '@/contexts/OrdersContext';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: MapPin, label: 'Delivery Addresses', action: () => router.push('/location-picker') },
      { icon: CreditCard, label: 'Payment Methods', action: () => handlePaymentMethods() },
      { icon: Bell, label: 'Notifications', action: () => router.push('/notifications') },
    ]
  },
  {
    title: 'Shopping',
    items: [
      { icon: Heart, label: 'Favorites', action: () => router.push('/favorites') },
      { icon: RotateCcw, label: 'Order History', action: () => router.push('/(tabs)/orders') },
      { icon: Tag, label: 'Promo Codes', action: () => router.push('/promo-codes') },
      { icon: Zap, label: 'AI Reminders', action: () => router.push('/ai-reminder') },
    ]
  },
  {
    title: 'Community',
    items: [
      { icon: Users, label: 'Refer Friends', action: () => router.push('/referral') },
      { icon: Star, label: 'Rate Luxuire', action: () => handleRateApp() },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', action: () => router.push('/help-center') },
      { icon: Settings, label: 'Settings', action: () => handleSettings() },
    ]
  }
];

const handlePaymentMethods = () => {
  Alert.alert(
    'Payment Methods',
    'Manage your saved payment methods and add new ones.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Manage', onPress: () => {
        Alert.alert('Coming Soon', 'Payment methods management will be available soon!');
      }}
    ]
  );
};

const handleRateApp = () => {
  Alert.alert(
    'Rate Luxuire',
    'Love using Luxuire? Rate us on the App Store!',
    [
      { text: 'Later', style: 'cancel' },
      { text: 'Rate Now', onPress: () => {
        Linking.openURL('https://apps.apple.com/app/luxuire');
      }}
    ]
  );
};

const handleSettings = () => {
  Alert.alert(
    'Settings',
    'Manage your app preferences and account settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => {
        Alert.alert('Coming Soon', 'Settings will be available soon!');
      }}
    ]
  );
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { referralData, getReferralStats } = useReferral();
  const { orders } = useOrders();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const renderMenuItem = (item: typeof menuSections[0]['items'][0], index: number) => (
    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={20} color="#B3C33E" strokeWidth={2} />
        </View>
        <Text style={styles.menuItemText}>{item.label}</Text>
      </View>
      <ChevronRight size={20} color="#CCCCCC" strokeWidth={2} />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = getReferralStats();
  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ 
                uri: user.profileImage || 'https://images.pexels.com/photos/4148950/pexels-photo-4148950.jpeg?auto=compress&cs=tinysrgb&w=400'
              }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              {user.email && <Text style={styles.profileEmail}>{user.email}</Text>}
              {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/profile-edit')}
            >
              <Edit size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderCount}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₦{totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.availablePoints}</Text>
            <Text style={styles.statLabel}>Referral Points</Text>
          </View>
        </View>

        {/* Referral Banner */}
        <TouchableOpacity 
          style={styles.referralBanner}
          onPress={() => router.push('/referral')}
        >
          <View style={styles.referralContent}>
            <Text style={styles.referralTitle}>🎁 Earn Rewards</Text>
            <Text style={styles.referralText}>
              Refer friends and earn ₦0.10 per point! You have {stats.availablePoints} points ready to convert.
            </Text>
          </View>
          <ChevronRight size={20} color="#7A9C2A" strokeWidth={2} />
        </TouchableOpacity>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.menuSectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/browse')}
            >
              <Text style={styles.quickActionIcon}>🛒</Text>
              <Text style={styles.quickActionText}>Browse Items</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/custom-basket')}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Custom Basket</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/ai-reminder')}
            >
              <Text style={styles.quickActionIcon}>🔔</Text>
              <Text style={styles.quickActionText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF4444" strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  profilePhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3C33E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#B3C33E',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  referralBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  referralContent: {
    flex: 1,
  },
  referralTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  referralText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    lineHeight: 20,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF4444',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});