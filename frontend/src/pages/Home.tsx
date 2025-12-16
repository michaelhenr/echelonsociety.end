import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import vcrew from "@/assets/product-quarter-hoodie.jpg";
import hoodie from "@/assets/product-vcrew.jpg";
import bgLogo8 from "@/assets/bg-logo-8.jpg";
import bgLogo9 from "@/assets/bg-logo-9.jpg";

/**
 * Home page with Echelon Society introduction and featured products
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo8}), url(${bgLogo9})`, backgroundBlendMode: 'overlay' }}
      >
        <div className="bg-background/85 backdrop-blur-sm">
          {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Echelon Society</h1>
          <p className="text-2xl mb-6">A Higher Standard</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover timeless elegance and old money fashion. Where style meets philanthropy.
          </p>
        </div>
      </section>

      {/* Quick Actions - 4 Buttons */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/products")}>
              <CardHeader>
                <CardTitle className="text-primary">Shop</CardTitle>
                <CardDescription>
                  Browse and shop our collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Shopping</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/submit-ad")}>
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

            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/submit-brand")}>
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

            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/submit-product")}>
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
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Our Story</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-foreground mb-4">
              Founded in 2017, Echelon Society began with a vision to curate unique and special items. 
              We evolved into a fundraising and volunteering organization dedicated to helping 
              those in need.
            </p>
            <p className="text-lg text-foreground mb-6">
              Today, we offer a carefully selected collection of unique items - from sport accessories 
              to special products that stand out. We maintain our commitment to quality and uniqueness 
              while dedicating 50% of our profits to supporting lower-income communities.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate("/about")}
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Featured Collection</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={vcrew} 
                alt="V Crew Sweatshirt" 
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">V Crew Sweatshirt</h3>
                <p className="text-muted-foreground mb-4">Premium crewneck sweatshirt</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">700 EGP</span>
                  <Button onClick={() => navigate("/products")}>View Details</Button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={hoodie} 
                alt="Echelon Quarter Hoodie" 
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Echelon Quarter Hoodie</h3>
                <p className="text-muted-foreground mb-4">Elegant quarter-zip design</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">800 EGP</span>
                  <Button onClick={() => navigate("/products")}>View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Fashion with Purpose</h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto mb-8">
            Every purchase contributes to our mission. 50% of our profits go directly to 
            helping lower-income communities, providing clothing and support to those in need.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">50%</p>
              <p className="text-muted-foreground">Profit to Charity</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">Since 2017</p>
              <p className="text-muted-foreground">Years of Service</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">100%</p>
              <p className="text-muted-foreground">Commitment</p>
            </div>
          </div>
        </div>
      </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;