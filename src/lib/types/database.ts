export interface Database {
  public: {
    Tables: {
      formations_categories: {
        Row: {
          id: string;
          nom: string;
          slug: string;
          description: string | null;
          emoji: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["formations_categories"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["formations_categories"]["Insert"]>;
      };
      formations: {
        Row: {
          id: string;
          nom: string;
          slug: string;
          description_courte: string | null;
          description_longue: string | null;
          url_officielle: string | null;
          url_affiliation: string | null;
          logo_url: string | null;
          image_cover_url: string | null;
          categorie_id: string | null;
          fondateur: string | null;
          prix_min: number | null;
          prix_max: number | null;
          eligible_cpf: boolean;
          duree_heures: number | null;
          format: string | null;
          garantie: boolean;
          description_garantie: string | null;
          nb_etudiants: number | null;
          taux_placement: number | null;
          revenu_moyen_apres: number | null;
          note_moyenne: number;
          nb_avis: number;
          est_sponsorisee: boolean;
          rang_sponsorise: number | null;
          est_recommandee: boolean;
          est_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["formations"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["formations"]["Insert"]>;
      };
      avis: {
        Row: {
          id: string;
          formation_id: string | null;
          user_id: string | null;
          auteur_prenom: string | null;
          auteur_metier_avant: string | null;
          auteur_metier_apres: string | null;
          note: number;
          titre: string | null;
          contenu: string | null;
          est_verifie: boolean;
          preuve_achat_url: string | null;
          est_publie: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["avis"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["avis"]["Insert"]>;
      };
      matching_questions: {
        Row: {
          id: string;
          ordre: number;
          question: string;
          type: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matching_questions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["matching_questions"]["Insert"]>;
      };
      matching_options: {
        Row: {
          id: string;
          question_id: string | null;
          label: string;
          valeur: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matching_options"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["matching_options"]["Insert"]>;
      };
      matching_sessions: {
        Row: {
          id: string;
          reponses: Record<string, string> | null;
          formations_recommandees: string[] | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matching_sessions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matching_sessions"]["Insert"]>;
      };
      organisations: {
        Row: {
          id: string;
          user_id: string | null;
          formation_id: string | null;
          plan: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organisations"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organisations"]["Insert"]>;
      };
    };
  };
}

// Alias types for convenience
export type Formation = Database["public"]["Tables"]["formations"]["Row"];
export type FormationCategorie = Database["public"]["Tables"]["formations_categories"]["Row"];
export type Avis = Database["public"]["Tables"]["avis"]["Row"];
export type MatchingQuestion = Database["public"]["Tables"]["matching_questions"]["Row"];
export type MatchingOption = Database["public"]["Tables"]["matching_options"]["Row"];
export type Organisation = Database["public"]["Tables"]["organisations"]["Row"];

export type FormationAvecCategorie = Formation & {
  formations_categories: FormationCategorie | null;
};
