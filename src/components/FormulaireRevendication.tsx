"use client";

import { useState } from "react";

export function FormulaireRevendication() {
  const [nomFormation, setNomFormation] = useState("");
  const [email, setEmail] = useState("");
  const [soumis, setSoumis] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulation — en prod, envoyer à une API/edge function
    await new Promise((r) => setTimeout(r, 1000));
    setSoumis(true);
    setLoading(false);
  }

  if (soumis) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-xl">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900">Demande envoyée !</h3>
        <p className="text-gray-600 text-sm mt-2">
          Nous vous contacterons sous 48h pour valider votre demande.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <label htmlFor="nom-formation" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la formation *
        </label>
        <input
          id="nom-formation"
          type="text"
          value={nomFormation}
          onChange={(e) => setNomFormation(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Ex: L'Académie™"
          required
        />
      </div>
      <div>
        <label htmlFor="email-pro" className="block text-sm font-medium text-gray-700 mb-1">
          Email professionnel *
        </label>
        <input
          id="email-pro"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="contact@votre-formation.com"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
