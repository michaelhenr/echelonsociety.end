import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo-detailed.jpg";
import bgLogo1 from "@/assets/bg-logo-1.jpg";
import bgLogo2 from "@/assets/bg-logo-2.jpg";

/**
 * Role Selection page - Entry point for users to choose their role
 * Client, Advertiser, Brand Owner, or Product Submission
 */
const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Background Images */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={bgLogo1} 
          alt="" 
          className="absolute top-10 left-10 w-64 h-64 object-contain"
        />
        <img 
          src={bgLogo2} 
          alt="" 
          className="absolute bottom-10 right-10 w-64 h-64 object-contain"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img 
            src={logo} 
            alt="Echelon Society" 
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h1 className="text-5xl font-bold text-primary mb-4">Echelon Society</h1>
          <p className="text-xl text-muted-foreground mb-2">A Higher Standard</p>
          <p className="text-lg text-foreground">Welcome to our e-commerce platform</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/")}>
            <CardHeader>
              <CardTitle className="text-primary">Browse as Client</CardTitle>
              <CardDescription>
                Explore products, brands, and advertisements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Enter Store</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/submit-ad")}>
            <CardHeader>
              <CardTitle className="text-primary">Submit Advertisement</CardTitle>
              <CardDescription>
                Advertise your products or services with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Submit Ad</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/submit-brand")}>
            <CardHeader>
              <CardTitle className="text-primary">Register Your Brand</CardTitle>
              <CardDescription>
                Join our platform as a brand partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Submit Brand</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/submit-product")}>
            <CardHeader>
              <CardTitle className="text-primary">Add Your Product</CardTitle>
              <CardDescription>
                List your individual products for sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Submit Product</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Supporting local businesses and communities since 2017
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;