import type { Brand, Product, ProductMedia } from "@/types";
import { getCatalog } from "@/lib/catalog-server";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import ProductScrollStage from "@/components/ProductScrollStage";
import ProductActions from "@/components/ProductActions";
import ProductTabs from "@/components/ProductTabs";
import { ArrowLeft } from "@/components/icons";
import { formatNpr } from "@/lib/currency";
import { productDiscount } from "@/lib/pricing";

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
      className="group flex w-44 shrink-0 flex-col gap-3 sm:w-56"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--aw-secondary)]">
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--aw-ink-muted)]">
          {product.category}
        </p>
        <p className="mt-1 line-clamp-2 font-display text-sm leading-snug text-[var(--aw-ink)] transition-colors group-hover:text-[var(--aw-maroon)]">
          {product.name}
        </p>
        <p className="mt-0.5 text-sm text-[var(--aw-ink)]">{formatNpr(product.price)}</p>
      </div>
    </Link>
  );
}

function Price({ product, discount }: { product: Product; discount: number }) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span className="text-xl font-medium tracking-tight text-[var(--aw-ink)]">
        {formatNpr(product.price)}
      </span>
      {productDiscount(product) > 0 && (
        <>
          <span className="text-sm text-[var(--aw-ink-muted)] line-through">
            {formatNpr(product.oldPrice!)}
          </span>
          <span className="bg-[var(--aw-highlight)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Editorial three-column product page (Originals):
 * description on the left, a scrolling photo stack in the middle and
 * sizing / add to bag on the right. The whole stage pins while scrolling
 * slides the photos in place. Below lg: gallery → info → actions.
 */
export default async function ProductDetail({
  product,
  basePath,
  brand,
}: {
  product: Product;
  basePath: string;
  brand: Brand;
}) {
  const { getRelated } = await getCatalog();
  const related = getRelated(brand, product);
  const discount = productDiscount(product);
  // Photos and videos in admin order; built-in products only have photos.
  const images: ProductMedia[] = product.media?.length
    ? product.media
    : (product.gallery.length > 0 ? product.gallery : [product.image]).filter(Boolean).map((url) => ({ url, type: "image" as const }));
  const productSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.gallery,
    category: product.category,
    brand: { "@type": "Brand", name: "KARMALU" },
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: product.price,
    },
  }).replace(/</g, "\\u003c");


  return (
    <div className="bg-[var(--aw-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productSchema }}
      />

      <div>
      <ProductScrollStage
        images={images}
        name={product.name}
        info={
        <section className="px-5 pt-7 sm:px-8 lg:px-10 lg:py-10 xl:px-14">
          <div className="rise-in">
            <Link
              href={`${basePath}/${product.categorySlug}`}
              className="group inline-flex items-center gap-1.5 text-[11px] text-[var(--aw-ink-muted)] transition-colors hover:text-[var(--aw-ink)]"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              Back to {product.category}
            </Link>

            <div className="mt-6 flex items-center gap-3 lg:mt-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--aw-ink-muted)]">
                Karmalu Originals
              </p>
              {product.badge && (
                <span className="border border-[var(--aw-ink)]/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--aw-ink)]">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="mt-3 max-w-sm font-display text-[1.75rem] font-medium leading-[1.08] tracking-[-0.025em] text-[var(--aw-ink)] xl:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-4 lg:hidden">
              <Price product={product} discount={discount} />
            </div>

            <p className="mt-5 max-w-sm text-[13px] leading-6 text-[var(--aw-ink-muted)]">
              {product.description}
            </p>

            {product.details.length > 0 && (
              <ul className="mt-6 flex max-w-sm flex-col gap-2 border-t border-[var(--aw-ink)]/10 pt-5">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[12px] leading-5 text-[var(--aw-ink-muted)]">
                    <span className="mt-2 h-px w-3 shrink-0 bg-[var(--aw-ink)]/40" />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        }
        actions={
        <section
          aria-label="Choose options"
          className="px-5 pt-8 sm:px-8 lg:flex lg:flex-col lg:px-10 lg:py-10 xl:px-14"
        >
          <div className="rise-in rise-in-2 w-full lg:max-w-xs lg:self-end">
            <div className="hidden lg:block">
              <Price product={product} discount={discount} />
              <p className="mt-1 text-[11px] text-[var(--aw-ink-muted)]">
                Delivery cost is confirmed with your order.
              </p>
            </div>

            <div className="lg:mt-7">
              <ProductActions product={product} />
            </div>

            <ol className="mt-7 flex flex-col gap-2 border-t border-[var(--aw-ink)]/10 pt-5 text-[11px] leading-5 text-[var(--aw-ink-muted)]">
              {[
                "Choose your colour and size",
                "Send your order request via WhatsApp",
                "Our team confirms the details",
              ].map((stepText, i) => (
                <li key={stepText} className="flex gap-3">
                  <span className="tabular-nums text-[var(--aw-ink)]">0{i + 1}</span>
                  {stepText}
                </li>
              ))}
            </ol>
          </div>
        </section>
        }
      />
      </div>

      <section className="border-t border-[var(--aw-ink)]/10 px-5 sm:px-8 lg:px-14">
        <ProductTabs product={product} />
      </section>

      {related.length > 0 && (
        <section className="border-t border-[var(--aw-ink)]/10 bg-[var(--aw-secondary)]">
          <div className="px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--aw-ink-muted)]">
                  Styled together
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-[var(--aw-ink)] sm:text-3xl">
                  Complete the look
                </h2>
              </div>
              <Link
                href={`${basePath}/${product.categorySlug}`}
                className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--aw-ink)] underline underline-offset-4 sm:block"
              >
                Explore the collection
              </Link>
            </div>
            <div className="no-scrollbar flex gap-5 overflow-x-auto pb-2">
              {related.map((p) => (
                <WearWithCard key={p.id} product={p} basePath={basePath} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
