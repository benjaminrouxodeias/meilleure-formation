import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Guides & conseils formations business en ligne",
  description:
    "Guides, conseils et analyses pour choisir la bonne formation business en ligne. Copywriting, marketing digital, e-commerce, freelance, SEO et plus.",
  alternates: {
    canonical: "https://meilleure-formation.cloud/blog",
  },
};

const CATEGORIES_BLOG: Record<string, string> = {
  all: "Tous les articles",
  copywriting: "Copywriting",
  "marketing-digital": "Marketing Digital",
  "e-commerce": "E-commerce",
  freelance: "Freelance",
  seo: "SEO",
  reconversion: "Reconversion",
  guide: "Guides pratiques",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("blog_articles")
    .select("slug, titre, extrait, categorie_blog, date_publication, temps_lecture_min, auteur, tags")
    .eq("est_publie", true)
    .order("date_publication", { ascending: false });

  if (searchParams.cat && searchParams.cat !== "all") {
    query = query.eq("categorie_blog", searchParams.cat);
  }

  const { data: articles } = await query;
  const currentCat = searchParams.cat || "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Le blog Meilleure Formation
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Guides, analyses et conseils pour vous aider à choisir la bonne
          formation et réussir votre projet professionnel.
        </p>
      </div>

      {/* Filtres catégories */}
      <div className="mt-8 flex flex-wrap gap-2">
        {Object.entries(CATEGORIES_BLOG).map(([key, label]) => (
          <Link
            key={key}
            href={key === "all" ? "/blog" : `/blog?cat=${key}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCat === key
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Articles */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <article key={article.slug} className="group">
              <Link href={`/blog/${article.slug}`} className="block">
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
                      {article.categorie_blog}
                    </span>
                    <span className="text-xs text-gray-400">
                      {article.temps_lecture_min} min de lecture
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.titre}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
                    {article.extrait}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>{article.auteur}</span>
                    <time dateTime={article.date_publication}>
                      {new Date(article.date_publication).toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </time>
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
