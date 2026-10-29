import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog-server";
import type { Brand } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://karmalu.com";

const SHOP_PATH: Record<Brand, string> = { originals: "/originals", decor: "/living-decor" };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const catalog = await getCatalog();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  for (const brand of ["originals", "decor"] as Brand[]) {
    const base = `${BASE_URL}${SHOP_PATH[brand]}`;
    pages.push(
      { url: base, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
      { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
      { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
      ...catalog.getCategories(brand).map(({ slug }) => ({
        url: `${base}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...catalog.getProducts(brand).map((p) => ({
        url: `${base}/product/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        images: p.image && p.image.startsWith("http") ? [p.image] : p.image ? [`${BASE_URL}${p.image}`] : undefined,
      })),
    );
  }

  return pages;
}
