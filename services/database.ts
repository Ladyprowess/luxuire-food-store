import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']

export class DatabaseService {
  // User operations
  static async createUser(userData: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        addresses (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Address operations
  static async createAddress(addressData: Tables['addresses']['Insert']) {
    const { data, error } = await supabase
      .from('addresses')
      .insert(addressData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserAddresses(userId: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Product operations
  static async getProducts(filters?: {
    category?: string
    search?: string
    inStock?: boolean
    fresh?: boolean
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (name, icon, color),
        product_variations (*)
      `)

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('categories.name', filters.category)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock)
    }

    if (filters?.fresh !== undefined) {
      query = query.eq('fresh', filters.fresh)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, icon, color),
        product_variations (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  // Order operations
  static async createOrder(orderData: Tables['orders']['Insert']) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createOrderItems(items: Tables['order_items']['Insert'][]) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select()
    
    if (error) throw error
    return data
  }

  static async createOrderTracking(trackingData: Tables['order_tracking']['Insert'][]) {
    const { data, error } = await supabase
      .from('order_tracking')
      .insert(trackingData)
      .select()
    
    if (error) throw error
    return data
  }

  static async getUserOrders(userId: string, status?: string) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, image, unit),
          product_variations (name, price)
        ),
        order_tracking (*)
      `)
      .eq('user_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, image, unit),
          product_variations (name, price)
        ),
        order_tracking (*)
      `)
      .eq('id', orderId)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Payment operations
  static async createPayment(paymentData: Tables['payments']['Insert']) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updatePayment(reference: string, updates: Tables['payments']['Update']) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('reference', reference)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getPaymentByReference(reference: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single()
    
    if (error) throw error
    return data
  }

  // Wallet operations
  static async createWalletTransaction(transactionData: Tables['wallet_transactions']['Insert']) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert(transactionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserWalletTransactions(userId: string) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateUserWalletBalance(userId: string, amount: number, type: 'credit' | 'debit') {
    // Get current balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError

    const newBalance = type === 'credit' 
      ? user.wallet_balance + amount 
      : user.wallet_balance - amount

    if (newBalance < 0) {
      throw new Error('Insufficient wallet balance')
    }

    const { data, error } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Favorites operations
  static async addToFavorites(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async removeFromFavorites(userId: string, productId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    
    if (error) throw error
  }

  static async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        products (
          *,
          categories (name, icon, color)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Promo codes operations
  static async getActivePromoCodes() {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getPromoCodeByCode(code: string) {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    if (error) throw error
    return data
  }

  static async usePromoCode(promoCodeId: string, userId: string, orderId: string, discountAmount: number) {
    // Record usage
    const { error: usageError } = await supabase
      .from('promo_code_usage')
      .insert({
        promo_code_id: promoCodeId,
        user_id: userId,
        order_id: orderId,
        discount_amount: discountAmount
      })
    
    if (usageError) throw usageError

    // Increment used count
    const { error: updateError } = await supabase
      .rpc('increment_promo_usage', { promo_id: promoCodeId })
    
    if (updateError) throw updateError
  }

  // Notifications operations
  static async createNotification(notificationData: Tables['notifications']['Insert']) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}