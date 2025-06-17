
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
  const shipping = subtotal > 5000 ? 0 : 300; // Free shipping over KSh 5,000
  const total = subtotal + shipping;

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
    setCheckoutStep('payment');
  };

  const handlePayment = async (method: 'mpesa' | 'card') => {
    setIsCheckingOut(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Your order has been placed. Payment method: ${method.toUpperCase()}`,
      });
      setIsCheckingOut(false);
      setCheckoutStep('cart');
      setCustomerDetails({ email: '', phone: '', name: '', address: '' });
      onClose();
    }, 2000);
  };

  const resetCart = () => {
    setCheckoutStep('cart');
    setCustomerDetails({ email: '', phone: '', name: '', address: '' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-maasai-black">
            {checkoutStep === 'cart' && 'Shopping Cart'}
            {checkoutStep === 'details' && 'Customer Details'}
            {checkoutStep === 'payment' && 'Payment'}
          </SheetTitle>
          <SheetDescription>
            {checkoutStep === 'cart' && `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
            {checkoutStep === 'details' && 'Please provide your contact information'}
            {checkoutStep === 'payment' && 'Choose your payment method'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {checkoutStep === 'cart' && (
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-maasai-black-light">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-4 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-maasai-black">{item.name}</h4>
                        <p className="text-sm text-maasai-black-light">Size: {item.selectedSize}</p>
                        <p className="font-semibold text-maasai-gold">KSh {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {checkoutStep === 'details' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    placeholder="Enter your delivery address"
                  />
                </div>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-maasai-black mb-2">Choose Payment Method</h3>
                  <p className="text-maasai-black-light">Total: KSh {total.toLocaleString()}</p>
                </div>
                
                <Button
                  onClick={() => handlePayment('mpesa')}
                  disabled={isCheckingOut}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
                >
                  {isCheckingOut ? 'Processing...' : 'Pay with M-Pesa'}
                </Button>
                
                <Button
                  onClick={() => handlePayment('card')}
                  disabled={isCheckingOut}
                  className="w-full bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white py-6"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isCheckingOut ? 'Processing...' : 'Pay with Card'}
                </Button>
                
                <p className="text-sm text-maasai-black-light text-center mt-4">
                  Secure payment powered by Flutterwave
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-4 space-y-4">
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
                  className="w-full bg-maasai-black hover:bg-maasai-black-light text-maasai-white"
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
                  className="flex-1"
                >
                  Back to Cart
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white"
                >
                  Continue
                </Button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <Button
                variant="outline"
                onClick={() => setCheckoutStep('details')}
                className="w-full"
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
