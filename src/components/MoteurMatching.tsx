"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EtoilesNote } from "./EtoilesNote";
import { BadgeCPF, BadgeGarantie, BadgeRecommandee } from "./BadgeCPF";
import Link from "next/link";
import type { Formation } from "@/lib/types/database";

const QUESTIONS = [
  {
    id: "budget",
    question: "Quel est votre budget pour une formation ?",
    options: [
      { label: "Moins de 500€", value: "low" },
      { label: "500€ à 1000€", value: "medium" },
      { label: "1000€ à 2000€", value: "high" },
      { label: "Plus de 2000€", value: "premium" },
      { label: "Je veux utiliser mon CPF", value: "cpf" },
    ],
  },
  {
    id: "disponibilite",
    question: "Combien de temps pouvez-vous consacrer par semaine ?",
    options: [
      { label: "Moins de 5h/semaine", value: "light" },
      { label: "5 à 10h/semaine", value: "moderate" },
      { label: "10 à 20h/semaine", value: "intensive" },
      { label: "Temps plein (reconversion)", value: "fulltime" },
    ],
  },
  {
    id: "objectif",
    question: "Quel est votre objectif principal ?",
    options: [
      { label: "Me lancer en freelance", value: "freelance" },
      { label: "Monter en compétences dans mon job", value: "upskill" },
      { label: "Reconversion professionnelle", value: "reconversion" },
      { label: "Lancer mon business", value: "business" },
    ],
  },
  {
    id: "niveau",
    question: "Quel est votre niveau actuel ?",
    options: [
      { label: "Débutant complet", value: "debutant" },
      { label: "Quelques bases", value: "intermediaire" },
      { label: "Intermédiaire / en activité", value: "avance" },
    ],
  },
  {
    id: "secteur",
    question: "Quel secteur vous intéresse le plus ?",
    options: [
      { label: "Copywriting / Rédaction", value: "copywriting" },
      { label: "Marketing Digital", value: "marketing-digital" },
      { label: "E-commerce / Dropshipping", value: "e-commerce" },
      { label: "Closing / Vente", value: "closing" },
      { label: "Freelance / Indépendant", value: "freelance" },
      { label: "SEO / Référencement", value: "seo" },
      { label: "Réseaux sociaux / Vidéo", value: "social-media" },
    ],
  },
];

