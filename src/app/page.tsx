import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CarteFormation } from "@/components/CarteFormation";
import { EtoilesNote } from "@/components/EtoilesNote";

const CATEGORIES_STATIC = [
  { nom: "Copywriting", slug: "copywriting", emoji: "✍️" },
  { nom: "Marketing Digital", slug: "marketing-digital", emoji: "📱" },
  { nom: "E-commerce", slug: "e-commerce", emoji: "🛒" },
  { nom: "Closing", slug: "closing", emoji: "📞" },
  { nom: "Freelance", slug: "freelance", emoji: "💻" },
  { nom: "SEO", slug: "seo", emoji: "🔍" },
  { nom: "Community Management", slug: "community-management", emoji: "👥" },
  { nom: "Montage Vidéo", slug: "montage-video", emoji: "🎬" },
  { nom: "Dropshipping", slug: "dropshipping", emoji: "📦" },
  { nom: "Trading", slug: "trading", emoji: "📈" },
];

export default async function HomePage() {
  const supabase = createClient();

  // Formations recommandées/sponsorisées en premier
  const { data: formationsRecommandees } = await supabase
    .from("formations")
    .select("*")
    .eq("est_active", true)
    .or("est_sponsorisee.eq.true,est_recommandee.eq.true")
    .order("rang_sponsorise", { ascending: true, nullsFirst: false })
    .order("note_moyenne", { ascending: false })
    .limit(6);

  // Mieux notées
  const { data: formationsMieuxNotees } = await supabase
    .from("formations")
    .select("*")
    .eq("est_active", true)
    .order("note_moyenne", { ascending: false })
    .limit(6);

  const { data: categories } = await supabase
    .from("formations_categories")
    .select("*")
    .order("nom");

  const cats = categories || CATEGORIES_STATIC;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Trouvez la meilleure{" "}
              <span className="text-yellow-300">formation business</span>{" "}
              en ligne
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Comparez les formations, lisez les avis vérifiés, et trouvez
              celle qui correspond à votre projet. 100% indépendant et gratuit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/comparateur"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Lancer le comparateur
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Explorer les catégories
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-200">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Avis vérifiés
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                100% gratuit
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Comparaison objective
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Explorer par catégorie
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 text-center">
                {cat.nom}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Formations recommandées */}
      {formationsRecommandees && formationsRecommandees.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Formations recommandées
            </h2>
          </div>
          <div className="space-y-4">
            {formationsRecommandees.map((formation) => (
              <CarteFormation key={formation.id} formation={formation} />
            ))}
          </div>
        </section>
      )}

      {/* Mieux notées */}
      {formationsMieuxNotees && formationsMieuxNotees.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Les mieux notées
            </h2>
          </div>
          <div className="space-y-4">
            {formationsMieuxNotees.map((formation) => (
              <CarteFormation key={formation.id} formation={formation} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pas sûr de quelle formation choisir ?
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Notre comparateur intelligent analyse votre profil, votre budget et
            vos objectifs pour vous recommander les 3 formations les plus
            adaptées.
          </p>
          <Link
            href="/comparateur"
            className="mt-6 inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Lancer le comparateur gratuit
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
