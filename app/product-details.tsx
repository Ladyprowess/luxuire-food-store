import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, Plus, Minus, ShoppingCart, Heart, Package, Truck, Shield } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { ProductVariation } from '@/types';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Set default variation if available
  React.useEffect(() => {
    if (product.variations && product.variations.length > 0 && !selectedVariation) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product.variations, selectedVariation]);

  const currentPrice = selectedVariation ? selectedVariation.price : product.currentPrice;
  const currentPriceRange = selectedVariation ? selectedVariation.priceRange : product.priceRange;
  const isInStock = selectedVariation ? selectedVariation.inStock : product.inStock;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariation);
    Alert.alert(
      'Added to Cart',
      `${quantity} ${product.unit} of ${product.name}${selectedVariation ? ` (${selectedVariation.name})` : ''} added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
      ]
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const images = product.images || [product.image];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setIsFavorite(!isFavorite)} 
          style={styles.headerButton}
        >
          <Heart 
            size={24} 
            color={isFavorite ? "#FF4444" : "#333333"} 
            fill={isFavorite ? "#FF4444" : "none"}
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[selectedImageIndex] }} style={styles.productImage} />
          {product.fresh && (
            <View style={styles.freshBadge}>
              <Text style={styles.freshBadgeText}>Fresh</Text>
            </View>
          )}
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <View style={styles.thumbnailContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImageIndex(index)}
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.thumbnailSelected
                    ]}
                  >
                    <Image source={{ uri: image }} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productUnit}>{product.unit}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₦{currentPrice.toLocaleString()}</Text>
            <Text style={styles.priceRange}>Range: {currentPriceRange}</Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" strokeWidth={0} />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.ratingCount}>(124 reviews)</Text>
            </View>
            
            {product.lastBought && (
              <View style={styles.lastBoughtContainer}>
                <Clock size={14} color="#999999" strokeWidth={2} />
                <Text style={styles.lastBoughtText}>Last bought {product.lastBought}</Text>
              </View>
            )}
          </View>

          <View style={styles.stockContainer}>
            <View style={[styles.stockIndicator, { backgroundColor: isInStock ? '#4CAF50' : '#FF4444' }]} />
            <Text style={[styles.stockText, { color: isInStock ? '#4CAF50' : '#FF4444' }]}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Product Tags */}
          {product.tags && (
            <View style={styles.tagsContainer}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Product Variations */}
        {product.variations && product.variations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Options</Text>
            {product.variations.map((variation) => (
              <TouchableOpacity
                key={variation.id}
                style={[
                  styles.variationCard,
                  selectedVariation?.id === variation.id && styles.variationCardSelected,
                  !variation.inStock && styles.variationCardDisabled
                ]}
                onPress={() => variation.inStock && setSelectedVariation(variation)}
                disabled={!variation.inStock}
              >
                <View style={styles.variationInfo}>
                  <Text style={[
                    styles.variationName,
                    selectedVariation?.id === variation.id && styles.variationNameSelected,
                    !variation.inStock && styles.variationNameDisabled
                  ]}>
                    {variation.name}
                  </Text>
                  <Text style={[
                    styles.variationPrice,
                    selectedVariation?.id === variation.id && styles.variationPriceSelected,
                    !variation.inStock && styles.variationPriceDisabled
                  ]}>
                    ₦{variation.price.toLocaleString()}
                  </Text>
                  
                  {/* Variation Attributes */}
                  <View style={styles.attributesContainer}>
                    {Object.entries(variation.attributes).map(([key, value]) => (
                      <Text key={key} style={[
                        styles.attributeText,
                        !variation.inStock && styles.attributeTextDisabled
                      ]}>
                        {key}: {value}
                      </Text>
                    ))}
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedVariation?.id === variation.id && styles.radioButtonSelected,
                  !variation.inStock && styles.radioButtonDisabled
                ]} />
                
                {!variation.inStock && (
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Product Attributes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.attributesGrid}>
            {product.attributes.origin && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Origin:</Text>
                <Text style={styles.attributeValue}>{product.attributes.origin}</Text>
              </View>
            )}
            {product.attributes.quality && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Quality:</Text>
                <Text style={styles.attributeValue}>{product.attributes.quality}</Text>
              </View>
            )}
            {product.attributes.brand && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Brand:</Text>
                <Text style={styles.attributeValue}>{product.attributes.brand}</Text>
              </View>
            )}
            {product.attributes.shelfLife && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Shelf Life:</Text>
                <Text style={styles.attributeValue}>{product.attributes.shelfLife}</Text>
              </View>
            )}
            {product.attributes.storage && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Storage:</Text>
                <Text style={styles.attributeValue}>{product.attributes.storage}</Text>
              </View>
            )}
            {product.attributes.organic && (
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Organic:</Text>
                <Text style={styles.attributeValue}>Yes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Nutritional Information */}
        {product.attributes.nutritionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutritional Information (per 100g)</Text>
            <View style={styles.nutritionGrid}>
              {Object.entries(product.attributes.nutritionalInfo).map(([key, value]) => (
                <View key={key} style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                  <Text style={styles.nutritionValue}>{value}{key === 'calories' ? ' kcal' : 'g'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || 'Fresh, high-quality foodstuff sourced directly from local markets. Perfect for your cooking needs.'}
          </Text>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Package size={16} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.deliveryText}>Fresh items bought from market when you order</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Truck size={16} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.deliveryText}>Lagos delivery: 3-7 hours | Outside Lagos: 4-7 days</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Shield size={16} color="#B3C33E" strokeWidth={2} />
              <Text style={styles.deliveryText}>Quality guaranteed or money back</Text>
            </View>
          </View>
        </View>

        {/* Similar Products */}
        {product.relatedProducts && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {products
                .filter(p => product.relatedProducts?.includes(p.id))
                .map((similarProduct) => (
                  <TouchableOpacity
                    key={similarProduct.id}
                    style={styles.similarProductCard}
                    onPress={() => router.push(`/product-details?id=${similarProduct.id}`)}
                  >
                    <Image source={{ uri: similarProduct.image }} style={styles.similarProductImage} />
                    <Text style={styles.similarProductName}>{similarProduct.name}</Text>
                    <Text style={styles.similarProductPrice}>₦{similarProduct.currentPrice.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
            <Minus size={20} color="#666666" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
            <Plus size={20} color="#666666" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addToCartButton, !isInStock && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!isInStock}
        >
          <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.addToCartButtonText}>
            Add to Cart - ₦{(currentPrice * quantity).toLocaleString()}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    marginTop: 80,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  freshBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freshBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: '#B3C33E',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  productName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  productUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 16,
  },
  currentPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#B3C33E',
    marginBottom: 4,
  },
  priceRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999999',
  },
  metaContainer: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginLeft: 4,
  },
  ratingCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999999',
    marginLeft: 4,
  },
  lastBoughtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastBoughtText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stockText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#F0F7E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
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
    marginBottom: 12,
  },
  variationCard: {
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
  variationCardSelected: {
    backgroundColor: '#F0F7E6',
    borderColor: '#B3C33E',
  },
  variationCardDisabled: {
    opacity: 0.5,
  },
  variationInfo: {
    flex: 1,
  },
  variationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  variationNameSelected: {
    color: '#7A9C2A',
  },
  variationNameDisabled: {
    color: '#999999',
  },
  variationPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#B3C33E',
    marginBottom: 8,
  },
  variationPriceSelected: {
    color: '#7A9C2A',
  },
  variationPriceDisabled: {
    color: '#999999',
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginRight: 12,
    marginBottom: 2,
  },
  attributeTextDisabled: {
    color: '#999999',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: '#B3C33E',
    backgroundColor: '#B3C33E',
  },
  radioButtonDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  outOfStockText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FF4444',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  attributesGrid: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  attributeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  nutritionGrid: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  nutritionValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#B3C33E',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  deliveryInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
  },
  similarProductCard: {
    width: 120,
    marginRight: 12,
  },
  similarProductImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarProductName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
  },
  similarProductPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#B3C33E',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
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
  addToCartButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addToCartButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#B3C33E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});