export function MoteurMatching() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [resultats, setResultats] = useState<Formation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const question = QUESTIONS[etape];
  const progression = ((etape + 1) / QUESTIONS.length) * 100;

  async function handleReponse(value: string) {
    const newReponses = { ...reponses, [question.id]: value };
    setReponses(newReponses);

    if (etape < QUESTIONS.length - 1) {
      setEtape(etape + 1);
    } else {
      setLoading(true);
      try {
        const formations = await rechercherFormations(newReponses);
        setResultats(formations);
      } catch {
        setResultats([]);
      }
      setLoading(false);
    }
  }

  function recommencer() {
    setEtape(0);
    setReponses({});
    setResultats(null);
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
          <svg className="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Analyse de votre profil en cours...</p>
      </div>
    );
  }

  if (resultats !== null) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Voici vos {resultats.length} formation{resultats.length > 1 ? "s" : ""} recommandée{resultats.length > 1 ? "s" : ""}
          </h2>
          <p className="text-gray-600 mt-2">
            Basées sur votre budget, disponibilité, objectif et secteur d&apos;intérêt.
          </p>
        </div>

        {resultats.length > 0 ? (
          <div className="space-y-4">
            {resultats.map((formation, i) => (
              <div key={formation.id} className="bg-white rounded-xl border border-gray-200 p-6 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-lg">
                    {formation.nom.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{formation.nom}</h3>
                      {formation.est_recommandee && <BadgeRecommandee />}
                    </div>
                    <div className="mt-1">
                      {formation.trustpilot_note ? (
                        <EtoilesNote note={Number(formation.trustpilot_note)} nbAvis={formation.trustpilot_nb_avis} taille="sm" source="Trustpilot" />
                      ) : (
                        <EtoilesNote note={Number(formation.note_moyenne)} nbAvis={formation.nb_avis} taille="sm" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{formation.description_courte}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {formation.prix_min && (
                        <span className="text-sm font-semibold">
                          {formation.prix_min}€{formation.prix_max && formation.prix_max !== formation.prix_min ? ` — ${formation.prix_max}€` : ""}
                        </span>
                      )}
                      {formation.eligible_cpf && <BadgeCPF />}
                      {formation.garantie && <BadgeGarantie />}
                    </div>
                    <div className="mt-3 text-xs text-primary-600 bg-primary-50 rounded-lg p-2">
                      <MatchExplanation reponses={reponses} formation={formation} />
                    </div>
                    <Link
                      href={`/formations/${formation.slug}`}
                      className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Voir la fiche complète
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">
              Aucune formation ne correspond exactement à vos critères.
              Essayez d&apos;élargir vos filtres.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={recommencer}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Recommencer le comparateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Étape {etape + 1} sur {QUESTIONS.length}</span>
          <span>{Math.round(progression)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progression}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleReponse(option.value)}
            className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all font-medium text-gray-700 hover:text-primary-700"
          >
            {option.label}
          </button>
        ))}
      </div>

      {etape > 0 && (
        <button
          onClick={() => setEtape(etape - 1)}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Question précédente
        </button>
      )}
    </div>
  );
}

function MatchExplanation({ reponses, formation }: { reponses: Record<string, string>; formation: Formation }) {
  const raisons: string[] = [];

  if (reponses.budget === "cpf" && formation.eligible_cpf) {
    raisons.push("Éligible CPF");
  }
  if (formation.note_moyenne >= 4.5) {
    raisons.push(`Note exceptionnelle (${formation.note_moyenne}/5)`);
  }
  if (formation.garantie) {
    raisons.push("Garantie satisfait ou remboursé");
  }
  if (formation.taux_placement && formation.taux_placement > 80) {
    raisons.push(`${formation.taux_placement}% de taux de placement`);
  }
  if (raisons.length === 0) {
    raisons.push("Correspond à vos critères de recherche");
  }

  return <span>{raisons.join(" • ")}</span>;
}

async function rechercherFormations(reponses: Record<string, string>): Promise<Formation[]> {
  const supabase = createClient();

  // Pour le copywriting, toujours recommander L'Académie uniquement
  if (reponses.secteur === "copywriting") {
    const { data: academie } = await supabase
      .from("formations")
      .select("*")
      .eq("slug", "lacademie-copywriting")
      .single();
    return academie ? [academie] : [];
  }

  // Mapper le secteur vers un slug de catégorie
  const secteurToSlug: Record<string, string[]> = {
    "marketing-digital": ["marketing-digital"],
    "e-commerce": ["e-commerce", "dropshipping"],
    closing: ["closing"],
    freelance: ["freelance"],
    seo: ["seo"],
    "social-media": ["community-management", "montage-video"],
  };

  // Récupérer les catégories correspondantes
  const slugs = secteurToSlug[reponses.secteur] || [];
  let categorieIds: string[] = [];

  if (slugs.length > 0) {
    const { data: cats } = await supabase
      .from("formations_categories")
      .select("id")
      .in("slug", slugs);
    categorieIds = (cats || []).map((c) => c.id);
  }

  let query = supabase
    .from("formations")
    .select("*")
    .eq("est_active", true);

  // Filtre par catégorie
  if (categorieIds.length > 0) {
    query = query.in("categorie_id", categorieIds);
  }

  // Filtre par budget
  switch (reponses.budget) {
    case "low":
      query = query.lte("prix_min", 500);
      break;
    case "medium":
      query = query.lte("prix_min", 1000);
      break;
    case "high":
      query = query.lte("prix_min", 2000);
      break;
    case "cpf":
      query = query.eq("eligible_cpf", true);
      break;
  }

  const { data: formations } = await query
    .order("est_recommandee", { ascending: false })
    .order("note_moyenne", { ascending: false })
    .limit(3);

  return formations || [];
}
