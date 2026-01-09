export type ServiceMode = 'autonome' | 'assiste' | 'delegation';

export type PlanType = 
  | 'gratuit' 
  | 'pack_8' 
  | 'mensuel_30' 
  | 'pack_15' 
  | 'premium_mensuel' 
  | 'premium_trimestriel';

export interface Formation {
  type: string;
  intitule: string;
  etablissement: string;
  lieu: string;
  obtenu: boolean;
  dateDebut: string;
  dateFin: string;
}

export interface Experience {
  entreprise: string;
  poste: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  typeContrat: string;
  missions: string;
}

export interface TunnelData {
  // Step 1 - Mode
  mode: ServiceMode | null;
  
  // Step 2 - Pricing
  plan: PlanType | null;
  servicesAdditionnels: string[];
  
  // Step 3 - Account (Identité)
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  password: string;
  confirmPassword: string;
  acceptCGU: boolean;
  acceptNewsletter: boolean;
  
  // Permis & véhicule
  permisConduire: boolean | null;
  categoriesPermis: string[];
  vehiculePersonnel: boolean | null;
  
  // Step 4 - Situation & Profile
  situationProfessionnelle: string[];
  preavis: boolean | null;
  disponibilite: string;
  
  // Formations
  formations: Formation[];
  niveauEtude: string[];
  
  // Expériences
  experiences: Experience[];
  
  // Compétences
  competencesTechniques: string;
  competencesAutres: string;
  
  // Step 5 - Projet professionnel
  metiersRecherches: string[];
  metiersCustom: string;
  secteursRecherches: string[];
  metiersExclus: string;
  communesRecherchees: string[];
  distanceMax: number;
  typesContrat: string[];
  horairesAcceptes: string[];
  salaireSouhaite: string[];
  tachesAEviter: string[];
  
  // Step 6 - CV & Documents
  cvFile: File | null;
  cvUrl: string;
  lettreMotivationFile: File | null;
  lettreMotivationUrl: string;
  diplomesFile: File | null;
  diplomesUrl: string;
  certificatsFile: File | null;
  certificatsUrl: string;
  
  // Compétences extraites par IA
  competencesExtraites: string[];
  experiencesExtraites: string[];
  scoreCv: number;
  
  // Step 7 - Preferences & Communication
  frequenceSuivi: string;
  momentsDisponibles: string[];
  moyensContact: string[];
  accesForem: string;
  identifiantsForem: string;
  sitesEmploi: string[];
  accesSitesEmploi: string;
  utiliserComptesExistants: string;
  comptesAUtiliser: string;
  sourceDecouverte: string[];
  
  // Consentements
  consentements: {
    infoExactes: boolean;
    autorisationCandidatures: boolean;
    autorisationIdentifiants: boolean;
    pasGarantie: boolean;
    serviceAdministratif: boolean;
    autorisationContact: boolean;
    engagement: boolean;
    rgpd: boolean;
  };
}

export const initialTunnelData: TunnelData = {
  mode: null,
  plan: null,
  servicesAdditionnels: [],
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  adresse: '',
  password: '',
  confirmPassword: '',
  acceptCGU: false,
  acceptNewsletter: false,
  permisConduire: null,
  categoriesPermis: [],
  vehiculePersonnel: null,
  situationProfessionnelle: [],
  preavis: null,
  disponibilite: '',
  formations: [],
  niveauEtude: [],
  experiences: [],
  competencesTechniques: '',
  competencesAutres: '',
  metiersRecherches: [],
  metiersCustom: '',
  secteursRecherches: [],
  metiersExclus: '',
  communesRecherchees: [],
  distanceMax: 30,
  typesContrat: [],
  horairesAcceptes: [],
  salaireSouhaite: [],
  tachesAEviter: [],
  cvFile: null,
  cvUrl: '',
  lettreMotivationFile: null,
  lettreMotivationUrl: '',
  diplomesFile: null,
  diplomesUrl: '',
  certificatsFile: null,
  certificatsUrl: '',
  competencesExtraites: [],
  experiencesExtraites: [],
  scoreCv: 0,
  frequenceSuivi: '',
  momentsDisponibles: [],
  moyensContact: [],
  accesForem: '',
  identifiantsForem: '',
  sitesEmploi: [],
  accesSitesEmploi: '',
  utiliserComptesExistants: '',
  comptesAUtiliser: '',
  sourceDecouverte: [],
  consentements: {
    infoExactes: false,
    autorisationCandidatures: false,
    autorisationIdentifiants: false,
    pasGarantie: false,
    serviceAdministratif: false,
    autorisationContact: false,
    engagement: false,
    rgpd: false,
  },
};

// Options data
export const CATEGORIES_PERMIS = [
  'Aucun permis',
  'AM / A1 / A2 / A (moto)',
  'B (voiture)',
  'B+E (voiture + remorque lourde)',
  'C / C1 (camion)',
  'C+E / C1+E (camion + remorque)',
  'D / D1 (bus / minibus)',
  'D+E / D1+E (bus / minibus + remorque)',
  'G (tracteur agricole)',
];

