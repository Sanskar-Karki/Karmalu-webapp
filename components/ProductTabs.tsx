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
      <div role="tablist" aria-label="Product information" className="flex border-b border-[var(--color-ink)]/8 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            aria-controls="product-information-panel"
            onClick={() => setActive(tab)}
            className={`shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)] sm:px-6 sm:text-sm ${
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
      <div id="product-information-panel" role="tabpanel" className="py-7 grid md:grid-cols-2 gap-8 lg:gap-16 sm:py-9">

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
                <li className="rounded-xl bg-[#f8f7f3] p-4 leading-6">
                  Delivery coverage, timing and any charge are confirmed with you on WhatsApp before the order is accepted.
                </li>
                <li className="text-xs leading-5">
                  The price shown above is for the product. Your team will confirm the delivery cost and final amount before fulfillment.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-ink)]">
                Returns
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-[var(--color-ink-muted)]">
                {[
                  "Please contact our team with your order number for return or exchange assistance.",
                  "Ask about eligibility and available options before confirming your order.",
                  "Payment arrangements are confirmed by our team during the WhatsApp conversation.",
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
                  "Please follow the care label on the product.",
                  "Care needs vary by fabric and item.",
                  "Contact us if you need material or care details before ordering.",
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
                  { icon: "🏷️", label: "Check care label" },
                  { icon: "🧺", label: "Follow fabric guidance" },
                  { icon: "💬", label: "Ask us for help" },
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
