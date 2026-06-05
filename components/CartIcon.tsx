"use client";

import { useCart, useCartDrawer } from "@/store/BrandProvider";
import { Cart } from "@/components/icons";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: count comes from persisted (client) storage.
  useEffect(() => setMounted(true), []);
  const count = mounted ? cart.count() : 0;

  return (
    <button
      onClick={openDrawer}
      aria-label="Open cart"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-ink)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] transition-colors"
    >
      <Cart size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
