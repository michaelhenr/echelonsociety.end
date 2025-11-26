import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ProductsAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import vcrew from "@/assets/product-quarter-hoodie.jpg";
import hoodie from "@/assets/product-vcrew.jpg";
import bgLogo5 from "@/assets/bg-logo-5.jpg";
import bgLogo6 from "@/assets/bg-logo-6.jpg";
import bgLogo7 from "@/assets/bg-logo-7.jpg";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
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
  const [brands, setBrands] = useState<string[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductsAPI.list({ in_stock: true });

      // Add local images for Echelon products
      const productsWithImages = data.map((product: any) => {
        if (product.name === "V Crew Sweatshirt") {
          return { ...product, image_url: vcrew };
        } else if (product.name === "Echelon Quarter Hoodie") {
          return { ...product, image_url: hoodie };
        }
        return product;
      });

      setProducts(productsWithImages);
      setFilteredProducts(productsWithImages);

      // Extract unique brand names
      const uniqueBrands = Array.from(new Set(data.map((p: any) => p.brands?.name).filter(Boolean)));
      setBrands(uniqueBrands);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
    newCart.set(productId, (newCart.get(productId) || 0) + 1);
    setCart(newCart);
    
    toast({
      title: "Added to Cart",
      description: "Product added successfully",
    });
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
            <Button onClick={() => navigate("/checkout", { state: { cart, products } })}>
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
              <SelectItem value="Sweatshirts">Sweatshirts</SelectItem>
              <SelectItem value="Hoodies">Hoodies</SelectItem>
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-1">{product.brands?.name}</p>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{product.price} EGP</span>
                  <Button onClick={() => addToCart(product.id)}>Add to Cart</Button>
                </div>
              </div>
            </div>
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