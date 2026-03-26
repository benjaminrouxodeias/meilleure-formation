import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Page introuvable
      </h1>
      <p className="mt-4 text-gray-600">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/comparateur"
          className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          Lancer le comparateur
        </Link>
      </div>
    </div>
  );
}
