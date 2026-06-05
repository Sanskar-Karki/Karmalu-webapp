"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBrand, useCart } from "@/store/BrandProvider";
import QtyStepper from "@/components/QtyStepper";
import Button from "@/components/Button";
import { Trash, ArrowLeft } from "@/components/icons";

export default function CartView() {
  const { basePath, label } = useBrand();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-[40vh]" />;
  }

  const items = cart.items;
  const subtotal = cart.subtotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-3xl">
          🛍️
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">
          Your cart is empty
        </h1>
        <p className="text-[var(--color-ink-muted)] max-w-sm">
          Looks like you haven&apos;t added anything from {label} yet.
        </p>
        <Button href={basePath} size="lg">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-8">
        Your Cart
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Line items */}
        <ul className="flex flex-col divide-y divide-[var(--color-ink)]/8">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <Link
                href={`${basePath}/product/${item.slug}`}
                className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--color-beige)] shrink-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-widest">
                  {item.category}
                </p>
                <Link
                  href={`${basePath}/product/${item.slug}`}
                  className="font-semibold text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors truncate"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-bold text-[var(--color-ink)] mt-auto">
                  ${item.price}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <button
                  onClick={() => cart.remove(item.id)}
                  aria-label="Remove item"
                  className="text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition"
                >
                  <Trash size={18} />
                </button>
                <QtyStepper
                  value={item.qty}
                  onChange={(q) => cart.setQty(item.id, q)}
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Order summary</h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 150 && subtotal > 0 && (
              <p className="text-xs text-[var(--brand)] bg-[var(--brand-soft)] rounded-lg px-3 py-2 mt-1">
                Add ${(150 - subtotal).toFixed(2)} more for free shipping.
              </p>
            )}
          </div>

          <div className="border-t border-[var(--color-ink)]/8 pt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button href={`${basePath}/checkout`} size="lg" fullWidth>
            Checkout
          </Button>

          <Link
            href={basePath}
            className="inline-flex items-center justify-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition"
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
