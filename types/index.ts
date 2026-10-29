import type { StoredSizeChart } from "@/lib/size-chart";

export type Brand = "decor" | "originals";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

/** A photo or video attached to a product (stored in the catalogue database). */
export interface ProductMedia {
  url: string;
  type: "image" | "video";
  publicId?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  categorySlug: string;
  category: string;
  tags?: string[];
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  /** Ordered photos and videos (database products only; `gallery` holds the photo URLs). */
  media?: ProductMedia[];
  /** Position in the home page "New Arrivals" / "Featured" section (hand-picked in the admin). */
  homeRank?: number;
  description: string;
  details: string[];
  badge?: string;
  rating: number;
  reviews: number;
  sizes?: string[];
  /** Either chart format — read it with normalizeSizeChart() from lib/size-chart. */
  sizeChart?: StoredSizeChart;
  colors?: { hex: string; label: string }[];
}

export interface CartItem {
  /** Unique per product+size+color combination — see createCartStore's cartItemKey. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  /** Original price when the product is on sale (for "You save"). */
  oldPrice?: number;
  image: string;
  category: string;
  qty: number;
  size?: string;
  color?: string;
}
