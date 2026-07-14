import type { Brand, Product } from "@/types";
import { getRelated } from "@/data/catalog";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import ProductTabs from "@/components/ProductTabs";
import { Star } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

/* ── "Wear it with" product tile (server-safe) ── */
function WearWithCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/product/${product.slug}`}
      className="group flex flex-col gap-2 shrink-0 w-44 sm:w-52"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-beige)]">
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          sizes="208px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-widest font-semibold">
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

export default function ProductDetail({
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
    <div className="bg-white min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-[var(--color-ink)]/6 bg-white">
        <nav className="w-full px-6 h-10 flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
          <Link href={basePath} className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`${basePath}/${product.categorySlug}`} className="hover:text-[var(--color-ink)] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-medium">{product.name}</span>
        </nav>
      </div>

      {/* ── Main grid: gallery + info ── */}
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* Gallery */}
          <ProductGallery images={product.gallery} name={product.name} fitViewport />

          {/* Info panel */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Title + price */}
            <div className="flex flex-col gap-3 pb-4 border-b border-[var(--color-ink)]/8">
              {product.badge && (
                <span className="self-start px-2.5 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-[10px] font-bold uppercase tracking-widest">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[var(--color-ink)]">
                  {formatNpr(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-base text-[var(--color-ink-muted)] line-through">
                      {formatNpr(product.oldPrice)}
                    </span>
                    <span className="text-sm font-bold text-red-500">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-[var(--brand)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "" : "opacity-20"}
                    />
                  ))}
                </div>
                <span className="text-xs text-[var(--color-ink-muted)]">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Description snippet */}
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {product.description}
            </p>

            {/* Actions: colour, size, add to bag */}
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Delivery & Returns / Care ── */}
      <div className="w-full px-4 sm:px-6">
        <ProductTabs product={product} />
      </div>

      {/* ── Wear it with / Recently viewed ── */}
      {related.length > 0 && (
        <div className="border-t border-[var(--color-ink)]/8 mt-12">
          <div className="w-full px-4 sm:px-6 py-12">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-lg font-extrabold uppercase tracking-widest text-[var(--color-ink)]">
                Wear it with
              </h2>
              <Link
                href={`${basePath}/${product.categorySlug}`}
                className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-muted)] hover:text-[var(--brand)] underline underline-offset-2 transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {related.map((p) => (
                <WearWithCard key={p.id} product={p} basePath={basePath} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
