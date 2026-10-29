"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/types";
import { useCart, useCartDrawer } from "@/store/BrandProvider";
import { Heart, Check, Cart, Close } from "@/components/icons";
import Link from "next/link";
import { formatNpr } from "@/lib/currency";
import { convertMeasurement, hasMeasurements, normalizeSizeChart, type SizeChart } from "@/lib/size-chart";

/** 38 → "38", 38.25 → "38.3". */
const formatMeasurement = (n: number) => String(Math.round(n * 10) / 10);

const FALLBACK_COLOUR = { hex: "#1B1716", label: "Noir" };

function SizeGuideModal({
  sizeChart,
  helpHref,
  onClose,
}: {
  sizeChart: SizeChart;
  helpHref: string;
  onClose: () => void;
}) {
  // Inches first (shoppers can switch to cm); charts are stored in cm.
  const [unit, setUnit] = useState<"cm" | "in">("in");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Portal to <body> so pinned / animated ancestors can't trap or clip it.
  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-[70] bg-[var(--color-ink)]/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Find your fit</p>
              <h2 className="mt-1 font-bold text-[var(--color-ink)]">Size guide</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close size guide"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <Close size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-ink)]/60">Compare these measurements with a similar garment that fits you well.</p>
            <div className="flex shrink-0 rounded-full bg-[var(--color-beige)] p-1" aria-label="Measurement units">
              {(["in", "cm"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={unit === value}
                  onClick={() => setUnit(value)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors ${
                    unit === value ? "bg-white text-[var(--color-ink)] shadow-sm" : "text-[var(--color-ink-muted)]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs leading-5 text-[var(--color-ink)]/60">
            Measurements are a guide, not a guaranteed fit. If you are between sizes, ask our team before sending your order request.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-ink)]/10 text-left">
                  <th className="py-2 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide">Size</th>
                  {sizeChart.columns.map((column) => (
                    <th key={column} className="py-2 pr-3 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide whitespace-nowrap">
                      {column} ({unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.rows.map((row) => (
                  <tr key={row.size} className="border-b border-[var(--color-ink)]/6 last:border-0">
                    <td className="py-2.5 font-semibold text-[var(--color-ink)]">{row.size}</td>
                    {row.values.map((measurement, index) => (
                      <td key={index} className="py-2.5 pr-3 tabular-nums text-[var(--color-ink)]/70">
                        {measurement === null ? "—" : formatMeasurement(convertMeasurement(measurement, sizeChart.unit, unit))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href={helpHref}
            className="text-sm font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-dark)]"
          >
            Ask the team for fit help
          </Link>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default function ProductActions({ product }: { product: Product }) {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();

  const colours = product.colors && product.colors.length > 0 ? product.colors : [FALLBACK_COLOUR];
  const sizes = product.sizes ?? [];
  // Size guide only when the chart has real measurements (either stored format).
  const chart = normalizeSizeChart(product.sizeChart);
  const sizeChart = hasMeasurements(chart) ? chart : null;

  const [selectedColour, setSelectedColour] = useState(colours[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    document.body.classList.add("has-mobile-buy-bar");
    return () => document.body.classList.remove("has-mobile-buy-bar");
  }, []);

  const handleAddToBag = () => {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    cart.add(product, 1, selectedSize ?? undefined, selectedColour.label);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Colour swatches */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ink)]/50">
            Colour
          </span>
          <span className="text-xs font-medium text-[var(--color-ink)]">
            {selectedColour.label}
          </span>
        </div>
        <div className="flex gap-2">
          {colours.map((c) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColour(c)}
              aria-pressed={selectedColour.hex === c.hex}
              aria-label={c.label}
              title={c.label}
              className={`relative w-7 h-7 rounded-full transition-all duration-150 ${
                selectedColour.hex === c.hex
                  ? "ring-2 ring-offset-2 ring-[var(--color-ink)]"
                  : "hover:ring-1 hover:ring-offset-1 hover:ring-[var(--color-ink)]/40"
              }`}
              style={{ backgroundColor: c.hex, border: c.hex === "#EDEBDE" ? "1px solid rgba(45,42,36,0.15)" : "none" }}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ink)]/50">
              Select Size
            </span>
            {sizeChart && (
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-semibold text-[var(--brand)] underline underline-offset-4 transition-colors hover:text-[var(--brand-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              >
                Size guide &amp; fit help
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={selectedSize === s}
                onClick={() => { setSelectedSize(s); setSizeError(false); }}
                className={`min-w-12 h-11 px-3 text-xs font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
                  selectedSize === s
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                    : "bg-white text-[var(--color-ink)] border-[var(--color-ink)]/15 hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && (
            <p id="size-error" role="alert" className="text-xs font-medium text-red-600">Please select a size to continue.</p>
          )}
        </div>
      )}

      {/* Add to bag */}
      <button
        type="button"
        onClick={handleAddToBag}
        className={`w-full py-4 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
          added
            ? "bg-green-600 text-white"
            : "bg-[var(--color-ink)] text-white hover:bg-[var(--brand)] active:scale-[0.99]"
        }`}
      >
        {added ? (
          <><Check size={17} /> Added to bag</>
        ) : (
          <><Cart size={17} /> Add to bag</>
        )}
      </button>

      {/* Wishlist */}
      <button
        type="button"
        aria-pressed={wished}
        onClick={() => setWished((v) => !v)}
        className="flex items-center justify-center gap-2 text-sm text-[var(--color-ink)]/60 transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
      >
        <Heart size={15} filled={wished} className={wished ? "text-red-500" : ""} />
        {wished ? "Saved to wish list" : "Add to wish list"}
      </button>

      {showSizeGuide && sizeChart && (
        <SizeGuideModal
          sizeChart={sizeChart}
          helpHref={product.brand === "originals" ? "/originals/contact" : "/living-decor/contact"}
          onClose={() => setShowSizeGuide(false)}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
              {sizes.length === 0
                ? selectedColour.label
                : selectedSize
                ? `${selectedColour.label} · Size ${selectedSize}`
                : "Select a size"}
            </p>
            <p className="text-sm font-medium text-[var(--color-ink)]">{formatNpr(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToBag}
            aria-describedby={sizeError ? "size-error" : undefined}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-[var(--color-ink)] px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            {added ? <Check size={16} /> : <Cart size={16} />}
            {added ? "Added" : "Add to bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
