import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

const getArticle = cache(async (slug: string) => {
  const supabase = createClient();
  return supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("est_publie", true)
    .single();
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: article } = await getArticle(params.slug);
  if (!article) return {};

  return {
    title: article.titre,
    description: article.meta_description,
    alternates: {
      canonical: `https://meilleure-formation.cloud/blog/${params.slug}`,
    },
    openGraph: {
      title: article.titre,
      description: article.meta_description,
      type: "article",
      publishedTime: article.date_publication,
      modifiedTime: article.updated_at,
      authors: [article.auteur],
    },
  };
}

export async function generateStaticParams() {
  const { createClient: createBrowserClient } = await import("@supabase/supabase-js");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("blog_articles")
    .select("slug")
    .eq("est_publie", true);
  return (data || []).map((a: any) => ({ slug: a.slug }));
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { data: article } = await getArticle(params.slug);
  if (!article) notFound();

  // Articles similaires
  const supabase = createClient();
  const { data: articlesLies } = await supabase
    .from("blog_articles")
    .select("slug, titre, extrait, temps_lecture_min, categorie_blog")
    .eq("est_publie", true)
    .eq("categorie_blog", article.categorie_blog)
    .neq("slug", article.slug)
    .order("date_publication", { ascending: false })
    .limit(3);

  // Schema.org Article
  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    description: article.meta_description,
    author: {
      "@type": "Person",
      name: article.auteur,
    },
    publisher: {
      "@type": "Organization",
      name: "Meilleure Formation",
      url: "https://meilleure-formation.cloud",
    },
    datePublished: article.date_publication,
    dateModified: article.updated_at,
    mainEntityOfPage: `https://meilleure-formation.cloud/blog/${article.slug}`,
    inLanguage: "fr",
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://meilleure-formation.cloud" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://meilleure-formation.cloud/blog" },
      { "@type": "ListItem", position: 3, name: article.titre },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 line-clamp-1">{article.titre}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
                  {article.categorie_blog}
                </span>
                <span className="text-sm text-gray-400">
                  {article.temps_lecture_min} min de lecture
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {article.titre}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>Par {article.auteur}</span>
                <time dateTime={article.date_publication}>
                  {new Date(article.date_publication).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </header>

            {/* Corps de l'article */}
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-li:text-gray-600
                prose-blockquote:border-primary-500 prose-blockquote:text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.contenu }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 bg-primary-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Trouvez la formation idéale
              </h3>
              <p className="mt-2 text-gray-600">
                Comparez les meilleures formations et trouvez celle qui correspond
                à votre projet.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {article.categorie_formation_slug && (
                  <Link
                    href={`/categorie/${article.categorie_formation_slug}`}
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Voir les formations
                  </Link>
                )}
                <Link
                  href="/comparateur"
                  className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Lancer le comparateur
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* Formation mise en avant */}
              {article.formation_mise_en_avant_slug && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <p className="text-xs font-semibold text-yellow-800 uppercase mb-2">Formation recommandée</p>
                  <Link
                    href={`/formations/${article.formation_mise_en_avant_slug}`}
                    className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    Voir la fiche complète →
                  </Link>
                </div>
              )}

              {/* Articles liés */}
              {articlesLies && articlesLies.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Articles similaires</h3>
                  <div className="space-y-4">
                    {articlesLies.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/blog/${a.slug}`}
                        className="block group"
                      >
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {a.titre}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {a.temps_lecture_min} min de lecture
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA comparateur */}
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <p className="font-semibold text-gray-900 mb-2">Pas sûr de votre choix ?</p>
                <p className="text-sm text-gray-600 mb-4">Notre comparateur vous aide en 5 questions.</p>
                <Link
                  href="/comparateur"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Lancer le comparateur
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
