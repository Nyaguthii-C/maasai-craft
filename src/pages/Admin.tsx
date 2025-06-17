
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/AdminDashboard";
import { Product, Order } from "@/types";

// Mock admin credentials - in a real app, this would be handled by backend
const ADMIN_EMAIL = "admin@maasaicraft.com";
const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock products data for admin dashboard
  const products: Product[] = [
    {
      id: 1,
      name: "Traditional Kiondo - Large",
      price: 2500,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      category: "Kiondos",
      description: "Hand-woven large sisal basket with leather handles",
      sizes: ["Large"],
      inStock: 15
    },
    {
      id: 2,
      name: "Maasai Leather Sandals - Men",
      price: 3200,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      category: "Sandals",
      description: "Authentic Maasai leather sandals handcrafted for men",
      sizes: ["40", "41", "42", "43", "44", "45"],
      inStock: 12
    },
    {
      id: 3,
      name: "Beaded Maasai Necklace",
      price: 1500,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Jewelry",
      description: "Colorful traditional Maasai beaded necklace",
      sizes: ["One Size"],
      inStock: 30
    },
    {
      id: 4,
      name: "Maasai Beaded Keychain",
      price: 400,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Keychains",
      description: "Handcrafted beaded keychain with traditional patterns",
      sizes: ["One Size"],
      inStock: 50
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-maasai-white">
        <header className="bg-maasai-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-maasai-gold rounded-full flex items-center justify-center">
                  <span className="text-maasai-white font-bold text-sm">MC</span>
                </div>
                <h1 className="text-2xl font-bold text-maasai-black">Maasai Craft Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="border-maasai-gold text-maasai-gold hover:bg-maasai-gold hover:text-maasai-white"
                >
                  Back to Store
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <AdminDashboard
            isOpen={true}
            onClose={() => {}}
            products={products}
            orders={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maasai-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-maasai-gold rounded-full flex items-center justify-center">
              <span className="text-maasai-white font-bold text-sm">MC</span>
            </div>
            <h1 className="text-2xl font-bold text-maasai-black">Maasai Craft</h1>
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maasaicraft.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-gray-600">
            <p>Demo credentials:</p>
            <p>Email: admin@maasaicraft.com</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
