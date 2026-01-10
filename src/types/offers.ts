export interface Offer {
  id: string;
  titre: string;
  entreprise: string | null;
  lieu: string | null;
  code_postal: string | null;
  type_contrat: string | null;
  description: string | null;
  date_publication: string | null;
  source: string | null;
  lien_candidature: string | null;
  domaine: string | null;
  salaire?: string | null;
}

export interface OffersResponse {
  total: number;
  limit: number;
  offset: number;
  offers: Offer[];
  error?: string;
}

export interface Candidature {
  id: string;
  candidat_id: string;
  offre_id: string;
  statut: 'proposee' | 'approuvee' | 'envoyee' | 'entretien' | 'refusee' | 'abandonnee';
  score_matching: number | null;
  date_envoi: string | null;
  created_at: string;
  notes: string | null;
  offre?: Offer;
}

export type CandidatureStatut = Candidature['statut'];

export const STATUT_LABELS: Record<CandidatureStatut, string> = {
  proposee: 'Proposée',
  approuvee: 'Approuvée',
  envoyee: 'Envoyée',
  entretien: 'Entretien',
  refusee: 'Refusée',
  abandonnee: 'Abandonnée',
};

export const STATUT_COLORS: Record<CandidatureStatut, string> = {
  proposee: 'bg-blue-100 text-blue-700 border-blue-200',
  approuvee: 'bg-green-100 text-green-700 border-green-200',
  envoyee: 'bg-purple-100 text-purple-700 border-purple-200',
  entretien: 'bg-gold/20 text-gold-dark border-gold/30',
  refusee: 'bg-red-100 text-red-700 border-red-200',
  abandonnee: 'bg-gray-100 text-gray-600 border-gray-200',
};
