import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { getCategories, getProductsByCategory } from "@/data/catalog";
import ActivewearGrid from "@/components/ActivewearGrid";
import { ArrowLeft } from "@/components/icons";

const basePath = "/activewear";

export default function ActivewearCategoryView({
  category,
}: {
  category: Category;
}) {
  const products = getProductsByCategory("activewear", category.slug);
  const allCategories = getCategories("activewear");

  return (
    <div className="flex flex-col">
      {/* ── Full-bleed photo hero ── */}
      <section className="relative h-[52vh] min-h-[380px] w-full overflow-hidden bg-black">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
          <Link
            href={basePath}
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-4 w-fit transition"
          >
            <ArrowLeft size={16} /> All collections
          </Link>
          <span className="rise-in rise-in-1 text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            {products.length} pieces
          </span>
          <h1 className="rise-in rise-in-2 text-5xl sm:text-7xl font-extrabold uppercase tracking-tight text-white leading-none mt-2">
            {category.name}
          </h1>
          <p className="rise-in rise-in-3 text-white/80 max-w-md leading-relaxed mt-3">
            {category.tagline}
          </p>
        </div>
      </section>

      {/* ── Sticky category pills ── */}
      <section className="sticky top-16 z-30 bg-[var(--aw-bg)]/95 backdrop-blur-md border-b border-[var(--aw-ink)]/8">
        <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {allCategories.map((c) => {
              const active = c.slug === category.slug;
              return (
                <Link
                  key={c.slug}
                  href={`${basePath}/${c.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                    active
                      ? "bg-[var(--aw-highlight)] text-[var(--aw-ink)] shadow-sm"
                      : "bg-[var(--aw-secondary)] text-[var(--aw-ink)] hover:bg-[var(--aw-accent)]"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Lookbook grid ── */}
      <section className="bg-[var(--aw-bg)] max-w-7xl mx-auto w-full px-6 py-10">
        <ActivewearGrid products={products} featureFirst={products.length >= 4} />
      </section>
    </div>
  );
}
