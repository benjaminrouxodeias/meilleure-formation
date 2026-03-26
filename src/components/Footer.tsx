import Link from "next/link";

const categories = [
  { nom: "Copywriting", slug: "copywriting" },
  { nom: "Marketing Digital", slug: "marketing-digital" },
  { nom: "E-commerce", slug: "e-commerce" },
  { nom: "Closing", slug: "closing" },
  { nom: "Freelance", slug: "freelance" },
  { nom: "SEO", slug: "seo" },
  { nom: "Community Management", slug: "community-management" },
  { nom: "Montage Vidéo", slug: "montage-video" },
  { nom: "Dropshipping", slug: "dropshipping" },
  { nom: "Trading", slug: "trading" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
              <span className="font-bold">
                <span className="text-gray-900">Meilleure</span>{" "}
                <span className="text-primary-600">Formation</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Le comparateur #1 des formations business en ligne.
              Avis vérifiés, prix transparents, comparaisons objectives.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorie/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {cat.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/comparateur"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Comparateur
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/revendiquer-ma-fiche"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Revendiquer ma fiche
                </Link>
              </li>
              {categories.slice(6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorie/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {cat.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Meilleure Formation. Tous droits réservés.
            Certains liens sont des liens affiliés.
          </p>
        </div>
      </div>
    </footer>
  );
}
