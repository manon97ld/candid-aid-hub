import { useState } from "react";
import { Eye, EyeOff, Check, X, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TunnelData, CATEGORIES_PERMIS } from "@/types/tunnel";
import { cn } from "@/lib/utils";

interface Step3AccountProps {
  data: TunnelData;
  onChange: (updates: Partial<TunnelData>) => void;
  errors: Record<string, string>;
}

export function Step3Account({ data, onChange, errors }: Step3AccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(data.password);
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

  const toggleCategoriePermis = (categorie: string) => {
    const current = data.categoriesPermis;
    if (current.includes(categorie)) {
      onChange({ categoriesPermis: current.filter(c => c !== categorie) });
    } else {
      onChange({ categoriesPermis: [...current, categorie] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          Créons ton compte
        </h1>
        <p className="text-gray-600">
          Renseigne tes informations pour créer ton espace personnel
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Identité */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            🧍 Identité & Coordonnées
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={data.prenom}
                onChange={(e) => onChange({ prenom: e.target.value })}
                className={cn(errors.prenom && "border-red-500")}
                placeholder="Ton prénom"
              />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={data.nom}
                onChange={(e) => onChange({ nom: e.target.value })}
                className={cn(errors.nom && "border-red-500")}
                placeholder="Ton nom"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="adresse">Adresse (ville et code postal minimum) *</Label>
            <Input
              id="adresse"
              value={data.adresse}
              onChange={(e) => onChange({ adresse: e.target.value })}
              className={cn(errors.adresse && "border-red-500")}
              placeholder="Ex: Rue de la Loi 16, 1000 Bruxelles"
            />
            {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  className={cn("pl-10", errors.email && "border-red-500")}
                  placeholder="ton@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="telephone"
                  type="tel"
                  value={data.telephone}
                  onChange={(e) => onChange({ telephone: e.target.value })}
                  className={cn("pl-10", errors.telephone && "border-red-500")}
                  placeholder="+32 xxx xx xx xx"
                />
              </div>
              {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
            </div>
          </div>
        </div>

        {/* Section: Permis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">🚗 Permis & Véhicule</h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Possédez-vous un permis de conduire ? *</Label>
              <RadioGroup
                value={data.permisConduire === null ? '' : data.permisConduire ? 'oui' : 'non'}
                onValueChange={(v) => onChange({ permisConduire: v === 'oui' })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="oui" id="permis-oui" />
                  <Label htmlFor="permis-oui" className="font-normal">Oui</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="non" id="permis-non" />
                  <Label htmlFor="permis-non" className="font-normal">Non</Label>
                </div>
              </RadioGroup>
            </div>

            {data.permisConduire && (
              <div>
                <Label className="mb-3 block">Quelles catégories de permis possédez-vous ?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES_PERMIS.map((cat) => (
                    <label
                      key={cat}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                        data.categoriesPermis.includes(cat)
                          ? "border-gold bg-gold/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Checkbox
                        checked={data.categoriesPermis.includes(cat)}
                        onCheckedChange={() => toggleCategoriePermis(cat)}
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="mb-3 block">Disposez-vous d'un véhicule personnel ? *</Label>
              <RadioGroup
                value={data.vehiculePersonnel === null ? '' : data.vehiculePersonnel ? 'oui' : 'non'}
                onValueChange={(v) => onChange({ vehiculePersonnel: v === 'oui' })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="oui" id="vehicule-oui" />
                  <Label htmlFor="vehicule-oui" className="font-normal">Oui</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="non" id="vehicule-non" />
                  <Label htmlFor="vehicule-non" className="font-normal">Non</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Section: Mot de passe */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            Sécurité du compte
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => onChange({ password: e.target.value })}
                  className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              
              {/* Password strength */}
              {data.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all",
                          i < passwordStrength ? strengthColors[passwordStrength] : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn(
                    "text-xs",
                    passwordStrength <= 1 ? "text-red-500" : passwordStrength <= 2 ? "text-yellow-600" : "text-green-600"
                  )}>
                    Force: {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.confirmPassword}
                  onChange={(e) => onChange({ confirmPassword: e.target.value })}
                  className={cn("pl-10 pr-10", errors.confirmPassword && "border-red-500")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {data.confirmPassword && (
                <div className="flex items-center gap-1 mt-1">
                  {data.password === data.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm">Les mots de passe correspondent</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-500" />
                      <span className="text-red-500 text-sm">Les mots de passe ne correspondent pas</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consentements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">📝 Consentements</h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={data.acceptCGU}
                onCheckedChange={(checked) => onChange({ acceptCGU: !!checked })}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                J'accepte les <a href="/cgu" className="text-gold underline">Conditions Générales d'Utilisation</a> et la <a href="/confidentialite" className="text-gold underline">Politique de confidentialité</a> *
              </span>
            </label>
            {errors.acceptCGU && <p className="text-red-500 text-sm">{errors.acceptCGU}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={data.acceptNewsletter}
                onCheckedChange={(checked) => onChange({ acceptNewsletter: !!checked })}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                Je veux recevoir des conseils emploi par email (optionnel)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
