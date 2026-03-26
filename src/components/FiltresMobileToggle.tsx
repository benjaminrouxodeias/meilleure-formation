"use client";

import { useState } from "react";
import { FiltresSidebar } from "./FiltresSidebar";

interface FiltresMobileToggleProps {
  categorieSlug: string;
}

export function FiltresMobileToggle({ categorieSlug }: FiltresMobileToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {open ? "Masquer les filtres" : "Afficher les filtres"}
      </button>

      {open && (
        <div className="mt-3 bg-white rounded-xl border border-gray-200 p-6">
          <FiltresSidebar categorieSlug={categorieSlug} />
        </div>
      )}
    </>
  );
}
