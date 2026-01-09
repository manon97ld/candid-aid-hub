import { Target, Handshake, Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceMode } from "@/types/tunnel";

interface Step1ModeProps {
  selectedMode: ServiceMode | null;
  onModeSelect: (mode: ServiceMode) => void;
}

const modes = [
  {
    id: 'autonome' as ServiceMode,
    icon: Target,
    title: "En autonomie",
    subtitle: "Je gère ma recherche avec des outils",
    badge: "Idéal pour tester",
    badgeColor: "bg-green-100 text-green-700",
    price: "GRATUIT",
    priceNote: "",
    features: [
      "Accès au moteur de recherche d'offres",
      "Outils d'optimisation CV",
      "Analyse de CV par IA",
      "Modèles de lettres de motivation",
      "Tableau de suivi des candidatures",
      "3 candidatures assistées gratuites/mois"
    ]
  },
  {
    id: 'assiste' as ServiceMode,
    icon: Handshake,
    title: "Avec assistant dédié",
    subtitle: "Je valide, mon assistant s'occupe du reste",
    badge: "Le plus populaire",
    badgeColor: "bg-gold text-navy",
    price: "À partir de 20€",
    priceNote: "",
    featured: true,
    features: [
      "Tout du mode Autonome +",
      "Assistant humain personnel",
      "10 candidatures personnalisées/mois",
      "Suggestions d'offres quotidiennes pré-filtrées",
      "Optimisation CV + lettres sur-mesure",
      "Support prioritaire par messagerie",
      "Coaching ponctuel"
    ]
  },
  {
    id: 'delegation' as ServiceMode,
    icon: Crown,
    title: "Délégation totale",
    subtitle: "Je ne fais rien, tout est géré pour moi",
    badge: "Service VIP",
    badgeColor: "bg-purple-100 text-purple-700",
    price: "À partir de 60€/mois",
    priceNote: "",
    features: [
      "Tout du mode Assisté +",
      "Prise en charge complète A→Z",
      "Jusqu'à 20 candidatures personnalisées/mois",
      "Recherche proactive quotidienne",
      "Coaching avancé + entretiens réguliers",
      "Refonte CV + profil LinkedIn",
      "Préparation intensive aux entretiens",
      "Concierge emploi dédié"
    ]
  }
];

export function Step1Mode({ selectedMode, onModeSelect }: Step1ModeProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
          Comment veux-tu qu'on t'accompagne ?
        </h1>
        <p className="text-lg text-gray-600">
          Choisis le niveau d'aide qui te correspond
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={cn(
                "relative text-left transition-all duration-300",
                mode.featured ? "card-pricing-featured" : "card-pricing",
                isSelected && !mode.featured && "ring-2 ring-gold border-gold",
                isSelected && mode.featured && "ring-4 ring-gold"
              )}
            >
              {/* Badge */}
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap",
                mode.badgeColor
              )}>
                {mode.badge}
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-navy" />
                  </div>
                </div>
              )}

              <div className="pt-6">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                  mode.featured ? "bg-gold/20" : "bg-navy/10"
                )}>
                  <Icon className={cn(
                    "w-7 h-7",
                    mode.featured ? "text-gold" : "text-navy"
                  )} />
                </div>

                {/* Title & Subtitle */}
                <h3 className={cn(
                  "text-xl font-bold mb-1",
                  mode.featured ? "text-white" : "text-navy"
                )}>
                  {mode.title}
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  mode.featured ? "text-white/70" : "text-gray-500"
                )}>
                  {mode.subtitle}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className={cn(
                    "text-2xl font-bold",
                    mode.featured ? "text-gold" : "text-navy"
                  )}>
                    {mode.price}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {mode.features.map((feature, index) => (
                    <li 
                      key={index}
                      className={cn(
                        "flex items-start gap-2 text-sm",
                        mode.featured ? "text-white/80" : "text-gray-600"
                      )}
                    >
                      <Check className={cn(
                        "w-4 h-4 flex-shrink-0 mt-0.5",
                        mode.featured ? "text-gold" : "text-green-500"
                      )} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
