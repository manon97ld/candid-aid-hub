import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-section pt-24 pb-16 lg:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="section-badge-navy">
              <span>🎯</span>
              <span>Service de recherche d'emploi en Belgique</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Épuisé(e) de postuler{" "}
              <span className="text-gold">sans résultat</span> ?
            </h1>

            {/* Subheading */}
            <p className="text-xl text-white/90 font-medium">
              On s'occupe de tout pour toi.
            </p>

            {/* Description */}
            <p className="text-white/70 leading-relaxed">
              Tu n'as plus le temps, plus l'énergie, plus la méthode ?{" "}
              <strong className="text-white">Candid'aide postule à ta place</strong> — avec des CV et lettres personnalisés, en toute confidentialité. Toi, tu reprends confiance.
            </p>

            {/* Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-white/90">On postule vraiment à ta place</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-white/90">CV et lettre personnalisée pour chaque offre</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-white/90">Suivi complet et 100% confidentiel</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/inscription" className="btn-gold">
                Voir les formules dès 3€
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#comment-ca-marche" className="btn-gold-outline border-white/30 text-white hover:bg-white hover:text-navy">
                Comment ça marche ?
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Confidentiel</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="stat-item">
                <span className="stat-value">3€</span>
                <span className="stat-label">Par candidature</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="stat-item">
                <span className="stat-value">48h</span>
                <span className="stat-label">Démarrage</span>
              </div>
            </div>
          </div>

          {/* Right Column - Partner Card */}
          <div className="partner-card animate-float">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Ton partenaire emploi</h3>
                <p className="text-white/60 text-sm">Service humain et discret</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gold/90 text-navy px-4 py-3 rounded-lg">
                <span className="font-bold">1</span>
                <span className="font-medium">Partage tes objectifs et souhaits</span>
              </div>
              <div className="flex items-center gap-3 bg-gold/90 text-navy px-4 py-3 rounded-lg">
                <span className="font-bold">2</span>
                <span className="font-medium">Indique tes préférences</span>
              </div>
              <div className="flex items-center gap-3 bg-gold/90 text-navy px-4 py-3 rounded-lg">
                <span className="font-bold">3</span>
                <span className="font-medium">On s'occupe de tout pour toi</span>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white">Candid'aide s'occupe de tout</p>
                  <p className="text-white/60 text-sm">Recherche • CV • Lettres • Suivi</p>
                </div>
              </div>
            </div>

            {/* Success Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Candidature envoyée</p>
                <p className="text-xs text-gray-500">CV + Lettre personnalisés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
