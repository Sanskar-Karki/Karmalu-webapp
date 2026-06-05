import Image from "next/image";
import Link from "next/link";
import type { Brand, Category } from "@/types";
import { getCategories, getProductsByCategory } from "@/data/catalog";
import ProductGrid from "@/components/ProductGrid";
import Breadcrumb from "@/components/Breadcrumb";

export default function CategoryView({
  brand,
  basePath,
  category,
}: {
  brand: Brand;
  basePath: string;
  category: Category;
}) {
  const products = getProductsByCategory(brand, category.slug);
  const allCategories = getCategories(brand);

  return (
    <div className="flex flex-col">
      {/* Category hero */}
      <section className="relative overflow-hidden bg-[var(--color-beige)]">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--page-bg)] via-[var(--page-bg)]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col gap-3">
          <Breadcrumb
            items={[{ label: "Home", href: basePath }, { label: category.name }]}
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] tracking-tight mt-2">
            {category.name}
          </h1>
          <p className="text-[var(--color-ink-muted)] max-w-md leading-relaxed">
            {category.tagline}
          </p>
        </div>
      </section>

      {/* Category chips */}
      <section className="sticky top-16 z-30 bg-[var(--page-bg)]/95 backdrop-blur-md border-b border-[var(--color-ink)]/8">
        <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {allCategories.map((c) => {
              const active = c.slug === category.slug;
              return (
                <Link
                  key={c.slug}
                  href={`${basePath}/${c.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm"
                      : "bg-[var(--brand-soft)] text-[var(--brand)] hover:bg-[var(--brand)]/15"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12">
        <p className="text-sm font-semibold text-[var(--color-ink-muted)] uppercase tracking-widest mb-6">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
