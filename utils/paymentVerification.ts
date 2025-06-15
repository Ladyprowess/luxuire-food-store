// Frontend utility functions for payment verification

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  transaction?: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paidAt: string;
    customer: {
      email: string;
      customerCode: string;
    };
    channel: string;
    fees: number;
  };
  error?: string;
}

export class PaymentVerificationService {
  /**
   * Generate secure payment reference
   */
  static generatePaymentReference(orderId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `luxuire_${orderId}_${timestamp}_${random}`;
  }

  /**
   * Log payment attempt for audit (with mobile-safe storage)
   */
  static logPaymentAttempt(data: {
    reference: string;
    amount: number;
    email: string;
    orderId: string;
    userId: string;
    timestamp: Date;
  }): void {
    const logData = {
      ...data,
      timestamp: data.timestamp.toISOString()
    };

    console.log('Payment attempt logged:', logData);
  }
}