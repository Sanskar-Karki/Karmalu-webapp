import type { Brand, Category, Product } from "@/types";
import { decorProducts, decorCategories } from "./decor";
import { originalsProducts, originalsCategories } from "./originals";

/** Plain, serialisable catalogue data (safe to pass from server to client). */
export type CatalogData = Record<Brand, { products: Product[]; categories: Category[] }>;

/**
 * The product data that ships with the code. Used as the fallback when the
 * Supabase catalogue is empty or unreachable, and as the source for
 * `supabase/catalog_seed.sql`.
 */
export const staticCatalogData: CatalogData = {
  decor: { products: decorProducts, categories: decorCategories },
  originals: { products: originalsProducts, categories: originalsCategories },
};

/** Query helpers over a loaded catalogue. */
export function createCatalog(data: CatalogData) {
  return {
    data,
    getProducts(brand: Brand): Product[] {
      return data[brand].products;
    },
    getCategories(brand: Brand): Category[] {
      return data[brand].categories;
    },
    getCategory(brand: Brand, slug: string): Category | undefined {
      return data[brand].categories.find((c) => c.slug === slug);
    },
    getProductsByCategory(brand: Brand, slug: string): Product[] {
      return data[brand].products.filter(
        (p) => p.categorySlug === slug || p.tags?.includes(slug),
      );
    },
    getProduct(brand: Brand, slug: string): Product | undefined {
      return data[brand].products.find((p) => p.slug === slug);
    },
    getRelated(brand: Brand, product: Product, limit = 4): Product[] {
      return data[brand].products
        .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
        .slice(0, limit);
    },
  };
}

export type Catalog = ReturnType<typeof createCatalog>;
