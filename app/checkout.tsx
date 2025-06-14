import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, CreditCard, Clock, MessageSquare, CircleCheck as CheckCircle, Tag } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useOrders } from '@/contexts/OrdersContext';
import { usePromo } from '@/contexts/PromoContext';
import { usePaystack } from '@/contexts/PaystackContext';

const deliveryTimes = [
  { id: 'asap', label: 'ASAP (2-3 hours)', fee: 500 },
  { id: 'evening', label: 'Today Evening (4-6 PM)', fee: 300 },
  { id: 'tomorrow', label: 'Tomorrow Morning', fee: 200 },
];

const paymentMethods = [
  { id: 'paystack', label: 'Paystack (Card/Bank)', subtitle: 'Secure payment via Paystack' },
  { id: 'transfer', label: 'Bank Transfer', subtitle: 'Direct bank transfer' },
  { id: 'ussd', label: 'USSD Payment', subtitle: 'Pay with your phone' },
  { id: 'cash', label: 'Cash on Delivery', subtitle: 'Pay when you receive your order' },
];

export default function CheckoutScreen() {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('asap');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paystack');
  const [generalRequest, setGeneralRequest] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { currentLocation, getDeliveryFee, getDeliveryTime } = useLocation();
  const { addOrder } = useOrders();
  const { appliedPromo, applyPromoCode, removePromoCode } = usePromo();
  const { initializePayment } = usePaystack();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/browse')} style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const subtotal = getCartTotal();
  const deliveryTimeFee = deliveryTimes.find(time => time.id === selectedDeliveryTime)?.fee || 0;
  const baseDeliveryFee = currentLocation ? getDeliveryFee(currentLocation) : 2000;
  const totalDeliveryFee = baseDeliveryFee + deliveryTimeFee;
  const serviceFee = Math.round(subtotal * 0.01); // 1% service fee
  
  // Apply promo discount
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      promoDiscount = (subtotal * appliedPromo.discountValue) / 100;
      if (appliedPromo.maxDiscount && promoDiscount > appliedPromo.maxDiscount) {
        promoDiscount = appliedPromo.maxDiscount;
      }
    } else {
      promoDiscount = appliedPromo.discountValue;
    }
  }
  
  const total = subtotal + totalDeliveryFee + serviceFee - promoDiscount;

  const defaultAddress = user?.addresses?.find(addr => addr.id === user.defaultAddressId) || user?.addresses?.[0];
  const deliveryTime = defaultAddress ? getDeliveryTime(defaultAddress) : '2-4 hours';

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    const result = await applyPromoCode(promoCode, subtotal);
    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.message
    );
    
    if (result.success) {
      setPromoCode('');
    }
  };

  const handlePaystackPayment = () => {
    if (!user?.email) {
      Alert.alert('Error', 'Email is required for payment. Please update your profile.');
      return;
    }

    initializePayment(
      total,
      user.email,
      () => {
        // Payment successful
        processOrder();
      },
      () => {
        // Payment cancelled
        setIsProcessing(false);
        Alert.alert('Payment Cancelled', 'Your payment was cancelled. You can try again or choose a different payment method.');
      }
    );
  };

  const processOrder = async () => {
    try {
      // Create order
      const orderId = await addOrder(
        items,
        defaultAddress!,
        selectedPaymentMethod,
        generalRequest
      );
      
      Alert.alert(
        'Order Placed Successfully!',
        `Your order #${orderId} has been confirmed. Our agent will start shopping for your items shortly.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              clearCart();
              removePromoCode();
              router.push('/(tabs)/orders');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!defaultAddress) {
      Alert.alert('Address Required', 'Please add a delivery address first.', [
        { text: 'Add Address', onPress: () => router.push('/location-picker') }
      ]);
      return;
    }

    if (baseDeliveryFee === -1) {
      Alert.alert(
        'International Delivery',
        'For international deliveries, please contact us at luxuire.com/help-center for custom pricing.',
        [
          { text: 'Contact Support', onPress: () => router.push('/help-center') }
        ]
      );
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedPaymentMethod === 'paystack') {
        handlePaystackPayment();
      } else {
        // For other payment methods, process order directly
        await processOrder();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          
          {defaultAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressLabel}>{defaultAddress.label}</Text>
              <Text style={styles.addressText}>
                {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state}
              </Text>
              <Text style={styles.deliveryTimeText}>
                Estimated delivery: {deliveryTime}
              </Text>
              <TouchableOpacity onPress={() => router.push('/location-picker')}>
                <Text style={styles.changeAddressText}>Change Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={() => router.push('/location-picker')}
            >
              <Text style={styles.addAddressText}>Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Delivery Time (only for Lagos) */}
        {defaultAddress && getDeliveryFee(defaultAddress) === 2000 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Delivery Time</Text>
            </View>
            
            {deliveryTimes.map((timeOption) => (
              <TouchableOpacity
                key={timeOption.id}
                style={[
                  styles.optionCard,
                  selectedDeliveryTime === timeOption.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedDeliveryTime(timeOption.id)}
              >
                <View style={styles.optionInfo}>
                  <Text style={[
                    styles.optionLabel,
                    selectedDeliveryTime === timeOption.id && styles.optionLabelSelected
                  ]}>
                    {timeOption.label}
                  </Text>
                  <Text style={[
                    styles.optionFee,
                    selectedDeliveryTime === timeOption.id && styles.optionFeeSelected
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
        )}

        {/* Promo Code */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Promo Code</Text>
          </View>
          
          {appliedPromo ? (
            <View style={styles.appliedPromoCard}>
              <View style={styles.appliedPromoInfo}>
                <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                <Text style={styles.appliedPromoDescription}>{appliedPromo.description}</Text>
                <Text style={styles.appliedPromoDiscount}>
                  -₦{promoDiscount.toLocaleString()} discount applied
                </Text>
              </View>
              <TouchableOpacity onPress={removePromoCode}>
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={styles.applyPromoButton}
                onPress={handleApplyPromo}
              >
                <Text style={styles.applyPromoText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionCard,
                selectedPaymentMethod === method.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionLabel,
                  selectedPaymentMethod === method.id && styles.optionLabelSelected
                ]}>
                  {method.label}
                </Text>
                <Text style={[
                  styles.optionSubtitle,
                  selectedPaymentMethod === method.id && styles.optionSubtitleSelected
                ]}>
                  {method.subtitle}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPaymentMethod === method.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* General Request */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Special Instructions</Text>
          </View>
          
          <TextInput
            style={styles.requestInput}
            placeholder="Any special instructions for our shopping agent..."
            value={generalRequest}
            onChangeText={setGeneralRequest}
            placeholderTextColor="#999999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
              <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base Delivery Fee</Text>
              <Text style={styles.summaryValue}>₦{baseDeliveryFee.toLocaleString()}</Text>
            </View>
            {defaultAddress && getDeliveryFee(defaultAddress) === 2000 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Time Fee</Text>
                <Text style={styles.summaryValue}>₦{deliveryTimeFee.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee (1%)</Text>
              <Text style={styles.summaryValue}>₦{serviceFee.toLocaleString()}</Text>
            </View>
            {appliedPromo && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Promo Discount ({appliedPromo.code})
                </Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -₦{promoDiscount.toLocaleString()}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Delivery Information</Text>
          <Text style={styles.infoText}>• Items will be bought fresh from the market</Text>
          <Text style={styles.infoText}>• You'll receive real-time updates</Text>
          <Text style={styles.infoText}>• Our agent will contact you if any item is unavailable</Text>
          <Text style={styles.infoText}>• Lagos delivery: 3-7 hours | Outside Lagos: 4-7 days</Text>
          <Text style={styles.infoText}>• Service charge: 1% of order total</Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <CheckCircle size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.placeOrderButtonText}>
            {isProcessing ? 'Processing...' : `Place Order - ₦${total.toLocaleString()}`}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  addressCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  addressLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  deliveryTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B3C33E',
    marginBottom: 8,
  },
  changeAddressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#B3C33E',
  },
  addAddressButton: {
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B3C33E',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
  },
  optionCard: {
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
  optionCardSelected: {
    backgroundColor: '#F0F7E6',
    borderColor: '#B3C33E',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#7A9C2A',
  },
  optionFee: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  optionFeeSelected: {
    color: '#7A9C2A',
  },
  optionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  optionSubtitleSelected: {
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
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
  },
  applyPromoButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyPromoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  appliedPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  appliedPromoInfo: {
    flex: 1,
  },
  appliedPromoCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 2,
  },
  appliedPromoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  appliedPromoDiscount: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#4CAF50',
  },
  removePromoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FF4444',
  },
  requestInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    minHeight: 80,
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
  discountLabel: {
    color: '#4CAF50',
  },
  discountValue: {
    color: '#4CAF50',
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
    fontSize: 18,
    color: '#333333',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#B3C33E',
  },
  infoContainer: {
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  placeOrderButton: {
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
  placeOrderButtonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
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
  },
  shopButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});