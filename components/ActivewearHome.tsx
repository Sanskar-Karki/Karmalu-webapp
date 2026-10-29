import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import ActivewearShopCard from "@/components/ActivewearShopCard";
import NewsletterForm from "@/components/NewsletterForm";
import OriginalsHero from "@/components/OriginalsHero";
import Reveal from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { getCatalog } from "@/lib/catalog-server";
import { formatNpr, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { homePicks } from "@/lib/home-picks";

const basePath = "/originals";
const instagramUrl = "https://www.instagram.com/karmalu_originals/";
// The top (pinned) posts of @karmalu_originals, in profile order.
// To change them, copy a post's link from Instagram and keep the /embed/ suffix.
const instagramPosts = [
  {
    url: "https://www.instagram.com/reel/Dci35WSpGnm/embed/",
    title: "Karmalu Originals featured Instagram reel 1",
  },
  {
    url: "https://www.instagram.com/reel/Dci0rvWpjQ_/embed/",
    title: "Karmalu Originals featured Instagram reel 2",
  },
  {
    url: "https://www.instagram.com/reel/Dd1QKgUJNU9/embed/",
    title: "Karmalu Originals featured Instagram reel 3",
  },
];

function SectionHeading({
  eyebrow,
  title,
  id,
  light = false,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  light?: boolean;
}) {
  return (
    <Reveal>
      <p
        className={`flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] ${
          light ? "text-white/60" : "text-[var(--aw-ink-muted)]"
        }`}
      >
        <span
          aria-hidden
          className={`reveal-line block h-px w-8 ${
            light ? "bg-white/60" : "bg-[var(--aw-highlight)]"
          }`}
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-4 font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl ${
          light ? "text-white" : "text-[var(--aw-ink)]"
        }`}
      >
        {title}
      </h2>
    </Reveal>
  );
}

function SweepLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--aw-ink)]";
  const inner = (
    <>
      <span className="link-sweep pb-1">{children}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--aw-ink)]/20 transition-all duration-300 group-hover:border-[var(--aw-ink)] group-hover:bg-[var(--aw-ink)] group-hover:text-white">
        <ArrowRight
          size={12}
          className="transition-transform duration-300 group-hover:-rotate-45"
        />
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export default async function ActivewearHome() {
  const { getCategories, getProducts } = await getCatalog();
  const categories = getCategories("originals");
  // Newest first, topped up with other pieces so the 2-col (mobile) and
  // 3-col (desktop) grids both fill complete rows; the 4th hides on desktop.
  const products = getProducts("originals");
  // Hand-picked order from the admin (Home page screen), else newest first.
  const { items: newArrivals, curated } = homePicks(products, () =>
    [...products.filter((p) => p.badge === "New"), ...products.filter((p) => p.badge !== "New")].slice(0, 4),
  );
  const featured = newArrivals[0];
  const marqueeText = `Free delivery on orders over ${formatNpr(FREE_SHIPPING_THRESHOLD)}`;

  return (
    <div className="flex flex-col bg-[var(--aw-bg)]">
      {/* Without JS the reveal observer never runs — keep content visible. */}
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important;clip-path:none!important}.reveal-line{transform:none!important}`}</style>
      </noscript>

      <OriginalsHero
        feature={
          featured && {
            name: featured.name,
            href: `${basePath}/product/${featured.slug}`,
            image: featured.image,
            price: formatNpr(featured.price),
          }
        }
      />

      {/* Free-delivery marquee */}
      <p className="sr-only">{marqueeText}</p>
      <div
        aria-hidden
        className="marquee-hover-pause overflow-hidden border-y border-white/10 bg-green-700 py-2 text-white"
      >
        <div className="animate-marquee flex w-max ">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center gap-6 pr-6 text-[12px] font-bold uppercase tracking-[0.25em] sm:text-[14px]"
                >
                  {marqueeText}
                  <span className="text-white">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* New arrivals */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div>
            <SectionHeading eyebrow="Just dropped" title="New Arrivals" />
            <Reveal delay={120}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--aw-ink-muted)]">
                Meet the newest pieces in the Karmalu Originals collection.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <SweepLink href={`${basePath}/shop`}>Shop all</SweepLink>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-7">
          {newArrivals.map((product, i) => (
            <Reveal
              key={product.id}
              delay={i * 120}
              // Automatic mode shows 4 so 2-col rows fill; the 4th hides on the 3-col desktop grid.
              className={!curated && i === 3 ? "lg:hidden" : undefined}
            >
              <ActivewearShopCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="scroll-mt-16 bg-[var(--aw-secondary)] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-32"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div>
            <SectionHeading eyebrow="Find your fit" title="Shop by Category" />
            <Reveal delay={120}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--aw-ink-muted)]">
                Explore everyday pieces for every wardrobe and occasion.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <SweepLink href={`${basePath}/shop`}>View all</SweepLink>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.slug} variant="scale" delay={(i % 3) * 110}>
              <Link
                href={`${basePath}/${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--aw-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aw-highlight)] focus-visible:ring-offset-2 sm:aspect-[5/4]"
              >
                <ProductImage
                  preset="card"
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
                <span
                  aria-hidden
                  className="absolute left-4 top-4 font-display text-xs font-medium tracking-[0.2em] text-white/80 sm:left-6 sm:top-5">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-white/60">
                    {" "}
                    / {String(categories.length).padStart(2, "0")}
                  </span>
                </span>
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-white group-hover:text-[var(--aw-ink)] sm:right-5 sm:top-5 sm:h-10 sm:w-10">
                  <ArrowRight size={15} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <h3 className="font-display text-2xl font-medium tracking-[-0.02em] transition-transform duration-500 group-hover:-translate-y-1 sm:text-3xl">
                    {category.name}
                  </h3>
                  <p className="mt-1 hidden max-w-xs text-xs leading-relaxed text-white/80 transition-all duration-500 sm:block sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    {category.tagline}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-32">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
          <Reveal variant="clip" className="overflow-hidden rounded-2xl">
            <div className="group relative min-h-[340px] overflow-hidden sm:min-h-[460px] lg:min-h-[560px]">
              <ProductImage
                preset="banner"
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1100&h=900&fit=crop&q=85"
                alt="Everyday style from the Karmalu Originals community"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </div>
          </Reveal>
          <div className="flex flex-col items-start">
            <SectionHeading eyebrow="The Karmalu community" title="Your style. Your everyday." />
            <Reveal delay={150}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--aw-ink-muted)]">
                Karmalu Originals is made to be part of your life. Wear it your
                way, share your look, and find inspiration from the community.
              </p>
            </Reveal>
            <Reveal delay={250} className="mt-8">
              <SweepLink href={instagramUrl} external>
                Join us on Instagram
              </SweepLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section
        aria-labelledby="instagram-heading"
        className="bg-[var(--aw-secondary)] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <SectionHeading
                id="instagram-heading"
                eyebrow="From our Instagram"
                title="A little more Karmalu."
              />
              <Reveal delay={120}>
                <p className="mt-4 max-w-md text-sm text-[var(--aw-ink-muted)]">
                  A few recent posts from our Instagram. Follow along for new
                  looks, drops and everyday moments.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <SweepLink href={instagramUrl} external>
                @karmalu_originals
              </SweepLink>
            </Reveal>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto overflow-y-hidden pb-3 md:grid md:grid-cols-3 md:overflow-visible">
            {instagramPosts.map((post, i) => (
              <Reveal
                key={post.url}
                variant="fade"
                delay={i * 120}
                className="w-[min(86vw,360px)] shrink-0 snap-center md:w-full"
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--aw-ink)]/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(20,16,15,0.35)]">
                  <iframe
                    title={post.title}
                    src={post.url}
                    className="h-[670px] w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150} className="mt-8">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[var(--aw-ink)] px-8 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[var(--aw-maroon)] active:scale-[0.97]"
            >
              Follow Karmalu Originals
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative isolate overflow-hidden bg-[var(--aw-accent)] px-5 py-24 sm:py-32">
        <div
          aria-hidden
          className="animate-blob absolute -left-24 top-1/4 -z-10 h-80 w-80 rounded-full bg-[var(--aw-highlight)]/50 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden
          className="animate-blob-slow absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-[var(--aw-highlight)]/30 blur-3xl sm:h-96 sm:w-96"
        />
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/60">
              Stay in the loop
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl">
              Notes from{" "}
              <em className="font-serif font-normal italic">Karmalu.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/75">
              Hear about new arrivals, collection updates and more.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <NewsletterForm
              id="originals-home-email"
              variant="originals"
              className="mx-auto mt-8"
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
