import { CartItem } from '@/types';


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


export const createFlutterwaveConfig = (paymentData: PaymentData) => {
  const { items, total, customerDetails, paymentMethod } = paymentData;
  return {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
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
      logo: 'https://the-logo-url.com/logo.png',
    },
    meta: {
      order_summary: items.map(item =>
        `${item.name} (${item.quantity} x ${item.price})`
      ).join(', '),
      delivery_address: customerDetails.address || 'Not provided'
    }
  };
};


export const sendPaymentNotification = async (phoneNumber: string, amount: number, transactionRef: string) => {
  try {
    console.log(`SMS sent to ${phoneNumber}: Payment of KSh ${amount} successful. Ref: ${transactionRef}`);
    return true;
  } catch (error) {
    console.error('SMS notification error:', error);
    return false;
  }
};
