import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ShoppingBasket, Camera, MapPin, Phone, Clock, DollarSign, MessageSquare, Send } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useOrders } from '@/contexts/OrdersContext';
import { Linking } from 'react-native';

const deliveryTimeOptions = [
  { id: 'asap', label: 'ASAP (2-3 hours)', description: 'Get your order as soon as possible' },
  { id: 'today-evening', label: 'Today Evening (4-6 PM)', description: 'Perfect for dinner preparation' },
  { id: 'tomorrow-morning', label: 'Tomorrow Morning (8-10 AM)', description: 'Fresh start to your day' },
  { id: 'tomorrow-afternoon', label: 'Tomorrow Afternoon (12-2 PM)', description: 'Lunch time delivery' },
  { id: 'custom', label: 'Custom Time', description: 'Specify your preferred time' },
];

const budgetRanges = [
  { id: 'under-5k', label: 'Under ₦5,000', min: 0, max: 5000 },
  { id: '5k-10k', label: '₦5,000 - ₦10,000', min: 5000, max: 10000 },
  { id: '10k-20k', label: '₦10,000 - ₦20,000', min: 10000, max: 20000 },
  { id: '20k-50k', label: '₦20,000 - ₦50,000', min: 20000, max: 50000 },
  { id: 'above-50k', label: 'Above ₦50,000', min: 50000, max: null },
  { id: 'flexible', label: 'Flexible Budget', min: null, max: null },
];

// Email notification function for custom orders
const sendCustomOrderEmail = async (orderData: any) => {
  const subject = encodeURIComponent(`New Custom Basket Order - #${orderData.orderId}`);
  const body = encodeURIComponent(`New custom basket order received:%0D%0A%0D%0AOrder ID: ${orderData.orderId}%0D%0ACustomer Name: ${orderData.customerName}%0D%0APhone: ${orderData.phone}%0D%0A%0D%0AORDER DETAILS:%0D%0AItems Needed: ${orderData.itemNames}%0D%0AQuantity: ${orderData.quantity}%0D%0ADescription: ${orderData.description || 'None'}%0D%0A%0D%0ADELIVERY:%0D%0ATime: ${orderData.deliveryTime}%0D%0AAddress: ${orderData.address}%0D%0A%0D%0ABUDGET: ${orderData.budget}%0D%0A%0D%0ASPECIAL INSTRUCTIONS:%0D%0A${orderData.specialInstructions || 'None'}%0D%0A%0D%0AOrder Time: ${new Date().toLocaleString()}`);
  
  const emailUrl = `mailto:luxuireng@gmail.com?cc=support@luxuire.com&subject=${subject}&body=${body}`;
  console.log('Custom order email:', emailUrl);
};

