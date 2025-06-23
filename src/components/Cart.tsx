
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, CreditCard, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import {
  createFlutterwaveConfig,
  sendPaymentNotification,
  PaymentData
} from "@/services/flutterwaveService";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number, selectedSize: string) => void;
  onUpdateQuantity: (id: number, selectedSize: string, quantity: number) => void;
}

const Cart = ({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }: CartProps) => {
  const { toast } = useToast();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [customerDetails, setCustomerDetails] = useState({
    email: '',
    phone: '',
    name: '',
    address: ''
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items before checking out.",
        variant: "destructive"
      });
      return;
    }
    setCheckoutStep('details');
  };

  const handleProceedToPayment = () => {
    const { email, phone, name } = customerDetails;
    if (!email || !phone || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Enter a valid Kenyan phone number.",
        variant: "destructive"
      });
      return;
    }

    setCheckoutStep('payment');
  };

  const handlePayment = async (method: 'mpesa' | 'card') => {
    setIsCheckingOut(true);

    const paymentData: PaymentData = {
      items,
      total,
      customerDetails,
      paymentMethod: method
    };

    const config = createFlutterwaveConfig(paymentData);
    console.log("Flutterwave Config:", config);
    const triggerFlutterwave = useFlutterwave(config);

    triggerFlutterwave({
      callback: async (response) => {
        closePaymentModal();

        if (response.status === 'successful') {
          try {
            // verifyPayment function calling Supabase edge function
            const result = await fetch('https://vgnvqmunurawbtwvmmgt.supabase.co/functions/v1/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ transaction_id: response.transaction_id })
            }).then(res => res.json());

            if (result.status === 'success' && result.data.status === 'successful') {
              await sendPaymentNotification(customerDetails.phone, total, response.tx_ref);
              toast({
                title: "Payment Successful!",
                description: "You will receive an SMS confirmation shortly."
              });
              setCheckoutStep('cart');
              setCustomerDetails({ email: '', phone: '', name: '', address: '' });
              onClose();
            } else {
              toast({
                title: "Verification Failed",
                description: "Contact support if payment was deducted.",
                variant: "destructive"
              });
            }
          } catch (err) {
            toast({
              title: "Verification Error",
              description: "Please contact support.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Payment Failed",
            description: "Try again or use a different method.",
            variant: "destructive"
          });
        }

        setIsCheckingOut(false);
      },
      onClose: () => {
        console.log('Payment modal closed');
        setIsCheckingOut(false);
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {checkoutStep === 'cart' ? 'Cart' :
              checkoutStep === 'details' ? 'Customer Details' :
                'Payment'}
          </SheetTitle>
          <SheetDescription>
            {checkoutStep === 'cart' && `${items.length} item(s) in your cart`}
            {checkoutStep === 'details' && `Please provide your contact info`}
            {checkoutStep === 'payment' && `Total: KSh ${total.toLocaleString()}`}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="my-4">
          {checkoutStep === 'cart' && (
            <div>
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between border-b py-2">
                  <div>
                    <p>{item.name} (Size: {item.selectedSize})</p>
                    <p>KSh {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    <Button size="sm" onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}>-</Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button size="sm" onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</Button>
                    <Button size="sm" variant="ghost" onClick={() => onRemoveItem(item.id, item.selectedSize)}><Trash2 /></Button>
                  </div>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="text-right font-semibold">
                Total: KSh {total.toLocaleString()}
              </div>
              <Button className="w-full mt-4" onClick={handleCheckout}>Checkout</Button>
            </div>
          )}

          {checkoutStep === 'details' && (
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input value={customerDetails.name} onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
              </div>
              <div>
                <Label>Address (optional)</Label>
                <Input value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} />
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setCheckoutStep('cart')}>Back</Button>
                <Button onClick={handleProceedToPayment}>Continue</Button>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <Button className="w-full bg-green-600 text-white" onClick={() => handlePayment('mpesa')} disabled={isCheckingOut}>
                <Smartphone className="mr-2 w-4 h-4" />
                {isCheckingOut ? "Processing..." : "Pay with M-Pesa"}
              </Button>
              <Button className="w-full bg-yellow-600 text-white" onClick={() => handlePayment('card')} disabled={isCheckingOut}>
                <CreditCard className="mr-2 w-4 h-4" />
                {isCheckingOut ? "Processing..." : "Pay with Card"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setCheckoutStep('details')}>Back</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
