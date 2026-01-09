import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
              <span className="text-gold text-xl">🎯</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-navy">CANDID'</span>
              <span className="text-gold">AIDE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-navy/80 hover:text-navy transition-colors font-medium">
              Services
            </a>
            <a href="#tarifs" className="text-navy/80 hover:text-navy transition-colors font-medium">
              Tarifs
            </a>
            <a href="#faq" className="text-navy/80 hover:text-navy transition-colors font-medium">
              FAQ
            </a>
            <a href="#contact" className="text-navy/80 hover:text-navy transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/app" className="btn-gold">
                Mon espace
              </Link>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-gold">
                  Voir les formules
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <a href="#services" className="text-navy/80 hover:text-navy transition-colors font-medium py-2">
                Services
              </a>
              <a href="#tarifs" className="text-navy/80 hover:text-navy transition-colors font-medium py-2">
                Tarifs
              </a>
              <a href="#faq" className="text-navy/80 hover:text-navy transition-colors font-medium py-2">
                FAQ
              </a>
              <a href="#contact" className="text-navy/80 hover:text-navy transition-colors font-medium py-2">
                Contact
              </a>
              {user ? (
                <Link to="/app" className="btn-gold text-center mt-2">
                  Mon espace
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="text-navy font-medium py-2 flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link to="/inscription" className="btn-gold text-center mt-2">
                    Voir les formules
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
