import type { Product } from "@/types";
import ActivewearProductCard from "@/components/ActivewearProductCard";

/**
 * Photo-centric lookbook grid for Activewear.
 * The first product becomes a large featured tile; the rest flow as
 * tall-portrait tiles in a responsive masonry-style grid.
 */
export default function ActivewearGrid({
  products,
  featureFirst = true,
}: {
  products: Product[];
  featureFirst?: boolean;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-[var(--aw-ink)]/50">
        <p className="text-4xl mb-3">✦</p>
        <p className="font-semibold">Nothing here yet — check back soon.</p>
      </div>
    );
  }

  if (!featureFirst || products.length < 3) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map((p) => (
          <ActivewearProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  }

  const [hero, ...rest] = products;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
      {/* Featured large tile: 2 cols on desktop, full width on mobile */}
      <div className="col-span-2 row-span-2">
        <ActivewearProductCard product={hero} featured />
      </div>

      {rest.map((p) => (
        <ActivewearProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
