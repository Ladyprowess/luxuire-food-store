import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Package, CircleCheck as CheckCircle, Truck, ShoppingBag } from 'lucide-react-native';
import { useOrders } from '@/contexts/OrdersContext';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(getOrderById(id as string));

  useEffect(() => {
    // Refresh order data when component mounts
    setOrder(getOrderById(id as string));
  }, [id]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCallAgent = () => {
    const phoneNumber = order.agentPhone || '+2349027113199'; // Default to company number
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsAppAgent = () => {
    const phoneNumber = order.agentPhone || '2349027113199'; // Default to company number
    const message = encodeURIComponent(`Hello, I'm tracking my order #${order.id}. Can you please provide an update?`);
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };

  const getStatusIcon = (step: string, completed: boolean, current: boolean) => {
    if (completed) {
      return <CheckCircle size={24} color="#4CAF50" strokeWidth={2} />;
    } else if (current) {
      return <Clock size={24} color="#B3C33E" strokeWidth={2} />;
    } else {
      switch (step.toLowerCase()) {
        case 'order placed':
        case 'custom order received':
          return <Package size={24} color="#CCCCCC" strokeWidth={2} />;
        case 'shopping for items':
        case 'reviewing requirements':
          return <ShoppingBag size={24} color="#CCCCCC" strokeWidth={2} />;
        case 'items purchased':
        case 'quote prepared':
          return <Package size={24} color="#CCCCCC" strokeWidth={2} />;
        case 'out for delivery':
          return <Truck size={24} color="#CCCCCC" strokeWidth={2} />;
        case 'delivered':
          return <CheckCircle size={24} color="#CCCCCC" strokeWidth={2} />;
        default:
          return <Clock size={24} color="#CCCCCC" strokeWidth={2} />;
      }
    }
  };

  const isCustomOrder = order.customOrderData?.isCustomOrder;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.orderInfoSection}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Tracking Steps */}
        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <View style={styles.trackingContainer}>
            {order.trackingSteps.map((step, index) => (
              <View key={index} style={styles.trackingStep}>
                <View style={styles.stepIconContainer}>
                  {getStatusIcon(step.step, step.completed, step.current)}
                  {index < order.trackingSteps.length - 1 && (
                    <View style={[
                      styles.stepLine,
                      step.completed && styles.stepLineCompleted
                    ]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                    styles.stepTitle,
                    step.completed && styles.stepTitleCompleted,
                    step.current && styles.stepTitleCurrent
                  ]}>
                    {step.step}
                  </Text>
                  {step.time && (
                    <Text style={styles.stepTime}>{step.time}</Text>
                  )}
                  {step.current && !step.completed && (
                    <Text style={styles.stepCurrentText}>In Progress</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Custom Order Details */}
        {isCustomOrder && order.customOrderData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Order Details</Text>
            <View style={styles.customOrderCard}>
              <View style={styles.customOrderItem}>
                <Text style={styles.customOrderLabel}>Items Requested:</Text>
                <Text style={styles.customOrderValue}>{order.customOrderData.itemNames}</Text>
              </View>
              <View style={styles.customOrderItem}>
                <Text style={styles.customOrderLabel}>Quantity:</Text>
                <Text style={styles.customOrderValue}>{order.customOrderData.quantity}</Text>
              </View>
              {order.customOrderData.description && (
                <View style={styles.customOrderItem}>
                  <Text style={styles.customOrderLabel}>Description:</Text>
                  <Text style={styles.customOrderValue}>{order.customOrderData.description}</Text>
                </View>
              )}
              <View style={styles.customOrderItem}>
                <Text style={styles.customOrderLabel}>Delivery Time:</Text>
                <Text style={styles.customOrderValue}>{order.customOrderData.deliveryTime}</Text>
              </View>
              {order.customOrderData.budget && (
                <View style={styles.customOrderItem}>
                  <Text style={styles.customOrderLabel}>Budget:</Text>
                  <Text style={styles.customOrderValue}>{order.customOrderData.budget}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Order Items (for regular orders) */}
        {!isCustomOrder && order.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.map((item, index) => {
              const displayPrice = item.selectedVariation ? item.selectedVariation.price : item.product.currentPrice;
              const displayName = item.selectedVariation 
                ? `${item.product.name} (${item.selectedVariation.name})`
                : item.product.name;
              
              return (
                <View key={index} style={styles.orderItem}>
                  <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{displayName}</Text>
                    <Text style={styles.itemUnit}>{item.product.unit}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₦{(displayPrice * item.quantity).toLocaleString()}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryItem}>
              <MapPin size={16} color="#B3C33E" strokeWidth={2} />
              <View style={styles.deliveryContent}>
                <Text style={styles.deliveryLabel}>Delivery Address</Text>
                <Text style={styles.deliveryText}>
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </Text>
              </View>
            </View>
            
            {order.estimatedDelivery && (
              <View style={styles.deliveryItem}>
                <Clock size={16} color="#B3C33E" strokeWidth={2} />
                <View style={styles.deliveryContent}>
                  <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                  <Text style={styles.deliveryText}>{order.estimatedDelivery}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Contact Agent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCallAgent}>
              <Phone size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.contactButtonText}>Call Agent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleWhatsAppAgent}>
              <MessageCircle size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary (for regular orders) */}
        {!isCustomOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₦{order.subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>₦{order.deliveryFee.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>₦{order.serviceFee.toLocaleString()}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₦{order.total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
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
  orderInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  orderId: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 8,
  },
  orderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  trackingSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  trackingContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  stepTitleCompleted: {
    color: '#4CAF50',
  },
  stepTitleCurrent: {
    color: '#B3C33E',
  },
  stepTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
  },
  stepCurrentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B3C33E',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  customOrderCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  customOrderItem: {
    marginBottom: 12,
  },
  customOrderLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  customOrderValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
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
  itemUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B3C33E',
  },
  itemPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#333333',
  },
  deliveryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryContent: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  deliveryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});