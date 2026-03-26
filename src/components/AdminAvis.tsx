"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EtoilesNote } from "./EtoilesNote";

interface AvisAvecFormation {
  id: string;
  auteur_prenom: string | null;
  auteur_metier_avant: string | null;
  auteur_metier_apres: string | null;
  note: number;
  titre: string | null;
  contenu: string | null;
  created_at: string;
  formations: { nom: string; slug: string } | null;
}

export function AdminAvis({ avis }: { avis: AvisAvecFormation[] }) {
  const router = useRouter();

  async function validerAvis(id: string) {
    const supabase = createClient();
    await supabase.from("avis").update({ est_publie: true }).eq("id", id);
    router.refresh();
  }

  async function supprimerAvis(id: string) {
    const supabase = createClient();
    await supabase.from("avis").delete().eq("id", id);
    router.refresh();
  }

  if (avis.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 text-sm">
        Aucun avis en attente de validation.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {avis.map((a) => (
        <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{a.auteur_prenom}</span>
              <EtoilesNote note={a.note} taille="sm" afficherNote={false} />
              {a.formations && (
                <span className="text-xs text-gray-500">sur {a.formations.nom}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(a.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          {a.auteur_metier_avant && (
            <p className="text-xs text-gray-500">
              {a.auteur_metier_avant} → {a.auteur_metier_apres}
            </p>
          )}
          {a.titre && <h4 className="font-medium text-gray-900 mt-2">{a.titre}</h4>}
          {a.contenu && <p className="text-sm text-gray-600 mt-1">{a.contenu}</p>}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => validerAvis(a.id)}
              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
            >
              Publier
            </button>
            <button
              onClick={() => supprimerAvis(a.id)}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
