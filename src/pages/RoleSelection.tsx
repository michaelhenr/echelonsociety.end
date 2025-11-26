import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ClientsAPI } from "@/services/api";
import logo from "@/assets/logo.jpg";
import bgImage from "@/assets/bg-logo-1.jpg";

/**
 * Role Selection page - Entry point for users to choose their role
 * Client, Advertiser, Brand Owner, or Product Submission
 */
const RoleSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [clientName, setClientName] = useState("");

  const handleClientEntry = async () => {
    if (!clientName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await ClientsAPI.register(clientName.trim());

      toast({
        title: "Welcome!",
        description: response.message,
      });

      setShowNameDialog(false);
      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img 
            src={logo} 
            alt="Echelon Society" 
            className="w-48 h-48 mx-auto mb-6 object-contain rounded-full shadow-lg"
          />
          <h1 className="text-5xl font-bold text-white mb-4">Echelon Society</h1>
          <p className="text-xl text-white/90 mb-2">A Higher Standard</p>
          <p className="text-lg text-white/80">Welcome to our e-commerce platform</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-card/95 backdrop-blur" onClick={() => setShowNameDialog(true)}>
            <CardHeader>
              <CardTitle className="text-primary">Client</CardTitle>
              <CardDescription>
                Browse and shop our collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Shopping</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-card/95 backdrop-blur" onClick={() => navigate("/submit-ad")}>
            <CardHeader>
              <CardTitle className="text-primary">Submit Advertisement</CardTitle>
              <CardDescription>
                Add image, budget & due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Submit Ad</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-card/95 backdrop-blur" onClick={() => navigate("/submit-brand")}>
            <CardHeader>
              <CardTitle className="text-primary">Register Your Brand</CardTitle>
              <CardDescription>
                Submit name, description & logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Create Brand</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-card/95 backdrop-blur" onClick={() => navigate("/submit-product")}>
            <CardHeader>
              <CardTitle className="text-primary">Add Your Product</CardTitle>
              <CardDescription>
                Submit price, info & brand details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Add Product</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80">
            Supporting local businesses and communities since 2017
          </p>
        </div>
      </div>

      {/* Client Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Echelon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Can you write your name?</p>
            <div>
              <Label htmlFor="client-name">Your Name</Label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClientEntry();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleClientEntry}>Continue</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleSelection;