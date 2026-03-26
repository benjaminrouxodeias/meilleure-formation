"use client";

import { useEffect, useState } from "react";

interface StickyCtaMobileProps {
  ctaUrl: string;
  prixMin?: number | null;
  formationNom: string;
}

export function StickyCtaMobile({ ctaUrl, prixMin, formationNom }: StickyCtaMobileProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{formationNom}</p>
          {prixMin && (
            <p className="text-xs text-gray-500">À partir de {prixMin}€</p>
          )}
        </div>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Voir la formation
        </a>
      </div>
    </div>
  );
}
