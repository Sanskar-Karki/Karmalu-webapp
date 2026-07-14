"use client";

import { useState } from "react";
import type { Product } from "@/types";

const TABS = ["About this piece", "Dimensions & Materials", "Delivery & Care"] as const;
type Tab = (typeof TABS)[number];

export default function DecorProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("About this piece");

  return (
    <div className="border-t border-[var(--color-ink)]/8 mt-12">

      {/* Tab bar — understated, gold underline */}
      <div className="flex border-b border-[var(--color-ink)]/8 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              active === tab
                ? "border-[var(--brand)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-10 max-w-5xl">

        {/* ── About this piece ── */}
        {active === "About this piece" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  The Story
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">
                  Designed with intention
                </h3>
              </div>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Details
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">
                  Craftsmanship &amp; features
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
                    <span className="mt-1 w-4 h-4 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/8 flex items-center justify-center shrink-0">
                      <span className="w-1 h-1 rounded-full bg-[var(--brand)]" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Dimensions & Materials ── */}
        {active === "Dimensions & Materials" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Dimensions
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Size guide</h3>
              </div>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    { label: "Width", value: "—" },
                    { label: "Height / Length", value: "—" },
                    { label: "Depth", value: "—" },
                    { label: "Weight", value: "—" },
                  ].map(({ label, value }) => (
                    <tr key={label} className="border-b border-[var(--color-ink)]/6">
                      <td className="py-2.5 text-[var(--color-ink-muted)] w-1/2">{label}</td>
                      <td className="py-2.5 font-medium text-[var(--color-ink)]">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Measurements are approximate. Slight variations may occur between pieces as each is handcrafted.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Materials
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">What it&apos;s made of</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Natural, sustainably sourced materials.",
                  "Handcrafted by skilled artisans.",
                  "Finished with non-toxic, eco-conscious coatings.",
                  "Built to last — not designed to be replaced.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
                    <span className="mt-1 w-4 h-4 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/8 flex items-center justify-center shrink-0">
                      <span className="w-1 h-1 rounded-full bg-[var(--brand)]" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Delivery & Care ── */}
        {active === "Delivery & Care" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Delivery
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Shipping options</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  { method: "Standard", detail: "5–7 business days", price: "Free over $150, else $9.99" },
                  { method: "Express", detail: "2–3 business days", price: "$14.99" },
                  { method: "White Glove", detail: "Scheduled delivery + room placement", price: "$49.99" },
                ].map((d) => (
                  <li
                    key={d.method}
                    className="flex flex-col gap-0.5 pb-4 border-b border-[var(--color-ink)]/6 last:border-0"
                  >
                    <span className="font-semibold text-sm text-[var(--color-ink)]">{d.method}</span>
                    <span className="text-sm text-[var(--color-ink-muted)]">{d.detail}</span>
                    <span className="text-xs font-medium text-[var(--brand)]">{d.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Care
                </span>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Keeping it beautiful</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "💧", label: "Spot clean with damp cloth" },
                  { icon: "☀️", label: "Avoid direct sunlight" },
                  { icon: "🧴", label: "Use gentle, pH-neutral cleaners" },
                  { icon: "📦", label: "Store in original packaging" },
                  { icon: "🌡️", label: "Keep away from heat sources" },
                  { icon: "🤲", label: "Handle with care" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--color-ink)]/8 bg-[var(--color-beige)]/50"
                  >
                    <span className="text-xl shrink-0">{c.icon}</span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] leading-snug">{c.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Free returns within 30 days. Items must be in original condition.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
