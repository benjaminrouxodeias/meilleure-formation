interface EtoilesNoteProps {
  note: number;
  taille?: "sm" | "md" | "lg";
  afficherNote?: boolean;
  nbAvis?: number;
}

const tailles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function EtoilesNote({
  note,
  taille = "md",
  afficherNote = true,
  nbAvis,
}: EtoilesNoteProps) {
  const etoiles = Array.from({ length: 5 }, (_, i) => {
    const remplissage = Math.min(1, Math.max(0, note - i));
    return remplissage;
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {etoiles.map((remplissage, i) => (
          <svg
            key={i}
            className={`${tailles[taille]} text-yellow-400`}
            viewBox="0 0 20 20"
            fill={remplissage >= 1 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={remplissage >= 1 ? 0 : 1.5}
          >
            {remplissage > 0 && remplissage < 1 ? (
              <>
                <defs>
                  <linearGradient id={`star-${i}`}>
                    <stop offset={`${remplissage * 100}%`} stopColor="currentColor" />
                    <stop offset={`${remplissage * 100}%`} stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#star-${i})`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </>
            ) : (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            )}
          </svg>
        ))}
      </div>
      {afficherNote && (
        <span className="font-semibold text-gray-900 text-sm">
          {note.toFixed(1)}
        </span>
      )}
      {nbAvis !== undefined && (
        <span className="text-gray-500 text-sm">({nbAvis} avis)</span>
      )}
    </div>
  );
}
