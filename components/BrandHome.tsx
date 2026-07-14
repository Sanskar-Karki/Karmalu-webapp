import ProductImage from "@/components/ProductImage";
import type { Brand } from "@/types";
import { getCategories, getProducts, getProductsByCategory } from "@/data/catalog";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import { ArrowRight } from "@/components/icons";
import NewsletterForm from "@/components/NewsletterForm";

interface HeroCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function BrandHome({
  brand,
  basePath,
  hero,
}: {
  brand: Brand;
  basePath: string;
  hero: HeroCopy;
}) {
  const categories = getCategories(brand);
  const products = getProducts(brand);
  const featured = products.filter((p) => p.badge).slice(0, 6);
  const featuredList = featured.length >= 3 ? featured : products.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ProductImage
            preset="banner"
            src={hero.image}
            alt={hero.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--page-bg)] via-[var(--page-bg)]/85 to-[var(--page-bg)]/30" />
        </div>

        <div className="relative z-10 w-full px-6 py-24 sm:py-32 flex flex-col gap-5">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand)]">
            {hero.eyebrow}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--color-ink)] leading-[1.05] tracking-tight max-w-xl">
            {hero.title}
          </h1>
          <p className="text-lg text-[var(--color-ink-muted)] max-w-md leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Button href={`${basePath}/${categories[0].slug}`} size="lg">
              Shop now <ArrowRight size={18} />
            </Button>
            <Button href={`${basePath}/about`} variant="outline" size="lg">
              Our story
            </Button>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="w-full px-6 py-16">
        <SectionHeader
          eyebrow="Browse"
          title="Shop by category"
          subtitle="Find exactly what you're looking for across our curated collections."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              href={`${basePath}/${cat.slug}`}
              count={getProductsByCategory(brand, cat.slug).length}
            />
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="bg-white border-y border-[var(--color-ink)]/8">
        <div className="w-full px-6 py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <SectionHeader eyebrow="Handpicked" title="Featured this season" />
            <Button href={`${basePath}/${categories[0].slug}`} variant="ghost" className="hidden sm:inline-flex shrink-0">
              View all <ArrowRight size={16} />
            </Button>
          </div>
          <ProductGrid products={featuredList} />
        </div>
      </section>

      {/* ── Values strip ── */}
      <section className="w-full px-6 py-16">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { t: "Free shipping", s: "On orders over $150", icon: "✦" },
            { t: "30-day returns", s: "Shop with confidence", icon: "◈" },
            { t: "Crafted with care", s: "Quality in every detail", icon: "◉" },
            { t: "Secure checkout", s: "Your data, protected", icon: "⬡" },
          ].map((v) => (
            <li
              key={v.t}
              className="flex flex-col gap-1 p-5 rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]"
            >
              <span className="text-2xl text-[var(--brand)]">{v.icon}</span>
              <span className="font-semibold text-[var(--color-ink)] mt-1">{v.t}</span>
              <span className="text-sm text-[var(--color-ink-muted)]">{v.s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[var(--brand)] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--brand-contrast)]/60">
              Stay in the loop
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-[var(--brand-contrast)] leading-[0.95] tracking-tight">
              New arrivals &amp;
              <br />
              <em className="not-italic">exclusive</em> offers
            </h2>
          </div>
          <p className="text-[var(--brand-contrast)]/70 leading-relaxed max-w-sm">
            Be the first to know about new drops, seasonal stories, and members-only deals.
          </p>
          <NewsletterForm id="brand-home-email" />
          <p className="text-[var(--brand-contrast)]/40 text-xs">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
