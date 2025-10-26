import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
    const { data } = await supabase.from("brands").select("*");
    if (data) setBrands(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.brandId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("products").insert({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        brand_id: formData.brandId,
        image_url: formData.imageUrl,
        in_stock: true,
      });

      if (error) throw error;

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Submit Product</h1>

        {brands.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
            <p className="text-yellow-800">
              No brands found. Please{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/")}>
                create a brand
              </Button>{" "}
              first by selecting "Register Your Brand" option.
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
                <SelectItem value="Sweatshirts">Sweatshirts</SelectItem>
                <SelectItem value="Hoodies">Hoodies</SelectItem>
                <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
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
                    <SelectItem key={brand.id} value={brand.id}>
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
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={brands.length === 0}>
            Submit Product
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitProduct;
