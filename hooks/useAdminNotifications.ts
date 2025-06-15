import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOrders } from '@/contexts/OrdersContext';

export function useAdminNotifications() {
  const { addNotification } = useNotifications();
  const { orders } = useOrders();
  
  // Track order status changes to generate notifications
  useEffect(() => {
    const lastOrdersJSON = localStorage.getItem('lastOrdersState');
    const lastOrders = lastOrdersJSON ? JSON.parse(lastOrdersJSON) : [];
    
    // Check for new orders
    orders.forEach(order => {
      const lastOrder = lastOrders.find((o: any) => o.id === order.id);
      
      // New order notification
      if (!lastOrder) {
        addNotification({
          title: 'New Order Placed',
          message: `Order #${order.id} has been placed and is awaiting processing.`,
          type: 'order',
          orderId: order.id,
          read: false,
        });
        return;
      }
      
      // Status change notification
      if (lastOrder && lastOrder.status !== order.status) {
        let title = '';
        let message = '';
        
        switch (order.status) {
          case 'shopping':
            title = 'Order Status Updated';
            message = `Order #${order.id} is now being shopped for.`;
            break;
          case 'purchased':
            title = 'Items Purchased';
            message = `Items for order #${order.id} have been purchased.`;
            break;
          case 'delivery':
            title = 'Order Out for Delivery';
            message = `Order #${order.id} is now out for delivery.`;
            break;
          case 'delivered':
            title = 'Order Delivered';
            message = `Order #${order.id} has been successfully delivered.`;
            break;
          case 'cancelled':
            title = 'Order Cancelled';
            message = `Order #${order.id} has been cancelled.`;
            break;
        }
        
        if (title && message) {
          addNotification({
            title,
            message,
            type: 'order',
            orderId: order.id,
            read: false,
          });
        }
      }
    });
    
    // Save current orders state for next comparison
    localStorage.setItem('lastOrdersState', JSON.stringify(orders));
  }, [orders, addNotification]);
  
  return null;
}