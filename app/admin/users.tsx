import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, Users, User, Package, TrendingUp, Mail, Phone, DollarSign, CreditCard as Edit, Trash2, ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

// Mock users data - in a real app, this would come from a context or API
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    walletBalance: 5000,
    totalOrders: 12,
    totalSpent: 45000,
    createdAt: new Date(2025, 4, 10),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+234 802 345 6789',
    walletBalance: 2500,
    totalOrders: 8,
    totalSpent: 32000,
    createdAt: new Date(2025, 5, 5),
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '+234 803 456 7890',
    walletBalance: 0,
    totalOrders: 3,
    totalSpent: 12000,
    createdAt: new Date(2025, 5, 12),
  },
];

export default function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const { user: currentUser } = useAuth();

  const filteredUsers = mockUsers.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchQuery)
    );
  });

  const handleEditUser = (user: any) => {
    Alert.alert(
      'Edit User',
      'This feature is not implemented in the demo.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteUser = (user: any) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Not Implemented', 'This feature is not implemented in the demo.');
          }
        }
      ]
    );
  };

  const renderUserModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        visible={showUserModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* User Profile */}
              <View style={styles.userProfile}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </Text>
                </View>
                <Text style={styles.userName}>{selectedUser.name}</Text>
                <Text style={styles.userJoined}>
                  Joined {selectedUser.createdAt.toLocaleDateString()}
                </Text>
              </View>

              {/* Contact Information */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Contact Information</Text>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#666666" strokeWidth={2} />
                  <Text style={styles.contactText}>{selectedUser.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#666666" strokeWidth={2} />
                  <Text style={styles.contactText}>{selectedUser.phone}</Text>
                </View>
              </View>

              {/* Order Statistics */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Order Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <ShoppingBag size={20} color="#B3C33E" strokeWidth={2} />
                    <Text style={styles.statValue}>{selectedUser.totalOrders}</Text>
                    <Text style={styles.statLabel}>Total Orders</Text>
                  </View>
                  <View style={styles.statItem}>
                    <DollarSign size={20} color="#B3C33E" strokeWidth={2} />
                    <Text style={styles.statValue}>₦{selectedUser.totalSpent.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Total Spent</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Wallet size={20} color="#B3C33E" strokeWidth={2} />
                    <Text style={styles.statValue}>₦{selectedUser.walletBalance.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Wallet Balance</Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditUser(selectedUser)}
                  >
                    <Edit size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.actionButtonText}>Edit User</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(selectedUser)}
                  >
                    <Trash2 size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.actionButtonText}>Delete User</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* View Orders */}
              <TouchableOpacity 
                style={styles.viewOrdersButton}
                onPress={() => {
                  setShowUserModal(false);
                  router.push('/admin/orders');
                }}
              >
                <ShoppingBag size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.viewOrdersButtonText}>View User's Orders</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999999" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Users List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.usersContainer}>
        <Text style={styles.resultsText}>
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </Text>

        {filteredUsers.map((user) => (
          <TouchableOpacity 
            key={user.id}
            style={styles.userCard}
            onPress={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          >
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitials}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userPhone}>{user.phone}</Text>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Orders</Text>
                <Text style={styles.userStatValue}>{user.totalOrders}</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Spent</Text>
                <Text style={styles.userStatValue}>₦{user.totalSpent.toLocaleString()}</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Wallet</Text>
                <Text style={styles.userStatValue}>₦{user.walletBalance.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity 
                style={[styles.userAction, styles.editAction]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditUser(user);
                }}
              >
                <Edit size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.userActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.userAction, styles.deleteAction]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user);
                }}
              >
                <Trash2 size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.userActionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Users size={48} color="#CCCCCC" strokeWidth={1} />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search
            </Text>
          </View>
        )}
      </ScrollView>

      {/* User Details Modal */}
      {renderUserModal()}

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
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => router.push('/admin/users')}
        >
          <Users size={24} color="#B3C33E" strokeWidth={2} />
          <Text style={[styles.navItemText, styles.navItemTextActive]}>Users</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Import Wallet icon from lucide-react-native
function Wallet(props: any) {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
      <path d="M18 12H6" />
      <path d="M18 16H6" />
      <path d="M16 8H6" />
    </svg>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  usersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B3C33E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInitials: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  userPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  userStat: {
    alignItems: 'center',
  },
  userStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  userStatValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editAction: {
    backgroundColor: '#2196F3',
  },
  deleteAction: {
    backgroundColor: '#FF4444',
  },
  userActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  modalCloseButton: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#666666',
  },
  modalContent: {
    padding: 16,
  },
  userProfile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userJoined: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333333',
    marginVertical: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  viewOrdersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  viewOrdersButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
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