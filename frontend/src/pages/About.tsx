import { Layout } from "@/components/Layout";
import bgLogo10 from "@/assets/bg-logo-10.jpg";
import bgLogo11 from "@/assets/bg-logo-11.jpg";

/**
 * About page detailing Echelon Society's history and mission
 */
const About = () => {
  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo10}), url(${bgLogo11})`, backgroundBlendMode: 'overlay' }}
      >
        <div className="bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">About Echelon Society</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Our Beginning */}
          <section className="bg-card p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Beginning</h2>
            <p className="text-lg text-foreground leading-relaxed">
              Echelon Society was founded in 2017 with a vision to curate unique and special items. 
              From our inception, we understood that true value comes not just from what we sell, 
              but from the uniqueness of our products and the impact we make on the world around us.
            </p>
          </section>

          {/* Evolution */}
          <section className="bg-card p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Evolution</h2>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              What began as a platform for unique items quickly evolved into something more meaningful. 
              We transitioned into a fundraising and volunteering organization, dedicating ourselves 
              to supporting those in need within our community. This period taught us the true 
              meaning of service and the profound impact that collective action can have.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Today, Echelon Society offers a carefully curated collection of unique items - from 
              sport accessories to special products that stand out. We maintain our commitment to 
              quality and uniqueness while dedicating 50% of our profits to supporting lower-income 
              communities. We represent the perfect union of unique products and social responsibility.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-card p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              At Echelon Society, we believe that true value extends beyond material possessions. 
              We are committed to curating unique and special items - from sport accessories to 
              electronics, clothing, and home decor - while dedicating 50% of our profits to 
              supporting lower-income communities. Through our work, we provide resources and 
              support to those who need it most.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Every item you purchase from Echelon Society contributes to this mission. Your 
              investment in our brand directly impacts lives, helping to support families and 
              community development initiatives.
            </p>
          </section>

          {/* Our Values */}
          <section className="bg-card p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl mb-2 text-accent">Uniqueness</h3>
                <p className="text-foreground">
                  We curate special and unique items that stand out from the ordinary.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-accent">Integrity</h3>
                <p className="text-foreground">
                  Transparency and honesty guide every decision we make.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-accent">Philanthropy</h3>
                <p className="text-foreground">
                  Giving back is not an afterthought—it's at the core of who we are.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-accent">Quality</h3>
                <p className="text-foreground">
                  We maintain the highest standards in product selection and quality.
                </p>
              </div>
            </div>
          </section>

          {/* Our Impact */}
          <section className="bg-secondary/20 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Our Impact</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-accent mb-2">50%</p>
                <p className="text-foreground">Of Profits to Charity</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">8+</p>
                <p className="text-foreground">Years of Service</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">∞</p>
                <p className="text-foreground">Lives Touched</p>
              </div>
            </div>
          </section>

          {/* A Higher Standard */}
          <section className="text-center bg-primary text-primary-foreground p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">A Higher Standard</h2>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto">
              This is more than our tagline—it's our promise. At Echelon Society, we hold 
              ourselves to a higher standard in everything we do, from the unique items we curate 
              to the communities we serve. Join us in this journey of quality, uniqueness, and impact.
            </p>
          </section>
        </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;