import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cart from "@/components/Cart";
import { Product, CartItem } from "@/types";

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      name: "Traditional Kiondo - Medium",
      price: 1800,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      category: "Kiondos",
      description: "Hand-woven medium sisal basket perfect for shopping",
      sizes: ["Medium"],
      inStock: 20
    },
    {
      id: 3,
      name: "Traditional Kiondo - Small",
      price: 1200,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      category: "Kiondos",
      description: "Compact sisal basket for everyday use",
      sizes: ["Small"],
      inStock: 25
    },
    {
      id: 4,
      name: "Maasai Leather Sandals - Men",
      price: 3200,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      category: "Sandals",
      description: "Authentic Maasai leather sandals handcrafted for men",
      sizes: ["40", "41", "42", "43", "44", "45"],
      inStock: 12
    },
    {
      id: 5,
      name: "Maasai Leather Sandals - Women",
      price: 2800,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      category: "Sandals",
      description: "Elegant Maasai leather sandals for women",
      sizes: ["36", "37", "38", "39", "40", "41"],
      inStock: 18
    },
    {
      id: 6,
      name: "Beaded Maasai Necklace",
      price: 1500,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Jewelry",
      description: "Colorful traditional Maasai beaded necklace",
      sizes: ["One Size"],
      inStock: 30
    },
    {
      id: 7,
      name: "Beaded Maasai Bracelet Set",
      price: 800,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Jewelry",
      description: "Set of 3 traditional Maasai beaded bracelets",
      sizes: ["One Size"],
      inStock: 40
    },
    {
      id: 8,
      name: "Maasai Beaded Keychain - Traditional",
      price: 400,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Keychains",
      description: "Handcrafted beaded keychain with traditional patterns",
      sizes: ["One Size"],
      inStock: 50
    },
    {
      id: 9,
      name: "Maasai Warrior Shield Keychain",
      price: 600,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Keychains",
      description: "Miniature warrior shield keychain with authentic Maasai patterns",
      sizes: ["One Size"],
      inStock: 35
    },
    {
      id: 10,
      name: "Maasai Animal Spirit Keychain Set",
      price: 800,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Keychains",
      description: "Set of 3 keychains featuring lion, elephant, and buffalo designs",
      sizes: ["One Size"],
      inStock: 25
    },
    {
      id: 11,
      name: "Maasai Leather & Bead Keychain",
      price: 700,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      category: "Keychains",
      description: "Premium leather keychain with colorful Maasai beadwork",
      sizes: ["One Size"],
      inStock: 40
    }
  ];

  const addToCart = (product: Product, selectedSize: string) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.selectedSize === selectedSize);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, selectedSize, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: number, selectedSize: string) => {
    setCartItems(cartItems.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (id: number, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id && item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const categories = ["All", "Kiondos", "Sandals", "Jewelry", "Keychains"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-maasai-white">
      {/* Header */}
      <header className="bg-maasai-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-maasai-gold rounded-full flex items-center justify-center">
                <span className="text-maasai-white font-bold text-sm">MC</span>
              </div>
              <h1 className="text-2xl font-bold text-maasai-black">Maasai Craft</h1>
            </div>
            
            {/* Desktop Navigation - removed admin button */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-maasai-black hover:text-maasai-gold transition-colors">Home</a>
              <a href="#products" className="text-maasai-black hover:text-maasai-gold transition-colors">Products</a>
              <a href="#about" className="text-maasai-black hover:text-maasai-gold transition-colors">About</a>
              <a href="#contact" className="text-maasai-black hover:text-maasai-gold transition-colors">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative border-maasai-gold text-maasai-gold hover:bg-maasai-gold hover:text-maasai-white"
              >
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-maasai-gold text-maasai-white">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation - removed admin button */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-maasai-black hover:text-maasai-gold transition-colors py-2">Home</a>
                <a href="#products" className="text-maasai-black hover:text-maasai-gold transition-colors py-2">Products</a>
                <a href="#about" className="text-maasai-black hover:text-maasai-gold transition-colors py-2">About</a>
                <a href="#contact" className="text-maasai-black hover:text-maasai-gold transition-colors py-2">Contact</a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-maasai-white to-maasai-gold-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-maasai-black mb-6">
            Authentic Maasai Crafts
          </h2>
          <p className="text-xl text-maasai-black-light mb-8 max-w-2xl mx-auto">
            Discover the beauty of traditional Maasai craftsmanship. From hand-woven kiondos to beaded jewelry, 
            each piece tells a story of heritage and artistry.
          </p>
          <Button 
            size="lg" 
            className="bg-maasai-black hover:bg-maasai-black-light text-maasai-white px-8 py-3 text-lg"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-maasai-black text-center mb-12">Our Collection</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white"
                  : "border-maasai-gold text-maasai-gold hover:bg-maasai-gold hover:text-maasai-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-maasai-gold-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-bold text-maasai-black mb-8">About Maasai Craft</h3>
            <p className="text-lg text-maasai-black-light mb-6">
              We are dedicated to preserving and sharing the rich cultural heritage of the Maasai people through 
              authentic handcrafted products. Each item in our collection is carefully made by skilled artisans 
              using traditional techniques passed down through generations.
            </p>
            <p className="text-lg text-maasai-black-light">
              By purchasing from us, you're not just buying a product – you're supporting local communities 
              and helping preserve invaluable cultural traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maasai-black text-maasai-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-maasai-gold rounded-full flex items-center justify-center">
                  <span className="text-maasai-white font-bold text-sm">MC</span>
                </div>
                <h3 className="text-xl font-bold">Maasai Craft</h3>
              </div>
              <p className="text-gray-400">
                Authentic Maasai crafts made with love and tradition.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-maasai-gold transition-colors">Home</a></li>
                <li><a href="#products" className="text-gray-400 hover:text-maasai-gold transition-colors">Products</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-maasai-gold transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-maasai-gold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div id="contact">
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400 mb-2">Email: info@maasaicraft.com</p>
              <p className="text-gray-400 mb-2">Phone: +254 700 123 456</p>
              <p className="text-gray-400">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Maasai Craft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product, size: string) => void }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-maasai-gold">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-maasai-white/80 hover:bg-maasai-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-maasai-black group-hover:text-maasai-gold transition-colors">
              {product.name}
            </CardTitle>
            <CardDescription className="text-maasai-black-light">
              {product.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-maasai-gold text-maasai-gold" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-maasai-black">
            KSh {product.price.toLocaleString()}
          </span>
          <Badge variant="secondary" className="bg-maasai-gold-light text-maasai-black">
            {product.inStock} in stock
          </Badge>
        </div>
        
        {product.sizes.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-maasai-black mb-2">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-maasai-gold focus:border-maasai-gold"
            >
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        
        <Button
          onClick={() => onAddToCart(product, selectedSize)}
          className="w-full bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default Index;
