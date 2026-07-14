"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import { Plus, Check, Star } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

export default function ActivewearProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { basePath } = useBrand();
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const href = `${basePath}/product/${product.slug}`;
  const hasLifestyle = Boolean(product.hoverImage);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.add(product, 1);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative block overflow-hidden rounded-2xl bg-[var(--aw-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aw-highlight)] ${
        featured ? "aspect-[4/5] sm:aspect-auto sm:h-full" : "aspect-[3/4]"
      }`}
    >
      {/* Base product image */}
      <ProductImage
        preset="card"
        src={product.image}
        alt={product.name}
        fill
        sizes={featured ? "(max-width: 640px) 100vw, 66vw" : undefined}
        className={`object-cover transition-all duration-700 ease-in-out ${
          hovered && hasLifestyle ? "opacity-0 scale-105" : "opacity-100 scale-100"
        }`}
      />

      {/* Lifestyle / model hover image */}
      {hasLifestyle && (
        <ProductImage
          preset="card"
          src={product.hoverImage!}
          alt={`${product.name} lifestyle`}
          fill
          sizes={featured ? "(max-width: 640px) 100vw, 66vw" : undefined}
          className={`object-cover transition-all duration-700 ease-in-out absolute inset-0 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      )}

      {/* Gradient overlay — lightens on hover to keep lifestyle photo visible */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          hovered
            ? "bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            : "bg-gradient-to-t from-black/75 via-black/20 to-transparent"
        }`}
      />

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-[var(--aw-highlight)] text-[var(--aw-ink)] text-[10px] font-bold uppercase tracking-widest">
            {product.badge}
          </span>
        </div>
      )}

      {/* Quick add button */}
      <button
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white text-[var(--aw-ink)] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {added ? <Check size={18} /> : <Plus size={18} />}
      </button>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col gap-1 text-white">
        <div className="flex items-center gap-1 text-[11px] text-white/70">
          <Star size={12} className="text-[var(--aw-highlight)]" />
          {product.rating} · {product.reviews} reviews
        </div>
        <h3
          className={`font-bold leading-tight ${
            featured ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
          }`}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`font-extrabold ${featured ? "text-xl" : "text-base"}`}>
            {formatNpr(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-white/50 line-through">{formatNpr(product.oldPrice)}</span>
          )}
        </div>

        {/* Animated underline */}
        <span className="mt-1.5 h-0.5 w-0 bg-[var(--aw-highlight)] transition-all duration-500 group-hover:w-10 rounded-full" />
      </div>
    </Link>
  );
}
