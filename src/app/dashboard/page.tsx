import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard Organisation",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/revendiquer-ma-fiche");
  }

  const { data: organisation } = await supabase
    .from("organisations")
    .select("*, formations(*)")
    .eq("user_id", user.id)
    .single();

  if (!organisation) {
    redirect("/revendiquer-ma-fiche");
  }

  const formation = (organisation as any).formations;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez votre fiche formation et consultez vos statistiques
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 capitalize">
          Plan {organisation.plan}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Vues de la fiche</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible prochainement</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Clics sur le CTA</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible prochainement</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Position dans la catégorie</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          <p className="text-xs text-gray-400 mt-1">Disponible prochainement</p>
        </div>
      </div>

      {/* Infos formation */}
      {formation && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Votre formation</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nom</span>
              <span className="font-medium text-gray-900">{formation.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Note moyenne</span>
              <span className="font-medium text-gray-900">{formation.note_moyenne}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre d&apos;avis</span>
              <span className="font-medium text-gray-900">{formation.nb_avis}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Statut</span>
              <span className={`font-medium ${formation.est_active ? "text-green-600" : "text-red-600"}`}>
                {formation.est_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={`/formations/${formation.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voir ma fiche
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {organisation.plan === "gratuit" && (
        <div className="mt-8 bg-primary-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-900">Passez au plan Premium</h3>
          <p className="text-sm text-gray-600 mt-2">
            Boostez la visibilité de votre formation avec le badge &quot;Sponsorisée&quot;,
            des statistiques détaillées et un positionnement prioritaire.
          </p>
          <button className="mt-4 inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
            Voir les offres
          </button>
        </div>
      )}
    </div>
  );
}
