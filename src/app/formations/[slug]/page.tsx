import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EtoilesNote } from "@/components/EtoilesNote";
import { BadgeCPF, BadgeGarantie, BadgeRecommandee } from "@/components/BadgeCPF";
import { CarteFormation } from "@/components/CarteFormation";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: formation } = await supabase
    .from("formations")
    .select("nom, description_courte, note_moyenne, nb_avis, fondateur")
    .eq("slug", params.slug)
    .single();

  if (!formation) return {};

  return {
    title: `${formation.nom} — Avis, Prix, Note (${formation.note_moyenne}/5)`,
    description: `${formation.nom} par ${formation.fondateur} : ${formation.description_courte} Note : ${formation.note_moyenne}/5 sur ${formation.nb_avis} avis.`,
    openGraph: {
      title: `${formation.nom} — ${formation.note_moyenne}/5 (${formation.nb_avis} avis)`,
      description: formation.description_courte || undefined,
    },
  };
}

export default async function FormationPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: formation } = await supabase
    .from("formations")
    .select("*, formations_categories(*)")
    .eq("slug", params.slug)
    .single();

  if (!formation) notFound();

  const { data: avis } = await supabase
    .from("avis")
    .select("*")
    .eq("formation_id", formation.id)
    .eq("est_publie", true)
    .order("created_at", { ascending: false });

  // Formations similaires (même catégorie)
  const { data: similaires } = await supabase
    .from("formations")
    .select("*")
    .eq("categorie_id", formation.categorie_id!)
    .neq("id", formation.id)
    .eq("est_active", true)
    .order("note_moyenne", { ascending: false })
    .limit(3);

  const categorie = formation.formations_categories;
  const ctaUrl = formation.url_affiliation || formation.url_officielle;

  // Schema.org Course + AggregateRating
  const schemaCourse = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: formation.nom,
    description: formation.description_longue || formation.description_courte,
    provider: {
      "@type": "Organization",
      name: formation.fondateur || formation.nom,
    },
    ...(formation.note_moyenne > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: formation.note_moyenne,
        reviewCount: formation.nb_avis,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    offers: formation.prix_min
      ? {
          "@type": "Offer",
          price: formation.prix_min,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          ...(formation.prix_max && { highPrice: formation.prix_max }),
        }
      : undefined,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: formation.format || "100% en ligne",
      ...(formation.duree_heures && {
        duration: `PT${formation.duree_heures}H`,
      }),
    },
  };

  // Schema.org Reviews
  const schemaReviews = avis?.map((a) => ({
    "@type": "Review",
    author: { "@type": "Person", name: a.auteur_prenom },
    reviewRating: {
      "@type": "Rating",
      ratingValue: a.note,
      bestRating: 5,
    },
    name: a.titre,
    reviewBody: a.contenu,
    datePublished: a.created_at,
  }));

  // FAQ dynamique
  const faqItems = [
    ...(formation.prix_min
      ? [{
          question: `Combien coûte ${formation.nom} ?`,
          answer: formation.prix_max && formation.prix_max !== formation.prix_min
            ? `${formation.nom} propose des formules de ${formation.prix_min}€ à ${formation.prix_max}€.`
            : `${formation.nom} est disponible à ${formation.prix_min}€.`,
        }]
      : []),
    ...(formation.eligible_cpf
      ? [{
          question: `${formation.nom} est-elle éligible au CPF ?`,
          answer: `Oui, ${formation.nom} est éligible au Compte Personnel de Formation (CPF). Vous pouvez financer tout ou partie de la formation via votre solde CPF.`,
        }]
      : []),
    ...(formation.garantie
      ? [{
          question: `${formation.nom} offre-t-elle une garantie ?`,
          answer: formation.description_garantie || `Oui, ${formation.nom} propose une garantie satisfait ou remboursé.`,
        }]
      : []),
    ...(formation.duree_heures
      ? [{
          question: `Quelle est la durée de ${formation.nom} ?`,
          answer: `La formation dure ${formation.duree_heures} heures au total et est disponible en format ${formation.format || '100% en ligne'}.`,
        }]
      : []),
    {
      question: `Quels sont les avis sur ${formation.nom} ?`,
      answer: `${formation.nom} a une note de ${formation.note_moyenne}/5 basée sur ${formation.nb_avis} avis vérifiés. ${avis && avis.length > 0 ? `Le dernier avis de ${avis[0].auteur_prenom} donne ${avis[0].note}/5.` : ''}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...schemaCourse,
            ...(schemaReviews && schemaReviews.length > 0 && { review: schemaReviews }),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Accueil</Link>
          <span>/</span>
          {categorie && (
            <>
              <Link href={`/categorie/${categorie.slug}`} className="hover:text-primary-600">
                {categorie.nom}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{formation.nom}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Header formation */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-2xl">
                  {formation.nom.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {formation.nom}
                    </h1>
                    {formation.est_recommandee && <BadgeRecommandee />}
                  </div>
                  {formation.fondateur && (
                    <p className="text-gray-500 mt-1">par {formation.fondateur}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <EtoilesNote
                      note={Number(formation.note_moyenne)}
                      nbAvis={formation.nb_avis}
                    />
                    {formation.eligible_cpf && <BadgeCPF />}
                    {formation.garantie && <BadgeGarantie />}
                  </div>
                </div>
              </div>

              {ctaUrl && (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                  Voir la formation
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Présentation */}
            <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Présentation</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {formation.description_longue || formation.description_courte}
              </p>

              {/* Chiffres clés */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formation.nb_etudiants && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formation.nb_etudiants.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Étudiants formés</p>
                  </div>
                )}
                {formation.taux_placement && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formation.taux_placement}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Taux de placement</p>
                  </div>
                )}
                {formation.revenu_moyen_apres && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formation.revenu_moyen_apres.toLocaleString("fr-FR")}€
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Revenu moyen/mois</p>
                  </div>
                )}
                {formation.duree_heures && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formation.duree_heures}h
                    </p>
                    <p className="text-xs text-gray-500 mt-1">De formation</p>
                  </div>
                )}
              </div>
            </section>

            {/* Tarifs */}
            {formation.prix_min && (
              <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tarifs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Formule</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Prix</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formation.prix_min && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {formation.prix_max && formation.prix_max !== formation.prix_min ? "Essentiel" : "Accès complet"}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{formation.prix_min}€</td>
                          <td className="py-3 px-4 text-gray-600">Accès à la formation complète</td>
                        </tr>
                      )}
                      {formation.prix_max && formation.prix_max !== formation.prix_min && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">Premium</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{formation.prix_max}€</td>
                          <td className="py-3 px-4 text-gray-600">Formation + coaching personnalisé</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {formation.eligible_cpf && (
                  <p className="mt-4 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                    Cette formation est éligible au CPF. Vous pouvez la financer via votre Compte Personnel de Formation.
                  </p>
                )}
                {formation.garantie && formation.description_garantie && (
                  <p className="mt-3 text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
                    {formation.description_garantie}
                  </p>
                )}
              </section>
            )}

            {/* Avis */}
            <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Avis ({avis?.length || 0})
                </h2>
                <Link
                  href={`/laisser-un-avis/${formation.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Laisser un avis
                </Link>
              </div>

              {avis && avis.length > 0 ? (
                <div className="space-y-6">
                  {avis.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{review.auteur_prenom}</span>
                          {review.est_verifie && (
                            <span className="ml-2 text-xs text-green-600 font-medium">Achat vérifié</span>
                          )}
                        </div>
                        <EtoilesNote note={review.note} taille="sm" afficherNote={false} />
                      </div>
                      {(review.auteur_metier_avant || review.auteur_metier_apres) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {review.auteur_metier_avant}
                          {review.auteur_metier_avant && review.auteur_metier_apres && " → "}
                          {review.auteur_metier_apres && (
                            <span className="text-primary-600 font-medium">{review.auteur_metier_apres}</span>
                          )}
                        </p>
                      )}
                      {review.titre && (
                        <h4 className="font-medium text-gray-900 mt-2">{review.titre}</h4>
                      )}
                      {review.contenu && (
                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">{review.contenu}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun avis pour le moment. Soyez le premier à donner votre avis !
                </p>
              )}
            </section>

            {/* FAQ */}
            <section className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <details
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:text-primary-600 text-sm">
                      {item.question}
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 text-sm">{item.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* CTA sidebar */}
              {ctaUrl && (
                <div className="bg-primary-50 rounded-xl p-6 text-center">
                  <p className="font-semibold text-gray-900 mb-2">Intéressé par cette formation ?</p>
                  {formation.prix_min && (
                    <p className="text-2xl font-bold text-primary-600 mb-4">
                      À partir de {formation.prix_min}€
                    </p>
                  )}
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Voir la formation
                  </a>
                </div>
              )}

              {/* Formations similaires */}
              {similaires && similaires.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Formations similaires</h3>
                  <div className="space-y-3">
                    {similaires.map((f) => (
                      <Link
                        key={f.id}
                        href={`/formations/${f.slug}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">{f.nom}</p>
                        <div className="mt-1">
                          <EtoilesNote note={Number(f.note_moyenne)} taille="sm" nbAvis={f.nb_avis} />
                        </div>
                        {f.prix_min && (
                          <p className="text-xs text-gray-500 mt-1">
                            À partir de {f.prix_min}€
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
