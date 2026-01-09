import { MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  TunnelData, 
  FREQUENCES_SUIVI, 
  MOMENTS_DISPONIBLES, 
  MOYENS_CONTACT,
  SITES_EMPLOI,
  SOURCES_DECOUVERTE,
  ACCES_FOREM_OPTIONS,
  ACCES_SITES_OPTIONS,
  UTILISER_COMPTES_OPTIONS
} from "@/types/tunnel";
import { cn } from "@/lib/utils";

interface Step7PreferencesProps {
  data: TunnelData;
  onChange: (updates: Partial<TunnelData>) => void;
  errors: Record<string, string>;
}

export function Step7Preferences({ data, onChange, errors }: Step7PreferencesProps) {
  const toggleItem = (field: keyof TunnelData, item: string) => {
    const current = data[field] as string[];
    if (current.includes(item)) {
      onChange({ [field]: current.filter(i => i !== item) });
    } else {
      onChange({ [field]: [...current, item] });
    }
  };

  const updateConsentement = (key: keyof TunnelData['consentements'], value: boolean) => {
    onChange({
      consentements: {
        ...data.consentements,
        [key]: value
      }
    });
  };

  const allConsentsChecked = Object.values(data.consentements).every(Boolean);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          📞 Préférences de communication
        </h1>
        <p className="text-gray-600">
          Dernières informations pour personnaliser ton accompagnement
        </p>
      </div>

      <div className="space-y-8">
        {/* Fréquence de suivi */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            Fréquence de contact
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">À quelle fréquence souhaitez-vous recevoir des points de suivi ? *</Label>
              <RadioGroup
                value={data.frequenceSuivi}
                onValueChange={(v) => onChange({ frequenceSuivi: v })}
                className="space-y-2"
              >
                {FREQUENCES_SUIVI.map((freq) => (
                  <div key={freq} className="flex items-center gap-2">
                    <RadioGroupItem value={freq} id={`freq-${freq}`} />
                    <Label htmlFor={`freq-${freq}`} className="font-normal">{freq}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block">À quels moments êtes-vous disponible pour être contacté ? *</Label>
              <div className="grid grid-cols-2 gap-2">
                {MOMENTS_DISPONIBLES.map((moment) => (
                  <label
                    key={moment}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                      data.momentsDisponibles.includes(moment)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.momentsDisponibles.includes(moment)}
                      onCheckedChange={() => toggleItem('momentsDisponibles', moment)}
                    />
                    <span className="text-sm">{moment}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Quel moyen de contact préférez-vous ? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MOYENS_CONTACT.map((moyen) => (
                  <label
                    key={moyen}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                      data.moyensContact.includes(moyen)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.moyensContact.includes(moyen)}
                      onCheckedChange={() => toggleItem('moyensContact', moyen)}
                    />
                    <span className="text-sm">{moyen}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accès Forem */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">🔐 Accès aux sites d'emploi</h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">
                Acceptez-vous de communiquer vos identifiants Forem afin que nous puissions améliorer votre profil et envoyer des candidatures ? *
              </Label>
              <RadioGroup
                value={data.accesForem}
                onValueChange={(v) => onChange({ accesForem: v })}
                className="space-y-2"
              >
                {ACCES_FOREM_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`forem-${option}`} />
                    <Label htmlFor={`forem-${option}`} className="font-normal capitalize">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {data.accesForem === 'oui' && (
              <div>
                <Label htmlFor="identifiants-forem">Identifiants Forem (email et mot de passe)</Label>
                <Textarea
                  id="identifiants-forem"
                  value={data.identifiantsForem}
                  onChange={(e) => onChange({ identifiantsForem: e.target.value })}
                  placeholder="Email: ...\nMot de passe: ..."
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔒 Ces informations sont sécurisées et utilisées uniquement pour vos démarches d'emploi
                </p>
              </div>
            )}

            <div>
              <Label className="mb-3 block">Sur quels sites d'intérim et d'emplois avez-vous déjà un compte ?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SITES_EMPLOI.map((site) => (
                  <label
                    key={site}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm",
                      data.sitesEmploi.includes(site)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.sitesEmploi.includes(site)}
                      onCheckedChange={() => toggleItem('sitesEmploi', site)}
                    />
                    <span>{site}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Pouvez-vous vous connecter facilement à ces comptes ?</Label>
              <RadioGroup
                value={data.accesSitesEmploi}
                onValueChange={(v) => onChange({ accesSitesEmploi: v })}
                className="space-y-2"
              >
                {ACCES_SITES_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`acces-${option}`} />
                    <Label htmlFor={`acces-${option}`} className="font-normal">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block">Souhaitez-vous que nous utilisions vos comptes existants ?</Label>
              <RadioGroup
                value={data.utiliserComptesExistants}
                onValueChange={(v) => onChange({ utiliserComptesExistants: v })}
                className="space-y-2"
              >
                {UTILISER_COMPTES_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`utiliser-${option}`} />
                    <Label htmlFor={`utiliser-${option}`} className="font-normal">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {data.utiliserComptesExistants?.includes('certains') && (
              <div>
                <Label htmlFor="comptes-a-utiliser">Précisez lesquels</Label>
                <Input
                  id="comptes-a-utiliser"
                  value={data.comptesAUtiliser}
                  onChange={(e) => onChange({ comptesAUtiliser: e.target.value })}
                  placeholder="Ex: LinkedIn, Indeed..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Source découverte */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">📣 Comment avez-vous connu Candid'aide ?</h2>

          <div className="grid grid-cols-2 gap-2">
            {SOURCES_DECOUVERTE.map((source) => (
              <label
                key={source}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                  data.sourceDecouverte.includes(source)
                    ? "border-gold bg-gold/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Checkbox
                  checked={data.sourceDecouverte.includes(source)}
                  onCheckedChange={() => toggleItem('sourceDecouverte', source)}
                />
                <span className="text-sm">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Consentements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">📝 Autorisations & Consentements *</h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.infoExactes}
                onCheckedChange={(checked) => updateConsentement('infoExactes', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                Je certifie que les informations fournies sont exactes et complètes, et j'assume la responsabilité en cas d'erreur ou de falsification.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.autorisationCandidatures}
                onCheckedChange={(checked) => updateConsentement('autorisationCandidatures', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                J'autorise Candid'aide à préparer, adapter et envoyer des candidatures en mon nom, en utilisant les documents fournis uniquement dans le cadre de ma recherche d'emploi.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.autorisationIdentifiants}
                onCheckedChange={(checked) => updateConsentement('autorisationIdentifiants', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                J'autorise Candid'aide à utiliser de manière sécurisée les identifiants ou accès que je fournis (Forem, Indeed, agences d'intérim…), exclusivement pour mes démarches d'emploi.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.pasGarantie}
                onCheckedChange={(checked) => updateConsentement('pasGarantie', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                Je comprends que Candid'aide ne peut garantir ni entretien ni embauche, les décisions appartenant exclusivement aux employeurs.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.serviceAdministratif}
                onCheckedChange={(checked) => updateConsentement('serviceAdministratif', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                Je comprends que Candid'aide est un service d'assistance administrative et opérationnelle, et ne remplace pas les services publics de l'emploi ou un conseil juridique.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.autorisationContact}
                onCheckedChange={(checked) => updateConsentement('autorisationContact', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                J'autorise Candid'aide à me contacter via WhatsApp, SMS, email ou Messenger dans le cadre du suivi de mes candidatures.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.engagement}
                onCheckedChange={(checked) => updateConsentement('engagement', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                Je m'engage à informer Candid'aide de tout changement de situation (emploi trouvé, modification de disponibilités…) et à rester disponible pour les entretiens dans un délai raisonnable (24–48h).
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={data.consentements.rgpd}
                onCheckedChange={(checked) => updateConsentement('rgpd', !!checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-600">
                J'autorise Candid'aide à traiter et conserver mes données personnelles pendant la durée nécessaire à ma recherche d'emploi, conformément au RGPD, et je comprends que je peux demander leur suppression à tout moment.
              </span>
            </label>
          </div>

          {!allConsentsChecked && (
            <p className="text-sm text-orange-600 mt-4">
              ⚠️ Veuillez accepter tous les consentements pour continuer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
