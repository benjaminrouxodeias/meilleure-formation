"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FormulaireAvisProps {
  formationId: string;
  formationSlug: string;
}

export function FormulaireAvis({ formationId, formationSlug }: FormulaireAvisProps) {
  const [note, setNote] = useState(0);
  const [hoverNote, setHoverNote] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [metierAvant, setMetierAvant] = useState("");
  const [metierApres, setMetierApres] = useState("");
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [soumis, setSoumis] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (note === 0) {
      setErreur("Veuillez donner une note.");
      return;
    }
    if (!prenom.trim()) {
      setErreur("Veuillez entrer votre prénom.");
      return;
    }
    if (!contenu.trim()) {
      setErreur("Veuillez écrire votre avis.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("avis").insert({
      formation_id: formationId,
      auteur_prenom: prenom.trim(),
      auteur_metier_avant: metierAvant.trim() || null,
      auteur_metier_apres: metierApres.trim() || null,
      note,
      titre: titre.trim() || null,
      contenu: contenu.trim(),
      est_publie: false,
      est_verifie: false,
    });

    setLoading(false);

    if (error) {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
      return;
    }

    setSoumis(true);
  }

  if (soumis) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre avis !</h2>
        <p className="text-gray-600">
          Votre avis est en cours de vérification. Il sera publié après validation par notre équipe.
        </p>
        <a
          href={`/formations/${formationSlug}`}
          className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Retour à la fiche formation
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erreur && (
        <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {erreur}
        </div>
      )}

      {/* Note étoiles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre note *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNote(n)}
              onMouseEnter={() => setHoverNote(n)}
              onMouseLeave={() => setHoverNote(0)}
              className="p-1"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  n <= (hoverNote || note) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Prénom */}
      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
          Prénom *
        </label>
        <input
          id="prenom"
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Votre prénom"
          required
        />
      </div>

      {/* Métier avant / après */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="metier-avant" className="block text-sm font-medium text-gray-700 mb-1">
            Votre métier avant la formation
          </label>
          <input
            id="metier-avant"
            type="text"
            value={metierAvant}
            onChange={(e) => setMetierAvant(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Ex: Commercial B2B"
          />
        </div>
        <div>
          <label htmlFor="metier-apres" className="block text-sm font-medium text-gray-700 mb-1">
            Votre métier maintenant
          </label>
          <input
            id="metier-apres"
            type="text"
            value={metierApres}
            onChange={(e) => setMetierApres(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Ex: Copywriter freelance"
          />
        </div>
      </div>

      {/* Titre */}
      <div>
        <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
          Titre de votre avis
        </label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Résumez votre expérience en une phrase"
        />
      </div>

      {/* Contenu */}
      <div>
        <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
          Votre avis *
        </label>
        <textarea
          id="contenu"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={5}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Décrivez votre expérience avec cette formation..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours..." : "Envoyer mon avis"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Votre avis sera vérifié par notre équipe avant publication.
      </p>
    </form>
  );
}
