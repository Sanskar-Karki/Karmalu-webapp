"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import { Heart, Check } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

/**
 * Editorial product card (IVL-inspired): generous image tile, quiet
 * typography, ink accents, a single understated wishlist control and an
 * "Add to bag" action that reveals on hover (always visible on mobile).
 */
export default function ActivewearShopCard({ product }: { product: Product }) {
  const { basePath } = useBrand();
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pickingOptions, setPickingOptions] = useState(false);

  const href = `${basePath}/product/${product.slug}`;
  const hasLifestyle = Boolean(product.hoverImage);
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const [pickedColor, setPickedColor] = useState(colors[0]?.label);

  const addToCart = (size?: string, color?: string) => {
    cart.add(product, 1, size, color);
    setAdded(true);
    setPickingOptions(false);
    openDrawer();
    setTimeout(() => setAdded(false), 1400);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (sizes.length > 0 || colors.length > 0) {
      setPickingOptions((v) => !v);
      return;
    }
    addToCart();
  };

  const handlePickColor = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    setPickedColor(label);
    if (sizes.length === 0) addToCart(undefined, label);
  };

  const handlePickSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    addToCart(size, pickedColor);
  };

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    setWished((v) => !v);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1">
      {/* Image tile */}
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative block aspect-[4/5] overflow-hidden bg-[var(--aw-secondary)] shadow-none transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aw-ink)]"
      >
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ease-in-out ${
            hovered && hasLifestyle ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
        {hasLifestyle && (
          <ProductImage
            preset="card"
            src={product.hoverImage!}
            alt={`${product.name} alternate`}
            fill
            className={`object-cover absolute inset-0 transition-all duration-700 ease-in-out ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}

        {/* Badges — quiet, lowercase-feel labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-[var(--aw-bg)] text-[var(--aw-ink)] text-[10px] font-medium uppercase tracking-[0.15em]">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-[var(--aw-cherry)] text-white text-[10px] font-medium uppercase tracking-[0.15em]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={toggleWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            wished
              ? "bg-[var(--aw-ink)] text-[var(--aw-bg)]"
              : "bg-[var(--aw-bg)]/80 text-[var(--aw-ink)] hover:bg-[var(--aw-bg)]"
          }`}
        >
          <Heart size={15} filled={wished} />
        </button>

        {/* Hover add-to-bag (desktop) */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 hidden sm:flex flex-col gap-2 transition-all duration-300 ${
            hovered || pickingOptions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          {pickingOptions && (
            <div
              onClick={(e) => e.preventDefault()}
              className="flex flex-col gap-2 p-2 bg-[var(--aw-bg)] rounded-lg shadow-lg"
            >
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={(e) => handlePickColor(e, c.label)}
                      aria-label={c.label}
                      title={c.label}
                      className={`w-6 h-6 rounded-full transition-all ${
                        pickedColor === c.label
                          ? "ring-2 ring-offset-1 ring-[var(--aw-ink)]"
                          : "hover:ring-1 hover:ring-offset-1 hover:ring-[var(--aw-ink)]/40"
                      }`}
                      style={{ backgroundColor: c.hex, border: c.hex === "#EDEBDE" ? "1px solid rgba(0,0,0,0.15)" : "none" }}
                    />
                  ))}
                </div>
              )}
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handlePickSize(e, s)}
                      className="min-w-[2.25rem] px-2 py-1.5 text-center rounded text-[11px] font-bold text-[var(--aw-ink)] border border-[var(--aw-ink)]/20 hover:bg-[var(--aw-ink)] hover:text-[var(--aw-bg)] hover:border-[var(--aw-ink)] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-[var(--aw-ink)] text-[var(--aw-bg)] text-[11px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[var(--aw-maroon)] transition-colors active:scale-[0.98] cursor-pointer"
          >
            {added ? (
              <>
                <Check size={15} /> Added
              </>
            ) : pickingOptions && sizes.length > 0 ? (
              "Select a size"
            ) : pickingOptions ? (
              "Select a color"
            ) : (
              "Add to bag"
            )}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 flex flex-col gap-1">
        <Link href={href} className="block">
          <p className="text-[10px] text-[var(--aw-ink-muted)] uppercase tracking-[0.2em]">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-[15px] text-[var(--aw-ink)] leading-tight group-hover:text-[var(--aw-maroon)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[15px] text-[var(--aw-ink)]">{formatNpr(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[13px] text-[var(--aw-ink-muted)] line-through">
              {formatNpr(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Mobile add */}
        <div className="sm:hidden mt-2 flex flex-col gap-2">
          {pickingOptions && colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={(e) => handlePickColor(e, c.label)}
                  aria-label={c.label}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all ${
                    pickedColor === c.label
                      ? "ring-2 ring-offset-1 ring-[var(--aw-ink)]"
                      : ""
                  }`}
                  style={{ backgroundColor: c.hex, border: c.hex === "#EDEBDE" ? "1px solid rgba(0,0,0,0.15)" : "none" }}
                />
              ))}
            </div>
          )}
          {pickingOptions && sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => handlePickSize(e, s)}
                  className="min-w-[2.25rem] px-2 py-1.5 text-center rounded text-[11px] font-bold text-[var(--aw-ink)] border border-[var(--aw-ink)]/20 active:scale-95 transition-transform"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleAdd}
            className="w-full py-2.5 border border-[var(--aw-ink)] text-[var(--aw-ink)] text-[11px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {added ? (
              <>
                <Check size={15} /> Added
              </>
            ) : pickingOptions && sizes.length > 0 ? (
              "Select a size"
            ) : pickingOptions ? (
              "Select a color"
            ) : (
              "Add to bag"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
