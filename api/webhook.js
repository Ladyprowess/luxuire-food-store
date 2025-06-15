// Paystack webhook endpoint to handle payment notifications
// This ensures you're notified of all payment events in real-time

const crypto = require('crypto');
const PAYSTACK_SECRET_KEY = 'sk_live_dbb5ce0d33d0e4c4f2bf81c3ce2c436ccf7103bc'; // Your live secret key

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    const signature = req.headers['x-paystack-signature'];

    if (hash !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;
      
      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;
      
      case 'transfer.success':
        await handleSuccessfulTransfer(event.data);
        break;
      
      case 'transfer.failed':
        await handleFailedTransfer(event.data);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleSuccessfulPayment(transaction) {
  console.log('Processing successful payment:', {
    reference: transaction.reference,
    amount: transaction.amount / 100,
    email: transaction.customer.email,
    timestamp: new Date().toISOString()
  });

  // Here you would:
  // 1. Update order status to 'paid'
  // 2. Send confirmation email
  // 3. Trigger order fulfillment
  // 4. Update user's order history
  // 5. Send push notification if applicable

  // Example: Send email notification
  await sendEmailNotification('payment_success', {
    customerEmail: transaction.customer.email,
    amount: transaction.amount / 100,
    reference: transaction.reference,
    orderId: extractOrderIdFromReference(transaction.reference)
  });
}

async function handleFailedPayment(transaction) {
  console.log('Processing failed payment:', {
    reference: transaction.reference,
    amount: transaction.amount / 100,
    email: transaction.customer.email,
    failureReason: transaction.gateway_response,
    timestamp: new Date().toISOString()
  });

  // Handle failed payment
  // 1. Update order status to 'payment_failed'
  // 2. Send failure notification
  // 3. Optionally retry payment or offer alternative
}

async function handleSuccessfulTransfer(transfer) {
  console.log('Processing successful transfer:', {
    reference: transfer.reference,
    amount: transfer.amount / 100,
    recipient: transfer.recipient.name,
    timestamp: new Date().toISOString()
  });

  // Handle successful payout (e.g., to vendors, referral payments)
}

async function handleFailedTransfer(transfer) {
  console.log('Processing failed transfer:', {
    reference: transfer.reference,
    amount: transfer.amount / 100,
    recipient: transfer.recipient.name,
    failureReason: transfer.failure_reason,
    timestamp: new Date().toISOString()
  });

  // Handle failed payout
}

function extractOrderIdFromReference(reference) {
  // Extract order ID from payment reference
  // Assuming format: luxuire_orderId_timestamp_random
  const parts = reference.split('_');
  return parts.length > 1 ? parts[1] : null;
}

async function sendEmailNotification(type, data) {
  // Implement email notification logic
  // This could use SendGrid, Mailgun, or your preferred email service
  console.log(`Sending ${type} email notification:`, data);
}