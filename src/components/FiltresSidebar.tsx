"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FiltresSidebarProps {
  categorieSlug: string;
}

export function FiltresSidebar({ categorieSlug }: FiltresSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTri = searchParams.get("tri") || "recommandees";
  const currentCpf = searchParams.get("cpf") === "true";
  const currentNote = searchParams.get("note") || "";
  const currentPrix = searchParams.get("prix") || "";
  const currentFormat = searchParams.get("format") || "";

  function updateFiltre(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/categorie/${categorieSlug}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Trier par
        </label>
        <select
          value={currentTri}
          onChange={(e) => updateFiltre("tri", e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="recommandees">Recommandées</option>
          <option value="note">Mieux notées</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Budget max
        </label>
        <select
          value={currentPrix}
          onChange={(e) => updateFiltre("prix", e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Tous les prix</option>
          <option value="500">Moins de 500€</option>
          <option value="1000">Moins de 1 000€</option>
          <option value="1500">Moins de 1 500€</option>
          <option value="2000">Moins de 2 000€</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Note minimum
        </label>
        <select
          value={currentNote}
          onChange={(e) => updateFiltre("note", e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Toutes les notes</option>
          <option value="4.5">4.5+ / 5</option>
          <option value="4">4+ / 5</option>
          <option value="3.5">3.5+ / 5</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Format
        </label>
        <select
          value={currentFormat}
          onChange={(e) => updateFiltre("format", e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Tous les formats</option>
          <option value="100% en ligne">100% en ligne</option>
          <option value="hybride">Hybride</option>
          <option value="présentiel">Présentiel</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentCpf}
            onChange={(e) =>
              updateFiltre("cpf", e.target.checked ? "true" : "")
            }
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Éligible CPF</span>
        </label>
      </div>
    </div>
  );
}
