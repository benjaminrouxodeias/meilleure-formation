import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FormulaireAvis } from "@/components/FormulaireAvis";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: formation } = await supabase
    .from("formations")
    .select("nom")
    .eq("slug", params.slug)
    .single();

  if (!formation) return {};

  return {
    title: `Laisser un avis sur ${formation.nom}`,
    description: `Partagez votre expérience avec ${formation.nom}. Votre avis aidera d'autres personnes à faire le bon choix.`,
  };
}

export default async function LaisserAvisPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: formation } = await supabase
    .from("formations")
    .select("id, nom, slug")
    .eq("slug", params.slug)
    .single();

  if (!formation) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        <span>/</span>
        <Link href={`/formations/${formation.slug}`} className="hover:text-primary-600">
          {formation.nom}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Laisser un avis</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        Laisser un avis sur {formation.nom}
      </h1>
      <p className="text-gray-600 mb-8">
        Votre avis est précieux et aidera d&apos;autres personnes à faire leur choix.
      </p>

      <FormulaireAvis formationId={formation.id} formationSlug={formation.slug} />
    </div>
  );
}
