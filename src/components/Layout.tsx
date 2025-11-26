import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { NewsletterAPI } from "@/services/api";
import { ChatBot } from "@/components/ChatBot";
import logo from "@/assets/logo.jpg";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

/**
 * Layout component providing consistent navigation and structure
 * Includes hidden admin access via logo clicks
 */
export const Layout = ({ children, showNav = true }: LayoutProps) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    
    // Single click navigates to home only if not already there
    if (newClicks === 1 && location.pathname !== "/home") {
      navigate("/home");
    }
    
    setLogoClicks(newClicks);
    
    if (newClicks === 5) {
      setShowPasswordPrompt(true);
      setLogoClicks(0);
    }
    
    setTimeout(() => setLogoClicks(0), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "333") {
      navigate("/admin");
      setShowPasswordPrompt(false);
      setPassword("");
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await NewsletterAPI.subscribe(email);

      toast({
        title: "Success!",
        description: response.message || "You'll receive 10% off your next order!",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={logo} 
                alt="Echelon Society" 
                className="h-12 w-12 cursor-pointer object-contain"
                onClick={handleLogoClick}
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">Echelon Society</h1>
                <p className="text-sm text-muted-foreground">A Higher Standard</p>
              </div>
            </div>
            
            {showNav && (
              <nav className="flex gap-6">
                <Link to="/" className="text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold text-primary">Thank You for Visiting!</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter and get 10% off your next order
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-sm text-muted-foreground">
              © 2025 Echelon Society. A Higher Standard.
            </p>
          </div>
        </div>
      </footer>

      <ChatBot />

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Admin Access</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-border rounded-md mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword("");
                  }}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};