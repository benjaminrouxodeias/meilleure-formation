import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminAvis } from "@/components/AdminAvis";
import { AdminFormations } from "@/components/AdminFormations";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Vérifier le rôle admin via les métadonnées utilisateur
  // En production, utiliser un système de rôle plus robuste
  const { data: userData } = await supabase.auth.getUser();
  const isAdmin = userData?.user?.app_metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  // Récupérer les avis en attente
  const { data: avisEnAttente } = await supabase
    .from("avis")
    .select("*, formations(nom, slug)")
    .eq("est_publie", false)
    .order("created_at", { ascending: false });

  // Récupérer toutes les formations
  const { data: formations } = await supabase
    .from("formations")
    .select("*, formations_categories(nom)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Administration</h1>

      {/* Avis à valider */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Avis en attente de validation ({avisEnAttente?.length || 0})
        </h2>
        <AdminAvis avis={avisEnAttente || []} />
      </section>

      {/* Gestion formations */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Formations ({formations?.length || 0})
        </h2>
        <AdminFormations formations={formations || []} />
      </section>
    </div>
  );
}
