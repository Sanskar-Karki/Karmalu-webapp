import type { Brand, Category, Product } from "@/types";
import { decorProducts, decorCategories } from "./decor";
import { activewearProducts, activewearCategories } from "./activewear";

export const catalog: Record<
  Brand,
  { products: Product[]; categories: Category[] }
> = {
  decor: { products: decorProducts, categories: decorCategories },
  activewear: { products: activewearProducts, categories: activewearCategories },
};

export function getProducts(brand: Brand): Product[] {
  return catalog[brand].products;
}

export function getCategories(brand: Brand): Category[] {
  return catalog[brand].categories;
}

export function getCategory(brand: Brand, slug: string): Category | undefined {
  return catalog[brand].categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(brand: Brand, slug: string): Product[] {
  return catalog[brand].products.filter((p) => p.categorySlug === slug);
}

export function getProduct(brand: Brand, slug: string): Product | undefined {
  return catalog[brand].products.find((p) => p.slug === slug);
}

export function getRelated(brand: Brand, product: Product, limit = 4): Product[] {
  return catalog[brand].products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}
