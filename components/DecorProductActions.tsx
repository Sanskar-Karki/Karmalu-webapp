"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useCart, useCartDrawer } from "@/store/BrandProvider";
import { Heart, Check, Minus, Plus } from "@/components/icons";

export default function DecorProductActions({ product }: { product: Product }) {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const handleAdd = () => {
    cart.add(product, qty);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Quantity */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
          Quantity
        </span>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-[var(--color-ink)]/15 rounded-full overflow-hidden">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              aria-label="Decrease quantity"
              className="w-10 h-10 flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-beige)] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-[var(--color-ink)]">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => v + 1)}
              aria-label="Increase quantity"
              className="w-10 h-10 flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-beige)] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-xs text-[var(--color-ink-muted)]">In stock</span>
        </div>
      </div>

      {/* Add to bag */}
      <button
        onClick={handleAdd}
        className={`w-full py-4 rounded-full text-sm font-extrabold uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
          added
            ? "bg-[var(--color-ink)] text-white"
            : "bg-[var(--brand)] text-[var(--brand-contrast)] hover:bg-[var(--brand-dark)] active:scale-[0.99]"
        }`}
      >
        {added ? <><Check size={16} /> Added to bag</> : "Add to bag"}
      </button>

      {/* Wishlist */}
      <button
        onClick={() => setWished((v) => !v)}
        className="flex items-center justify-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
      >
        <Heart size={15} filled={wished} className={wished ? "text-rose-400" : ""} />
        {wished ? "Saved to wishlist" : "Save to wishlist"}
      </button>

      {/* Delivery estimate */}
      <p className="text-xs text-[var(--color-ink-muted)] text-center">
        Order within <span className="font-semibold text-[var(--color-ink)]">2 hours</span> for dispatch today.
      </p>
    </div>
  );
}
