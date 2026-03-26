import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Meilleure Formation — Comparateur de formations business en ligne",
    template: "%s | Meilleure Formation",
  },
  description:
    "Comparez les meilleures formations business en ligne : copywriting, marketing digital, e-commerce, freelance. Avis vérifiés, prix, CPF. Trouvez LA formation qui vous correspond.",
  metadataBase: new URL("https://meilleure-formation.cloud"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Meilleure Formation",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
