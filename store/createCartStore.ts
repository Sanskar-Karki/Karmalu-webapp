import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

/** Composite key so the same product in a different size or color is a separate line item. */
const cartItemKey = (productId: string, size?: string, color?: string) =>
  [productId, size, color].filter(Boolean).join("::");

export interface CartState {
  items: CartItem[];
  add: (product: Product, qty?: number, size?: string, color?: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
  /** Shipping method chosen at checkout (id + cost), shared with the cart drawer. Null until picked. */
  shippingMethod: { id: string; cost: number } | null;
  setShippingMethod: (method: { id: string; cost: number } | null) => void;
}

export function createCartStore(storageKey: string) {
  return create<CartState>()(
    persist(
      (set, get) => ({
        items: [],
        shippingMethod: null,

        add: (product, qty = 1, size, color) =>
          set((state) => {
            const key = cartItemKey(product.id, size, color);
            const existing = state.items.find((i) => i.id === key);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === key ? { ...i, qty: i.qty + qty } : i
                ),
              };
            }
            const item: CartItem = {
              id: key,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              qty,
              size,
              color,
            };
            return { items: [...state.items, item] };
          }),

        remove: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

        setQty: (id, qty) =>
          set((state) => ({
            items:
              qty <= 0
                ? state.items.filter((i) => i.id !== id)
                : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
          })),

        clear: () => set({ items: [], shippingMethod: null }),

        count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

        subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

        setShippingMethod: (method) => set({ shippingMethod: method }),
      }),
      { name: storageKey }
    )
  );
}
