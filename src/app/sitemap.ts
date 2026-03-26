import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = "https://meilleure-formation.cloud";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/comparateur`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/revendiquer-ma-fiche`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Pages catégories
  const { data: categories } = await supabase.from("formations_categories").select("slug");
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Pages formations
  const { data: formations } = await supabase
    .from("formations")
    .select("slug, updated_at")
    .eq("est_active", true);
  const formationPages: MetadataRoute.Sitemap = (formations || []).map((f) => ({
    url: `${baseUrl}/formations/${f.slug}`,
    lastModified: new Date(f.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...formationPages];
}
