import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import bgLogo7 from "@/assets/bg-logo-7.jpg";

const SubmitAd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.budget || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    const startDate = new Date(formData.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(formData.endDate);
    endDate.setHours(0, 0, 0, 0);

    // Check if start date is in the past
    if (startDate < today) {
      toast({
        title: "Invalid Start Date",
        description: "Start date cannot be in the past. Please select today or a future date.",
        variant: "destructive",
      });
      return;
    }

    // Check if end date is in the past
    if (endDate < today) {
      toast({
        title: "Invalid End Date",
        description: "End date cannot be in the past. Please select today or a future date.",
        variant: "destructive",
      });
      return;
    }

    // Check if end date is before start date
    if (endDate < startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after or equal to start date.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.createAd({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        image_url: formData.imageUrl || undefined, // Only send if provided
        start_date: formData.startDate,
        end_date: formData.endDate,
        active: true,
      });

      toast({
        title: "Success!",
        description: "Your ad has been submitted successfully",
      });

      navigate("/");
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
        style={{ backgroundImage: `url(${bgLogo7})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Submit Advertisement</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Ad Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            <Label htmlFor="budget">Budget (EGP) *</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-muted-foreground mt-1">Leave empty if you don't have an image URL</p>
          </div>

          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              required
            />
            <p className="text-sm text-muted-foreground mt-1">Must be today or a future date</p>
          </div>

          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || new Date().toISOString().split('T')[0]} // Must be after start date
              required
            />
            <p className="text-sm text-muted-foreground mt-1">Must be after or equal to start date</p>
          </div>

          <Button type="submit" className="w-full">Submit Ad</Button>
        </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitAd;
