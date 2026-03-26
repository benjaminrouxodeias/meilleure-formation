import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CarteFormation } from "@/components/CarteFormation";
import { FiltresSidebar } from "@/components/FiltresSidebar";
import Link from "next/link";

interface PageProps {
  params: { slug: string };
  searchParams: { tri?: string; cpf?: string; note?: string; prix?: string; format?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: categorie } = await supabase
    .from("formations_categories")
    .select("nom, description")
    .eq("slug", params.slug)
    .single();

  if (!categorie) return {};

  const annee = new Date().getFullYear();

  return {
    title: `Meilleure formation ${categorie.nom} en ${annee} : comparatif complet`,
    description: `Comparatif des meilleures formations ${categorie.nom} en ${annee}. Avis vérifiés, prix, CPF. Trouvez la formation ${categorie.nom} qui vous correspond.`,
    openGraph: {
      title: `Meilleure formation ${categorie.nom} en ${annee}`,
      description: categorie.description || undefined,
    },
  };
}

export default async function CategoriePage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const annee = new Date().getFullYear();

  const { data: categorie } = await supabase
    .from("formations_categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!categorie) notFound();

  let query = supabase
    .from("formations")
    .select("*")
    .eq("categorie_id", categorie.id)
    .eq("est_active", true);

  // Filtres
  if (searchParams.cpf === "true") {
    query = query.eq("eligible_cpf", true);
  }
  if (searchParams.note) {
    query = query.gte("note_moyenne", parseFloat(searchParams.note));
  }
  if (searchParams.prix) {
    query = query.lte("prix_min", parseInt(searchParams.prix));
  }
  if (searchParams.format) {
    query = query.eq("format", searchParams.format);
  }

  // Tri
  switch (searchParams.tri) {
    case "note":
      query = query.order("note_moyenne", { ascending: false });
      break;
    case "prix-asc":
      query = query.order("prix_min", { ascending: true });
      break;
    case "prix-desc":
      query = query.order("prix_min", { ascending: false });
      break;
    default: // recommandees
      query = query
        .order("est_recommandee", { ascending: false })
        .order("est_sponsorisee", { ascending: false })
        .order("note_moyenne", { ascending: false });
  }

  const { data: formations } = await query;

  // Schema.org ItemList
  const schemaItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Meilleures formations ${categorie.nom} en ${annee}`,
    itemListElement: (formations || []).map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: f.nom,
        description: f.description_courte,
        provider: {
          "@type": "Organization",
          name: f.fondateur || f.nom,
        },
        ...(f.note_moyenne > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: f.note_moyenne,
            reviewCount: f.nb_avis,
            bestRating: 5,
          },
        }),
        offers: f.prix_min
          ? {
              "@type": "Offer",
              price: f.prix_min,
              priceCurrency: "EUR",
              ...(f.prix_max && f.prix_max !== f.prix_min && {
                highPrice: f.prix_max,
              }),
            }
          : undefined,
        url: `https://meilleure-formation.cloud/formations/${f.slug}`,
      },
    })),
  };

  // FAQ
  const faqItems = [
    {
      question: `Quelle est la meilleure formation ${categorie.nom} en ${annee} ?`,
      answer: formations && formations.length > 0
        ? `Selon notre comparatif, ${formations[0].nom} est la formation ${categorie.nom} la mieux notée avec une note de ${formations[0].note_moyenne}/5 basée sur ${formations[0].nb_avis} avis vérifiés.`
        : `Consultez notre comparatif pour trouver la meilleure formation ${categorie.nom}.`,
    },
    {
      question: `Combien coûte une formation ${categorie.nom} ?`,
      answer: formations && formations.length > 0
        ? `Les prix varient de ${Math.min(...formations.filter(f => f.prix_min).map(f => f.prix_min!))}€ à ${Math.max(...formations.filter(f => f.prix_max).map(f => f.prix_max!))}€ selon la formation et le niveau de programme choisi.`
        : `Les prix varient selon les formations. Consultez notre comparatif pour plus de détails.`,
    },
    {
      question: `Peut-on financer une formation ${categorie.nom} avec le CPF ?`,
      answer: formations?.some(f => f.eligible_cpf)
        ? `Oui, certaines formations ${categorie.nom} sont éligibles au CPF. Utilisez notre filtre CPF pour les trouver.`
        : `Actuellement, les formations ${categorie.nom} de notre comparatif ne sont pas éligibles au CPF.`,
    },
    {
      question: `Pourquoi se former en ${categorie.nom} ?`,
      answer: categorie.description || `Le ${categorie.nom} est une compétence très demandée sur le marché. Se former permet d'acquérir des compétences pratiques et de se démarquer professionnellement.`,
    },
  ];

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Accueil</Link>
          <span>/</span>
          <span className="text-gray-900">{categorie.nom}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Meilleure formation {categorie.nom} en {annee} : comparatif complet
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            {categorie.description}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar filtres */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filtrer</h3>
              <FiltresSidebar categorieSlug={params.slug} />
            </div>
          </aside>

          {/* Liste formations */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {formations?.length || 0} formation{(formations?.length || 0) > 1 ? "s" : ""} trouvée{(formations?.length || 0) > 1 ? "s" : ""}
              </p>
            </div>

            {formations && formations.length > 0 ? (
              <div className="space-y-4">
                {formations.map((formation) => (
                  <CarteFormation key={formation.id} formation={formation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  Aucune formation trouvée avec ces critères.
                </p>
                <Link
                  href={`/categorie/${params.slug}`}
                  className="mt-4 inline-flex text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Réinitialiser les filtres
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Section "Pourquoi" */}
        <section className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pourquoi se former en {categorie.nom} ?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {categorie.description} Le marché des compétences numériques est en
            pleine expansion, et le {categorie.nom.toLowerCase()} fait partie des
            compétences les plus recherchées par les entreprises et les
            entrepreneurs. Une bonne formation vous permet d&apos;acquérir des bases
            solides, de pratiquer sur des cas réels, et de vous lancer rapidement
            dans une nouvelle carrière ou d&apos;améliorer vos résultats actuels.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions fréquentes sur les formations {categorie.nom}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-gray-900 hover:text-primary-600">
                  {item.question}
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
