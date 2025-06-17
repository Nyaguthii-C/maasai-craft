import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, CreditCard, Smartphone } from "lucide-react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { createFlutterwaveConfig, verifyPayment, sendPaymentNotification, PaymentData } from '@/services/flutterwaveService';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number, selectedSize: string) => void;
  onUpdateQuantity: (id: number, selectedSize: string, quantity: number) => void;
}

const Cart = ({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }: CartProps) => {
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [customerDetails, setCustomerDetails] = useState({
    email: '',
    phone: '',
    name: '',
    address: ''
  });

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  // Flutterwave configuration
  const paymentData: PaymentData = {
    items,
    total,
    customerDetails,
    paymentMethod: 'card' // This will be updated based on button clicked
  };

  const config = createFlutterwaveConfig(paymentData);
  const handleFlutterPayment = useFlutterwave(config);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }
    setCheckoutStep('details');
  };

  const handleProceedToPayment = () => {
    if (!customerDetails.email || !customerDetails.phone || !customerDetails.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number for M-Pesa (Kenyan format)
    const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
    if (!phoneRegex.test(customerDetails.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number for M-Pesa payments.",
        variant: "destructive"
      });
      return;
    }

    setCheckoutStep('payment');
  };

  const handlePayment = async (method: 'mpesa' | 'card') => {
    setIsCheckingOut(true);

    const updatedPaymentData = { ...paymentData, paymentMethod: method };
    const updatedConfig = createFlutterwaveConfig(updatedPaymentData);

    handleFlutterPayment({
      ...updatedConfig,
      callback: async (response) => {
        console.log('Payment response:', response);
        closePaymentModal();

        if (response.status === 'successful') {
          try {
            // Verify payment
            const verification = await verifyPayment(response.transaction_id);
            
            if (verification.status === 'success' && verification.data.status === 'successful') {
              // Send SMS notification
              await sendPaymentNotification(
                customerDetails.phone,
                total,
                response.tx_ref
              );

              toast({
                title: "Payment Successful!",
                description: `Your order has been placed successfully. Payment method: ${method.toUpperCase()}. You will receive an SMS confirmation shortly.`,
              });

              // Reset cart and close
              setCheckoutStep('cart');
              setCustomerDetails({ email: '', phone: '', name: '', address: '' });
              onClose();
            } else {
              toast({
                title: "Payment verification failed",
                description: "Please contact support if money was deducted.",
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment verification error",
              description: "Please contact support to confirm your payment status.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Payment failed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive"
          });
        }
        setIsCheckingOut(false);
      },
      onClose: () => {
        console.log('Payment modal closed');
        setIsCheckingOut(false);
      },
    });
  };

  const resetCart = () => {
    setCheckoutStep('cart');
    setCustomerDetails({ email: '', phone: '', name: '', address: '' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-md sm:max-w-lg p-4 sm:p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-maasai-black text-lg sm:text-xl">
            {checkoutStep === 'cart' && 'Shopping Cart'}
            {checkoutStep === 'details' && 'Customer Details'}
            {checkoutStep === 'payment' && 'Payment'}
          </SheetTitle>
          <SheetDescription className="text-sm">
            {checkoutStep === 'cart' && `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
            {checkoutStep === 'details' && 'Please provide your contact information'}
            {checkoutStep === 'payment' && 'Choose your payment method'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
          <div className="flex-1 overflow-y-auto">
            {checkoutStep === 'cart' && (
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-maasai-black-light">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-maasai-black text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-maasai-black-light">Size: {item.selectedSize}</p>
                        <p className="font-semibold text-maasai-gold text-sm sm:text-base">KSh {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0"
                        >
                          <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0"
                        >
                          <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {checkoutStep === 'details' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    placeholder="0712345678 or +254712345678"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for M-Pesa payments and SMS notifications</p>
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm">Delivery Address</Label>
                  <Input
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    placeholder="Enter your delivery address"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-maasai-black mb-2">Choose Payment Method</h3>
                  <p className="text-maasai-black-light text-sm sm:text-base">Total: KSh {total.toLocaleString()}</p>
                </div>
                
                <Button
                  onClick={() => handlePayment('mpesa')}
                  disabled={isCheckingOut}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 sm:py-6"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {isCheckingOut ? 'Processing...' : 'Pay with M-Pesa'}
                </Button>
                
                <Button
                  onClick={() => handlePayment('card')}
                  disabled={isCheckingOut}
                  className="w-full bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white py-4 sm:py-6"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isCheckingOut ? 'Processing...' : 'Pay with Card'}
                </Button>
                
                <p className="text-xs sm:text-sm text-maasai-black-light text-center mt-4">
                  Secure payment powered by Flutterwave
                  <br />
                  You will receive SMS confirmation after successful payment
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4 mt-4 bg-white">
            {checkoutStep === 'cart' && items.length > 0 && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `KSh ${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-maasai-black hover:bg-maasai-black-light text-maasai-white py-3"
                >
                  Checkout
                </Button>
              </>
            )}

            {checkoutStep === 'details' && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={resetCart}
                  className="flex-1 py-3"
                >
                  Back to Cart
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white py-3"
                >
                  Continue
                </Button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <Button
                variant="outline"
                onClick={() => setCheckoutStep('details')}
                className="w-full py-3"
              >
                Back to Details
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
