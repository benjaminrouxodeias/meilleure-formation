import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meilleure Formation — Comparateur de formations business en ligne",
    template: "%s | Meilleure Formation",
  },
  description:
    "Comparez les meilleures formations business en ligne : copywriting, marketing digital, e-commerce, freelance. Avis vérifiés, prix, CPF. Trouvez LA formation qui vous correspond.",
  metadataBase: new URL("https://meilleure-formation.cloud"),
  alternates: {
    canonical: "https://meilleure-formation.cloud",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Meilleure Formation",
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "theme-color": "#4F46E5",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Meilleure Formation",
              url: "https://meilleure-formation.cloud",
              description: "Comparez les meilleures formations business en ligne : copywriting, marketing digital, e-commerce, freelance. Avis vérifiés, prix, CPF.",
              inLanguage: "fr",
              publisher: {
                "@type": "Organization",
                name: "Meilleure Formation",
                url: "https://meilleure-formation.cloud",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
