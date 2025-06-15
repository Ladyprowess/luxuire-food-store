import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Share, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, MapPin, CreditCard, Bell, Heart, RotateCcw, Users, HelpCircle as HelpCircle, Settings, LogOut, ChevronRight, Star, Gift, CreditCard as Edit, Tag, Zap, X, Check, Wallet } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/contexts/ReferralContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useWallet } from '@/contexts/WalletContext';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: MapPin, label: 'Delivery Addresses', action: () => router.push('/location-picker') },
      { icon: CreditCard, label: 'Payment Methods', action: () => {} }, // Will be handled by the component
      { icon: Wallet, label: 'My Wallet', action: () => router.push('/wallet') },
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

const paymentMethods = [
  {
    id: 'online',
    name: 'Online Payment',
    description: 'Pay with card via Paystack',
    icon: '💳',
    recommended: true
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order (Lagos only)',
    icon: '💵',
    recommended: false
  }
];

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
  const { user, logout, updateUser } = useAuth();
  const { referralData, getReferralStats } = useReferral();
  const { orders } = useOrders();
  const { balance } = useWallet();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(user?.preferredPaymentMethod || 'online');

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

  const handlePaymentMethodPress = () => {
    setShowPaymentModal(true);
  };

  const handleSelectPaymentMethod = async (methodId: string) => {
    try {
      await updateUser({
        preferredPaymentMethod: methodId
      });
      setSelectedPaymentMethod(methodId);
      setShowPaymentModal(false);
      Alert.alert('Success', 'Default payment method updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment method. Please try again.');
    }
  };

  // Check if user is admin (simplified check for demo)
  const isAdmin = user?.email?.includes('admin') || user?.email === 'luxuireng@gmail.com';

  const renderMenuItem = (item: typeof menuSections[0]['items'][0], index: number) => {
    // Special handling for Payment Methods menu item
    if (item.label === 'Payment Methods') {
      return (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={handlePaymentMethodPress}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemIcon}>
              <item.icon size={20} color="#B3C33E" strokeWidth={2} />
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemSubtext}>
                {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Not set'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#CCCCCC" strokeWidth={2} />
        </TouchableOpacity>
      );
    }

    // Special handling for My Wallet menu item
    if (item.label === 'My Wallet') {
      return (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemIcon}>
              <item.icon size={20} color="#B3C33E" strokeWidth={2} />
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemSubtext}>
                ₦{balance.toLocaleString()} available
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#CCCCCC" strokeWidth={2} />
        </TouchableOpacity>
      );
    }
    
    // Regular menu items
    return (
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
  };

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

        {/* Admin Dashboard Button (only for admins) */}
        {isAdmin && (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/admin')}
          >
            <View style={styles.adminButtonIcon}>
              <Settings size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.adminButtonContent}>
              <Text style={styles.adminButtonTitle}>Admin Dashboard</Text>
              <Text style={styles.adminButtonSubtitle}>Manage orders, products, and users</Text>
            </View>
            <ChevronRight size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        )}

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
            <Text style={styles.statNumber}>₦{balance.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Wallet Balance</Text>
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
              onPress={() => router.push('/wallet')}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Fund Wallet</Text>
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

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <X size={24} color="#333333" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Choose your preferred payment method for future orders
              </Text>
              
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedPaymentMethod === method.id && styles.paymentMethodCardSelected
                  ]}
                  onPress={() => handleSelectPaymentMethod(method.id)}
                >
                  <View style={styles.paymentMethodInfo}>
                    <View style={styles.paymentMethodHeader}>
                      <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                      <View style={styles.paymentMethodNameContainer}>
                        <Text style={styles.paymentMethodName}>{method.name}</Text>
                        {method.recommended && (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>Recommended</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                  </View>
                  
                  <View style={[
                    styles.radioButton,
                    selectedPaymentMethod === method.id && styles.radioButtonSelected
                  ]}>
                    {selectedPaymentMethod === method.id && (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              
              <Text style={styles.paymentMethodNote}>
                You can always change your payment method during checkout. Cash on delivery is only available in Lagos.
              </Text>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => handleSelectPaymentMethod(selectedPaymentMethod)}
              >
                <Text style={styles.saveButtonText}>Save Preference</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  adminButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminButtonContent: {
    flex: 1,
  },
  adminButtonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adminButtonSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    flex: 1,
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
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
  },
  menuItemSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: '70%',
  },
  modalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodCardSelected: {
    backgroundColor: '#F0F7E6',
    borderColor: '#B3C33E',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginRight: 8,
  },
  recommendedBadge: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recommendedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  paymentMethodDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#B3C33E',
    backgroundColor: '#B3C33E',
  },
  paymentMethodNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});