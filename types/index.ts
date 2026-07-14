export type Brand = "decor" | "activewear";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  categorySlug: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  description: string;
  details: string[];
  badge?: string;
  rating: number;
  reviews: number;
  sizes?: string[];
  sizeChart?: { size: string; chest: number; waist: number; hip: number }[];
  colors?: { hex: string; label: string }[];
}

export interface CartItem {
  /** Unique per product+size+color combination — see createCartStore's cartItemKey. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
  size?: string;
  color?: string;
}
