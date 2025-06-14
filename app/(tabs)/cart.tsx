import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Minus, Plus, Trash2, Clock, MessageSquare, CreditCard, ShoppingBag, Package } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';

const deliveryTimes = [
  { id: 'asap', label: 'ASAP (2-3 hours)', fee: 500 },
  { id: 'evening', label: 'Today Evening (4-6 PM)', fee: 300 },
  { id: 'tomorrow', label: 'Tomorrow Morning', fee: 200 },
];

export default function CartScreen() {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('asap');
  const [generalRequest, setGeneralRequest] = useState('');

  const { items, updateQuantity, removeFromCart, updateSpecialRequest, getCartTotal, clearCart } = useCart();
  const { currentLocation, getDeliveryFee } = useLocation();
  const { user } = useAuth();

  const subtotal = getCartTotal();
  const deliveryTimeFee = deliveryTimes.find(time => time.id === selectedDeliveryTime)?.fee || 0;
  
  const defaultAddress = user?.addresses?.find(addr => addr.id === user.defaultAddressId) || user?.addresses?.[0];
  const baseDeliveryFee = currentLocation ? getDeliveryFee(currentLocation) : 
                         defaultAddress ? getDeliveryFee(defaultAddress) : 2000;
  
  const totalDeliveryFee = baseDeliveryFee + deliveryTimeFee;
  const serviceFee = Math.round(subtotal * 0.01); // 1% service fee
  const total = subtotal + totalDeliveryFee + serviceFee;

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first.');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <ShoppingBag size={64} color="#CCCCCC" strokeWidth={1} />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some fresh items from our market</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/(tabs)/browse')}
          >
            <Text style={styles.shopNowButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={styles.headerActions}>
            <Text style={styles.itemCount}>{items.length} items</Text>
            <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items */}
        <View style={styles.section}>
          {items.map((item) => {
            const displayPrice = item.selectedVariation ? item.selectedVariation.price : item.product.currentPrice;
            const displayName = item.selectedVariation 
              ? `${item.product.name} (${item.selectedVariation.name})`
              : item.product.name;
            
            return (
              <View key={item.id} style={styles.cartItem}>
                <TouchableOpacity 
                  onPress={() => router.push(`/product-details?id=${item.product.id}`)}
                >
                  <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                </TouchableOpacity>
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{displayName}</Text>
                  <Text style={styles.itemUnit}>{item.product.unit}</Text>
                  
                  {/* Show variation attributes if available */}
                  {item.selectedVariation && (
                    <View style={styles.variationInfo}>
                      {Object.entries(item.selectedVariation.attributes).map(([key, value]) => (
                        <Text key={key} style={styles.variationText}>
                          {key}: {value}
                        </Text>
                      ))}
                    </View>
                  )}
                  
                  <Text style={styles.itemPrice}>₦{displayPrice.toLocaleString()}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} color="#666666" strokeWidth={2} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} color="#666666" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.itemActions}>
                  <Text style={styles.itemTotal}>
                    ₦{(displayPrice * item.quantity).toLocaleString()}
                  </Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={20} color="#FF4444" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Special Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Special Requests</Text>
          </View>
          
          {items.map((item) => (
            <View key={`request-${item.id}`} style={styles.requestContainer}>
              <Text style={styles.requestLabel}>
                {item.selectedVariation 
                  ? `${item.product.name} (${item.selectedVariation.name}):`
                  : `${item.product.name}:`
                }
              </Text>
              <TextInput
                style={styles.requestInput}
                placeholder="e.g., Wash and slice the vegetables"
                value={item.specialRequest}
                onChangeText={(text) => updateSpecialRequest(item.id, text)}
                placeholderTextColor="#999999"
              />
            </View>
          ))}
          
          <View style={styles.requestContainer}>
            <Text style={styles.requestLabel}>General Request:</Text>
            <TextInput
              style={styles.requestInput}
              placeholder="Any additional instructions for our team"
              value={generalRequest}
              onChangeText={setGeneralRequest}
              placeholderTextColor="#999999"
              multiline
            />
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Delivery Time</Text>
          </View>
          
          {deliveryTimes.map((timeOption) => (
            <TouchableOpacity
              key={timeOption.id}
              style={[
                styles.deliveryOption,
                selectedDeliveryTime === timeOption.id && styles.deliveryOptionSelected
              ]}
              onPress={() => setSelectedDeliveryTime(timeOption.id)}
            >
              <View style={styles.deliveryOptionInfo}>
                <Text style={[
                  styles.deliveryOptionLabel,
                  selectedDeliveryTime === timeOption.id && styles.deliveryOptionLabelSelected
                ]}>
                  {timeOption.label}
                </Text>
                <Text style={[
                  styles.deliveryOptionFee,
                  selectedDeliveryTime === timeOption.id && styles.deliveryOptionFeeSelected
                ]}>
                  +₦{timeOption.fee.toLocaleString()}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedDeliveryTime === timeOption.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base Delivery Fee</Text>
              <Text style={styles.summaryValue}>₦{baseDeliveryFee.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Time Fee</Text>
              <Text style={styles.summaryValue}>₦{deliveryTimeFee.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee (1%)</Text>
              <Text style={styles.summaryValue}>₦{serviceFee.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleProceedToCheckout}
        >
          <CreditCard size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout - ₦{total.toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FF4444',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginLeft: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  itemUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  variationInfo: {
    marginBottom: 4,
  },
  variationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#7A9C2A',
    marginBottom: 2,
  },
  itemPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#B3C33E',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantity: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginHorizontal: 12,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
  },
  requestContainer: {
    marginBottom: 16,
  },
  requestLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  requestInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deliveryOption: {
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
  deliveryOptionSelected: {
    backgroundColor: '#F0F7E6',
    borderColor: '#B3C33E',
  },
  deliveryOptionInfo: {
    flex: 1,
  },
  deliveryOptionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  deliveryOptionLabelSelected: {
    color: '#7A9C2A',
  },
  deliveryOptionFee: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  deliveryOptionFeeSelected: {
    color: '#7A9C2A',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#B3C33E',
    backgroundColor: '#B3C33E',
  },
  summaryContainer: {
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
  checkoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#B3C33E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
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