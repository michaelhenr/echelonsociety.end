import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BrandsAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import bgLogo8 from "@/assets/bg-logo-8.jpg";

const SubmitBrand = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBrands, setExistingBrands] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await BrandsAPI.list();
        setExistingBrands(brands.map((b: any) => b.name.toLowerCase()));
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    };
    loadBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (existingBrands.includes(formData.name.toLowerCase())) {
      toast({
        title: "Brand Already Exists",
        description: `A brand named "${formData.name}" already exists. Please choose a different name.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await BrandsAPI.create({
        name: formData.name,
        description: formData.description,
        contact_email: formData.email,
        contact_phone: formData.phone,
      });

      toast({
        title: "Success!",
        description: "Your brand has been submitted successfully",
      });

      setFormData({ name: "", description: "", email: "", phone: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo8})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Submit Brand</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Brand Name *</Label>
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
            <Label htmlFor="email">Contact Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Contact Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Brand"}
          </Button>
        </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitBrand;
