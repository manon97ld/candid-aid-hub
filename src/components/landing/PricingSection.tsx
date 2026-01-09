import { Link } from "react-router-dom";
import { Check, ArrowRight, Minus, Plus } from "lucide-react";
import { useState } from "react";

const PricingSection = () => {
  const [quantities, setQuantities] = useState({
    piece: 5,
    boost: 1,
    fond: 1
  });

  const updateQuantity = (plan: keyof typeof quantities, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [plan]: Math.max(1, prev[plan] + delta)
    }));
  };

  const plans = [
    {
      key: "piece" as const,
      icon: "✉️",
      title: "À la pièce",
      subtitle: "Tu veux tester un premier essai et voir comment on travaille.",
      basePrice: 17.50,
      priceLabel: "€",
      unit: "/5x candidatures",
      hasQuantity: true,
      minQuantity: 5,
      features: [
        "Tu choisis le nombre exact de candidatures",
        "Recherche d'offres adaptées à ton profil",
        "CV envoyé avec chaque candidature",
        "Lettre de motivation personnalisée",
        "Tableau de suivi des candidatures"
      ],
      idealFor: {
        title: "Idéal pour :",
        items: [
          "Tester le service",
          "Avancer tranquillement",
          "Compléter tes démarches"
        ]
      },
      ctaText: "Choisir cette formule",
      ctaLink: "/inscription?plan=piece"
    },
    {
      key: "boost" as const,
      icon: "🏆",
      title: "Coup de boost",
      subtitle: "La formule la plus choisie",
      basePrice: 20,
      priceLabel: "€",
      unit: "",
      featured: true,
      candidatures: 8,
      hasQuantity: true,
      features: [
        "8 candidatures",
        "Sélection d'offres adaptées à ton profil",
        "CV optimisé pour chaque offre",
        "Lettres de motivation sur mesure",
        "Tableau de suivi complet",
        "Support par email"
      ],
      idealFor: {
        title: "Idéal pour :",
        items: [
          "Relancer ta recherche rapidement",
          "Montrer des démarches actives",
          "Reprendre confiance"
        ]
      },
      ctaText: "Je veux relancer ma recherche",
      ctaLink: "/inscription?plan=boost"
    },
    {
      key: "fond" as const,
      icon: "👑",
      title: "À fond pour toi",
      subtitle: "La formule la plus complète",
      basePrice: 40,
      priceLabel: "€",
      unit: "",
      candidatures: 15,
      hasQuantity: true,
      features: [
        "15 candidatures",
        "Recherche d'offres intensive",
        "CV adapté si besoin",
        "Lettres de motivation sur mesure",
        "Suivi régulier de ton dossier",
        "Tableau de suivi avancé",
        "Support prioritaire"
      ],
      idealFor: {
        title: "Idéal pour :",
        items: [
          "Déléguer complètement ta recherche",
          "Démontrer une grosse recherche d'emploi",
          "Avancer sans stress"
        ]
      },
      ctaText: "Je veux qu'on s'occupe de tout",
      ctaLink: "/inscription?plan=fond"
    },
    {
      key: "mensuel" as const,
      icon: "📅",
      title: "Forfait mensuel",
      subtitle: "Recherche d'emploi active et continue",
      basePrice: 120,
      priceLabel: "€",
      unit: "/mois - recommandé",
      hasQuantity: false,
      features: [
        "Recherche régulière d'offres adaptées au profil, au secteur, et à la région",
        "Prises d'initiatives et mise en place de candidatures tout au long du mois",
        "Assurer bonne gestion du suivi correctement/réponse aux offres pertinentes",
        "Gestion des outils adéquats et soutien régulièrement des offres et opportunités",
        "Suivi clair et transparent des démarches"
      ],
      note: {
        title: "Note :",
        content: "Le forfait mensuel est modulable. Que votre profil soit actif/passif/passif-actif (ouverts aux opportunités mais déjà en poste), nous nous adapterons avec des démarches appropriées."
      },
      additionalInfo: "Les candidatures seront envoyées exceptés des périodes clefs de l'année, dans ces contextes, nous privilégions surtout la qualité des opportunités visibles.",
      ctaText: "Choisir le forfait mensuel",
      ctaLink: "/inscription?plan=mensuel"
    }
  ];

  return (
    <section id="tarifs" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="section-badge">
            <span>💰</span>
            <span>Nos Formules</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy mb-4">
            Des offres <span className="text-gold">simples et transparentes</span>
          </h2>
          <p className="text-gray-600">
            Pas d'abonnement, pas de frais cachés — juste un service humain, concret et efficace pour la recherche d'emploi en Belgique.
          </p>
        </div>

        {/* Common Features */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm text-sm">
            <span>• 5€ de frais de création du dossier <span className="text-gray-500">(pour toute 1ère commande)</span></span>
            <span className="text-gray-300">|</span>
            <span>Mise à jour du CV • Préparation de la lettre • Adresse mail dédiée • Tableau de suivi</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={plan.featured ? "card-pricing-featured" : "card-pricing"}
            >
              {/* Quantity Selector */}
              {plan.hasQuantity && plan.key !== 'mensuel' && (
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button 
                    onClick={() => updateQuantity(plan.key, -1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      plan.featured 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`text-xl font-bold ${plan.featured ? 'text-gold' : 'text-navy'}`}>
                    {plan.key === 'piece' ? quantities.piece : quantities[plan.key]}x
                  </span>
                  <button 
                    onClick={() => updateQuantity(plan.key, 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      plan.featured 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Candidatures Count */}
              {plan.candidatures && (
                <p className={`text-center text-sm font-medium mb-4 ${plan.featured ? 'text-gold' : 'text-gold-dark'}`}>
                  {plan.candidatures} candidatures
                </p>
              )}

              {/* Icon & Title */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{plan.icon}</span>
                <h3 className={`font-bold ${plan.featured ? 'text-white' : 'text-navy'}`}>
                  {plan.title}
                </h3>
              </div>

              <p className={`text-sm mb-4 ${plan.featured ? 'text-white/70' : 'text-gray-500'}`}>
                {plan.subtitle}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-navy'}`}>
                  {plan.basePrice}
                  <span className="text-lg">{plan.priceLabel}</span>
                </span>
                {plan.unit && (
                  <span className={`text-sm ${plan.featured ? 'text-white/60' : 'text-gray-500'}`}>
                    {plan.unit}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.featured ? 'text-gold' : 'text-gold'}`} />
                    <span className={`text-sm ${plan.featured ? 'text-white/90' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Ideal For */}
              {plan.idealFor && (
                <div className={`p-4 rounded-lg mb-6 ${plan.featured ? 'bg-white/5' : 'bg-gold/5'}`}>
                  <p className={`text-sm font-medium mb-2 ${plan.featured ? 'text-gold' : 'text-gold-dark'}`}>
                    {plan.idealFor.title}
                  </p>
                  <ul className="space-y-1">
                    {plan.idealFor.items.map((item, idx) => (
                      <li key={idx} className={`text-sm flex items-center gap-2 ${plan.featured ? 'text-white/70' : 'text-gray-600'}`}>
                        <Check className={`w-3 h-3 ${plan.featured ? 'text-gold' : 'text-gold'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Note for mensuel */}
              {plan.note && (
                <div className="p-4 rounded-lg mb-6 bg-gold/5 border border-gold/20">
                  <p className="text-sm font-medium text-gold-dark mb-2">{plan.note.title}</p>
                  <p className="text-xs text-gray-600">{plan.note.content}</p>
                </div>
              )}

              {/* CTA */}
              <Link 
                to={plan.ctaLink}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  plan.featured 
                    ? 'bg-gold text-navy hover:bg-gold-light' 
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {plan.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1">
              {[1,2,3,4].map(i => (
                <span key={i} className="text-gold">★</span>
              ))}
              <span className="text-gray-300">★</span>
            </div>
            <span className="font-medium text-navy">4/5</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Service humain, accessible et <span className="text-gold font-medium">100% confidentiel</span> 🔒</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
