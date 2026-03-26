import Link from "next/link";
import { EtoilesNote } from "./EtoilesNote";
import { BadgeCPF, BadgeGarantie, BadgeRecommandee, BadgeSponsorisee } from "./BadgeCPF";
import type { Formation } from "@/lib/types/database";

interface CarteFormationProps {
  formation: Formation;
}

export function CarteFormation({ formation }: CarteFormationProps) {
  const prixLabel =
    formation.prix_min && formation.prix_max
      ? formation.prix_min === formation.prix_max
        ? `${formation.prix_min}€`
        : `${formation.prix_min}€ — ${formation.prix_max}€`
      : formation.prix_min
      ? `À partir de ${formation.prix_min}€`
      : null;

  return (
    <Link href={`/formations/${formation.slug}`} className="block group">
      <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {formation.est_sponsorisee && (
          <div className="absolute top-3 right-3">
            <BadgeSponsorisee />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl">
            {formation.nom.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {formation.nom}
              </h3>
              {formation.est_recommandee && <BadgeRecommandee />}
            </div>

            {formation.fondateur && (
              <p className="text-sm text-gray-500 mt-0.5">
                par {formation.fondateur}
              </p>
            )}

            <div className="mt-2">
              <EtoilesNote
                note={Number(formation.note_moyenne)}
                nbAvis={formation.nb_avis}
                taille="sm"
              />
            </div>

            {formation.description_courte && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {formation.description_courte}
              </p>
            )}

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {prixLabel && (
                <span className="text-sm font-semibold text-gray-900">
                  {prixLabel}
                </span>
              )}
              {formation.eligible_cpf && <BadgeCPF />}
              {formation.garantie && <BadgeGarantie />}
              {formation.duree_heures && (
                <span className="text-xs text-gray-500">
                  {formation.duree_heures}h de formation
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-shrink-0 items-center">
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium group-hover:bg-primary-700 transition-colors">
              Voir la fiche
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
