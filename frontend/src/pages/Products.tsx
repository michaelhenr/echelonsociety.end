import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/api';
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import bgLogo5 from "@/assets/bg-logo-5.jpg";
import bgLogo6 from "@/assets/bg-logo-6.jpg";
import bgLogo7 from "@/assets/bg-logo-7.jpg";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string; // Required - comes from database only
  brand_id: string;
  brands?: { name: string };
}

/**
 * Products page with search, filtering, and cart functionality
 */
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.fetchProducts();
        // Use products directly from database - no hardcoded image mapping
        // All images must come from database image_url field
        const productsList = data || [];
        // Log products to verify image_url is present
        productsList.forEach((product: any) => {
          if (!product.image_url) {
            console.warn(`⚠️ Product "${product.name}" (ID: ${product._id || product.id}) is missing image_url in database`);
          } else {
            console.log(`✅ Product "${product.name}" has image_url:`, product.image_url);
          }
        });
        setProducts(productsList);
        setFilteredProducts(productsList);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    load();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (brandFilter !== "all") {
      filtered = filtered.filter((p) => p.brands?.name === brandFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, brandFilter, products]);

  const addToCart = (productId: string) => {
    const newCart = new Map(cart);
    // Use _id or id as the key - ensure we use the same format
    const key = productId;
    newCart.set(key, (newCart.get(key) || 0) + 1);
    setCart(newCart);
    
    toast({
      title: "Added to Cart",
      description: "Product added successfully",
    });
  };

  const goToCheckout = () => {
    if (cart.size === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add some products to your cart first",
        variant: "destructive",
      });
      return;
    }
    // Convert Map to object for state serialization
    const cartObj = Object.fromEntries(cart);
    navigate("/checkout", { state: { cart: cartObj, products: filteredProducts } });
  };

  const getCartCount = () => {
    return Array.from(cart.values()).reduce((sum, count) => sum + count, 0);
  };

  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo5}), url(${bgLogo6}), url(${bgLogo7})`, backgroundBlendMode: 'overlay' }}
      >
        <div className="bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Our Collection</h1>
          {getCartCount() > 0 && (
            <Button onClick={() => {
              const cartObj = Object.fromEntries(cart);
              navigate("/checkout", { state: { cart: cartObj, products: filteredProducts } });
            }}>
              View Cart ({getCartCount()})
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="Search by product or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Sport Accessories">Sport Accessories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Home & Decor">Home & Decor</SelectItem>
              <SelectItem value="Unique Items">Unique Items</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Echelon Society">Echelon Society</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id || Math.random()}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;