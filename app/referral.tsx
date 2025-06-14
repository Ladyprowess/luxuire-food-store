import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Users, Gift, Copy, Share2, DollarSign, Trophy, Star } from 'lucide-react-native';
import { useReferral } from '@/contexts/ReferralContext';
import { useAuth } from '@/contexts/AuthContext';
import { Linking } from 'react-native';

export default function ReferralScreen() {
  const { referralData, convertPointsToCash, getReferralStats } = useReferral();
  const { user } = useAuth();
  const [isConverting, setIsConverting] = useState(false);

  const stats = getReferralStats();

  const handleCopyReferralCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(referralData.referralCode);
        Alert.alert('Copied!', 'Referral code copied to clipboard');
      } else {
        Alert.alert('Referral Code', `Copy this code: ${referralData.referralCode}`);
      }
    } catch (error) {
      Alert.alert('Referral Code', `Copy this code: ${referralData.referralCode}`);
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(referralData.referralLink);
        Alert.alert('Copied!', 'Referral link copied to clipboard');
      } else {
        Alert.alert('Referral Link', `Copy this link: ${referralData.referralLink}`);
      }
    } catch (error) {
      Alert.alert('Referral Link', `Copy this link: ${referralData.referralLink}`);
    }
  };

  const handleShareReferral = async () => {
    try {
      const message = `🎉 Join me on Luxuire and get fresh foodstuffs delivered to your doorstep!\n\nUse my referral code: ${referralData.referralCode}\n\nOr click this link: ${referralData.referralLink}\n\nGet fresh ingredients from local markets delivered fast! 🥬🍅🌾`;
      
      await Share.share({
        message,
        title: 'Join Luxuire - Fresh Food Delivery',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleConvertPoints = async () => {
    if (stats.availablePoints < 100) {
      Alert.alert(
        'Insufficient Points',
        'You need at least 100 points to convert to cash. Keep referring friends to earn more points!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Convert Points to Cash',
      `Convert ${stats.availablePoints} points to ₦${(stats.availablePoints * 0.10).toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Convert',
          onPress: async () => {
            setIsConverting(true);
            try {
              const success = await convertPointsToCash(stats.availablePoints);
              if (success) {
                // Send email notification about cash conversion
                const subject = encodeURIComponent('Points to Cash Conversion Request');
                const body = encodeURIComponent(`Cash conversion request:%0D%0A%0D%0AUser: ${user?.name || 'N/A'}%0D%0AEmail: ${user?.email || 'N/A'}%0D%0APhone: ${user?.phone || 'N/A'}%0D%0APoints Converted: ${stats.availablePoints}%0D%0ACash Amount: ₦${(stats.availablePoints * 0.10).toFixed(2)}%0D%0ARequest Time: ${new Date().toLocaleString()}%0D%0A%0D%0APlease process this cash conversion.`);
                
                Linking.openURL(`mailto:luxuireng@gmail.com?cc=support@luxuire.com&subject=${subject}&body=${body}`);
                
                Alert.alert(
                  'Conversion Successful!',
                  'Your points have been converted to cash. Our team will process the payment within 24 hours.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Error', 'Failed to convert points. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'Something went wrong. Please try again.');
            } finally {
              setIsConverting(false);
            }
          }
        }
      ]
    );
  };

  const sendReferralEmail = () => {
    const subject = encodeURIComponent('Check out Luxuire - Fresh Food Delivery!');
    const body = encodeURIComponent(`Hi there!%0D%0A%0D%0AI wanted to share Luxuire with you - it's an amazing app that delivers fresh foodstuffs from local markets right to your doorstep!%0D%0A%0D%0AUse my referral code: ${referralData.referralCode}%0D%0AOr click this link: ${referralData.referralLink}%0D%0A%0D%0AYou'll get fresh ingredients like Ugu, tomatoes, rice, and more delivered in just 2-4 hours in Lagos. They shop fresh from the market when you order!%0D%0A%0D%0ACheck it out: https://luxuire.com%0D%0A%0D%0ABest regards,%0D%0A${user?.name || 'Your friend'}`);
    
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Gift size={48} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.heroTitle}>Earn Rewards by Referring Friends!</Text>
          <Text style={styles.heroSubtitle}>
            Get 1 point for every friend who joins Luxuire using your referral code. Convert points to cash!
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.statNumber}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Friends Referred</Text>
          </View>
          
          <View style={styles.statCard}>
            <Star size={24} color="#FFD700" strokeWidth={2} />
            <Text style={styles.statNumber}>{stats.availablePoints}</Text>
            <Text style={styles.statLabel}>Available Points</Text>
          </View>
          
          <View style={styles.statCard}>
            <DollarSign size={24} color="#4CAF50" strokeWidth={2} />
            <Text style={styles.statNumber}>₦{stats.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Points to Cash Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Convert Points to Cash</Text>
          <View style={styles.conversionCard}>
            <View style={styles.conversionInfo}>
              <Text style={styles.conversionTitle}>Your Points Value</Text>
              <Text style={styles.conversionAmount}>
                {stats.availablePoints} points = ₦{(stats.availablePoints * 0.10).toFixed(2)}
              </Text>
              <Text style={styles.conversionRate}>Rate: 1 point = ₦0.10</Text>
              <Text style={styles.conversionNote}>
                Minimum 100 points required for conversion
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.convertButton,
                (stats.availablePoints < 100 || isConverting) && styles.convertButtonDisabled
              ]}
              onPress={handleConvertPoints}
              disabled={stats.availablePoints < 100 || isConverting}
            >
              <Text style={styles.convertButtonText}>
                {isConverting ? 'Converting...' : 'Convert to Cash'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.referralCard}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Referral Code</Text>
              <Text style={styles.codeText}>{referralData.referralCode}</Text>
            </View>
            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyReferralCode}>
                <Copy size={16} color="#B3C33E" strokeWidth={2} />
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Referral Link Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Link</Text>
          <View style={styles.referralCard}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Referral Link</Text>
              <Text style={styles.linkText} numberOfLines={2}>
                {referralData.referralLink}
              </Text>
            </View>
            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyReferralLink}>
                <Copy size={16} color="#B3C33E" strokeWidth={2} />
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share with Friends</Text>
          <View style={styles.shareContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
              <Share2 size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.shareButtonText}>Share via Apps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={sendReferralEmail}>
              <Text style={styles.shareButtonIcon}>📧</Text>
              <Text style={styles.shareButtonText}>Share via Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>
                  Share your referral code or link with friends and family
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Signs Up</Text>
                <Text style={styles.stepDescription}>
                  Your friend downloads Luxuire and creates an account using your code
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Earn Points</Text>
                <Text style={styles.stepDescription}>
                  You get 1 point for each successful referral. Convert 100+ points to cash!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <View style={styles.termsCard}>
            <Text style={styles.termsText}>• You earn 1 point for each friend who successfully signs up</Text>
            <Text style={styles.termsText}>• Minimum 100 points required for cash conversion</Text>
            <Text style={styles.termsText}>• Conversion rate: 1 point = ₦0.10</Text>
            <Text style={styles.termsText}>• Cash payments processed within 24 hours</Text>
            <Text style={styles.termsText}>• Referral points are non-transferable</Text>
            <Text style={styles.termsText}>• Luxuire reserves the right to modify terms</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
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
  conversionCard: {
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  conversionInfo: {
    marginBottom: 16,
  },
  conversionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 8,
  },
  conversionAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  conversionRate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  conversionNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#7A9C2A',
    fontStyle: 'italic',
  },
  convertButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  convertButtonDisabled: {
    opacity: 0.5,
  },
  convertButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  codeContainer: {
    flex: 1,
  },
  codeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  codeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#B3C33E',
  },
  linkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B3C33E',
  },
  codeActions: {
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#7A9C2A',
    marginLeft: 4,
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  shareButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  shareButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  stepsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B3C33E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  termsCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
});