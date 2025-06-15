// Backend API endpoint to verify Paystack payments
// This would typically be deployed to Vercel, Netlify Functions, or your backend server

const PAYSTACK_SECRET_KEY = 'sk_live_dbb5ce0d33d0e4c4f2bf81c3ce2c436ccf7103bc'; // Your live secret key

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference, orderId, userId } = req.body;

    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment reference is required' 
      });
    }

    // Verify payment with Paystack
    const verificationResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verificationData = await verificationResponse.json();

    if (!verificationResponse.ok) {
      return res.status(400).json({
        success: false,
        error: 'Failed to verify payment with Paystack',
        details: verificationData
      });
    }

    const { data: transaction } = verificationData;

    // Check if payment was successful
    if (transaction.status !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Payment was not successful',
        status: transaction.status
      });
    }

    // Additional verification checks
    const verificationChecks = {
      amountMatches: true, // You would verify the amount matches your order
      currencyMatches: transaction.currency === 'NGN',
      referenceValid: transaction.reference === reference,
      notAlreadyProcessed: true, // Check if this payment hasn't been processed before
    };

    if (!Object.values(verificationChecks).every(check => check)) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed security checks',
        checks: verificationChecks
      });
    }

    // Log successful payment for audit trail
    console.log('Payment verified successfully:', {
      reference: transaction.reference,
      amount: transaction.amount / 100, // Convert from kobo
      email: transaction.customer.email,
      orderId,
      userId,
      timestamp: new Date().toISOString()
    });

    // Here you would typically:
    // 1. Update order status in your database
    // 2. Send confirmation email to customer
    // 3. Trigger order fulfillment process
    // 4. Update inventory if needed

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      transaction: {
        reference: transaction.reference,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        status: transaction.status,
        paidAt: transaction.paid_at,
        customer: {
          email: transaction.customer.email,
          customerCode: transaction.customer.customer_code
        },
        channel: transaction.channel,
        fees: transaction.fees / 100
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during payment verification',
      details: error.message
    });
  }
}