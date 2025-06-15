import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Camera, CreditCard } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const paymentMethods = [
  { id: 'card', name: 'Card Payment', description: 'Pay with debit/credit card via Paystack' },
  { id: 'bank', name: 'Bank Transfer', description: 'Direct bank transfer' },
  { id: 'ussd', name: 'USSD Payment', description: 'Pay with your phone' },
  { id: 'cash', name: 'Cash on Delivery', description: 'Pay when you receive your order' },
];

export default function ProfileEditScreen() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    preferredPaymentMethod: user?.preferredPaymentMethod || 'card',
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: formData.profileImage,
        preferredPaymentMethod: formData.preferredPaymentMethod,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => {
          // In a real app, this would open camera
          Alert.alert('Coming Soon', 'Camera feature will be available soon!');
        }},
        { text: 'Gallery', onPress: () => {
          // In a real app, this would open gallery
          Alert.alert('Coming Soon', 'Gallery feature will be available soon!');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={handleImageChange} style={styles.imageContainer}>
            <Image 
              source={{ 
                uri: formData.profileImage || 'https://images.pexels.com/photos/4148950/pexels-photo-4148950.jpeg?auto=compress&cs=tinysrgb&w=400'
              }} 
              style={styles.profileImage} 
            />
            <View style={styles.cameraOverlay}>
              <Camera size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change profile picture</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <User size={20} color="#666666" strokeWidth={2} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#666666" strokeWidth={2} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#666666" strokeWidth={2} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Preferred Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                formData.preferredPaymentMethod === method.id && styles.paymentMethodCardSelected
              ]}
              onPress={() => setFormData(prev => ({ ...prev, preferredPaymentMethod: method.id }))}
            >
              <View style={styles.paymentMethodInfo}>
                <Text style={[
                  styles.paymentMethodName,
                  formData.preferredPaymentMethod === method.id && styles.paymentMethodNameSelected
                ]}>
                  {method.name}
                </Text>
                <Text style={[
                  styles.paymentMethodDescription,
                  formData.preferredPaymentMethod === method.id && styles.paymentMethodDescriptionSelected
                ]}>
                  {method.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                formData.preferredPaymentMethod === method.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
          
          <Text style={styles.paymentMethodNote}>
            This will be your default payment method for all orders
          </Text>
        </View>

        {/* Points Section */}
        <View style={styles.pointsSection}>
          <Text style={styles.pointsSectionTitle}>Referral Points</Text>
          <View style={styles.pointsCard}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsAmount}>0 Points</Text>
              <Text style={styles.pointsValue}>= ₦0.00</Text>
              <Text style={styles.pointsRate}>1 point = ₦0.10</Text>
            </View>
            <TouchableOpacity 
              style={styles.convertButton}
              onPress={() => Alert.alert('Convert Points', 'You need at least 100 points to convert to cash. Earn points by referring friends!')}
            >
              <Text style={styles.convertButtonText}>Convert to Cash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
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
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#B3C33E',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  paymentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
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
  paymentMethodName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  paymentMethodNameSelected: {
    color: '#7A9C2A',
  },
  paymentMethodDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  paymentMethodDescriptionSelected: {
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
  paymentMethodNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  pointsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  pointsSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  pointsCard: {
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  pointsInfo: {
    marginBottom: 16,
  },
  pointsAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  pointsValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  pointsRate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#7A9C2A',
  },
  convertButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  convertButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#B3C33E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});