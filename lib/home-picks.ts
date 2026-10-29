import type { Product } from "@/types";

/** Most products the New Arrivals section will show. */
export const HOME_PICKS_LIMIT = 12;

/** Only products with this badge can be in New Arrivals. */
export const NEW_BADGE = "New";

/**
 * Products for a home page's New Arrivals section, in the order arranged in
 * the admin (New Arrivals screen). Only "New"-tagged products qualify.
 * Falls back to `automatic` when nothing has been arranged.
 */
export function homePicks(products: Product[], automatic: () => Product[]): { items: Product[]; curated: boolean } {
  const picked = products
    .filter((p) => typeof p.homeRank === "number" && p.badge === NEW_BADGE)
    .sort((a, b) => a.homeRank! - b.homeRank!)
    .slice(0, HOME_PICKS_LIMIT);
  return picked.length ? { items: picked, curated: true } : { items: automatic(), curated: false };
}
