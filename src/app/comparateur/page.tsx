import { Metadata } from "next";
import { MoteurMatching } from "@/components/MoteurMatching";

export const metadata: Metadata = {
  title: "Comparateur de formations — Trouvez la formation idéale",
  description:
    "Répondez à 5 questions et trouvez la formation business en ligne qui correspond à votre profil, votre budget et vos objectifs. 100% gratuit.",
};

export default function ComparateurPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Trouvez votre formation idéale
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Répondez à 5 questions simples et découvrez les formations les plus
          adaptées à votre profil.
        </p>
      </div>

      <MoteurMatching />
    </div>
  );
}