export const SITUATIONS_PROFESSIONNELLES = [
  'En emploi',
  'Au chômage',
  'Etudiant',
  'En reconversion',
  'Au cpas',
];

export const DISPONIBILITES = [
  'Immédiate',
  'Dans une à deux semaines',
  'Dans environ un mois',
  "C'est en fonction du préavis",
];

export const NIVEAUX_ETUDE = [
  'Sans diplôme',
  'CEB (Certificat d\'études de base)',
  'CE1D / CE2D (secondaire inférieur)',
  'CESS (secondaire supérieur)',
  'Bachelier (Haute école)',
  'Master (Université)',
  'Doctorat',
  'Formation professionnelle (IFAPME, etc.)',
];

export const SECTEURS = [
  'Administration et secrétariat',
  'Agriculture et environnement',
  'Art et culture',
  'Commerce et vente',
  'Communication et marketing',
  'Construction et bâtiment',
  'Enseignement et formation',
  'Finance et comptabilité',
  'Hôtellerie et restauration',
  'Industrie et production',
  'Informatique et IT',
  'Logistique et transport',
  'Santé et social',
  'Sciences et recherche',
  'Services à la personne',
  'Tourisme et loisirs',
];

export const TYPES_CONTRAT = [
  '1/4 temps (+/- 10h semaine)',
  'Mi-temps (+/- 20h semaine)',
  '3/4 temps (30h/semaine)',
  'Temps plein (38h/semaine)',
  'Contrat collaboration indépendant',
  'Durée déterminée (CDD)',
  'Durée indéterminée (CDI)',
  'Etudiant',
  'Flexi-Jobs',
  'Freelance / indépendant',
  'Intérimaire',
  'Intérimaire avec option sur durée indéterminée',
  'Journalier (occasionnel ou saisonnier)',
  'Nettement défini',
  'Remplacement',
  'Salarié statutaire',
];

export const HORAIRES = [
  'Matin (5h-13h)',
  'Journée (9h-17h)',
  'Après-midi (13h-21h)',
  'Nuit (21h-5h)',
  'Horaire variable',
  'Weekend',
];

export const SALAIRES = [
  'Moins de 2000 € Brut',
  'Entre 2 000 € et 2 500 € Brut',
  'Entre 2 500 € et 3 000 € Brut',
  'Entre 3 000 € et 3500 € Brut',
  'Plus de 3500 € Brut',
];

export const TACHES_A_EVITER = [
  'Porter des charges lourdes',
  'Rester longtemps debout',
  'Rester longtemps assis',
  'Travail en extérieur (froid/chaud)',
  'Travail de nuit',
  'Travail répétitif',
  'Travail isolé',
  'Missions longues distances',
  'Travail physiquement exigeant',
  'Tâches administratives lourdes',
  'Aucun en particulier',
];

export const FREQUENCES_SUIVI = [
  'Quotidien (tous les jours)',
  '2-3 fois/semaine',
  'Une fois semaine',
  'Uniquement quand je le demande',
];

export const MOMENTS_DISPONIBLES = [
  'Matin (8h-12h)',
  'Après-midi (12h-17h)',
  'Soir (17h-22h)',
  'Aucune préférence',
];

export const MOYENS_CONTACT = [
  'Email',
  'Sms',
  'Appel téléphonique',
  'Whatsapp',
  'Messenger (Facebook)',
  'Teams',
  'Peu m\'importe',
];

export const SITES_EMPLOI = [
  'Forem',
  'Indeed',
  'LinkedIn',
  'StepStone',
  'Randstad',
  'Manpower',
  'Adecco',
  'Tempo-Team',
  'Start People',
  'Accent',
  'Unique',
  'Daoust',
];

export const SOURCES_DECOUVERTE = [
  'Facebook (publication)',
  'Facebook (groupe)',
  'Facebook (publicité)',
  'Instagram',
  'Google / Recherche internet',
  'Bouche-à-oreille',
  'Recommandation d\'un ami / membre de la famille',
  'Recommandation d\'un partenaire / organisme (CPAS, ASBL…)',
  'Flyer / Affiche / carte de visite',
];

export const ACCES_FOREM_OPTIONS = [
  'oui',
  'non',
  'je n\'ai pas de compte forem',
  'je ne me rappelle plus de mes identifiants',
];

export const ACCES_SITES_OPTIONS = [
  'Oui, à tous',
  'Oui, à certains seulement',
  'Non, j\'ai perdu certains accès',
  'Je ne sais pas / à vérifier',
];

export const UTILISER_COMPTES_OPTIONS = [
  'Oui',
  'Oui, mais seulement certains (préciser)',
  'Non, je préfère créer de nouveaux comptes',
];
