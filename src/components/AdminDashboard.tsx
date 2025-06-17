import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users, Plus, Minus, Trash2 } from "lucide-react";
import { Product, Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
}

const AdminDashboard = ({ isOpen, onClose, products, orders }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    sizes: [''],
    inStock: 0,
    image: ''
  });

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 },
  ];

  const categoryData = [
    { name: 'Kiondos', value: 35, color: '#D4AF37' },
    { name: 'Sandals', value: 25, color: '#1a1a1a' },
    { name: 'Jewelry', value: 30, color: '#F5E6A8' },
    { name: 'Keychains', value: 10, color: '#B8941F' },
  ];

  const totalRevenue = 284000;
  const totalOrders = 156;
  const totalProducts = products.length;
  const totalCustomers = 89;

  const handleAddProduct = () => {
    // In a real app, this would make an API call
    toast({
      title: "Product added",
      description: "New product has been added successfully.",
    });
    setNewProduct({
      name: '',
      price: 0,
      category: '',
      description: '',
      sizes: [''],
      inStock: 0,
      image: ''
    });
  };

  const handleStockChange = (productId: number, change: number) => {
    // In a real app, this would make an API call to update stock
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStock = Math.max(0, product.inStock + change);
      toast({
        title: "Stock updated",
        description: `${product.name} stock ${change > 0 ? 'increased' : 'decreased'} to ${newStock}`,
      });
    }
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...newProduct.sizes];
    newSizes[index] = value;
    setNewProduct({ ...newProduct, sizes: newSizes });
  };

  const addSizeField = () => {
    setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, ''] });
  };

  const removeSizeField = (index: number) => {
    const newSizes = newProduct.sizes.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, sizes: newSizes });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle className="text-maasai-black">Admin Dashboard</SheetTitle>
          <SheetDescription>
            Manage your Maasai Craft store
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 h-full overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-maasai-gold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-maasai-gold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-maasai-gold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground">Active products</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="h-4 w-4 text-maasai-gold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((order) => (
                      <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Order #{order}001</p>
                          <p className="text-sm text-muted-foreground">customer{order}@example.com</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KSh {(2500 * order).toLocaleString()}</p>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Product Management</h3>
                <Button className="bg-maasai-gold hover:bg-maasai-gold-dark text-maasai-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>Add a new product to your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (KSh)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value})}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kiondos">Kiondos</SelectItem>
                          <SelectItem value="Sandals">Sandals</SelectItem>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                          <SelectItem value="Keychains">Keychains</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock Quantity</Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={newProduct.inStock}
                        onChange={(e) => setNewProduct({...newProduct, inStock: Number(e.target.value)})}
                        placeholder="Enter stock quantity"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description"
                    />
                  </div>
                  
                  <div>
                    <Label>Sizes</Label>
                    {newProduct.sizes.map((size, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={size}
                          onChange={(e) => handleSizeChange(index, e.target.value)}
                          placeholder="Enter size"
                        />
                        {newProduct.sizes.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSizeField(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSizeField}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Size
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="productImage">Image URL</Label>
                    <Input
                      id="productImage"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="Enter image URL"
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddProduct}
                    className="w-full bg-maasai-black hover:bg-maasai-black-light text-maasai-white"
                  >
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="font-semibold text-maasai-gold">KSh {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {product.inStock} in stock
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStockChange(product.id, -1)}
                            disabled={product.inStock === 0}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStockChange(product.id, 1)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders yet. Orders will appear here when customers make purchases.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#D4AF37" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminDashboard;
