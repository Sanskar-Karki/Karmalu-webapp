"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import { Heart, Check, Plus, Star } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

export default function DecorShopCard({ product }: { product: Product }) {
  const { basePath } = useBrand();
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  const href = `${basePath}/product/${product.slug}`;
  const hasLifestyle = Boolean(product.hoverImage);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.add(product, 1);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1400);
  };

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    setWished((v) => !v);
  };

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col focus-visible:outline-none"
    >
      {/* Image tile */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--color-beige)]">
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-500 ${
            hovered && hasLifestyle ? "opacity-0" : "opacity-100"
          }`}
        />
        {hasLifestyle && (
          <ProductImage
            preset="card"
            src={product.hoverImage!}
            alt={`${product.name} alternate`}
            fill
            className={`object-cover absolute inset-0 transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)] bg-[var(--page-bg)]/90 px-2 py-1">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-contrast)] bg-[var(--brand)] px-2 py-1">
              −{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={toggleWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center transition-colors duration-200 ${
            wished ? "text-[var(--brand)]" : "text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]"
          }`}
        >
          <Heart size={16} filled={wished} />
        </button>

        {/* Quick-add on hover */}
        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-[var(--page-bg)] text-[var(--color-ink)] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--brand)] hover:text-[var(--brand-contrast)] cursor-pointer"
        >
          {added ? <Check size={15} /> : <Plus size={15} />}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 pt-3 border-t border-[var(--color-ink)]/10">
        <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
          {product.category}
        </p>

        <h3 className="text-[13px] text-[var(--color-ink)] leading-snug line-clamp-2 group-hover:text-[var(--brand-dark)] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(product.rating)
                    ? "text-[var(--brand)]"
                    : "text-[var(--color-ink)]/15"
                }
              />
            ))}
          </span>
          <span className="text-[10px] font-medium text-[var(--color-ink-muted)]">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">{formatNpr(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-[var(--color-ink-muted)] line-through">{formatNpr(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
