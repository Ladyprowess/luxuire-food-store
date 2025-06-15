import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Gift, CreditCard, Users, Heart } from 'lucide-react-native';
import { usePaystack } from '@/contexts/PaystackContext';

export default function PayForMeScreen() {
  const { order } = useLocalSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [payerEmail, setPayerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { initializePayment } = usePaystack();

  useEffect(() => {
    if (order) {
      try {
        const parsedOrder = JSON.parse(order as string);
        setOrderData(parsedOrder);
      } catch (error) {
        Alert.alert('Error', 'Invalid order data');
        router.back();
      }
    }
  }, [order]);

  const handlePayForFriend = () => {
    if (!payerEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!orderData) {
      Alert.alert('Error', 'Order data not found');
      return;
    }

    setIsProcessing(true);

    initializePayment(
      orderData.total,
      payerEmail,
      () => {
        // Payment successful
        Alert.alert(
          'Payment Successful! 🎉',
          `You've successfully paid ₦${orderData.total.toLocaleString()} for ${orderData.customerName}'s order. They will be notified of your generous gesture!`,
          [
            { text: 'Done', onPress: () => router.push('/(tabs)') }
          ]
        );
        setIsProcessing(false);
      },
      () => {
        // Payment cancelled
        setIsProcessing(false);
        Alert.alert('Payment Cancelled', 'The payment was cancelled.');
      }
    );
  };

  if (!orderData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay for Friend</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Gift size={64} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.heroTitle}>Pay for a Friend! 🎁</Text>
          <Text style={styles.heroSubtitle}>
            Help your friend get fresh foodstuffs delivered to their doorstep
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Users size={20} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.orderCustomer}>For: {orderData.customerName}</Text>
            </View>
            
            <View style={styles.orderDetail}>
              <Text style={styles.orderDetailLabel}>Order ID:</Text>
              <Text style={styles.orderDetailValue}>#{orderData.orderId}</Text>
            </View>
            
            <View style={styles.orderDetail}>
              <Text style={styles.orderDetailLabel}>Items:</Text>
              <Text style={styles.orderDetailValue}>{orderData.items} items</Text>
            </View>
            
            <View style={[styles.orderDetail, styles.totalDetail]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₦{orderData.total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Payment Details</Text>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentDescription}>
              You're about to pay for {orderData.customerName}'s order. This is a generous gesture that will be greatly appreciated!
            </Text>
            
            <View style={styles.emailInputContainer}>
              <Text style={styles.emailLabel}>Your Email Address *</Text>
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your email for payment receipt"
                value={payerEmail}
                onChangeText={setPayerEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999999"
              />
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Pay for a Friend?</Text>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>❤️</Text>
              <Text style={styles.benefitText}>Show you care with a thoughtful gesture</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎉</Text>
              <Text style={styles.benefitText}>Surprise someone special with fresh food</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🤝</Text>
              <Text style={styles.benefitText}>Help a friend in need</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🔒</Text>
              <Text style={styles.benefitText}>Secure payment via Paystack</Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityTitle}>🔐 Secure Payment</Text>
          <Text style={styles.securityText}>
            Your payment is processed securely through Paystack. We never store your card details.
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            (!payerEmail || isProcessing) && styles.payButtonDisabled
          ]}
          onPress={handlePayForFriend}
          disabled={!payerEmail || isProcessing}
        >
          <CreditCard size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Processing...' : `Pay ₦${orderData.total.toLocaleString()} for Friend`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderCustomer: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginLeft: 8,
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
  },
  orderDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#7A9C2A',
  },
  totalDetail: {
    borderTopWidth: 1,
    borderTopColor: '#B3C33E',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#7A9C2A',
  },
  totalAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#7A9C2A',
  },
  paymentCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  paymentDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  emailInputContainer: {
    marginBottom: 16,
  },
  emailLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  benefitsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
  securityNotice: {
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  securityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  securityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  payButton: {
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
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});