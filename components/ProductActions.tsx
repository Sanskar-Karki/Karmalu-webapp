"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useCart, useCartDrawer } from "@/store/BrandProvider";
import { Heart, Check, Cart, Close } from "@/components/icons";

const FALLBACK_COLOUR = { hex: "#1B1716", label: "Noir" };

function SizeGuideModal({
  sizeChart,
  onClose,
}: {
  sizeChart: NonNullable<Product["sizeChart"]>;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
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
            <h2 className="font-bold text-[var(--color-ink)]">Size guide</h2>
            <button
              onClick={onClose}
              aria-label="Close size guide"
              className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 transition"
            >
              <Close size={18} />
            </button>
          </div>
          <p className="text-xs text-[var(--color-ink)]/50">
            All measurements in centimetres.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-ink)]/10 text-left">
                  <th className="py-2 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide">Size</th>
                  <th className="py-2 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide">Chest</th>
                  <th className="py-2 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide">Waist</th>
                  <th className="py-2 font-semibold text-[var(--color-ink)]/50 text-xs uppercase tracking-wide">Hip</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size} className="border-b border-[var(--color-ink)]/6 last:border-0">
                    <td className="py-2.5 font-semibold text-[var(--color-ink)]">{row.size}</td>
                    <td className="py-2.5 text-[var(--color-ink)]/70">{row.chest}</td>
                    <td className="py-2.5 text-[var(--color-ink)]/70">{row.waist}</td>
                    <td className="py-2.5 text-[var(--color-ink)]/70">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductActions({ product }: { product: Product }) {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();

  const colours = product.colors && product.colors.length > 0 ? product.colors : [FALLBACK_COLOUR];
  const sizes = product.sizes ?? [];

  const [selectedColour, setSelectedColour] = useState(colours[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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
              aria-label={c.label}
              title={c.label}
              className={`relative w-8 h-8 rounded transition-all duration-150 ${
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
            {product.sizeChart && product.sizeChart.length > 0 && (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs underline underline-offset-2 text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] transition-colors"
              >
                Size guide
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => { setSelectedSize(s); setSizeError(false); }}
                className={`w-11 h-11 rounded text-sm font-semibold border transition-all duration-150 ${
                  selectedSize === s
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                    : "bg-white text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && (
            <p className="text-xs text-red-500 font-medium">Please select a size.</p>
          )}
        </div>
      )}

      {/* Add to bag */}
      <button
        onClick={handleAddToBag}
        className={`w-full py-4 rounded text-sm font-extrabold uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
          added
            ? "bg-green-600 text-white"
            : "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/85 active:scale-[0.99]"
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
        onClick={() => setWished((v) => !v)}
        className="flex items-center justify-center gap-2 text-sm text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] transition-colors"
      >
        <Heart size={15} filled={wished} className={wished ? "text-red-500" : ""} />
        {wished ? "Saved to wish list" : "Add to wish list"}
      </button>

      {showSizeGuide && product.sizeChart && (
        <SizeGuideModal sizeChart={product.sizeChart} onClose={() => setShowSizeGuide(false)} />
      )}
    </div>
  );
}
