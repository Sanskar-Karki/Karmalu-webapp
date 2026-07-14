import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import type { Brand } from "@/types";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from "@/data/catalog";
import DecorShopCard from "@/components/DecorShopCard";
import { ArrowRight, Check } from "@/components/icons";
import NewsletterForm from "@/components/NewsletterForm";

interface HeroCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  highlights?: string[];
  overlayEyebrow?: string;
  overlayTitle?: string;
  overlayText?: string;
}

/**
 * Living & Decor home — mirrors the Karmalu-web-main reference design
 * language: split serif hero, image-card category grid, featured edit,
 * values strip and a warm newsletter band. Wired to the real decor catalog.
 */
export default function DecorHome({
  basePath,
  hero,
}: {
  brand?: Brand;
  basePath: string;
  hero: HeroCopy;
}) {
  const brand: Brand = "decor";
  const categories = getCategories(brand);
  const products = getProducts(brand);
  const featured = products.filter((p) => p.badge);
  const featuredList = (featured.length >= 3 ? featured : products).slice(0, 8);

  const highlights =
    hero.highlights ?? ["Natural materials", "Quiet luxury", "Made for daily living"];

  return (
    <div className="flex flex-col">
      {/* ── Split hero ── */}
      <section className="relative overflow-hidden bg-[var(--page-bg)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
          {/* Copy */}
          <div className="relative z-10 max-w-2xl">
            <p className="mb-6 inline-flex items-center rounded-full border border-[var(--decor-border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--decor-accent)] shadow-sm">
              {hero.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold leading-[1.03] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--color-ink-muted)]">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`${basePath}/shop`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-ink)] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--color-ink)]/10 transition-colors hover:bg-[var(--brand)]"
              >
                Shop collection
                <ArrowRight size={18} />
              </Link>
              <Link
                href={`${basePath}/about`}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--decor-border)] bg-white px-7 py-4 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--decor-accent)] hover:text-[var(--decor-accent)]"
              >
                Our story
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]"
                >
                  <Check size={18} className="text-[var(--decor-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image + overlay card */}
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[var(--decor-border)] bg-[var(--decor-secondary)] shadow-2xl shadow-[var(--color-ink)]/10 lg:min-h-[620px]">
            <ProductImage
              preset="banner"
              src={hero.image}
              alt={hero.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/55 via-[var(--color-ink)]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="max-w-sm rounded-lg border border-white/25 bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--decor-accent)]">
                  {hero.overlayEyebrow ?? "This season"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--color-ink)] sm:text-3xl">
                  {hero.overlayTitle ?? "Layered neutrals, warm textures."}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-muted)]">
                  {hero.overlayText ??
                    "Explore a refined edit of lounge pieces, woven textures, and sculptural accents."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop by category ── */}
      <section className="mx-auto w-full max-w-8xl px-6 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--color-ink)] md:text-4xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-ink-muted)] md:text-lg">
            Explore focused edits for every room, from foundational pieces to the
            finishing details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = getProductsByCategory(brand, category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`${basePath}/${category.slug}`}
                className="group block overflow-hidden rounded-lg border border-[var(--decor-border)] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--decor-secondary)]">
                  <ProductImage
                    preset="card"
                    src={category.image}
                    alt={`${category.name} collection`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/65 via-[var(--color-ink)]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                        {count} piece{count !== 1 ? "s" : ""}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                        {category.name}
                      </h3>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[var(--color-ink)] transition-colors group-hover:bg-[var(--brand)] group-hover:text-white">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured edit ── */}
      <section className="border-y border-[var(--decor-border)] bg-[var(--decor-secondary)]/40">
        <div className="mx-auto w-full max-w-8xl px-6 py-20 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--decor-accent)]">
                Handpicked
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
                Featured this season
              </h2>
            </div>
            <Link
              href={`${basePath}/shop`}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--brand)]"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {featuredList.map((product) => (
              <DecorShopCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Values strip ── */}
      <section className="mx-auto w-full max-w-8xl px-6 py-20 md:py-24">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { t: "Free shipping", s: "On orders over $150" },
            { t: "30-day returns", s: "Shop with confidence" },
            { t: "Crafted with care", s: "Quality in every detail" },
            { t: "Secure checkout", s: "Your data, protected" },
          ].map((v) => (
            <li
              key={v.t}
              className="flex flex-col gap-2 rounded-lg border border-[var(--decor-border)] bg-white p-6 shadow-sm"
            >
              <Check size={20} className="text-[var(--decor-accent)]" />
              <span className="mt-1 font-semibold text-[var(--color-ink)]">
                {v.t}
              </span>
              <span className="text-sm text-[var(--color-ink-muted)]">{v.s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[var(--brand)] px-6 py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand-contrast)]/60">
              Stay in the loop
            </span>
            <h2 className="text-4xl font-semibold leading-tight text-[var(--brand-contrast)] sm:text-5xl">
              New arrivals &amp; seasonal stories
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-[var(--brand-contrast)]/75">
            Be the first to know about new drops, styling notes, and
            members-only offers.
          </p>
          <NewsletterForm id="decor-home-email" />
          <p className="text-xs text-[var(--brand-contrast)]/45">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
