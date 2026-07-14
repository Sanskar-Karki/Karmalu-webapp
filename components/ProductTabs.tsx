"use client";

import { useState } from "react";
import type { Product } from "@/types";

const TABS = ["Product Details", "Delivery & Returns", "Care Guide"] as const;
type Tab = (typeof TABS)[number];

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Product Details");

  return (
    <div className="border-t border-[var(--color-ink)]/8 mt-10">
      {/* Tab bar */}
      <div className="flex border-b border-[var(--color-ink)]/8 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 px-6 py-4 text-sm font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              active === tab
                ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8 grid md:grid-cols-2 gap-10 lg:gap-16">

        {active === "Product Details" && (
          <>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Description
              </h3>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Fit &amp; Features
              </h3>
              <ul className="flex flex-col gap-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                    {d}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                  A-line silhouette
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                  Contemporary fit
                </li>
              </ul>
            </div>
          </>
        )}

        {active === "Delivery & Returns" && (
          <>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Delivery
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-[var(--color-ink-muted)]">
                {[
                  { method: "Standard Delivery", detail: "5–7 business days", price: "Free over $150, else $9.99" },
                  { method: "Express Delivery", detail: "2–3 business days", price: "$9.99" },
                  { method: "Overnight Delivery", detail: "Next business day", price: "$19.99" },
                ].map((d) => (
                  <li key={d.method} className="flex flex-col gap-0.5 pb-3 border-b border-[var(--color-ink)]/6 last:border-0">
                    <span className="font-semibold text-[var(--color-ink)]">{d.method}</span>
                    <span>{d.detail}</span>
                    <span className="font-medium text-[var(--color-ink)]">{d.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Returns
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-[var(--color-ink-muted)]">
                {[
                  "Free returns within 30 days of delivery.",
                  "Items must be unworn, unwashed and in original condition with tags attached.",
                  "Sale items are eligible for exchange or store credit.",
                  "Start a return from your account or contact us at hello@karmalu.com.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {active === "Care Guide" && (
          <>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Fabric &amp; Care
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-[var(--color-ink-muted)]">
                {[
                  "59% Wool, 9% Viscose, 5% Nylon, 27% Polyester blended performance fabric.",
                  "Machine wash cold on gentle cycle.",
                  "Do not tumble dry — lay flat to dry.",
                  "Warm iron on reverse if needed.",
                  "Do not bleach or dry-clean.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Care Symbols
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🌊", label: "Machine wash cold" },
                  { icon: "❄️", label: "Gentle cycle" },
                  { icon: "🚫🔥", label: "No tumble dry" },
                  { icon: "♨️", label: "Warm iron" },
                  { icon: "🚫☢️", label: "No bleach" },
                  { icon: "✅", label: "Dry flat" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--color-ink)]/8 text-center"
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-[10px] text-[var(--color-ink-muted)] leading-tight">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
