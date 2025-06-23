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

            WhatsApp Chat Button
            <a
              href="https://wa.me/254700000000?text=Hi%20I'm%20interested%20in%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M20.52 3.48A11.76 11.76 0 0012.02 0C5.36 0 .07 6.21 1.36 12.71l-1.35 4.9 5.03-1.33c1.55.79 3.28 1.22 5.02 1.22 6.65 0 11.94-6.21 10.66-12.71a11.66 11.66 0 00-3.2-4.31zm-8.49 17.58c-1.6 0-3.18-.43-4.58-1.25l-.33-.2-2.98.78.8-2.9-.22-.3a9.65 9.65 0 01-1.74-5.48c0-5.29 4.31-9.6 9.61-9.6 2.56 0 4.96 1 6.76 2.81a9.56 9.56 0 012.85 6.76c.01 5.29-4.3 9.6-9.6 9.6zm5.52-7.24c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.23-.64.08a7.9 7.9 0 01-2.33-1.44 8.6 8.6 0 01-1.6-1.99c-.17-.3-.02-.46.13-.6.13-.13.3-.34.46-.51.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.54-.07-.17-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51h-.56c-.18 0-.46.07-.7.34s-.91.89-.91 2.17c0 1.27.93 2.5 1.06 2.67.13.17 1.82 2.87 4.41 4.02 2.59 1.15 2.59.77 3.06.73.47-.04 1.5-.6 1.71-1.17.2-.57.2-1.05.15-1.17-.04-.12-.3-.2-.6-.34z" />
              </svg>
            </a>

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