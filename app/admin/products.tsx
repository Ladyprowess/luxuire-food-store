import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, Filter, Plus, CreditCard as Edit, Trash2, Star, Package, ShoppingBag, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react-native';
import { products, categories } from '@/data/products';

export default function AdminProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
                           product.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    Alert.alert(
      'Add Product',
      'This feature is not implemented in the demo.',
      [{ text: 'OK' }]
    );
  };

  const handleEditProduct = (product: any) => {
    Alert.alert(
      'Edit Product',
      'This feature is not implemented in the demo.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteProduct = (product: any) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Not Implemented', 'This feature is not implemented in the demo.');
          }
        }
      ]
    );
  };

  const renderProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Product Image */}
              <Image 
                source={{ uri: selectedProduct.image }} 
                style={styles.productImage} 
                resizeMode="cover"
              />

              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{selectedProduct.name}</Text>
                <Text style={styles.productCategory}>{selectedProduct.category}</Text>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>₦{selectedProduct.currentPrice.toLocaleString()}</Text>
                  <Text style={styles.priceRange}>{selectedProduct.priceRange}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                  <Text style={styles.ratingText}>{selectedProduct.rating}</Text>
                </View>

                <View style={styles.stockContainer}>
                  <View style={[
                    styles.stockIndicator, 
                    { backgroundColor: selectedProduct.inStock ? '#4CAF50' : '#FF4444' }
                  ]} />
                  <Text style={[
                    styles.stockText, 
                    { color: selectedProduct.inStock ? '#4CAF50' : '#FF4444' }
                  ]}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                  {selectedProduct.fresh && (
                    <View style={styles.freshBadge}>
                      <Text style={styles.freshBadgeText}>Fresh</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Product Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {selectedProduct.description || 'No description available.'}
                </Text>
              </View>

              {/* Product Attributes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Attributes</Text>
                <View style={styles.attributesContainer}>
                  {Object.entries(selectedProduct.attributes).map(([key, value]: [string, any]) => {
                    if (key === 'nutritionalInfo') return null;
                    return (
                      <View key={key} style={styles.attributeItem}>
                        <Text style={styles.attributeLabel}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Text>
                        <Text style={styles.attributeValue}>
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Product Tags */}
              {selectedProduct.tags && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {selectedProduct.tags.map((tag: string, index: number) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Product Variations */}
              {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Variations</Text>
                  {selectedProduct.variations.map((variation: any, index: number) => (
                    <View key={index} style={styles.variationItem}>
                      <View style={styles.variationHeader}>
                        <Text style={styles.variationName}>{variation.name}</Text>
                        <Text style={styles.variationPrice}>₦{variation.price.toLocaleString()}</Text>
                      </View>
                      <View style={styles.variationAttributes}>
                        {Object.entries(variation.attributes).map(([key, value]: [string, any]) => (
                          <Text key={key} style={styles.variationAttribute}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                          </Text>
                        ))}
                      </View>
                      <View style={styles.variationStock}>
                        <View style={[
                          styles.stockDot,
                          { backgroundColor: variation.inStock ? '#4CAF50' : '#FF4444' }
                        ]} />
                        <Text style={[
                          styles.variationStockText,
                          { color: variation.inStock ? '#4CAF50' : '#FF4444' }
                        ]}>
                          {variation.inStock ? 'In Stock' : 'Out of Stock'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalAction, styles.editAction]}
                  onPress={() => {
                    setShowProductModal(false);
                    handleEditProduct(selectedProduct);
                  }}
                >
                  <Edit size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.modalActionText}>Edit Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalAction, styles.deleteAction]}
                  onPress={() => {
                    setShowProductModal(false);
                    handleDeleteProduct(selectedProduct);
                  }}
                >
                  <Trash2 size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.modalActionText}>Delete Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={24} color="#333333" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999999" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  categoryFilter === 'all' && styles.filterOptionSelected
                ]}
                onPress={() => setCategoryFilter('all')}
              >
                <Text style={[
                  styles.filterOptionText,
                  categoryFilter === 'all' && styles.filterOptionTextSelected
                ]}>
                  All
                </Text>
              </TouchableOpacity>
              
              {categories.slice(1).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    categoryFilter === category.id && styles.filterOptionSelected
                  ]}
                  onPress={() => setCategoryFilter(category.id)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    categoryFilter === category.id && styles.filterOptionTextSelected
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Add Product Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddProduct}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      {/* Products List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.productsContainer}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>

        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id}
              style={styles.productCard}
              onPress={() => {
                setSelectedProduct(product);
                setShowProductModal(true);
              }}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                {product.fresh && (
                  <View style={styles.freshBadge}>
                    <Text style={styles.freshBadgeText}>Fresh</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                
                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>₦{product.currentPrice.toLocaleString()}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#FFD700" fill="#FFD700" strokeWidth={0} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.productActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                  >
                    <Edit size={16} color="#2196F3" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product);
                    }}
                  >
                    <Trash2 size={16} color="#FF4444" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color="#CCCCCC" strokeWidth={1} />
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Product Details Modal */}
      {renderProductModal()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin')}
        >
          <TrendingUp size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin/orders')}
        >
          <ShoppingBag size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => router.push('/admin/products')}
        >
          <Package size={24} color="#B3C33E" strokeWidth={2} />
          <Text style={[styles.navItemText, styles.navItemTextActive]}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/admin/users')}
        >
          <Users size={24} color="#666666" strokeWidth={2} />
          <Text style={styles.navItemText}>Users</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#B3C33E',
  },
  filterOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3C33E',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
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
  productInfo: {
    padding: 12,
  },
  productName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  productCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#B3C33E',
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
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  modalCloseButton: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#666666',
  },
  modalContent: {
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  productName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  productCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 12,
  },
  productPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#B3C33E',
    marginBottom: 4,
  },
  priceRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  stockText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginRight: 12,
  },
  freshBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  freshBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  attributesContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  variationItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  variationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  variationPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#B3C33E',
  },
  variationAttributes: {
    marginBottom: 8,
  },
  variationAttribute: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  variationStock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  variationStockText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
  },
  editAction: {
    backgroundColor: '#2196F3',
  },
  deleteAction: {
    backgroundColor: '#FF4444',
  },
  modalActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#B3C33E',
    marginTop: -2,
  },
  navItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  navItemTextActive: {
    fontFamily: 'Inter-Medium',
    color: '#B3C33E',
  },
});