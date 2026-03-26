-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Catégories de formations
-- ============================================
CREATE TABLE formations_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  emoji text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Formations
-- ============================================
CREATE TABLE formations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_courte text,
  description_longue text,
  url_officielle text,
  url_affiliation text,
  logo_url text,
  image_cover_url text,
  categorie_id uuid REFERENCES formations_categories(id) ON DELETE SET NULL,
  fondateur text,
  prix_min integer,
  prix_max integer,
  eligible_cpf boolean DEFAULT false,
  duree_heures integer,
  format text DEFAULT '100% en ligne',
  garantie boolean DEFAULT false,
  description_garantie text,
  nb_etudiants integer,
  taux_placement integer,
  revenu_moyen_apres integer,
  note_moyenne numeric(3,2) DEFAULT 0,
  nb_avis integer DEFAULT 0,
  est_sponsorisee boolean DEFAULT false,
  rang_sponsorise integer,
  est_recommandee boolean DEFAULT false,
  est_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_formations_categorie ON formations(categorie_id);
CREATE INDEX idx_formations_slug ON formations(slug);
CREATE INDEX idx_formations_note ON formations(note_moyenne DESC);

-- ============================================
-- Avis utilisateurs
-- ============================================
CREATE TABLE avis (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  auteur_prenom text,
  auteur_metier_avant text,
  auteur_metier_apres text,
  note integer CHECK (note BETWEEN 1 AND 5),
  titre text,
  contenu text,
  est_verifie boolean DEFAULT false,
  preuve_achat_url text,
  est_publie boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_avis_formation ON avis(formation_id);
CREATE INDEX idx_avis_publie ON avis(est_publie);

-- ============================================
-- Moteur de matching
-- ============================================
CREATE TABLE matching_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordre integer NOT NULL,
  question text NOT NULL,
  type text NOT NULL
);

CREATE TABLE matching_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid REFERENCES matching_questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  valeur text NOT NULL
);

CREATE TABLE matching_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reponses jsonb,
  formations_recommandees uuid[],
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Organisations (formations qui revendiquent leur fiche)
-- ============================================
CREATE TABLE organisations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  plan text DEFAULT 'gratuit',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE formations_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;

-- Catégories : lecture publique
CREATE POLICY "categories_public_read" ON formations_categories
  FOR SELECT USING (true);

-- Formations : lecture publique des formations actives
CREATE POLICY "formations_public_read" ON formations
  FOR SELECT USING (est_active = true);

-- Formations : les admins peuvent tout faire (via service role)
CREATE POLICY "formations_admin_all" ON formations
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Avis : lecture publique des avis publiés uniquement
CREATE POLICY "avis_public_read" ON avis
  FOR SELECT USING (est_publie = true);

-- Avis : les utilisateurs connectés peuvent créer un avis
CREATE POLICY "avis_insert" ON avis
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Avis : les admins voient tous les avis
CREATE POLICY "avis_admin_read" ON avis
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Avis : les admins peuvent modifier les avis
CREATE POLICY "avis_admin_update" ON avis
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Questions matching : lecture publique
CREATE POLICY "matching_questions_public_read" ON matching_questions
  FOR SELECT USING (true);

CREATE POLICY "matching_options_public_read" ON matching_options
  FOR SELECT USING (true);

-- Sessions matching : tout le monde peut créer
CREATE POLICY "matching_sessions_insert" ON matching_sessions
  FOR INSERT WITH CHECK (true);

-- Organisations : les utilisateurs ne voient que leur organisation
CREATE POLICY "organisations_own_read" ON organisations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "organisations_own_update" ON organisations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "organisations_insert" ON organisations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER formations_updated_at
  BEFORE UPDATE ON formations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
