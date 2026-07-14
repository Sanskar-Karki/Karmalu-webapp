"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import QtyStepper from "@/components/QtyStepper";
import Button from "@/components/Button";
import { Trash, Close } from "@/components/icons";
import {
  formatNpr,
  FREE_SHIPPING_THRESHOLD,
  amountToFreeShipping,
  qualifiesForFreeShipping,
} from "@/lib/currency";

export default function CartDrawer() {
  const { basePath, label } = useBrand();
  const { open, closeDrawer } = useCartDrawer();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeDrawer]);

  const items = mounted ? cart.items : [];
  const subtotal = mounted ? cart.subtotal() : 0;
  const freeShipping = subtotal === 0 || qualifiesForFreeShipping(subtotal);
  const shippingMethod = mounted ? cart.shippingMethod : null;
  // Shipping is picked at checkout; until then we can't know the real cost.
  const shippingKnown = Boolean(shippingMethod);
  const shipping = freeShipping ? 0 : shippingMethod?.cost ?? 0;
  const total = subtotal + (shippingKnown ? shipping : 0);
  const remaining = amountToFreeShipping(subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-[var(--color-ink)]/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[var(--page-bg)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--color-ink)]/8 shrink-0">
          <div className="flex items-baseline gap-2">
            <h2 className="font-bold text-[var(--color-ink)]">Your Cart</h2>
            <span className="text-sm text-[var(--color-ink-muted)]">
              ({mounted ? cart.count() : 0})
            </span>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--brand-soft)] transition"
          >
            <Close size={20} />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-2xl">
              🛍️
            </div>
            <p className="font-semibold text-[var(--color-ink)]">Your cart is empty</p>
            <p className="text-sm text-[var(--color-ink-muted)] max-w-[24ch]">
              Nothing here yet from {label}.
            </p>
            <Button onClick={closeDrawer} href={basePath}>
              Start shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 divide-y divide-[var(--color-ink)]/8">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    href={`${basePath}/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-beige)] shrink-0"
                  >
                    <ProductImage preset="thumb" src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col min-w-0 gap-1">
                    <Link
                      href={`${basePath}/product/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--brand)] transition truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      {formatNpr(item.price)}
                      {item.size && <span className="ml-1">· Size {item.size}</span>}
                      {item.color && <span className="ml-1">· {item.color}</span>}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyStepper value={item.qty} onChange={(q) => cart.setQty(item.id, q)} />
                      <button
                        onClick={() => cart.remove(item.id)}
                        aria-label="Remove item"
                        className="text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition p-1"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-[var(--color-ink)] shrink-0">
                    {formatNpr(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-[var(--color-ink)]/8 px-6 py-5 flex flex-col gap-3 shrink-0">
              {/* Free-shipping progress */}
              <div className="flex flex-col gap-2 rounded-lg bg-[var(--brand-soft)] px-3 py-2.5">
                <p className="text-xs text-[var(--color-ink)] text-center">
                  {remaining > 0 ? (
                    <>
                      You&apos;re <span className="font-bold text-[var(--brand)]">{formatNpr(remaining)}</span> away from{" "}
                      <span className="font-semibold">free shipping</span>.
                    </>
                  ) : (
                    <span className="font-semibold text-[var(--brand)]">
                      🎉 You&apos;ve unlocked free shipping!
                    </span>
                  )}
                </p>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-ink)]/10"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={FREE_SHIPPING_THRESHOLD}
                  aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
                  aria-label="Progress toward free shipping"
                >
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-ink-muted)]">Subtotal</span>
                <span className="font-semibold">{formatNpr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-ink-muted)]">Shipping</span>
                <span className={`font-semibold ${!shippingKnown ? "text-[var(--color-ink-muted)] italic" : ""}`}>
                  {!shippingKnown
                    ? "Calculated at next step"
                    : shipping === 0
                    ? "Free"
                    : formatNpr(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-[var(--color-ink)]/8 pt-3">
                <span>Total</span>
                <span>{formatNpr(total)}</span>
              </div>

              <Button href={`${basePath}/checkout`} size="lg" fullWidth onClick={closeDrawer}>
                Checkout
              </Button>
              <Link
                href={`${basePath}/cart`}
                onClick={closeDrawer}
                className="text-center text-sm text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
