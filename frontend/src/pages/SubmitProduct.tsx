import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import bgLogo9 from "@/assets/bg-logo-9.jpg";

const SubmitProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brandId: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await api.fetchBrands();
      // Only show accepted brands
      if (data) {
        const acceptedBrands = data.filter((brand: any) => brand.status === 'accepted');
        setBrands(acceptedBrands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.brandId || !formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including Image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        brand_id: formData.brandId,
        image_url: formData.imageUrl, // Required - already validated above
        stock: 1,
      });

      toast({
        title: "Success!",
        description: "Your product has been submitted successfully",
      });

      navigate("/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo9})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Submit Product</h1>

        {brands.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
            <p className="text-yellow-800">
              No accepted brands found. Please{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/")}>
                register a brand
              </Button>{" "}
              first by selecting "Register Your Brand" option. Your brand will need to be accepted by an admin before you can use it.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (EGP) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="sport-accessories" value="Sport Accessories">Sport Accessories</SelectItem>
                <SelectItem key="electronics" value="Electronics">Electronics</SelectItem>
                <SelectItem key="clothing" value="Clothing">Clothing</SelectItem>
                <SelectItem key="accessories" value="Accessories">Accessories</SelectItem>
                <SelectItem key="home-decor" value="Home & Decor">Home & Decor</SelectItem>
                <SelectItem key="unique-items" value="Unique Items">Unique Items</SelectItem>
                <SelectItem key="other" value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brand">Brand *</Label>
            <div className="flex gap-2">
              <Select value={formData.brandId} onValueChange={(value) => setFormData({ ...formData, brandId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id || brand.id || Math.random()} value={brand._id || brand.id || ''}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                Create New Brand
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Image URL is required. 
              <br />
              <span className="text-xs font-semibold text-amber-600">⚠️ IMPORTANT: Use DIRECT image URLs only!</span>
              <br />
              <span className="text-xs font-semibold text-green-600">✅ CORRECT format:</span>
              <br />
              <span className="text-xs font-mono bg-muted p-1 rounded break-all">https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=998&auto=format&fit=crop</span>
              <br />
              <span className="text-xs font-semibold text-red-600">❌ WRONG (don't use):</span>
              <br />
              <span className="text-xs text-red-500">• unsplash.com/photos/... (photo page URL)</span>
              <br />
              <span className="text-xs text-red-500">• unsplash.com/photos/.../download (download URL)</span>
              <br />
              <span className="text-xs mt-2">How to get the correct URL:</span>
              <br />
              <span className="text-xs">1. Go to Unsplash photo page</span>
              <br />
              <span className="text-xs">2. Right-click the image → "Copy image address"</span>
              <br />
              <span className="text-xs">3. Or click "Download" → copy the redirected URL</span>
              <br />
              <span className="text-xs">4. URL must start with: https://images.unsplash.com/photo-</span>
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={brands.length === 0}>
            Submit Product
          </Button>
        </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitProduct;
