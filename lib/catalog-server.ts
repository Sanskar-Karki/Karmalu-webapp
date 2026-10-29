import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Brand, Category, Product, ProductMedia } from "@/types";
import { createCatalog, staticCatalogData, type CatalogData } from "@/data/catalog";
import type { StoredSizeChart } from "@/lib/size-chart";

/** Cache tag cleared by the admin whenever products or categories change. */
export const CATALOG_TAG = "catalog";

const BRANDS: Brand[] = ["decor", "originals"];

export type ProductRow = {
  id: string;
  brand: Brand;
  slug: string;
  name: string;
  category_slug: string;
  tags: string[];
  price: number | string;
  old_price: number | string | null;
  /** Missing until supabase/home_picks.sql has been run. */
  home_rank?: number | null;
  description: string;
  details: string[];
  badge: string | null;
  rating: number | string;
  reviews: number;
  sizes: string[];
  size_chart: StoredSizeChart | null;
  colors: NonNullable<Product["colors"]>;
  media: ProductMedia[];
  hover_url: string | null;
  status: "draft" | "published" | "archived";
  position: number;
  karmify_product_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  brand: Brand;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  position: number;
};

/** Converts a database row into the Product shape the storefront renders. */
export function rowToProduct(row: ProductRow, categoryName?: string): Product {
  const media = Array.isArray(row.media) ? row.media : [];
  const images = media.filter((m) => m.type === "image").map((m) => m.url);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    categorySlug: row.category_slug,
    category: categoryName ?? row.category_slug,
    tags: row.tags?.length ? row.tags : undefined,
    price: Number(row.price),
    oldPrice: row.old_price === null ? undefined : Number(row.old_price),
    image: images[0] ?? "",
    hoverImage: row.hover_url ?? undefined,
    gallery: images,
    media,
    description: row.description,
    details: row.details ?? [],
    badge: row.badge ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    sizes: row.sizes?.length ? row.sizes : undefined,
    sizeChart: row.size_chart ?? undefined,
    colors: row.colors?.length ? row.colors : undefined,
    homeRank: row.home_rank ?? undefined,
  };
}

/** Anonymous client: reads only what RLS lets the public see (published rows). */
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

async function fetchCatalogData(): Promise<CatalogData> {
  const supabase = publicClient();
  if (!supabase) return staticCatalogData;

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("catalog_products")
      .select("*")
      .eq("status", "published")
      .order("position")
      .order("created_at"),
    supabase.from("catalog_categories").select("*").order("position"),
  ]);

  if (productsRes.error || categoriesRes.error) {
    console.warn(
      "[catalog] Falling back to built-in product data:",
      productsRes.error?.message ?? categoriesRes.error?.message,
    );
    return staticCatalogData;
  }

  const productRows = (productsRes.data ?? []) as ProductRow[];
  // Not imported yet — keep showing the built-in catalogue.
  if (productRows.length === 0) return staticCatalogData;

  const categoryRows = (categoriesRes.data ?? []) as CategoryRow[];
  const data = {} as CatalogData;
  for (const brand of BRANDS) {
    const dbCategories: Category[] = categoryRows
      .filter((c) => c.brand === brand)
      .map(({ slug, name, tagline, image }) => ({ slug, name, tagline, image }));
    const categories = dbCategories.length ? dbCategories : staticCatalogData[brand].categories;
    const names = new Map(categories.map((c) => [c.slug, c.name]));
    data[brand] = {
      categories,
      products: productRows
        .filter((p) => p.brand === brand)
        .map((p) => rowToProduct(p, names.get(p.category_slug))),
    };
  }
  return data;
}

const cachedCatalogData = unstable_cache(fetchCatalogData, ["catalog-data"], {
  tags: [CATALOG_TAG],
  revalidate: 300,
});

/** The storefront catalogue (published products only), cached and shared per request. */
export const getCatalogData = cache(async (): Promise<CatalogData> => {
  try {
    return await cachedCatalogData();
  } catch (error) {
    console.warn("[catalog] Falling back to built-in product data:", error);
    return staticCatalogData;
  }
});

export const getCatalog = cache(async () => createCatalog(await getCatalogData()));
