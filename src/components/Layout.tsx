import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
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

  return (
    <div className="min-h-screen bg-background">
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
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Echelon Society. All rights reserved.</p>
            <p className="text-sm">Established 2017 • A Higher Standard</p>
          </div>
        </div>
      </footer>

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