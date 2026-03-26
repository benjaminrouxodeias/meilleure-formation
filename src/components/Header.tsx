import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MF</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">
              Meilleure Formation
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/comparateur"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Comparateur
            </Link>
            <Link
              href="/categorie/copywriting"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors hidden md:block"
            >
              Catégories
            </Link>
            <Link
              href="/comparateur"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Trouver ma formation
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
