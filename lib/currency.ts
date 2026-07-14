/**
 * Currency formatting for KARMALU (Nepal — Nepalese Rupees).
 *
 * All catalog prices are stored as plain NPR numbers. Render them through
 * `formatNpr` so the whole site shows a single, consistent currency:
 *   1250  -> "NPR 1,250"
 *   100   -> "NPR 100"
 *   5000  -> "NPR 5,000"
 */
export function formatNpr(amount: number): string {
  const rounded = Math.round(amount);
  return `NPR ${rounded.toLocaleString("en-IN")}`;
}

/** Order subtotal that unlocks free shipping (NPR). */
export const FREE_SHIPPING_THRESHOLD = 5000;

/** How much more the customer must spend to earn free shipping (>= 0). */
export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

/** Whether the given subtotal qualifies for free shipping. */
export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}
