import { X, Search, MapPin, Clock, Euro, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TunnelData, SECTEURS, TYPES_CONTRAT, HORAIRES, SALAIRES, TACHES_A_EVITER } from "@/types/tunnel";
import { cn } from "@/lib/utils";

// Liste des métiers populaires pour suggestions
const METIERS_POPULAIRES = [
  "Développeur web", "Comptable", "Commercial", "Secrétaire", "Technicien", 
  "Aide-soignant", "Cuisinier", "Chauffeur", "Magasinier", "Électricien",
  "Vendeur", "Agent administratif", "Infirmier", "Mécanicien", "Serveur"
];

interface Step5ProjetProps {
  data: TunnelData;
  onChange: (updates: Partial<TunnelData>) => void;
  errors: Record<string, string>;
}

export function Step5Projet({ data, onChange, errors }: Step5ProjetProps) {
  const toggleItem = (field: keyof TunnelData, item: string) => {
    const current = data[field] as string[];
    if (current.includes(item)) {
      onChange({ [field]: current.filter(i => i !== item) });
    } else {
      onChange({ [field]: [...current, item] });
    }
  };

  const addMetier = (metier: string) => {
    if (metier && !data.metiersRecherches.includes(metier)) {
      onChange({ metiersRecherches: [...data.metiersRecherches, metier] });
    }
  };

  const removeMetier = (metier: string) => {
    onChange({ metiersRecherches: data.metiersRecherches.filter(m => m !== metier) });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          🎯 Ton projet professionnel
        </h1>
        <p className="text-gray-600">
          Ces infos nous aident à te trouver les meilleures offres
        </p>
      </div>

      <div className="space-y-8">
        {/* Métiers recherchés */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-gold" />
            Poste / Secteur recherché
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Quels sont les métiers que vous souhaitez en priorité ? *</Label>
              
              {/* Métiers sélectionnés */}
              {data.metiersRecherches.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.metiersRecherches.map((metier) => (
                    <Badge
                      key={metier}
                      variant="secondary"
                      className="bg-gold/10 text-gold-dark border-gold/20 px-3 py-1"
                    >
                      {metier}
                      <button
                        onClick={() => removeMetier(metier)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggestions rapides */}
              <p className="text-sm text-gray-500 mb-2">Suggestions populaires :</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {METIERS_POPULAIRES.filter(m => !data.metiersRecherches.includes(m)).slice(0, 8).map((metier) => (
                  <button
                    key={metier}
                    onClick={() => addMetier(metier)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-full hover:border-gold hover:bg-gold/5 transition-colors"
                  >
                    + {metier}
                  </button>
                ))}
              </div>

              {/* Input custom */}
              <div>
                <Label htmlFor="metiers-custom">Autres métiers (séparez par des virgules)</Label>
                <Input
                  id="metiers-custom"
                  value={data.metiersCustom}
                  onChange={(e) => onChange({ metiersCustom: e.target.value })}
                  placeholder="Ex: Data analyst, Chef de projet digital..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const metiers = data.metiersCustom.split(',').map(m => m.trim()).filter(Boolean);
                      metiers.forEach(addMetier);
                      onChange({ metiersCustom: '' });
                    }
                  }}
                />
              </div>
            </div>

            {/* Secteurs */}
            <div>
              <Label className="mb-3 block">Dans quel(s) secteur(s) ? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {SECTEURS.map((secteur) => (
                  <label
                    key={secteur}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm",
                      data.secteursRecherches.includes(secteur)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.secteursRecherches.includes(secteur)}
                      onCheckedChange={() => toggleItem('secteursRecherches', secteur)}
                    />
                    <span>{secteur}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Métiers à éviter */}
            <div>
              <Label htmlFor="metiers-exclus">
                Métiers que vous ne voulez absolument PAS faire
              </Label>
              <Textarea
                id="metiers-exclus"
                value={data.metiersExclus}
                onChange={(e) => onChange({ metiersExclus: e.target.value })}
                placeholder="Ex: Téléprospection, porte-à-porte..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            Localisation & Mobilité
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="communes">Communes où vous souhaitez travailler</Label>
              <Input
                id="communes"
                placeholder="Ex: Bruxelles, 1000, Liège..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !data.communesRecherchees.includes(value)) {
                      onChange({ communesRecherchees: [...data.communesRecherchees, value] });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              {data.communesRecherchees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.communesRecherchees.map((commune) => (
                    <Badge
                      key={commune}
                      variant="secondary"
                      className="bg-gray-100"
                    >
                      {commune}
                      <button
                        onClick={() => toggleItem('communesRecherchees', commune)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-3 block">
                Distance maximale que vous pouvez parcourir: <span className="font-bold text-gold">{data.distanceMax} km</span>
              </Label>
              <Slider
                value={[data.distanceMax]}
                onValueChange={(value) => onChange({ distanceMax: value[0] })}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Types de contrat */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            Contrats & Horaires
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Quels types de contrats acceptez-vous ? *</Label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {TYPES_CONTRAT.map((contrat) => (
                  <label
                    key={contrat}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm",
                      data.typesContrat.includes(contrat)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.typesContrat.includes(contrat)}
                      onCheckedChange={() => toggleItem('typesContrat', contrat)}
                    />
                    <span>{contrat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Quels horaires acceptez-vous ? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {HORAIRES.map((horaire) => (
                  <label
                    key={horaire}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                      data.horairesAcceptes.includes(horaire)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.horairesAcceptes.includes(horaire)}
                      onCheckedChange={() => toggleItem('horairesAcceptes', horaire)}
                    />
                    <span className="text-sm">{horaire}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Salaire */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Euro className="w-5 h-5 text-gold" />
            Prétentions salariales
          </h2>

          <div>
            <Label className="mb-3 block">Quel est votre salaire BRUT mensuel souhaité ?</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SALAIRES.map((salaire) => (
                <label
                  key={salaire}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                    data.salaireSouhaite.includes(salaire)
                      ? "border-gold bg-gold/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Checkbox
                    checked={data.salaireSouhaite.includes(salaire)}
                    onCheckedChange={() => toggleItem('salaireSouhaite', salaire)}
                  />
                  <span className="text-sm">{salaire}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tâches à éviter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gold" />
            Conditions à éviter
          </h2>

          <div>
            <Label className="mb-3 block">
              Y a-t-il des types de tâches ou de conditions de travail que vous souhaitez éviter ?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TACHES_A_EVITER.map((tache) => (
                <label
                  key={tache}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                    data.tachesAEviter.includes(tache)
                      ? "border-gold bg-gold/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Checkbox
                    checked={data.tachesAEviter.includes(tache)}
                    onCheckedChange={() => toggleItem('tachesAEviter', tache)}
                  />
                  <span className="text-sm">{tache}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
