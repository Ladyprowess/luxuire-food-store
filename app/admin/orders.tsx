import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Phone,
  MessageCircle,
  DollarSign,
  Users
} from 'lucide-react-native';
import { useOrders } from '@/contexts/OrdersContext';
import AdminOrderStatusUpdater from '@/components/AdminOrderStatusUpdater';

export default function AdminOrdersScreen() {
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const { orders, updateOrderStatus } = useOrders();

  useEffect(() => {
    if (id) {
      const order = orders.find(o => o.id === id);
      if (order) {
        setSelectedOrder(order);
        setShowOrderModal(true);
      }
    }
  }, [id, orders]);

  const filteredOrders = orders
    .filter(order => {
      // Search filter
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (order.deliveryAddress.street + ' ' + 
                            order.deliveryAddress.city + ' ' + 
                            order.deliveryAddress.state).toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort orders
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'total-asc':
          return a.total - b.total;
        case 'total-desc':
          return b.total - a.total;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

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

  const handleContactCustomer = (phone: string) => {
    Alert.alert(
      'Contact Customer',
      `Call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} }
      ]
    );
  };

  const renderOrderModal = () => {
    if (!selectedOrder) return null;

    const StatusIcon = getStatusIcon(selectedOrder.status);
    const statusColor = getStatusColor(selectedOrder.status);

    return (
      <Modal
        visible={showOrderModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
              <TouchableOpacity onPress={() => setShowOrderModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Order Status */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Current Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <StatusIcon size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.statusBadgeText}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Order Details */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Order Details</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.paymentMethod}</Text>
                </View>
                {selectedOrder.paymentReference && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payment Reference:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.paymentReference}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Subtotal:</Text>
                  <Text style={styles.detailValue}>₦{selectedOrder.subtotal.toLocaleString()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Delivery Fee:</Text>
                  <Text style={styles.detailValue}>₦{selectedOrder.deliveryFee.toLocaleString()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Service Fee:</Text>
                  <Text style={styles.detailValue}>₦{selectedOrder.serviceFee.toLocaleString()}</Text>
                </View>
                <View style={[styles.detailItem, styles.totalItem]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>₦{selectedOrder.total.toLocaleString()}</Text>
                </View>
              </View>

              {/* Customer Information */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Customer Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>John Doe</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>+234 902 711 3199</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Order Items</Text>
                {selectedOrder.items.map((item: any, index: number) => {
                  const displayPrice = item.selectedVariation ? item.selectedVariation.price : item.product.currentPrice;
                  const displayName = item.selectedVariation 
                    ? `${item.product.name} (${item.selectedVariation.name})`
                    : item.product.name;
                  
                  return (
                    <View key={index} style={styles.orderItem}>
                      <View style={styles.orderItemDetails}>
                        <Text style={styles.orderItemName}>{displayName}</Text>
                        <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                        {item.specialRequest && (
                          <Text style={styles.orderItemNote}>Note: {item.specialRequest}</Text>
                        )}
                      </View>
                      <Text style={styles.orderItemPrice}>
                        ₦{(displayPrice * item.quantity).toLocaleString()}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Special Instructions</Text>
                  <Text style={styles.specialInstructions}>
                    {selectedOrder.specialInstructions}
                  </Text>
                </View>
              )}

              {/* Update Status */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Update Status</Text>
                <AdminOrderStatusUpdater 
                  orderId={selectedOrder.id}
                  currentStatus={selectedOrder.status}
                  onStatusUpdated={() => {
                    // Refresh order data after status update
                    const updatedOrder = orders.find(o => o.id === selectedOrder.id);
                    if (updatedOrder) {
                      setSelectedOrder(updatedOrder);
                    }
                  }}
                />
              </View>

              {/* Contact Customer */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Contact Customer</Text>
                <View style={styles.contactButtons}>
                  <TouchableOpacity 
                    style={[styles.contactButton, styles.callButton]}
                    onPress={() => handleContactCustomer('+234 902 711 3199')}
                  >
                    <Phone size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.contactButton, styles.messageButton]}
                  >
                    <MessageCircle size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.contactButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setShowOrderModal(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
        <Text style={styles.headerTitle}>Manage Orders</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999999" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders by ID or address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {['all', 'pending', 'shopping', 'purchased', 'delivery', 'delivered', 'cancelled'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    statusFilter === status && styles.filterOptionSelected
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    statusFilter === status && styles.filterOptionTextSelected
                  ]}>
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {[
                { id: 'date-desc', label: 'Newest First' },
                { id: 'date-asc', label: 'Oldest First' },
                { id: 'total-desc', label: 'Highest Amount' },
                { id: 'total-asc', label: 'Lowest Amount' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterOption,
                    sortBy === option.id && styles.filterOptionSelected
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === option.id && styles.filterOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Orders List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.ordersContainer}>
        <Text style={styles.resultsText}>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
        </Text>

        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          const statusColor = getStatusColor(order.status);

          return (
            <TouchableOpacity 
              key={order.id}
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(order);
                setShowOrderModal(true);
              }}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.orderStatus, { backgroundColor: statusColor }]}>
                  <StatusIcon size={16} color="#FFFFFF" strokeWidth={2} />
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

              <View style={styles.orderAddress}>
                <Text style={styles.orderAddressLabel}>Delivery Address:</Text>
                <Text style={styles.orderAddressText}>
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </Text>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.updateButton]}
                    onPress={() => {
                      const nextStatus = {
                        'pending': 'shopping',
                        'shopping': 'purchased',
                        'purchased': 'delivery',
                        'delivery': 'delivered'
                      }[order.status];
                      
                      if (nextStatus) {
                        updateOrderStatus(order.id, nextStatus);
                        Alert.alert('Success', `Order status updated to ${nextStatus}`);
                      }
                    }}
                  >
                    <Text style={styles.updateButtonText}>Update Status</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color="#CCCCCC" strokeWidth={1} />
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Order Details Modal */}
      {renderOrderModal()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin')}
        >
          <DollarSign size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => router.push('/admin/orders')}
        >
          <ShoppingBag size={24} color="#B3C33E" strokeWidth={2} />
          <Text style={[styles.navItemText, styles.navItemTextActive]}>Orders</Text>
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
  filterButton: {
    padding: 8,
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#B3C33E',
  },
  filterOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  ordersContainer: {
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
  orderAddress: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderAddressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  orderAddressText: {
    fontFamily: 'Inter-Regular',
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
  viewButton: {
    backgroundColor: '#F0F0F0',
  },
  viewButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  updateButton: {
    backgroundColor: '#B3C33E',
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
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
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    flex: 2,
    textAlign: 'right',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333333',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#B3C33E',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  orderItemNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  specialInstructions: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
  },
  currentStatusButton: {
    backgroundColor: '#B3C33E',
  },
  disabledButton: {
    opacity: 0.5,
  },
  statusButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  currentStatusButtonText: {
    color: '#FFFFFF',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  messageButton: {
    backgroundColor: '#2196F3',
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  closeModalButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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