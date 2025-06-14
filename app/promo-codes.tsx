import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Tag, Copy, Share2, Gift, Clock, Users, Percent } from 'lucide-react-native';
import { usePromo } from '@/contexts/PromoContext';
import { Linking } from 'react-native';

export default function PromoCodesScreen() {
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  
  const { promoCodes, appliedPromo, applyPromoCode, removePromoCode, getAvailablePromoCodes } = usePromo();
  
  const availablePromoCodes = getAvailablePromoCodes();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    setIsApplying(true);
    
    try {
      const result = await applyPromoCode(promoCode, 5000); // Test with 5000 order total
      Alert.alert(
        result.success ? 'Success!' : 'Error',
        result.message
      );
      
      if (result.success) {
        setPromoCode('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply promo code. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      // For web compatibility, we'll use a different approach
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        Alert.alert('Copied!', `Promo code "${code}" copied to clipboard`);
      } else {
        // Fallback for mobile
        Alert.alert('Promo Code', `Copy this code: ${code}`);
      }
    } catch (error) {
      Alert.alert('Promo Code', `Copy this code: ${code}`);
    }
  };

  const handleShareCode = async (code: string, description: string) => {
    try {
      const message = `🎉 Check out this Luxuire promo code: ${code}\n\n${description}\n\nGet fresh foodstuffs delivered to your doorstep!\n\nDownload Luxuire: https://luxuire.com`;
      
      await Share.share({
        message,
        title: 'Luxuire Promo Code',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const sendPromoRequestEmail = () => {
    const subject = encodeURIComponent('Request for Personalized Promo Code');
    const body = encodeURIComponent(`Hello Luxuire Team,%0D%0A%0D%0AI would like to request a personalized promo code for my account.%0D%0A%0D%0AAccount Details:%0D%0AEmail: [Your email]%0D%0APhone: [Your phone]%0D%0A%0D%0APlease let me know if you have any special offers available.%0D%0A%0D%0AThank you!`);
    
    Linking.openURL(`mailto:luxuireng@gmail.com?cc=support@luxuire.com&subject=${subject}&body=${body}`);
  };

  const formatExpiryDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiscountText = (promo: any) => {
    if (promo.discountType === 'percentage') {
      return `${promo.discountValue}% OFF`;
    } else {
      return `₦${promo.discountValue.toLocaleString()} OFF`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promo Codes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Apply Promo Code Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Apply Promo Code</Text>
          </View>
          
          {appliedPromo ? (
            <View style={styles.appliedPromoCard}>
              <View style={styles.appliedPromoInfo}>
                <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                <Text style={styles.appliedPromoDescription}>{appliedPromo.description}</Text>
                <Text style={styles.appliedPromoDiscount}>
                  {getDiscountText(appliedPromo)} applied to your next order
                </Text>
              </View>
              <TouchableOpacity onPress={removePromoCode} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
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
                style={[styles.applyButton, isApplying && styles.applyButtonDisabled]}
                onPress={handleApplyPromo}
                disabled={isApplying}
              >
                <Text style={styles.applyButtonText}>
                  {isApplying ? 'Applying...' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Available Promo Codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Promo Codes</Text>
          
          {availablePromoCodes.length > 0 ? (
            availablePromoCodes.map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoHeader}>
                  <View style={styles.promoCodeContainer}>
                    <Text style={styles.promoCodeText}>{promo.code}</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{getDiscountText(promo)}</Text>
                    </View>
                  </View>
                  <View style={styles.promoActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleCopyCode(promo.code)}
                    >
                      <Copy size={16} color="#B3C33E" strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleShareCode(promo.code, promo.description)}
                    >
                      <Share2 size={16} color="#B3C33E" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.promoDescription}>{promo.description}</Text>
                
                <View style={styles.promoDetails}>
                  <View style={styles.promoDetailItem}>
                    <Text style={styles.promoDetailLabel}>Minimum Order:</Text>
                    <Text style={styles.promoDetailValue}>₦{promo.minimumOrder.toLocaleString()}</Text>
                  </View>
                  
                  {promo.maxDiscount && (
                    <View style={styles.promoDetailItem}>
                      <Text style={styles.promoDetailLabel}>Max Discount:</Text>
                      <Text style={styles.promoDetailValue}>₦{promo.maxDiscount.toLocaleString()}</Text>
                    </View>
                  )}
                  
                  <View style={styles.promoDetailItem}>
                    <Clock size={14} color="#666666" strokeWidth={2} />
                    <Text style={styles.promoDetailValue}>Expires: {formatExpiryDate(promo.expiryDate)}</Text>
                  </View>
                  
                  <View style={styles.promoDetailItem}>
                    <Users size={14} color="#666666" strokeWidth={2} />
                    <Text style={styles.promoDetailValue}>
                      {promo.usageLimit - promo.usedCount} uses left
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.useCodeButton}
                  onPress={() => {
                    setPromoCode(promo.code);
                    handleApplyPromo();
                  }}
                >
                  <Text style={styles.useCodeButtonText}>Use This Code</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Gift size={48} color="#CCCCCC" strokeWidth={1} />
              <Text style={styles.emptyStateText}>No promo codes available</Text>
              <Text style={styles.emptyStateSubtext}>
                Check back later for new offers and discounts
              </Text>
            </View>
          )}
        </View>

        {/* Request Personalized Promo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need a Special Offer?</Text>
          <View style={styles.requestCard}>
            <Percent size={24} color="#B3C33E" strokeWidth={2} />
            <View style={styles.requestContent}>
              <Text style={styles.requestTitle}>Request Personalized Promo</Text>
              <Text style={styles.requestDescription}>
                Contact our team to get a personalized promo code based on your shopping history
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.requestButton}
              onPress={sendPromoRequestEmail}
            >
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How to Use */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use Promo Codes</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionStep}>1. Copy or enter a promo code above</Text>
            <Text style={styles.instructionStep}>2. Add items to your cart</Text>
            <Text style={styles.instructionStep}>3. Apply the code during checkout</Text>
            <Text style={styles.instructionStep}>4. Enjoy your discount!</Text>
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
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  appliedPromoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  appliedPromoDiscount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
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
  applyButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  promoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promoCodeContainer: {
    flex: 1,
  },
  promoCodeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  promoActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#F0F7E6',
    borderRadius: 8,
  },
  promoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  promoDetails: {
    marginBottom: 16,
  },
  promoDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  promoDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  promoDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#333333',
    marginLeft: 4,
  },
  useCodeButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  useCodeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  requestContent: {
    flex: 1,
    marginLeft: 12,
  },
  requestTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  requestDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    lineHeight: 18,
  },
  requestButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  requestButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  instructionsCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  instructionStep: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
});