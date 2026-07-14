import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://karmalu.com";

const DECOR_CATEGORIES = ["rugs", "cushions", "vases", "wall-art", "lamps"];
const AW_CATEGORIES = ["women", "men", "accessories"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/living-decor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/living-decor/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/living-decor/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/living-decor/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/activewear`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/activewear/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/activewear/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/activewear/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const decorCategoryRoutes: MetadataRoute.Sitemap = DECOR_CATEGORIES.map((slug) => ({
    url: `${BASE_URL}/living-decor/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const awCategoryRoutes: MetadataRoute.Sitemap = AW_CATEGORIES.map((slug) => ({
    url: `${BASE_URL}/activewear/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...decorCategoryRoutes, ...awCategoryRoutes];
}
