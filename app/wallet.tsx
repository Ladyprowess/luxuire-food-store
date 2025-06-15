import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Wallet, Plus, CreditCard, Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react-native';
import { useWallet } from '@/contexts/WalletContext';
import { usePaystack } from '@/contexts/PaystackContext';
import { useAuth } from '@/contexts/AuthContext';

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

export default function WalletScreen() {
  const [fundAmount, setFundAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { balance, transactions, addFunds, getTransactionHistory } = useWallet();
  const { initializePayment } = usePaystack();
  const { user } = useAuth();

  const handleFundWallet = () => {
    const amount = parseInt(fundAmount);
    
    if (!amount || amount < 100) {
      Alert.alert('Invalid Amount', 'Please enter an amount of at least ₦100');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'Email is required for payment. Please update your profile.');
      return;
    }

    setIsLoading(true);

    // Generate unique order ID for wallet funding
    const walletOrderId = `wallet_${Date.now()}`;

    initializePayment(
      amount,
      user.email,
      walletOrderId,
      user.id,
      async (reference: string) => {
        // Payment successful
        console.log('Wallet funding payment successful:', reference);
        
        const success = await addFunds(amount, reference);
        
        if (success) {
          Alert.alert(
            'Wallet Funded Successfully! 🎉',
            `₦${amount.toLocaleString()} has been added to your wallet.\n\nReference: ${reference}`,
            [{ text: 'OK' }]
          );
          setFundAmount('');
        } else {
          Alert.alert('Error', 'Failed to update wallet balance. Please contact support with this reference: ' + reference);
        }
        setIsLoading(false);
      },
      () => {
        // Payment cancelled
        setIsLoading(false);
        Alert.alert('Payment Cancelled', 'Your wallet funding was cancelled.');
      }
    );
  };

  const handleQuickAmount = (amount: number) => {
    setFundAmount(amount.toString());
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const transactionHistory = getTransactionHistory();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Wallet size={32} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>
            Use your wallet to pay for orders instantly
          </Text>
        </View>

        {/* Fund Wallet Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund Your Wallet</Text>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  fundAmount === amount.toString() && styles.quickAmountButtonSelected
                ]}
                onPress={() => handleQuickAmount(amount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  fundAmount === amount.toString() && styles.quickAmountTextSelected
                ]}>
                  ₦{amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount (min ₦100)"
              value={fundAmount}
              onChangeText={setFundAmount}
              keyboardType="numeric"
              placeholderTextColor="#999999"
            />
          </View>

          {/* Fund Button */}
          <TouchableOpacity 
            style={[
              styles.fundButton,
              (!fundAmount || isLoading) && styles.fundButtonDisabled
            ]}
            onPress={handleFundWallet}
            disabled={!fundAmount || isLoading}
          >
            <CreditCard size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.fundButtonText}>
              {isLoading ? 'Processing Payment...' : 'Fund Wallet via Paystack'}
            </Text>
          </TouchableOpacity>

          {/* Payment Info */}
          <View style={styles.paymentInfo}>
            <AlertCircle size={16} color="#666666" strokeWidth={2} />
            <Text style={styles.paymentInfoText}>
              Secure payment processing via Paystack. Your card details are never stored.
            </Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {transactionHistory.length > 0 ? (
            transactionHistory.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  {transaction.type === 'credit' ? (
                    <TrendingUp size={20} color="#4CAF50" strokeWidth={2} />
                  ) : (
                    <TrendingDown size={20} color="#FF4444" strokeWidth={2} />
                  )}
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.createdAt)}
                  </Text>
                  {transaction.reference && (
                    <Text style={styles.transactionReference}>
                      Ref: {transaction.reference}
                    </Text>
                  )}
                </View>
                
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    transaction.status === 'completed' ? styles.completedBadge : 
                    transaction.status === 'pending' ? styles.pendingBadge : styles.failedBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Clock size={48} color="#CCCCCC" strokeWidth={1} />
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
              <Text style={styles.emptyTransactionsSubtext}>
                Fund your wallet to see transaction history
              </Text>
            </View>
          )}
        </View>

        {/* Wallet Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Use Wallet?</Text>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>⚡</Text>
              <Text style={styles.benefitText}>Instant payments - no waiting for card processing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🔒</Text>
              <Text style={styles.benefitText}>Secure - your money is safely stored</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💰</Text>
              <Text style={styles.benefitText}>Budget control - load only what you want to spend</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📱</Text>
              <Text style={styles.benefitText}>Convenient - pay with one tap at checkout</Text>
            </View>
          </View>
        </View>
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
  balanceCard: {
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#B3C33E',
    alignItems: 'center',
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#7A9C2A',
    marginTop: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#B3C33E',
    borderColor: '#B3C33E',
  },
  quickAmountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  quickAmountTextSelected: {
    color: '#FFFFFF',
  },
  customAmountContainer: {
    marginBottom: 20,
  },
  customAmountLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fundButton: {
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
    marginBottom: 12,
  },
  fundButtonDisabled: {
    opacity: 0.6,
  },
  fundButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  paymentInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  transactionReference: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#999999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  creditAmount: {
    color: '#4CAF50',
  },
  debitAmount: {
    color: '#FF4444',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FF9800',
  },
  failedBadge: {
    backgroundColor: '#FF4444',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTransactionsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTransactionsSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
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
});