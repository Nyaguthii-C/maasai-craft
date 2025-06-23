// flutterwaveService.ts

import { CartItem } from '@/types';

const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-xxxxxxxxxxxxx-X';
const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-xxxxxxxxxxxxx-X';

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
      logo: 'https://your-logo-url.com/logo.png',
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
};

export const verifyPayment = async (transactionId: string | number) => {
  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
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






// import { FlutterWaveInit } from 'flutterwave-react-native';
// import { CartItem } from '@/types';

// const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST--X';
// const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST--X';

// export interface PaymentData {
//   items: CartItem[];
//   total: number;
//   customerDetails: {
//     email: string;
//     phone: string;
//     name: string;
//     address?: string;
//   };
//   paymentMethod: 'mpesa' | 'card';
// }

// export const createFlutterwaveConfig = (paymentData: PaymentData): FlutterWaveInit => {
//   const { items, total, customerDetails, paymentMethod } = paymentData;

//   return {
//     public_key: FLUTTERWAVE_PUBLIC_KEY,
//     tx_ref: `MC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//     amount: total, // ✅ remains a number
//     currency: 'KES',
//     payment_options: paymentMethod === 'mpesa' ? 'mobilemoneykenya' : 'card',
//     customer: {
//       email: customerDetails.email,
//       phone_number: customerDetails.phone,
//       name: customerDetails.name,
//     },
//     customizations: {
//       title: 'Maasai Craft',
//       description: `Payment for ${items.length} item(s)`,
//       logo: 'https://your-logo-url.com/logo.png',
//     },
//     meta: {
//       order_items: items.map(item => ({
//         id: item.id,
//         name: item.name,
//         size: item.selectedSize,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       delivery_address: customerDetails.address || 'Not provided',
//     }
//   };
// };

// export const verifyPayment = async (transactionId: string | number) => {
//   try {
//     const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return await response.json();
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     throw error;
//   }
// };

// export const sendPaymentNotification = async (phoneNumber: string, amount: number, transactionRef: string) => {
//   try {
//     console.log(`SMS sent to ${phoneNumber}: Payment of KSh ${amount} successful. Ref: ${transactionRef}`);
//     return true;
//   } catch (error) {
//     console.error('SMS notification error:', error);
//     return false;
//   }
// };