export default function CustomBasketScreen() {
  const [formData, setFormData] = useState({
    itemNames: '',
    description: '',
    quantity: '',
    deliveryTime: '',
    customDeliveryTime: '',
    phone: '',
    specialInstructions: '',
    budgetRange: '',
    customBudget: '',
  });
  
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const { addCustomOrder } = useOrders();

  React.useEffect(() => {
    if (user?.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone }));
    }
  }, [user]);

  const handleImageUpload = () => {
    Alert.alert(
      'Upload Sample Image',
      'Choose how you want to add a sample image of what you need',
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.itemNames.trim()) {
      Alert.alert('Required Field', 'Please specify the items you need');
      return;
    }

    if (!formData.quantity.trim()) {
      Alert.alert('Required Field', 'Please specify the quantity needed');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Required Field', 'Please provide your phone number');
      return;
    }

    if (!selectedDeliveryTime) {
      Alert.alert('Required Field', 'Please select a delivery time');
      return;
    }

    if (selectedDeliveryTime === 'custom' && !formData.customDeliveryTime.trim()) {
      Alert.alert('Required Field', 'Please specify your custom delivery time');
      return;
    }

    if (!currentLocation && !user?.addresses?.length) {
      Alert.alert('Address Required', 'Please add a delivery address first.', [
        { text: 'Add Address', onPress: () => router.push('/location-picker') }
      ]);
      return;
    }

    setIsSubmitting(true);

    try {
      const defaultAddress = user?.addresses?.find(addr => addr.id === user.defaultAddressId) || user?.addresses?.[0];
      const deliveryAddress = currentLocation || defaultAddress;
      
      const deliveryTimeText = selectedDeliveryTime === 'custom' 
        ? formData.customDeliveryTime 
        : deliveryTimeOptions.find(opt => opt.id === selectedDeliveryTime)?.label || '';
      
      const budgetText = selectedBudgetRange === 'flexible' 
        ? `Flexible Budget: ${formData.customBudget}` 
        : budgetRanges.find(range => range.id === selectedBudgetRange)?.label || 'Not specified';

      // Create custom order data
      const customOrderData = {
        customerName: user?.name || 'Guest',
        phone: formData.phone,
        itemNames: formData.itemNames,
        quantity: formData.quantity,
        description: formData.description,
        deliveryTime: deliveryTimeText,
        deliveryAddress: deliveryAddress!,
        address: deliveryAddress ? `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state}` : 'Not specified',
        budget: budgetText,
        specialInstructions: formData.specialInstructions
      };

      // Add to order history
      const orderId = await addCustomOrder(customOrderData);

      // Send email notification
      await sendCustomOrderEmail({
        orderId,
        ...customOrderData
      });
      
      Alert.alert(
        'Custom Order Submitted!',
        `Your custom basket order #${orderId} has been received. Our team will review your request and contact you within 30 minutes with pricing and availability.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              router.push('/(tabs)/orders');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultAddress = user?.addresses?.find(addr => addr.id === user.defaultAddressId) || user?.addresses?.[0];
  const deliveryAddress = currentLocation || defaultAddress;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Custom Basket</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <ShoppingBasket size={48} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.introTitle}>Tell us what you need</Text>
          <Text style={styles.introSubtitle}>
            Describe your unique foodstuff requirements and we'll source them fresh from the market for you
          </Text>
        </View>

        {/* Item Names */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What items do you need? *</Text>
          <Text style={styles.fieldDescription}>
            List all the foodstuffs you want. Be as specific as possible.
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., 2 bunches of Ugu, 1 derica of beans, half paint of egusi, 3 pieces of stockfish head..."
            value={formData.itemNames}
            onChangeText={(text) => setFormData(prev => ({ ...prev, itemNames: text }))}
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Description/Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Type / Description</Text>
          <Text style={styles.fieldDescription}>
            Any specific requirements about quality, preparation, or type?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., Make sure the tomatoes are firm and not overripe, I want bitterleaf already washed if available, prefer local rice over foreign..."
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholderTextColor="#999999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Quantity Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity Details *</Text>
          <Text style={styles.fieldDescription}>
            Specify quantities using local measurements (paint, derica, bunch, pieces, etc.)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1 paint of Garri, 5 pieces of stockfish head, 2 bunches of vegetables..."
            value={formData.quantity}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
            placeholderTextColor="#999999"
          />
        </View>

        {/* Sample Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Sample Images (Optional)</Text>
          <Text style={styles.fieldDescription}>
            Upload photos if you want specific items you can't describe in words
          </Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <Camera size={24} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Add Sample Images</Text>
          </TouchableOpacity>

          {uploadedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              {uploadedImages.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Delivery Time *</Text>
          </View>
          
          {deliveryTimeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedDeliveryTime === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedDeliveryTime(option.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionLabel,
                  selectedDeliveryTime === option.id && styles.optionLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedDeliveryTime === option.id && styles.optionDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedDeliveryTime === option.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}

          {selectedDeliveryTime === 'custom' && (
            <TextInput
              style={styles.input}
              placeholder="Specify your preferred delivery time..."
              value={formData.customDeliveryTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, customDeliveryTime: text }))}
              placeholderTextColor="#999999"
            />
          )}
        </View>

        {/* Budget Range */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Budget Range (Optional)</Text>
          </View>
          <Text style={styles.fieldDescription}>
            Help us understand your budget to provide the best options
          </Text>
          
          {budgetRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.optionCard,
                selectedBudgetRange === range.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedBudgetRange(range.id)}
            >
              <Text style={[
                styles.optionLabel,
                selectedBudgetRange === range.id && styles.optionLabelSelected
              ]}>
                {range.label}
              </Text>
              <View style={[
                styles.radioButton,
                selectedBudgetRange === range.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}

          {selectedBudgetRange === 'flexible' && (
            <TextInput
              style={styles.input}
              placeholder="Specify your budget range..."
              value={formData.customBudget}
              onChangeText={(text) => setFormData(prev => ({ ...prev, customBudget: text }))}
              placeholderTextColor="#999999"
            />
          )}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          
          {deliveryAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressLabel}>{deliveryAddress.label}</Text>
              <Text style={styles.addressText}>
                {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.state}
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

        {/* Phone Number */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Phone size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Phone Number *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Your phone number for order updates"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
            placeholderTextColor="#999999"
          />
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Special Instructions</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., Call me before delivery, Put vegetables in separate nylon, Ring the bell twice..."
            value={formData.specialInstructions}
            onChangeText={(text) => setFormData(prev => ({ ...prev, specialInstructions: text }))}
            placeholderTextColor="#999999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>• Our team will review your custom order</Text>
          <Text style={styles.infoText}>• We'll contact you within 30 minutes with pricing</Text>
          <Text style={styles.infoText}>• Once confirmed, we'll shop for your items fresh</Text>
          <Text style={styles.infoText}>• You'll receive real-time updates on your order</Text>
          <Text style={styles.infoText}>• Payment is made before delivery</Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Send size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting Order...' : 'Submit Custom Order'}
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
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  introTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  introSubtitle: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginLeft: 8,
  },
  fieldDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
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
  textArea: {
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
    minHeight: 100,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginLeft: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
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
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  optionDescriptionSelected: {
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
  infoCard: {
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
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});