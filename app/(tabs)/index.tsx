import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, MapPin, Bell, Sparkles, TrendingUp, Clock, Star, ShoppingCart } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';
import { categories, products } from '@/data/products';

const aiSuggestions = [
  'Fresh Ugu leaves are in season',
  'Tomatoes are cheaper today',
  'Try our premium local rice',
  'Fresh fish just arrived',
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const { addToCart, getCartItemsCount } = useCart();

  const featuredItems = products.slice(0, 4);
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(tabs)/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/browse?category=${categoryId}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'reorder':
        // For new users, redirect to browse
        router.push('/(tabs)/browse');
        break;
      case 'custom':
        router.push('/custom-basket');
        break;
      case 'voice':
        Alert.alert(
          'Voice Order',
          'Voice ordering feature is coming soon! You\'ll be able to place orders using voice commands.',
          [{ text: 'OK' }]
        );
        break;
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} added to your cart!`);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  const defaultAddress = user.addresses?.find(addr => addr.id === user.defaultAddressId) || user.addresses?.[0];
  const locationText = currentLocation 
    ? `${currentLocation.city}, ${currentLocation.state}`
    : defaultAddress 
    ? `${defaultAddress.city}, ${defaultAddress.state}`
    : 'Select Location';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => router.push('/location-picker')}
          >
            <MapPin size={16} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.locationText}>Deliver to {locationText}</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            {cartItemsCount > 0 && (
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => router.push('/(tabs)/cart')}
              >
                <ShoppingCart size={20} color="#B3C33E" strokeWidth={2} />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={24} color="#333333" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello, {user.name?.split(' ')[0] || 'there'}! 👋</Text>
          <Text style={styles.welcomeSubtext}>What fresh ingredients do you need today?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#999999" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Ugu, Tomatoes, Rice..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999999"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Today's Highlights</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {aiSuggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.suggestionCard}
                onPress={() => router.push('/(tabs)/browse')}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.slice(1).map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#B3C33E" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Fresh Today</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/browse')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.featuredCard}
                onPress={() => router.push(`/product-details?id=${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                {item.fresh && (
                  <View style={styles.freshBadge}>
                    <Text style={styles.freshBadgeText}>Fresh</Text>
                  </View>
                )}
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <Text style={styles.featuredUnit}>{item.unit}</Text>
                  <Text style={styles.featuredPrice}>₦{item.currentPrice.toLocaleString()}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('reorder')}
            >
              <Text style={styles.quickActionIcon}>🛒</Text>
              <Text style={styles.quickActionText}>Browse Items</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('custom')}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Custom Basket</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('voice')}
            >
              <Text style={styles.quickActionIcon}>🔊</Text>
              <Text style={styles.quickActionText}>Voice Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#B3C33E',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  welcomeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#B3C33E',
  },
  suggestionCard: {
    backgroundColor: '#F0F7E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#B3C33E',
  },
  suggestionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#7A9C2A',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#333333',
    textAlign: 'center',
  },
  featuredCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  freshBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freshBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  featuredUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  featuredPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#B3C33E',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333333',
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});