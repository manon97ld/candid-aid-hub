import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="text-gold text-xl">🎯</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">CANDID'</span>
                <span className="text-gold">AIDE</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Un service humain et discret qui postule à ta place. Recherche d'emploi simplifiée en Belgique francophone.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://facebook.com/candidaide" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/candidaide" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/candidaide" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">NAVIGATION</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors text-sm">Accueil</a></li>
              <li><a href="#services" className="text-white/70 hover:text-gold transition-colors text-sm">Nos services</a></li>
              <li><a href="#tarifs" className="text-white/70 hover:text-gold transition-colors text-sm">Tarifs</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-gold transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">NOS SERVICES</h4>
            <ul className="space-y-3">
              <li><span className="text-white/70 text-sm">Recherche d'offres ciblées</span></li>
              <li><span className="text-white/70 text-sm">Optimisation de CV</span></li>
              <li><span className="text-white/70 text-sm">Lettres de motivation personnalisées</span></li>
              <li><span className="text-white/70 text-sm">Candidature en ton nom</span></li>
              <li><span className="text-white/70 text-sm">Suivi et tableau de bord</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:contact@candidaideemploi.com" className="hover:text-gold transition-colors">
                  contact@candidaideemploi.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:0456962073" className="hover:text-gold transition-colors">
                  0456 96 20 73
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Belgique francophone</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2024 Candid'aide Emploi. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm">CGV</a>
            <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
