import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/config";
import { supabase } from "../lib/supabase";

const PAGES = [
  "", "/vehicules", "/demande-speciale", "/devenir-partenaire", "/a-propos", "/contact",
  "/voyageurs-diaspora", "/familles-professionnels", "/proprietaires",
  "/conditions-generales", "/confidentialite", "/annulation", "/remboursement", "/depot-de-garantie",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = PAGES.map((p) => ({ url: `${SITE_URL}${p}`, priority: p === "" ? 1 : 0.7 }));
  try {
    const { data } = await supabase.from("vehicles").select("id").eq("published", true);
    const cars: MetadataRoute.Sitemap = (data ?? []).map((v: { id: string }) => ({ url: `${SITE_URL}/vehicule/${v.id}`, priority: 0.8 }));
    return [...base, ...cars];
  } catch {
    return base;
  }
}
