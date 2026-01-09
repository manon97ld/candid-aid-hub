import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TunnelProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  "Mode",
  "Formule",
  "Compte",
  "Situation",
  "Projet",
  "Documents",
  "Validation"
];

export function TunnelProgress({ currentStep, totalSteps, onStepClick }: TunnelProgressProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-gold rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const canNavigate = step < currentStep && onStepClick;
          
          return (
            <button
              key={step}
              onClick={() => canNavigate && onStepClick(step)}
              disabled={!canNavigate}
              className={cn(
                "flex flex-col items-center gap-2 transition-all",
                canNavigate && "cursor-pointer hover:opacity-80",
                !canNavigate && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "tunnel-step",
                  isCompleted && "tunnel-step-completed",
                  isCurrent && "tunnel-step-active",
                  !isCompleted && !isCurrent && "tunnel-step-pending"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                isCurrent ? "text-navy" : "text-gray-500"
              )}>
                {STEP_LABELS[step - 1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
