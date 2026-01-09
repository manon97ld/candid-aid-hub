
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('candidat', 'assistant', 'recruteur', 'admin');

-- Create service_mode enum
CREATE TYPE public.service_mode AS ENUM ('autonome', 'assiste', 'delegation');

-- Create candidature_statut enum
CREATE TYPE public.candidature_statut AS ENUM ('proposee', 'approuvee', 'envoyee', 'entretien', 'refusee', 'abandonnee');

-- Create activity_type enum
CREATE TYPE public.activity_type AS ENUM (
  'PROFILE_CREATED', 'CV_PARSED', 'OFFER_IMPORTED', 'OFFER_SUGGESTED', 
  'OFFER_APPROVED', 'APPLICATION_SENT', 'INTERVIEW_SCHEDULED', 
  'PROFILE_UPDATED', 'MESSAGE_SENT', 'LOGIN', 'SUBSCRIPTION_CHANGED'
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'candidat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Candidats table
CREATE TABLE public.candidats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  mode_service service_mode NOT NULL DEFAULT 'autonome',
  plan_type TEXT DEFAULT 'gratuit',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Permis & véhicule
  permis_conduire BOOLEAN DEFAULT false,
  categories_permis TEXT[] DEFAULT '{}',
  vehicule_personnel BOOLEAN DEFAULT false,
  
  -- Situation
  situation_professionnelle TEXT[] DEFAULT '{}',
  preavis BOOLEAN DEFAULT false,
  disponibilite TEXT,
  
  -- Formation
  formations JSONB DEFAULT '[]',
  niveau_etude TEXT[] DEFAULT '{}',
  
  -- Expériences
  experiences JSONB DEFAULT '[]',
  
  -- Compétences
  competences_techniques TEXT,
  competences_autres TEXT,
  
  -- Projet professionnel
  metiers_recherches TEXT[] DEFAULT '{}',
  metiers_custom TEXT,
  secteurs_recherches TEXT[] DEFAULT '{}',
  metiers_exclus TEXT,
  communes_recherchees TEXT[] DEFAULT '{}',
  distance_max INTEGER DEFAULT 50,
  types_contrat TEXT[] DEFAULT '{}',
  horaires_acceptes TEXT[] DEFAULT '{}',
  salaire_souhaite TEXT[] DEFAULT '{}',
  taches_a_eviter TEXT[] DEFAULT '{}',
  
  -- Communication
  frequence_suivi TEXT DEFAULT 'hebdomadaire',
  moments_disponibles TEXT[] DEFAULT '{}',
  moyens_contact TEXT[] DEFAULT '{}',
  
  -- Forem
  acces_forem TEXT,
  identifiants_forem TEXT,
  sites_emploi TEXT[] DEFAULT '{}',
  acces_sites_emploi TEXT,
  utiliser_comptes_existants TEXT,
  comptes_a_utiliser TEXT,
  
  -- Documents
  cv_url TEXT,
  lettre_motivation_url TEXT,
  diplomes_url TEXT,
  certificats_url TEXT,
  
  -- Consentements
  consentements JSONB DEFAULT '{}',
  source_decouverte TEXT[] DEFAULT '{}',
  
  -- Profil
  progression_profil INTEGER DEFAULT 0,
  assistant_id UUID REFERENCES auth.users(id),
  statut TEXT DEFAULT 'actif',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidats ENABLE ROW LEVEL SECURITY;

-- Offres table
CREATE TABLE public.offres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  entreprise TEXT,
  lieu TEXT,
  ville TEXT,
  code_postal TEXT,
  description TEXT,
  type_contrat TEXT,
  domaine TEXT,
  competences_requises TEXT[] DEFAULT '{}',
  salaire TEXT,
  source TEXT DEFAULT 'Interne',
  id_externe TEXT,
  lien_candidature TEXT,
  date_publication TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_expiration TIMESTAMP WITH TIME ZONE,
  statut TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.offres ENABLE ROW LEVEL SECURITY;

-- Candidatures table
CREATE TABLE public.candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID REFERENCES public.candidats(id) ON DELETE CASCADE NOT NULL,
  offre_id UUID REFERENCES public.offres(id) ON DELETE CASCADE NOT NULL,
  assistant_id UUID REFERENCES auth.users(id),
  statut candidature_statut DEFAULT 'proposee',
  score_matching INTEGER DEFAULT 0,
  raisons_matching JSONB DEFAULT '[]',
  cv_utilise_url TEXT,
  lettre_url TEXT,
  mode_envoi TEXT,
  date_envoi TIMESTAMP WITH TIME ZONE,
  reponse_recruteur TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- Journal d'activité
CREATE TABLE public.journal_activite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type_action activity_type NOT NULL,
  details JSONB DEFAULT '{}',
  visible_candidat BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_activite ENABLE ROW LEVEL SECURITY;

-- Messages table for chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_candidats_updated_at BEFORE UPDATE ON public.candidats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offres_updated_at BEFORE UPDATE ON public.offres FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_candidatures_updated_at BEFORE UPDATE ON public.candidatures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile and role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, prenom, nom)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'prenom',
    NEW.raw_user_meta_data ->> 'nom'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'candidat'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Assistants can view assigned candidats profiles" ON public.profiles FOR SELECT USING (
  public.has_role(auth.uid(), 'assistant') AND 
  EXISTS (SELECT 1 FROM public.candidats WHERE candidats.user_id = profiles.user_id AND candidats.assistant_id = auth.uid())
);

-- Candidats policies
CREATE POLICY "Users can view their own candidat record" ON public.candidats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own candidat record" ON public.candidats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own candidat record" ON public.candidats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all candidats" ON public.candidats FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Assistants can view assigned candidats" ON public.candidats FOR SELECT USING (assistant_id = auth.uid());
CREATE POLICY "Assistants can update assigned candidats" ON public.candidats FOR UPDATE USING (assistant_id = auth.uid());

-- Offres policies
CREATE POLICY "Anyone can view active offres" ON public.offres FOR SELECT USING (statut = 'active');
CREATE POLICY "Recruteurs can manage their own offres" ON public.offres FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all offres" ON public.offres FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Candidatures policies
CREATE POLICY "Users can view their own candidatures" ON public.candidatures FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.candidats WHERE candidats.id = candidatures.candidat_id AND candidats.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own candidatures" ON public.candidatures FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.candidats WHERE candidats.id = candidatures.candidat_id AND candidats.user_id = auth.uid())
);
CREATE POLICY "Assistants can manage assigned candidatures" ON public.candidatures FOR ALL USING (assistant_id = auth.uid());
CREATE POLICY "Admins can manage all candidatures" ON public.candidatures FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Journal policies
CREATE POLICY "Users can view their own activity" ON public.journal_activite FOR SELECT USING (user_id = auth.uid() AND visible_candidat = true);
CREATE POLICY "Admins can view all activity" ON public.journal_activite FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert activity" ON public.journal_activite FOR INSERT WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update read status" ON public.messages FOR UPDATE USING (receiver_id = auth.uid());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
