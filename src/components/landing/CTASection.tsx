import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Shield } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="section-badge-navy">
              <span>✨</span>
              <span>Prêt(e) à avancer ?</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Et si c'était <span className="text-gold">toi</span> qu'on aidait à décrocher ton prochain poste ?
          </h2>

          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Candid'aide accompagne les chercheurs d'emploi partout en Belgique francophone avec un service humain, efficace et 100% confidentiel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/inscription" className="btn-gold">
              Je veux qu'on m'aide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#faq" className="btn-gold-outline border-white/30 text-white hover:bg-white hover:text-navy">
              Questions fréquentes
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>Dès 3€ par candidature</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>Démarrage sous 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>100% confidentiel</span>
            </div>
          </div>

          {/* Locations */}
          <div className="flex justify-center items-center gap-2 mt-6 text-white/50 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Namur • Liège • Charleroi • Mons • Bruxelles • Wallonie</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
