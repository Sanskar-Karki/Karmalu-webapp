import type { Brand, Product } from "@/types";
import { getRelated } from "@/data/catalog";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import DecorProductActions from "@/components/DecorProductActions";
import DecorProductTabs from "@/components/DecorProductTabs";
import { Star, ArrowRight } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

function CompleteTheRoomCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/product/${product.slug}`}
      className="group flex flex-col gap-3 shrink-0 w-48 sm:w-56"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-beige)]">
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[9px] text-[var(--brand)] uppercase tracking-[0.2em] font-bold">
          {product.category}
        </p>
        <p className="text-sm font-semibold text-[var(--color-ink)] leading-snug group-hover:text-[var(--brand)] transition-colors line-clamp-2">
          {product.name}
        </p>
        <p className="text-sm font-bold text-[var(--color-ink)] mt-0.5">{formatNpr(product.price)}</p>
      </div>
    </Link>
  );
}

export default function DecorProductDetail({
  product,
  basePath,
  brand,
}: {
  product: Product;
  basePath: string;
  brand: Brand;
}) {
  const related = getRelated(brand, product);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="bg-[var(--page-bg)] min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-[var(--color-ink)]/6 bg-white/70 backdrop-blur-sm">
        <nav className="w-full px-6 h-11 flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
          <Link href={basePath} className="hover:text-[var(--brand)] transition-colors">Home</Link>
          <span className="text-[var(--color-ink)]/20">/</span>
          <Link href={`${basePath}/shop`} className="hover:text-[var(--brand)] transition-colors">
            Shop
          </Link>
          <span className="text-[var(--color-ink)]/20">/</span>
          <Link href={`${basePath}/${product.categorySlug}`} className="hover:text-[var(--brand)] transition-colors">
            {product.category}
          </Link>
          <span className="text-[var(--color-ink)]/20">/</span>
          <span className="text-[var(--color-ink)] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ── Main grid ── */}
      <div className="w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-start">

          {/* Gallery */}
          <ProductGallery images={product.gallery} name={product.name} />

          {/* Info panel */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">

            {/* Category label */}
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--brand)]">
              {product.category}
            </span>

            {/* Title */}
            <div className="flex flex-col gap-3 pb-5 border-b border-[var(--color-ink)]/8">
              {product.badge && (
                <span className="self-start px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-[9px] font-extrabold uppercase tracking-[0.2em]">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] leading-[1.2]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.round(product.rating)
                          ? "text-[var(--brand)]"
                          : "text-[var(--color-ink)]/15"
                      }
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[var(--color-ink-muted)]">
                  {product.rating} &middot; {product.reviews} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[var(--color-ink)]">
                {formatNpr(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-[var(--color-ink-muted)] line-through">
                    {formatNpr(product.oldPrice)}
                  </span>
                  <span className="text-sm font-extrabold text-[var(--brand)]">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed border-l-2 border-[var(--brand)]/30 pl-4 italic">
              {product.description}
            </p>

            {/* Actions: qty + add to bag + wishlist + trust */}
            <DecorProductActions product={product} />

            {/* Editorial note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[var(--color-ink)]/6">
              <span className="text-2xl shrink-0">✦</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--brand)]">
                  Curator&apos;s note
                </span>
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  Each piece in our Living &amp; Decor collection is selected for longevity and character — designed to evolve with your space, not fade into it.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Tabs ── */}
        <DecorProductTabs product={product} />
      </div>

      {/* ── Complete the room ── */}
      {related.length > 0 && (
        <div className="bg-white border-t border-[var(--color-ink)]/6">
          <div className="w-full px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--brand)]">
                  Styled together
                </span>
                <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
                  Complete the room
                </h2>
              </div>
              <Link
                href={`${basePath}/shop`}
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors"
              >
                Browse all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {related.map((p) => (
                <CompleteTheRoomCard key={p.id} product={p} basePath={basePath} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Editorial bottom strip ── */}
      <div className="relative overflow-hidden h-[200px] sm:h-[260px]">
        <ProductImage
          preset="banner"
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80"
          alt="KARMALU Living & Decor — crafted for real life"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 gap-3">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.35em] text-[var(--brand-light)]">
            Living &amp; Decor
          </span>
          <p className="text-xl sm:text-3xl font-extrabold text-white leading-tight max-w-sm">
            Crafted for real life.
            <br />
            <em className="not-italic text-[var(--brand-light)]">Designed to stay.</em>
          </p>
          <Link
            href={basePath}
            className="self-start mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[var(--brand-dark)] transition-colors"
          >
            Explore the collection <ArrowRight size={12} />
          </Link>
        </div>
      </div>

    </div>
  );
}
