/**
 * Shared `next/image` presets so every product/banner image across the
 * site requests consistent breakpoints, quality and caching behavior.
 */

export const IMAGE_QUALITY = {
  card: 80,
  detail: 90,
  banner: 90,
} as const;

/** Product/category card in a grid — roughly 300px mobile, 500px tablet, 700px desktop. */
export const CARD_SIZES =
  "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw";

/** Full-bleed hero / collection banner — always viewport width. */
export const BANNER_SIZES = "100vw";

/** Product detail main image — roughly half the viewport on large screens, full width below. */
export const DETAIL_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 640px";

/** Small thumbnail rail (product gallery, cart line items). */
export const THUMB_SIZES = "72px";
