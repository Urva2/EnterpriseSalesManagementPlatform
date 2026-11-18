import api from './api';

/**
 * Payment Service - API abstraction for payment operations
 */
export const paymentService = {
  /**
   * Fetch all orders (Admin or Salesperson)
   */
  async getOrders(role = 'ADMIN') {
    try {
      const endpoint = role === 'ADMIN' ? '/orders/viewOrders?size=100' : '/orders/my-orders';
      const response = await api.get(endpoint);
      return response.data?.content || response.data || [];
    } catch (error) {
      console.error('Error fetching orders for payments:', error);
      throw error;
    }
  },

  /**
   * Fetch payments for a specific order
   */
  async getPaymentsByOrderId(orderId) {
    try {
      const response = await api.get(`/payments/orders/${orderId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching payments for order #${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Fetch payment summary for an order (total, paid, remaining, status)
   */
  async getOrderPaymentSummary(orderId) {
    try {
      const response = await api.get(`/payments/orders/${orderId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment summary for order #${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Record a new manual payment (Cash, UPI, Card)
   */
  async recordPayment(orderId, paymentData) {
    try {
      const payload = {
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod, // 'CASH' | 'UPI' | 'CARD'
        transactionReference: paymentData.transactionReference || '',
        remarks: paymentData.remarks || ''
      };
      const response = await api.post(`/payments/orders/${orderId}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error recording payment for order #${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Process refund on an existing payment
   */
  async refundPayment(paymentId, reason = '') {
    try {
      const url = `/payments/${paymentId}/refund${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`;
      const response = await api.post(url);
      return response.data;
    } catch (error) {
      console.error(`Error refunding payment #${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Aggregate all payments across orders
   */
  async getAllPayments(orders = []) {
    try {
      const paymentPromises = orders.map(async (order) => {
        try {
          const payments = await this.getPaymentsByOrderId(order.id);
          return payments.map(p => ({
            ...p,
            customerName: order.customerName || order.customer?.name || 'Customer',
            orderTotal: order.total || p.orderTotal || 0,
            orderDate: order.date
          }));
        } catch {
          return [];
        }
      });
      const results = await Promise.all(paymentPromises);
      const flattened = results.flat();
      // Sort newest first
      return flattened.sort((a, b) => new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0));
    } catch (error) {
      console.error('Error aggregating payments:', error);
      return [];
    }
  }
};

export default paymentService;

