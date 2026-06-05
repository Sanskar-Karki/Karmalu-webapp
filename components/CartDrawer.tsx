"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import QtyStepper from "@/components/QtyStepper";
import Button from "@/components/Button";
import { Trash, Close } from "@/components/icons";

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
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;

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
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col min-w-0 gap-1">
                    <Link
                      href={`${basePath}/product/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--brand)] transition truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[var(--color-ink-muted)]">${item.price}</p>
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
                    ${(item.price * item.qty).toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-[var(--color-ink)]/8 px-6 py-5 flex flex-col gap-3 shrink-0">
              {subtotal < 150 && (
                <p className="text-xs text-[var(--brand)] bg-[var(--brand-soft)] rounded-lg px-3 py-2 text-center">
                  Add ${(150 - subtotal).toFixed(2)} more for free shipping.
                </p>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-ink-muted)]">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-ink-muted)]">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-[var(--color-ink)]/8 pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
