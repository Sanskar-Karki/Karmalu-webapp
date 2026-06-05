"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBrand, useCart } from "@/store/BrandProvider";
import Button from "@/components/Button";
import { Check } from "@/components/icons";

const field =
  "w-full px-4 py-3 rounded-xl border border-[var(--color-ink)]/15 bg-white text-sm outline-none focus:ring-2 focus:ring-[var(--brand)] transition";

export default function CheckoutView() {
  const { basePath } = useBrand();
  const cart = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [placed, setPlaced] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-[40vh]" />;

  const items = cart.items;
  const subtotal = cart.subtotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    cart.clear();
  };

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] flex items-center justify-center">
          <Check size={36} />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">
          Order placed!
        </h1>
        <p className="text-[var(--color-ink-muted)] max-w-sm">
          Thank you for your order. A confirmation has been sent to your email.
          (This is a demo — no payment was taken.)
        </p>
        <Button href={basePath} size="lg">
          Back to shop
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">
          Nothing to check out
        </h1>
        <p className="text-[var(--color-ink-muted)]">Your cart is empty.</p>
        <Button href={basePath} size="lg">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[var(--color-ink)]">Contact</h2>
            <input type="email" required placeholder="Email address" className={field} />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[var(--color-ink)]">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder="First name" className={field} />
              <input required placeholder="Last name" className={field} />
            </div>
            <input required placeholder="Address" className={field} />
            <div className="grid sm:grid-cols-3 gap-3">
              <input required placeholder="City" className={field} />
              <input required placeholder="State" className={field} />
              <input required placeholder="ZIP" className={field} />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[var(--color-ink)]">Payment</h2>
            <input required placeholder="Card number" className={field} />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="MM / YY" className={field} />
              <input required placeholder="CVC" className={field} />
            </div>
            <p className="text-xs text-[var(--color-ink-muted)]">
              🔒 Demo checkout — no real payment is processed.
            </p>
          </section>

          <Button type="submit" size="lg" fullWidth>
            Place order — ${total.toFixed(2)}
          </Button>
        </form>

        {/* Summary */}
        <aside className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Your order</h2>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--color-beige)] shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] text-[10px] font-bold flex items-center justify-center">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-ink)] truncate">{item.name}</p>
                </div>
                <span className="text-sm font-semibold">${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--color-ink)]/8 pt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Shipping</span>
              <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
