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
  images: string[];
  description: string;
  details: string[];
  badge?: string;
  rating: number;
  reviews: number;
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
}
