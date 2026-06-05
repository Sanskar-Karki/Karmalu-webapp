"use client";

import { createContext, useContext, useState } from "react";
import type { Brand } from "@/types";
import type { CartState } from "./createCartStore";
import { useDecorCart, useActivewearCart } from "./carts";

interface BrandConfig {
  brand: Brand;
  label: string;
  basePath: string;
  useCart: typeof useDecorCart;
}

const configs: Record<Brand, BrandConfig> = {
  decor: {
    brand: "decor",
    label: "Living & Decor",
    basePath: "/living-decor",
    useCart: useDecorCart,
  },
  activewear: {
    brand: "activewear",
    label: "Activewear",
    basePath: "/activewear",
    useCart: useActivewearCart,
  },
};

const BrandContext = createContext<BrandConfig | null>(null);

/* ── Cart drawer open/close state ── */
interface CartDrawerCtx {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}
const CartDrawerContext = createContext<CartDrawerCtx | null>(null);

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const drawer: CartDrawerCtx = {
    open,
    openDrawer: () => setOpen(true),
    closeDrawer: () => setOpen(false),
    toggleDrawer: () => setOpen((v) => !v),
  };

  return (
    <BrandContext.Provider value={configs[brand]}>
      <CartDrawerContext.Provider value={drawer}>
        {children}
      </CartDrawerContext.Provider>
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandConfig {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within a BrandProvider");
  return ctx;
}

export function useCartDrawer(): CartDrawerCtx {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCartDrawer must be used within a BrandProvider");
  return ctx;
}

/** Convenience hook: the current brand's cart store. */
export function useCart(): CartState {
  const { useCart: useBrandCart } = useBrand();
  return useBrandCart();
}
