
import { FlutterwaveConfig } from 'flutterwave-react-v3';
import { CartItem } from '@/types';

// Add your Flutterwave API keys here
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-your-public-key-here'; // Replace with your actual public key
const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-your-secret-key-here'; // Replace with your actual secret key

export interface PaymentData {
  items: CartItem[];
  total: number;
  customerDetails: {
    email: string;
    phone: string;
    name: string;
    address?: string;
  };
  paymentMethod: 'mpesa' | 'card';
}

export const createFlutterwaveConfig = (paymentData: PaymentData): FlutterwaveConfig => {
  const { items, total, customerDetails, paymentMethod } = paymentData;
  
  const config: FlutterwaveConfig = {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `MC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: total,
    currency: 'KES',
    payment_options: paymentMethod === 'mpesa' ? 'mobilemoneykenya' : 'card',
    customer: {
      email: customerDetails.email,
      phone_number: customerDetails.phone,
      name: customerDetails.name,
    },
    customizations: {
      title: 'Maasai Craft',
      description: `Payment for ${items.length} item(s)`,
      logo: 'https://your-logo-url.com/logo.png', // Add your logo URL
    },
    meta: {
      order_items: items.map(item => ({
        id: item.id,
        name: item.name,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.price
      })),
      delivery_address: customerDetails.address || 'Not provided'
    }
  };

  return config;
};

export const verifyPayment = async (transactionId: string) => {
  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Send SMS notification (using Flutterwave's notification service)
export const sendPaymentNotification = async (phoneNumber: string, amount: number, transactionRef: string) => {
  try {
    // This would typically be handled by Flutterwave's webhook
    // For demo purposes, we'll log the notification
    console.log(`SMS Notification sent to ${phoneNumber}: Payment of KSh ${amount.toLocaleString()} successful. Ref: ${transactionRef}`);
    
    // In a real implementation, you might use Flutterwave's SMS service or integrate with Africa's Talking
    return true;
  } catch (error) {
    console.error('SMS notification error:', error);
    return false;
  }
};
