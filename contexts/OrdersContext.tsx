import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, CartItem, Address } from '@/types';

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: CartItem[], deliveryAddress: Address, paymentMethod: string, specialInstructions?: string, payForMeLink?: string, paymentReference?: string) => Promise<string>;
  addCustomOrder: (orderData: any) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getActiveOrders: () => Order[];
  getOrderHistory: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        setOrders(JSON.parse(ordersData));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = async (newOrders: Order[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addOrder = async (
    items: CartItem[], 
    deliveryAddress: Address, 
    paymentMethod: string,
    specialInstructions?: string,
    payForMeLink?: string,
    paymentReference?: string
  ): Promise<string> => {
    const orderId = `LX${Date.now().toString().slice(-6)}`;
    
    const subtotal = items.reduce((total, item) => {
      const price = item.selectedVariation ? item.selectedVariation.price : item.product.currentPrice;
      return total + (price * item.quantity);
    }, 0);
    
    const deliveryFee = getDeliveryFee(deliveryAddress);
    const serviceFee = Math.round(subtotal * 0.01);
    const total = subtotal + deliveryFee + serviceFee;

    const newOrder: Order = {
      id: orderId,
      userId: 'current-user', // In real app, get from auth context
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      status: 'pending',
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      createdAt: new Date(),
      estimatedDelivery: getEstimatedDelivery(deliveryAddress),
      payForMeLink,
      paymentReference,
      trackingSteps: [
        { step: 'Order Placed', completed: true, time: new Date().toLocaleTimeString(), current: false },
        { step: 'Shopping for Items', completed: false, time: '', current: true },
        { step: 'Items Purchased', completed: false, time: '', current: false },
        { step: 'Out for Delivery', completed: false, time: '', current: false },
        { step: 'Delivered', completed: false, time: '', current: false },
      ],
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    await saveOrders(updatedOrders);
    
    return orderId;
  };

  const addCustomOrder = async (orderData: any): Promise<string> => {
    const orderId = `CB${Date.now().toString().slice(-6)}`;
    
    // Create a custom order that appears in order history
    const customOrder: Order = {
      id: orderId,
      userId: 'current-user',
      items: [], // Custom orders don't have standard items
      subtotal: 0, // Will be determined later
      deliveryFee: 0, // Will be determined later
      serviceFee: 0,
      total: 0, // Will be determined later
      status: 'pending',
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: 'pending', // Will be determined later
      specialInstructions: orderData.specialInstructions,
      createdAt: new Date(),
      estimatedDelivery: 'To be confirmed',
      trackingSteps: [
        { step: 'Custom Order Received', completed: true, time: new Date().toLocaleTimeString(), current: false },
        { step: 'Reviewing Requirements', completed: false, time: '', current: true },
        { step: 'Quote Prepared', completed: false, time: '', current: false },
        { step: 'Shopping for Items', completed: false, time: '', current: false },
        { step: 'Delivered', completed: false, time: '', current: false },
      ],
      // Add custom order specific data
      customOrderData: {
        itemNames: orderData.itemNames,
        quantity: orderData.quantity,
        description: orderData.description,
        deliveryTime: orderData.deliveryTime,
        budget: orderData.budget,
        isCustomOrder: true,
      }
    };

    const updatedOrders = [customOrder, ...orders];
    setOrders(updatedOrders);
    await saveOrders(updatedOrders);
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedTrackingSteps = [...order.trackingSteps];
        
        // Update tracking steps based on status
        switch (status) {
          case 'shopping':
            updatedTrackingSteps[0].current = false;
            updatedTrackingSteps[1].completed = true;
            updatedTrackingSteps[1].current = false;
            updatedTrackingSteps[1].time = new Date().toLocaleTimeString();
            updatedTrackingSteps[2].current = true;
            break;
          case 'purchased':
            updatedTrackingSteps[2].completed = true;
            updatedTrackingSteps[2].current = false;
            updatedTrackingSteps[2].time = new Date().toLocaleTimeString();
            updatedTrackingSteps[3].current = true;
            break;
          case 'delivery':
            updatedTrackingSteps[3].completed = true;
            updatedTrackingSteps[3].current = false;
            updatedTrackingSteps[3].time = new Date().toLocaleTimeString();
            updatedTrackingSteps[4].current = true;
            break;
          case 'delivered':
            updatedTrackingSteps[4].completed = true;
            updatedTrackingSteps[4].current = false;
            updatedTrackingSteps[4].time = new Date().toLocaleTimeString();
            break;
        }

        return {
          ...order,
          status,
          trackingSteps: updatedTrackingSteps,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      order.status !== 'delivered' && order.status !== 'cancelled'
    );
  };

  const getOrderHistory = () => {
    return orders.filter(order => 
      order.status === 'delivered' || order.status === 'cancelled'
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getDeliveryFee = (address: Address): number => {
    // Lagos delivery logic
    const lagosAreas = ['ikeja', 'victoria island', 'ikoyi', 'lekki', 'surulere', 'yaba'];
    const locationText = `${address.city} ${address.street}`.toLowerCase();
    
    if (lagosAreas.some(area => locationText.includes(area)) || 
        address.state.toLowerCase().includes('lagos')) {
      return 2000;
    }
    
    // Other Nigerian states
    const nigerianStates = [
      'abia', 'adamawa', 'akwa ibom', 'anambra', 'bauchi', 'bayelsa', 'benue',
      'borno',  'cross river', 'delta', 'ebonyi', 'edo', 'ekiti', 'enugu',
      'gombe', 'imo', 'jigawa', 'kaduna', 'kano', 'katsina', 'kebbi', 'kogi',
      'kwara', 'lagos', 'nasarawa', 'niger', 'ogun', 'ondo', 'osun', 'oyo',
      'plateau', 'rivers', 'sokoto', 'taraba', 'yobe', 'zamfara', 'fct'
    ];
    
    const isNigerian = nigerianStates.some(state => 
      address.state.toLowerCase().includes(state)
    );
    
    return isNigerian ? 4000 : 8000; // International
  };

  const getEstimatedDelivery = (address: Address): string => {
    const lagosAreas = ['ikeja', 'victoria island', 'ikoyi', 'lekki', 'surulere', 'yaba'];
    const locationText = `${address.city} ${address.street}`.toLowerCase();
    
    if (lagosAreas.some(area => locationText.includes(area)) || 
        address.state.toLowerCase().includes('lagos')) {
      const now = new Date();
      now.setHours(now.getHours() + 3); // 3 hours from now
      return now.toLocaleString();
    }
    
    const now = new Date();
    now.setDate(now.getDate() + 5); // 5 days from now
    return now.toLocaleDateString();
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      addOrder,
      addCustomOrder,
      updateOrderStatus,
      getActiveOrders,
      getOrderHistory,
      getOrderById,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}