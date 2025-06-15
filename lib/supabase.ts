import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic session refresh for better mobile performance
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types (auto-generated from your schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          name: string
          profile_image: string | null
          preferred_payment_method: 'online' | 'cash' | 'wallet'
          wallet_balance: number
          default_address_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          name: string
          profile_image?: string | null
          preferred_payment_method?: 'online' | 'cash' | 'wallet'
          wallet_balance?: number
          default_address_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          name?: string
          profile_image?: string | null
          preferred_payment_method?: 'online' | 'cash' | 'wallet'
          wallet_balance?: number
          default_address_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          street: string
          city: string
          state: string
          is_default: boolean
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          street: string
          city: string
          state: string
          is_default?: boolean
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          street?: string
          city?: string
          state?: string
          is_default?: boolean
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category_id: string
          unit: string
          price_range: string
          current_price: number
          image: string
          images: any
          rating: number
          in_stock: boolean
          fresh: boolean
          description: string | null
          attributes: any
          tags: string[]
          related_products: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id: string
          unit: string
          price_range: string
          current_price: number
          image: string
          images?: any
          rating?: number
          in_stock?: boolean
          fresh?: boolean
          description?: string | null
          attributes?: any
          tags?: string[]
          related_products?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string
          unit?: string
          price_range?: string
          current_price?: number
          image?: string
          images?: any
          rating?: number
          in_stock?: boolean
          fresh?: boolean
          description?: string | null
          attributes?: any
          tags?: string[]
          related_products?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          subtotal: number
          delivery_fee: number
          service_fee: number
          total: number
          status: 'pending' | 'shopping' | 'purchased' | 'delivery' | 'delivered' | 'cancelled'
          payment_method: string
          payment_reference: string | null
          delivery_address: any
          special_instructions: string | null
          estimated_delivery: string | null
          agent_name: string | null
          agent_phone: string | null
          pay_for_me_link: string | null
          custom_order_data: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          subtotal?: number
          delivery_fee?: number
          service_fee?: number
          total?: number
          status?: 'pending' | 'shopping' | 'purchased' | 'delivery' | 'delivered' | 'cancelled'
          payment_method: string
          payment_reference?: string | null
          delivery_address: any
          special_instructions?: string | null
          estimated_delivery?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          pay_for_me_link?: string | null
          custom_order_data?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subtotal?: number
          delivery_fee?: number
          service_fee?: number
          total?: number
          status?: 'pending' | 'shopping' | 'purchased' | 'delivery' | 'delivered' | 'cancelled'
          payment_method?: string
          payment_reference?: string | null
          delivery_address?: any
          special_instructions?: string | null
          estimated_delivery?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          pay_for_me_link?: string | null
          custom_order_data?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          reference: string
          amount: number
          currency: string
          status: 'pending' | 'success' | 'failed' | 'cancelled'
          payment_method: string
          gateway: string
          gateway_response: any
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          reference: string
          amount: number
          currency?: string
          status?: 'pending' | 'success' | 'failed' | 'cancelled'
          payment_method: string
          gateway?: string
          gateway_response?: any
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          reference?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'success' | 'failed' | 'cancelled'
          payment_method?: string
          gateway?: string
          gateway_response?: any
          verified_at?: string | null
          created_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          description: string
          reference: string | null
          status: 'pending' | 'completed' | 'failed'
          related_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          description: string
          reference?: string | null
          status?: 'pending' | 'completed' | 'failed'
          related_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'credit' | 'debit'
          amount?: number
          description?: string
          reference?: string | null
          status?: 'pending' | 'completed' | 'failed'
          related_payment_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}