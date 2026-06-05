import type { Brand, Product } from "@/types";
import { getRelated } from "@/data/catalog";
import ProductGallery from "@/components/ProductGallery";
import AddToCart from "@/components/AddToCart";
import Badge from "@/components/Badge";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import { Star } from "@/components/icons";

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: basePath },
            { label: product.category, href: `${basePath}/${product.categorySlug}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5 lg:py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {product.badge && <Badge variant="solid">{product.badge}</Badge>}
              <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-widest">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-[var(--brand)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className={i < Math.round(product.rating) ? "" : "opacity-25"} />
                ))}
              </span>
              <span className="text-sm text-[var(--color-ink-muted)]">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[var(--color-ink)]">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-[var(--color-ink-muted)] line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-[var(--color-ink-muted)] leading-relaxed">
            {product.description}
          </p>

          <AddToCart product={product} />

          <ul className="flex flex-col gap-2 border-t border-[var(--color-ink)]/8 pt-5 mt-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                {d}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-3 text-center mt-2">
            {[
              { t: "Free shipping", s: "Over $150" },
              { t: "30-day returns", s: "No questions" },
              { t: "Secure checkout", s: "Encrypted" },
            ].map((b) => (
              <div key={b.t} className="rounded-xl bg-[var(--brand-soft)] py-3 px-2">
                <p className="text-xs font-semibold text-[var(--color-ink)]">{b.t}</p>
                <p className="text-[11px] text-[var(--color-ink-muted)]">{b.s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeader eyebrow="You may also like" title="Related pieces" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
