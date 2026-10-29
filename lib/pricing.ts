import type { Product } from "@/types";

/** Whole-number % off, or 0 when there's no genuine reduction. */
export function discountPercent(price: number, oldPrice?: number | null): number {
  if (!oldPrice || !Number.isFinite(oldPrice) || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Sale price from an original price and a % off (rounded to whole rupees). */
export function priceAfterDiscount(oldPrice: number, percent: number): number {
  return Math.round(oldPrice * (1 - percent / 100));
}

export function productDiscount(product: Pick<Product, "price" | "oldPrice">): number {
  return discountPercent(product.price, product.oldPrice);
}

/** On sale = a real markdown (or an explicit "Sale" badge). */
export function isOnSale(product: Pick<Product, "price" | "oldPrice" | "badge">): boolean {
  return product.badge === "Sale" || productDiscount(product) > 0;
}
