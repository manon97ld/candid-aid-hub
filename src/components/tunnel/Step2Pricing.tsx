import { Check, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceMode, PlanType } from "@/types/tunnel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Step2PricingProps {
  mode: ServiceMode;
  selectedPlan: PlanType | null;
  servicesAdditionnels: string[];
  onPlanSelect: (plan: PlanType) => void;
  onServicesChange: (services: string[]) => void;
}

const servicesOneShot = [
  { id: 'revision_cv', label: 'Révision CV par expert', price: 10 },
  { id: 'lettre_motivation', label: 'Lettre de motivation personnalisée', price: 8 },
  { id: 'simulation_entretien', label: "Simulation d'entretien", price: 15 },
];

const plansAssiste = [
  {
    id: 'pack_8' as PlanType,
    name: 'Pack 8 candidatures',
    price: '20€',
    priceNote: 'paiement unique',
    badge: 'Parfait pour tester',
    features: ['8 candidatures personnalisées', 'Valable 30 jours', 'Support par email'],
  },
  {
    id: 'mensuel_30' as PlanType,
    name: 'Abonnement Standard',
    price: '30€',
    priceNote: '/mois sans engagement',
    badge: 'Meilleur rapport qualité/prix',
    featured: true,
    features: ['10 candidatures/mois', 'Tous les services Assisté', 'Résiliable à tout moment', 'Support prioritaire'],
  },
  {
    id: 'pack_15' as PlanType,
    name: 'Pack 15 candidatures',
    price: '40€',
    priceNote: 'paiement unique',
    badge: 'Pour une recherche intensive',
    features: ['15 candidatures personnalisées', 'Valable 45 jours', 'Support prioritaire'],
  },
];

const plansDelegation = [
  {
    id: 'premium_mensuel' as PlanType,
    name: 'Abonnement Premium Mensuel',
    price: '60€',
    priceNote: '/mois sans engagement',
    badge: 'Le plus flexible',
    features: ['20 candidatures/mois', 'Service complet VIP', 'Concierge dédié', 'Résiliable à tout moment'],
  },
  {
    id: 'premium_trimestriel' as PlanType,
    name: 'Abonnement Premium Trimestriel',
    price: '150€',
    priceNote: '/3 mois (économie 30€)',
    badge: 'Meilleure valeur',
    featured: true,
    features: ['20 candidatures/mois pendant 3 mois', 'Service complet VIP', 'Concierge dédié', '1 mois offert comparé au mensuel'],
  },
];

export function Step2Pricing({ 
  mode, 
  selectedPlan, 
  servicesAdditionnels, 
  onPlanSelect, 
  onServicesChange 
}: Step2PricingProps) {
  const toggleService = (serviceId: string) => {
    if (servicesAdditionnels.includes(serviceId)) {
      onServicesChange(servicesAdditionnels.filter(s => s !== serviceId));
    } else {
      onServicesChange([...servicesAdditionnels, serviceId]);
    }
  };

  // Mode Autonome
  if (mode === 'autonome') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-3">
            🎉 Ton compte gratuit est prêt !
          </h1>
          <p className="text-gray-600">
            Aucun paiement requis. Tu pourras ajouter des services à la carte si tu le souhaites.
          </p>
        </div>

        <div className="card-pricing mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-navy">Plan Gratuit</h3>
              <p className="text-gray-500">Accès illimité aux outils de base</p>
            </div>
            <div className="text-3xl font-bold text-green-500">0€</div>
          </div>

          <ul className="space-y-2 mb-6">
            {['Moteur de recherche d\'offres', 'Outils d\'optimisation CV', 'Analyse de CV par IA', 'Modèles de lettres', 'Tableau de suivi', '3 candidatures assistées/mois'].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <span>📦</span> Services à la carte (optionnel)
          </h4>
          <div className="space-y-3">
            {servicesOneShot.map((service) => (
              <label
                key={service.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={servicesAdditionnels.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <span className="text-gray-700">{service.label}</span>
                </div>
                <span className="font-semibold text-navy">{service.price}€</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mode Assisté ou Délégation
  const plans = mode === 'assiste' ? plansAssiste : plansDelegation;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          Choisis ta formule
        </h1>
        <p className="text-gray-600">
          {mode === 'assiste' 
            ? "Sélectionne le pack ou l'abonnement qui te convient" 
            : "Choisis ta formule premium"}
        </p>
      </div>

      <div className={cn(
        "grid gap-6",
        plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
      )}>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          
          return (
            <button
              key={plan.id}
              onClick={() => onPlanSelect(plan.id)}
              className={cn(
                "relative text-left transition-all duration-300",
                plan.featured ? "card-pricing-featured" : "card-pricing",
                isSelected && !plan.featured && "ring-2 ring-gold border-gold",
                isSelected && plan.featured && "ring-4 ring-gold"
              )}
            >
              {/* Badge */}
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap",
                plan.featured ? "bg-gold text-navy" : "bg-gray-100 text-gray-700"
              )}>
                {plan.badge}
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
                <h3 className={cn(
                  "text-lg font-bold mb-1",
                  plan.featured ? "text-white" : "text-navy"
                )}>
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className={cn(
                    "text-3xl font-bold",
                    plan.featured ? "text-gold" : "text-navy"
                  )}>
                    {plan.price}
                  </span>
                  <span className={cn(
                    "text-sm ml-1",
                    plan.featured ? "text-white/70" : "text-gray-500"
                  )}>
                    {plan.priceNote}
                  </span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li 
                      key={index}
                      className={cn(
                        "flex items-start gap-2 text-sm",
                        plan.featured ? "text-white/80" : "text-gray-600"
                      )}
                    >
                      <Check className={cn(
                        "w-4 h-4 flex-shrink-0 mt-0.5",
                        plan.featured ? "text-gold" : "text-green-500"
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

      {/* FAQ */}
      <div className="mt-12">
        <h4 className="font-semibold text-navy mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Questions fréquentes
        </h4>
        <Accordion type="single" collapsible className="bg-white rounded-xl border">
          <AccordionItem value="change">
            <AccordionTrigger className="px-4">Puis-je changer de formule ?</AccordionTrigger>
            <AccordionContent className="px-4 text-gray-600">
              Oui, tu peux changer de formule à tout moment. Si tu passes à une formule supérieure, la différence sera calculée au prorata.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancel">
            <AccordionTrigger className="px-4">Comment résilier mon abonnement ?</AccordionTrigger>
            <AccordionContent className="px-4 text-gray-600">
              Les abonnements sont sans engagement. Tu peux résilier à tout moment depuis ton espace personnel.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="candidatures">
            <AccordionTrigger className="px-4">Que se passe-t-il si je n'utilise pas toutes mes candidatures ?</AccordionTrigger>
            <AccordionContent className="px-4 text-gray-600">
              Pour les packs one-shot, les candidatures non utilisées restent disponibles pendant la durée de validité. Pour les abonnements, les candidatures non utilisées ne sont pas reportées au mois suivant.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
