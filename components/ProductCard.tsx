"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import Badge from "@/components/Badge";
import { Star, Plus, Check } from "@/components/icons";
import { useBrand, useCart, useCartDrawer } from "@/store/BrandProvider";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { basePath } = useBrand();
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [added, setAdded] = useState(false);

  const href = `${basePath}/product/${product.slug}`;

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
      className="group flex flex-col bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-beige)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3">
            <Badge variant="solid">{product.badge}</Badge>
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute top-3 right-3 bg-[var(--color-ink)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Sale
          </span>
        )}

        {/* Quick-add button */}
        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {added ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-widest font-medium">
            {product.category}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
            <Star size={12} className="text-[var(--brand)]" />
            {product.rating}
          </span>
        </div>

        <h3 className="font-semibold text-[var(--color-ink)] text-base leading-snug line-clamp-2 flex-1 group-hover:text-[var(--brand)] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-lg font-bold text-[var(--color-ink)]">
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-[var(--color-ink-muted)] line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
