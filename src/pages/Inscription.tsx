import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TunnelProgress } from "@/components/tunnel/TunnelProgress";
import { Step1Mode } from "@/components/tunnel/Step1Mode";
import { Step2Pricing } from "@/components/tunnel/Step2Pricing";
import { Step3Account } from "@/components/tunnel/Step3Account";
import { Step4Situation } from "@/components/tunnel/Step4Situation";
import { Step5Projet } from "@/components/tunnel/Step5Projet";
import { Step6Documents } from "@/components/tunnel/Step6Documents";
import { Step7Preferences } from "@/components/tunnel/Step7Preferences";
import { WelcomeAgent } from "@/components/WelcomeAgent";
import { TunnelData, initialTunnelData, ServiceMode, PlanType } from "@/types/tunnel";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TOTAL_STEPS = 7;
const STORAGE_KEY = 'candidaide_tunnel_data';

const Inscription = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<TunnelData>(initialTunnelData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({ ...prev, ...parsed }));
        toast.info("Nous avons retrouvé tes données précédentes !");
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [data]);

  const updateData = (updates: Partial<TunnelData>) => {
    setData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const errorKeys = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      errorKeys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!data.mode) newErrors.mode = "Choisis un mode d'accompagnement";
        break;
      case 2:
        if (data.mode !== 'autonome' && !data.plan) {
          newErrors.plan = "Choisis une formule";
        }
        break;
      case 3:
        if (!data.prenom) newErrors.prenom = "Le prénom est requis";
        if (!data.nom) newErrors.nom = "Le nom est requis";
        if (!data.email) newErrors.email = "L'email est requis";
        else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Email invalide";
        if (!data.telephone) newErrors.telephone = "Le téléphone est requis";
        if (!data.adresse) newErrors.adresse = "L'adresse est requise";
        if (!data.password) newErrors.password = "Le mot de passe est requis";
        else if (data.password.length < 8) newErrors.password = "Minimum 8 caractères";
        if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        if (!data.acceptCGU) newErrors.acceptCGU = "Tu dois accepter les CGU";
        break;
      case 4:
        if (data.situationProfessionnelle.length === 0) {
          newErrors.situation = "Indique ta situation professionnelle";
        }
        break;
      case 5:
        if (data.metiersRecherches.length === 0 && !data.metiersCustom) {
          newErrors.metiers = "Indique au moins un métier recherché";
        }
        break;
      case 7:
        const allConsents = Object.values(data.consentements).every(Boolean);
        if (!allConsents) newErrors.consentements = "Tous les consentements sont requis";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved data
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success("🎉 Inscription réussie !");
      navigate("/");
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Mode
            selectedMode={data.mode}
            onModeSelect={(mode: ServiceMode) => {
              updateData({ mode });
              if (mode === 'autonome') updateData({ plan: 'gratuit' });
            }}
          />
        );
      case 2:
        return (
          <Step2Pricing
            mode={data.mode!}
            selectedPlan={data.plan}
            servicesAdditionnels={data.servicesAdditionnels}
            onPlanSelect={(plan: PlanType) => updateData({ plan })}
            onServicesChange={(services) => updateData({ servicesAdditionnels: services })}
          />
        );
      case 3:
        return <Step3Account data={data} onChange={updateData} errors={errors} />;
      case 4:
        return <Step4Situation data={data} onChange={updateData} errors={errors} />;
      case 5:
        return <Step5Projet data={data} onChange={updateData} errors={errors} />;
      case 6:
        return <Step6Documents data={data} onChange={updateData} errors={errors} />;
      case 7:
        return <Step7Preferences data={data} onChange={updateData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-navy">
            Candid'<span className="text-gold">aide</span>
          </Link>
          <p className="text-sm text-gray-500">
            Étape {currentStep} sur {TOTAL_STEPS}
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <TunnelProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={(step) => step < currentStep && setCurrentStep(step)}
        />
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-32">
        {renderStep()}
      </main>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <Button
            onClick={nextStep}
            disabled={isSubmitting || (currentStep === 1 && !data.mode)}
            className="btn-gold gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : currentStep === TOTAL_STEPS ? (
              "Finaliser mon inscription"
            ) : (
              <>
                Continuer
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Welcome Agent */}
      <WelcomeAgent />
    </div>
  );
};

export default Inscription;
