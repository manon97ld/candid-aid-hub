import { useState } from "react";
import { Plus, Trash2, Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { TunnelData, SITUATIONS_PROFESSIONNELLES, DISPONIBILITES, NIVEAUX_ETUDE, Formation, Experience } from "@/types/tunnel";
import { cn } from "@/lib/utils";

interface Step4SituationProps {
  data: TunnelData;
  onChange: (updates: Partial<TunnelData>) => void;
  errors: Record<string, string>;
}

export function Step4Situation({ data, onChange, errors }: Step4SituationProps) {
  const [newFormation, setNewFormation] = useState<Formation>({
    type: '',
    intitule: '',
    etablissement: '',
    lieu: '',
    obtenu: true,
    dateDebut: '',
    dateFin: ''
  });

  const [newExperience, setNewExperience] = useState<Experience>({
    entreprise: '',
    poste: '',
    ville: '',
    dateDebut: '',
    dateFin: '',
    typeContrat: '',
    missions: ''
  });

  const toggleSituation = (situation: string) => {
    const current = data.situationProfessionnelle;
    if (current.includes(situation)) {
      onChange({ situationProfessionnelle: current.filter(s => s !== situation) });
    } else {
      onChange({ situationProfessionnelle: [...current, situation] });
    }
  };

  const toggleNiveauEtude = (niveau: string) => {
    const current = data.niveauEtude;
    if (current.includes(niveau)) {
      onChange({ niveauEtude: current.filter(n => n !== niveau) });
    } else {
      onChange({ niveauEtude: [...current, niveau] });
    }
  };

  const addFormation = () => {
    if (newFormation.intitule && newFormation.etablissement) {
      onChange({ formations: [...data.formations, newFormation] });
      setNewFormation({
        type: '',
        intitule: '',
        etablissement: '',
        lieu: '',
        obtenu: true,
        dateDebut: '',
        dateFin: ''
      });
    }
  };

  const removeFormation = (index: number) => {
    onChange({ formations: data.formations.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    if (newExperience.poste && newExperience.entreprise) {
      onChange({ experiences: [...data.experiences, newExperience] });
      setNewExperience({
        entreprise: '',
        poste: '',
        ville: '',
        dateDebut: '',
        dateFin: '',
        typeContrat: '',
        missions: ''
      });
    }
  };

  const removeExperience = (index: number) => {
    onChange({ experiences: data.experiences.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          Ta situation actuelle
        </h1>
        <p className="text-gray-600">
          Parle-nous de ton parcours pour mieux t'accompagner
        </p>
      </div>

      <div className="space-y-8">
        {/* Situation professionnelle */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">📌 Situation actuelle</h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Quelle est votre situation professionnelle actuelle ? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SITUATIONS_PROFESSIONNELLES.map((situation) => (
                  <label
                    key={situation}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                      data.situationProfessionnelle.includes(situation)
                        ? "border-gold bg-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      checked={data.situationProfessionnelle.includes(situation)}
                      onCheckedChange={() => toggleSituation(situation)}
                    />
                    <span className="text-sm">{situation}</span>
                  </label>
                ))}
              </div>
            </div>

            {data.situationProfessionnelle.includes('En emploi') && (
              <div>
                <Label className="mb-3 block">Si vous êtes en emploi, devez-vous prester un préavis ?</Label>
                <RadioGroup
                  value={data.preavis === null ? '' : data.preavis ? 'oui' : 'non'}
                  onValueChange={(v) => onChange({ preavis: v === 'oui' })}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="oui" id="preavis-oui" />
                    <Label htmlFor="preavis-oui" className="font-normal">Oui</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="non" id="preavis-non" />
                    <Label htmlFor="preavis-non" className="font-normal">Non</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div>
              <Label className="mb-3 block">Quelle est votre disponibilité pour commencer un emploi ? *</Label>
              <RadioGroup
                value={data.disponibilite}
                onValueChange={(v) => onChange({ disponibilite: v })}
                className="space-y-2"
              >
                {DISPONIBILITES.map((dispo) => (
                  <div key={dispo} className="flex items-center gap-2">
                    <RadioGroupItem value={dispo} id={`dispo-${dispo}`} />
                    <Label htmlFor={`dispo-${dispo}`} className="font-normal">{dispo}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Formations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gold" />
            🎓 Formations & Diplômes
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Notez TOUTES les études et formations du plus récent au moins récent
          </p>

          {/* Liste des formations ajoutées */}
          {data.formations.length > 0 && (
            <div className="space-y-3 mb-6">
              {data.formations.map((formation, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-navy">{formation.intitule}</p>
                    <p className="text-sm text-gray-600">{formation.etablissement} - {formation.lieu}</p>
                    <p className="text-xs text-gray-500">
                      {formation.dateDebut} - {formation.dateFin} | {formation.obtenu ? '✅ Obtenu' : '❌ Non obtenu'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFormation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire nouvelle formation */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-navy">Ajouter une formation</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formation-type">Type de formation</Label>
                <Input
                  id="formation-type"
                  value={newFormation.type}
                  onChange={(e) => setNewFormation({ ...newFormation, type: e.target.value })}
                  placeholder="Ex: Diplôme, Certificat, Cours..."
                />
              </div>
              <div>
                <Label htmlFor="formation-intitule">Intitulé *</Label>
                <Input
                  id="formation-intitule"
                  value={newFormation.intitule}
                  onChange={(e) => setNewFormation({ ...newFormation, intitule: e.target.value })}
                  placeholder="Ex: Bachelier en informatique"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formation-etablissement">Établissement *</Label>
                <Input
                  id="formation-etablissement"
                  value={newFormation.etablissement}
                  onChange={(e) => setNewFormation({ ...newFormation, etablissement: e.target.value })}
                  placeholder="Ex: Haute École de Bruxelles"
                />
              </div>
              <div>
                <Label htmlFor="formation-lieu">Lieu</Label>
                <Input
                  id="formation-lieu"
                  value={newFormation.lieu}
                  onChange={(e) => setNewFormation({ ...newFormation, lieu: e.target.value })}
                  placeholder="Ex: Bruxelles ou 'en ligne'"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="formation-debut">Date début</Label>
                <Input
                  id="formation-debut"
                  type="month"
                  value={newFormation.dateDebut}
                  onChange={(e) => setNewFormation({ ...newFormation, dateDebut: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="formation-fin">Date fin</Label>
                <Input
                  id="formation-fin"
                  type="month"
                  value={newFormation.dateFin}
                  onChange={(e) => setNewFormation({ ...newFormation, dateFin: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={newFormation.obtenu}
                    onCheckedChange={(checked) => setNewFormation({ ...newFormation, obtenu: !!checked })}
                  />
                  <span className="text-sm">Diplôme obtenu</span>
                </label>
              </div>
            </div>

            <Button
              type="button"
              onClick={addFormation}
              disabled={!newFormation.intitule || !newFormation.etablissement}
              className="btn-gold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter cette formation
            </Button>
          </div>

          {/* Niveau d'étude */}
          <div className="mt-6">
            <Label className="mb-3 block">Quel est votre niveau d'étude ?</Label>
            <div className="grid grid-cols-2 gap-2">
              {NIVEAUX_ETUDE.map((niveau) => (
                <label
                  key={niveau}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                    data.niveauEtude.includes(niveau)
                      ? "border-gold bg-gold/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Checkbox
                    checked={data.niveauEtude.includes(niveau)}
                    onCheckedChange={() => toggleNiveauEtude(niveau)}
                  />
                  <span className="text-sm">{niveau}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Expériences */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gold" />
            💼 Expériences professionnelles
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Notez TOUTES vos expériences du plus récent au moins récent
          </p>

          {/* Liste des expériences ajoutées */}
          {data.experiences.length > 0 && (
            <div className="space-y-3 mb-6">
              {data.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-navy">{exp.poste}</p>
                    <p className="text-sm text-gray-600">{exp.entreprise} - {exp.ville}</p>
                    <p className="text-xs text-gray-500">
                      {exp.dateDebut} - {exp.dateFin} | {exp.typeContrat}
                    </p>
                    {exp.missions && (
                      <p className="text-xs text-gray-500 mt-1">Missions: {exp.missions}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire nouvelle expérience */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-navy">Ajouter une expérience</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exp-entreprise">Entreprise *</Label>
                <Input
                  id="exp-entreprise"
                  value={newExperience.entreprise}
                  onChange={(e) => setNewExperience({ ...newExperience, entreprise: e.target.value })}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label htmlFor="exp-poste">Poste occupé *</Label>
                <Input
                  id="exp-poste"
                  value={newExperience.poste}
                  onChange={(e) => setNewExperience({ ...newExperience, poste: e.target.value })}
                  placeholder="Ex: Développeur web"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="exp-ville">Ville</Label>
                <Input
                  id="exp-ville"
                  value={newExperience.ville}
                  onChange={(e) => setNewExperience({ ...newExperience, ville: e.target.value })}
                  placeholder="Ex: Bruxelles"
                />
              </div>
              <div>
                <Label htmlFor="exp-debut">Date début</Label>
                <Input
                  id="exp-debut"
                  type="month"
                  value={newExperience.dateDebut}
                  onChange={(e) => setNewExperience({ ...newExperience, dateDebut: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="exp-fin">Date fin</Label>
                <Input
                  id="exp-fin"
                  type="month"
                  value={newExperience.dateFin}
                  onChange={(e) => setNewExperience({ ...newExperience, dateFin: e.target.value })}
                  placeholder="En cours"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exp-contrat">Type de contrat</Label>
              <Input
                id="exp-contrat"
                value={newExperience.typeContrat}
                onChange={(e) => setNewExperience({ ...newExperience, typeContrat: e.target.value })}
                placeholder="Ex: CDI, CDD, Stage..."
              />
            </div>

            <div>
              <Label htmlFor="exp-missions">3 à 5 missions principales</Label>
              <Textarea
                id="exp-missions"
                value={newExperience.missions}
                onChange={(e) => setNewExperience({ ...newExperience, missions: e.target.value })}
                placeholder="Décrivez vos principales responsabilités..."
                rows={3}
              />
            </div>

            <Button
              type="button"
              onClick={addExperience}
              disabled={!newExperience.poste || !newExperience.entreprise}
              className="btn-gold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter cette expérience
            </Button>
          </div>
        </div>

        {/* Compétences */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">🛠️ Compétences</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="competences-techniques">
                Compétences techniques (logiciels, machines, outils, etc.)
              </Label>
              <Textarea
                id="competences-techniques"
                value={data.competencesTechniques}
                onChange={(e) => onChange({ competencesTechniques: e.target.value })}
                placeholder="Ex: Excel, Word, SAP, Permis cariste..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="competences-autres">
                Autres compétences transversales / certifications
              </Label>
              <Textarea
                id="competences-autres"
                value={data.competencesAutres}
                onChange={(e) => onChange({ competencesAutres: e.target.value })}
                placeholder="Ex: Gestion d'équipe, service client, VCA..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
