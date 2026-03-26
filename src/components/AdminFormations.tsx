"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface FormationAdmin {
  id: string;
  nom: string;
  slug: string;
  note_moyenne: number;
  nb_avis: number;
  est_active: boolean;
  est_sponsorisee: boolean;
  est_recommandee: boolean;
  formations_categories: { nom: string } | null;
}

export function AdminFormations({ formations }: { formations: FormationAdmin[] }) {
  const router = useRouter();

  async function toggleActive(id: string, estActive: boolean) {
    const supabase = createClient();
    await supabase.from("formations").update({ est_active: !estActive }).eq("id", id);
    router.refresh();
  }

  async function toggleSponsorisee(id: string, estSponsorisee: boolean) {
    const supabase = createClient();
    await supabase.from("formations").update({ est_sponsorisee: !estSponsorisee }).eq("id", id);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 px-4 font-medium text-gray-500">Formation</th>
            <th className="py-3 px-4 font-medium text-gray-500">Catégorie</th>
            <th className="py-3 px-4 font-medium text-gray-500">Note</th>
            <th className="py-3 px-4 font-medium text-gray-500">Avis</th>
            <th className="py-3 px-4 font-medium text-gray-500">Active</th>
            <th className="py-3 px-4 font-medium text-gray-500">Sponsorisée</th>
            <th className="py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {formations.map((f) => (
            <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{f.nom}</td>
              <td className="py-3 px-4 text-gray-600">
                {f.formations_categories?.nom || "—"}
              </td>
              <td className="py-3 px-4 text-gray-600">{f.note_moyenne}/5</td>
              <td className="py-3 px-4 text-gray-600">{f.nb_avis}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => toggleActive(f.id, f.est_active)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    f.est_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      f.est_active ? "left-5" : "left-1"
                    }`}
                  />
                </button>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => toggleSponsorisee(f.id, f.est_sponsorisee)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    f.est_sponsorisee ? "bg-primary-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      f.est_sponsorisee ? "left-5" : "left-1"
                    }`}
                  />
                </button>
              </td>
              <td className="py-3 px-4">
                <a
                  href={`/formations/${f.slug}`}
                  className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                >
                  Voir
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
