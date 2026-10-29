import type { Brand, ProductMedia } from "@/types";
import type { SizeChart } from "@/lib/size-chart";

export type ProductStatus = "draft" | "published" | "archived";

/** What the admin product form edits and sends to `saveProduct`. */
export interface AdminProductInput {
  id?: string;
  brand: Brand;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  oldPrice: number | null;
  description: string;
  details: string[];
  badge: string | null;
  sizes: string[];
  sizeChart: SizeChart;
  colors: { hex: string; label: string }[];
  media: ProductMedia[];
  hoverUrl: string | null;
  status: ProductStatus;
}

export interface MediaAsset {
  id: string;
  url: string;
  public_id: string;
  type: "image" | "video";
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  original_filename: string | null;
  created_at: string;
}

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string };

export const BADGES = ["New", "Bestseller", "Sale"] as const;
export const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free size"] as const;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
