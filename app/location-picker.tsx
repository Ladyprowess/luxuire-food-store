import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, ArrowLeft, Plus, Chrome as Home, Briefcase, MapPin as MapPinIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Address } from '@/types';

const predefinedLocations = [
  { city: 'Lagos', state: 'Lagos', areas: ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba', 'Ikoyi'] },
  { city: 'Abuja', state: 'FCT', areas: ['Wuse', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa'] },
  { city: 'Port Harcourt', state: 'Rivers', areas: ['GRA', 'Trans Amadi', 'Mile 1', 'Rumuola'] },
  { city: 'Kano', state: 'Kano', areas: ['Sabon Gari', 'Fagge', 'Nasarawa', 'Gwale'] },
];

export default function LocationPickerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Partial<Address> | null>(null);
  const [customAddress, setCustomAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, updateUser } = useAuth();
  const { setCurrentLocation, getDeliveryFee } = useLocation();

  const filteredLocations = predefinedLocations.filter(location =>
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.areas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectPredefined = (city: string, state: string, area: string) => {
    const address: Partial<Address> = {
      street: area,
      city,
      state,
    };
    setSelectedLocation(address);
  };

  const handleSaveAddress = async () => {
    if (isLoading) return;
    
    let addressToSave: Address;

    if (selectedLocation) {
      addressToSave = {
        id: Date.now().toString(),
        label: 'Selected Location',
        street: selectedLocation.street || '',
        city: selectedLocation.city || '',
        state: selectedLocation.state || '',
        isDefault: !user?.addresses?.length,
      };
    } else if (showCustomForm) {
      if (!customAddress.street || !customAddress.city || !customAddress.state) {
        Alert.alert('Error', 'Please fill in all address fields');
        return;
      }

      addressToSave = {
        id: Date.now().toString(),
        label: customAddress.label || 'Custom Address',
        street: customAddress.street,
        city: customAddress.city,
        state: customAddress.state,
        isDefault: !user?.addresses?.length,
      };
    } else {
      Alert.alert('Error', 'Please select or enter an address');
      return;
    }

    // Check delivery availability
    const deliveryFee = getDeliveryFee(addressToSave);
    if (deliveryFee === -1) {
      Alert.alert(
        'International Delivery',
        'For international deliveries, please contact us at luxuire.com/help-center for custom pricing.',
        [
          { text: 'OK', style: 'default' },
          { text: 'Contact Support', onPress: () => router.push('/help-center') }
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      // Update user addresses
      const updatedAddresses = [...(user?.addresses || []), addressToSave];
      await updateUser({ 
        addresses: updatedAddresses,
        defaultAddressId: addressToSave.isDefault ? addressToSave.id : user?.defaultAddressId
      });

      // Set as current location
      setCurrentLocation(addressToSave);

      Alert.alert('Success', 'Address saved successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canSave = selectedLocation || (showCustomForm && customAddress.street && customAddress.city && customAddress.state);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MapPin size={20} color="#999999" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for city, state, or area..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Current Selection */}
        {selectedLocation && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Selected Location:</Text>
            <View style={styles.selectionCard}>
              <MapPinIcon size={20} color="#B3C33E" strokeWidth={2} />
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionText}>
                  {selectedLocation.street}, {selectedLocation.city}, {selectedLocation.state}
                </Text>
                <Text style={styles.deliveryInfo}>
                  Delivery Fee: ₦{getDeliveryFee(selectedLocation as Address).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Predefined Locations */}
        {!showCustomForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Locations</Text>
            {filteredLocations.map((location, index) => (
              <View key={index} style={styles.locationGroup}>
                <Text style={styles.locationCity}>{location.city}, {location.state}</Text>
                <View style={styles.areasContainer}>
                  {location.areas.map((area, areaIndex) => (
                    <TouchableOpacity
                      key={areaIndex}
                      style={[
                        styles.areaButton,
                        selectedLocation?.street === area && 
                        selectedLocation?.city === location.city && 
                        styles.areaButtonSelected
                      ]}
                      onPress={() => handleSelectPredefined(location.city, location.state, area)}
                    >
                      <Text style={[
                        styles.areaButtonText,
                        selectedLocation?.street === area && 
                        selectedLocation?.city === location.city && 
                        styles.areaButtonTextSelected
                      ]}>
                        {area}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Custom Address Form */}
        {showCustomForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Custom Address</Text>
            
            <View style={styles.inputContainer}>
              <Home size={20} color="#666666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Address Label (e.g., Home, Office)"
                value={customAddress.label}
                onChangeText={(text) => setCustomAddress(prev => ({ ...prev, label: text }))}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={customAddress.street}
                onChangeText={(text) => setCustomAddress(prev => ({ ...prev, street: text }))}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={customAddress.city}
                onChangeText={(text) => setCustomAddress(prev => ({ ...prev, city: text }))}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={customAddress.state}
                onChangeText={(text) => setCustomAddress(prev => ({ ...prev, state: text }))}
                placeholderTextColor="#999999"
              />
            </View>
          </View>
        )}

        {/* Toggle Custom Form */}
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => {
            setShowCustomForm(!showCustomForm);
            setSelectedLocation(null);
          }}
        >
          <Plus size={20} color="#B3C33E" strokeWidth={2} />
          <Text style={styles.toggleButtonText}>
            {showCustomForm ? 'Choose from Popular Locations' : 'Enter Custom Address'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!canSave || isLoading) && styles.saveButtonDisabled
          ]}
          onPress={handleSaveAddress}
          disabled={!canSave || isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Address'}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  selectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  selectionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#7A9C2A',
    marginBottom: 4,
  },
  deliveryInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#7A9C2A',
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
  locationGroup: {
    marginBottom: 20,
  },
  locationCity: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  areaButtonSelected: {
    backgroundColor: '#B3C33E',
    borderColor: '#B3C33E',
  },
  areaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  areaButtonTextSelected: {
    color: '#FFFFFF',
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7E6',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3C33E',
    marginBottom: 20,
  },
  toggleButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7A9C2A',
    marginLeft: 8,
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