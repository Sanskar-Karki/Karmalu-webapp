import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

export interface CartState {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export function createCartStore(storageKey: string) {
  return create<CartState>()(
    persist(
      (set, get) => ({
        items: [],

        add: (product, qty = 1) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === product.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === product.id ? { ...i, qty: i.qty + qty } : i
                ),
              };
            }
            const item: CartItem = {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              category: product.category,
              qty,
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

        clear: () => set({ items: [] }),

        count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

        subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      }),
      { name: storageKey }
    )
  );
}
