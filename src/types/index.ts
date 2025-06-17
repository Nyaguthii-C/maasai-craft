
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sizes: string[];
  inStock: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  customerEmail: string;
  paymentMethod: 'mpesa' | 'card';
}
