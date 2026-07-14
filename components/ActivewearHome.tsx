import Image from "next/image";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { getCategories, getProducts } from "@/data/catalog";
import ActivewearShopCard from "@/components/ActivewearShopCard";
import ActivewearHero from "@/components/ActivewearHero";
import NewsletterForm from "@/components/NewsletterForm";
import { ArrowRight, Star } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

const basePath = "/activewear";

/* ── Small section label/heading pair ── */
function SectionHead({
  kicker,
  title,
  align = "left",
}: {
  kicker?: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {kicker && (
        <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[var(--aw-ink-muted)]">
          {kicker}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.01em] text-[var(--aw-ink)] mt-3 leading-[1.02]">
        {title}
      </h2>
    </div>
  );
}

/* ── Quiet text link ── */
function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--aw-ink)] border-b border-[var(--aw-ink)]/30 pb-1 hover:border-[var(--aw-ink)] transition-colors"
    >
      {children}
      <ArrowRight
        size={13}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/* ── Testimonial card (marquee) ── */
interface Testimonial {
  name: string;
  date: string;
  avatar: string;
  text: string;
  rating: number;
}

function TestimonialCard({ name, date, avatar, text, rating }: Testimonial) {
  return (
    <div className="w-[300px] sm:w-[360px] shrink-0 bg-[var(--aw-bg)] p-7 flex flex-col gap-5 border border-[var(--aw-ink)]/10">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={13} className="text-[var(--aw-ink)]" />
        ))}
      </div>
      <p className="text-[var(--aw-ink)]/75 leading-relaxed text-[15px] font-display">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto pt-2">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-[var(--aw-ink)] text-sm truncate">{name}</p>
          <p className="text-[var(--aw-ink-muted)] text-xs">{date}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialRow({
  items,
  direction,
}: {
  items: Testimonial[];
  direction: "left" | "right";
}) {
  const track = direction === "left" ? "marquee-track-left" : "marquee-track-right";
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-5 ${track}`}>
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function ActivewearHome() {
  const categories = getCategories("activewear");
  const products = getProducts("activewear");

  const bestSellersSlice = products.filter((p) => p.badge === "Bestseller").slice(0, 4);
  const newArrivalsSlice = products.filter((p) => p.badge === "New").slice(0, 4);

  const communityPhotos = [
    {
      src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
      handle: "@karmalu_moves",
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
      handle: "@daily.reps",
    },
    {
      src: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80",
      handle: "@yoga.with.k",
    },
    {
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
      handle: "@street.fit",
    },
    {
      src: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&q=80",
      handle: "@run.her.way",
    },
  ];

  const whyKarmalu = [
    {
      title: "Performance first",
      body: "Engineered fabrics and construction that keep up with every session.",
    },
    {
      title: "Tested for real",
      body: "Proven in the gym, on the road and in the ring — not just on paper.",
    },
    {
      title: "Sharp by design",
      body: "Gear that looks as good off-duty as it performs on.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Priya Sharma",
      date: "23rd March",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      text: "The Zen Flow leggings are perfect. I've bought the same pair every six months for two years.",
      rating: 5,
    },
    {
      name: "Marcus Webb",
      date: "19th March",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      text: "Finally, joggers that look good and perform. Gym, then dinner. Zero complaints.",
      rating: 5,
    },
    {
      name: "Aisha Thomas",
      date: "15th March",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
      text: "The quality is unreal for the price. I'm completely converted.",
      rating: 5,
    },
    {
      name: "James Khan",
      date: "11th March",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      text: "Three training tees, still going strong after a year of daily use. The fit is just right.",
      rating: 5,
    },
    {
      name: "Sofia Reyes",
      date: "8th March",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      text: "Every piece feels premium. The sports bra especially — zero bounce, all-day comfort.",
      rating: 5,
    },
    {
      name: "Ben Lawson",
      date: "4th March",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      text: "The quarter-zip is my go-to for cold runs. Warm without overheating.",
      rating: 5,
    },
  ];
  const rowA = testimonials.slice(0, 3);
  const rowB = testimonials.slice(3);

  const spotlight = products.find((p) => p.badge === "Bestseller") ?? products[0];

  return (
    <div className="flex flex-col bg-[var(--aw-bg)]">
      {/* ── 1. HERO (full screen) ── */}
      <ActivewearHero />

      {/* ── 2. SHOP BY CATEGORY ── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="w-full">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <SectionHead kicker="Collections" title="Shop by Category" />
            <TextLink href={`${basePath}/shop`}>All products</TextLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`${basePath}/${cat.slug}`}
                className="group relative overflow-hidden aspect-[3/4] bg-[var(--aw-secondary)]"
              >
                <ProductImage
                  preset="card"
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-display text-white text-3xl sm:text-4xl leading-none mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-white/75 text-sm mb-4 max-w-xs">
                    {cat.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white text-[11px] font-medium uppercase tracking-[0.2em] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Explore <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BEST SELLERS ── */}
      <section className="py-20 lg:py-28 px-6 bg-[var(--aw-secondary)]">
        <div className="w-full">
          <div className="flex flex-col items-center text-center gap-5 mb-14">
            <SectionHead
              kicker="Hand-picked"
              title="Best Sellers"
              align="center"
            />
            <p className="max-w-md text-[var(--aw-ink-muted)] text-[15px] leading-relaxed">
              Our most-loved pieces — quietly considered, endlessly wearable.
            </p>
            <TextLink href={`${basePath}/shop`}>Shop the edit</TextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {bestSellersSlice.map((p) => (
              <ActivewearShopCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BRAND STORY ── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] order-1 md:order-1 overflow-hidden">
            <ProductImage
              preset="banner"
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1125&fit=crop&q=80"
              alt="Our story"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-2 flex flex-col gap-6">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[var(--aw-ink-muted)]">
              Our story
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.02] text-[var(--aw-ink)]">
              The best clothes
              <br />
              <span className="italic font-light">disappear</span> when
              <br />
              you wear them.
            </h2>
            <p className="text-[var(--aw-ink-muted)] leading-relaxed max-w-md">
              KARMALU Activewear began with a simple belief: you shouldn&apos;t
              be thinking about your leggings mid-run. We obsess over fabric,
              fit and finish so you can focus on moving — wherever life takes
              you.
            </p>
            <div className="flex items-center gap-10 pt-2">
              <div>
                <p className="font-display text-3xl text-[var(--aw-ink)]">10K+</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--aw-ink-muted)] mt-1">
                  Athletes
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-[var(--aw-ink)]">4.9</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--aw-ink-muted)] mt-1">
                  Avg. rating
                </p>
              </div>
            </div>
            <div className="pt-2">
              <TextLink href={`${basePath}/about`}>Read our story</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. NEW ARRIVALS ── */}
      <section className="py-20 lg:py-28 px-6 bg-[var(--aw-secondary)]">
        <div className="w-full">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <SectionHead kicker="Just dropped" title="New Arrivals" />
            <TextLink href={`${basePath}/shop`}>View all</TextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {newArrivalsSlice.map((p) => (
              <ActivewearShopCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED COLLECTION BANNER ── */}
      {spotlight && (
        <section className="py-20 lg:py-28 px-6">
          <div className="w-full grid md:grid-cols-2 overflow-hidden bg-[var(--aw-secondary)]">
            <div className="relative min-h-[380px] md:min-h-0 order-1">
              <ProductImage
                preset="banner"
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1100&q=85"
                alt="Exclusive collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-2 flex flex-col justify-center p-10 md:p-16">
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[var(--aw-ink-muted)]">
                Limited edition
              </span>
              <h3 className="font-display text-4xl sm:text-5xl leading-[1.02] text-[var(--aw-ink)] mt-4">
                The Exclusive
                <br />
                <span className="italic font-light">Collection</span>
              </h3>
              <p className="mt-5 max-w-sm text-[var(--aw-ink-muted)] leading-relaxed text-[15px]">
                A small-batch capsule in our signature warm neutrals. Crafted in
                limited quantities — once it&apos;s gone, it&apos;s gone.
              </p>
              <p className="mt-6 text-[var(--aw-ink)]">
                {spotlight.name} — <span>{formatNpr(spotlight.price)}</span>
              </p>
              <Link
                href={`${basePath}/product/${spotlight.slug}`}
                className="mt-8 inline-flex items-center gap-2 self-start px-8 py-4 rounded-full bg-[var(--aw-ink)] text-[var(--aw-bg)] text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[var(--aw-maroon)] transition-colors"
              >
                Shop the drop <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. WHY KARMALU ── */}
      <section className="py-20 lg:py-28 px-6 bg-[var(--aw-secondary)]">
        <div className="w-full">
          <div className="text-center mb-14">
            <SectionHead kicker="What sets us apart" title="Why Karmalu" align="center" />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {whyKarmalu.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-2 p-8 bg-[var(--aw-bg)] rounded-2xl"
              >
                <h3 className="font-display text-xl text-[var(--aw-ink)]">{v.title}</h3>
                <p className="text-sm text-[var(--aw-ink-muted)] leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. LIFESTYLE GALLERY ── */}
      <section className="py-20 lg:py-28">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <SectionHead kicker="Join the movement" title="#KARMALU" align="center" />
            <p className="text-[var(--aw-ink-muted)] mt-4 max-w-sm mx-auto text-[15px]">
              Tag us in your best moments — the finest get featured here.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {communityPhotos.map((p) => (
              <Link
                key={p.handle}
                href={`${basePath}/shop`}
                className="group relative aspect-square overflow-hidden bg-[var(--aw-secondary)]"
              >
                <ProductImage
                  preset="card"
                  src={p.src}
                  alt={p.handle}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-medium">{p.handle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CUSTOMER REVIEWS ── */}
      <section className="py-20 lg:py-28 overflow-hidden bg-[var(--aw-secondary)]">
        <div className="w-full px-6 text-center mb-14">
          <SectionHead
            kicker="Loved by 10,000+"
            title="Words from our community"
            align="center"
          />
        </div>
        <div
          className="marquee-pause flex flex-col gap-5"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <TestimonialRow items={rowA} direction="left" />
          <TestimonialRow items={rowB} direction="right" />
        </div>
      </section>

      {/* ── 10. NEWSLETTER ── */}
      <section className="py-24 lg:py-32 bg-[var(--aw-accent)]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/50">
            Stay in the loop
          </span>
          <h2 className="font-display text-white text-4xl sm:text-5xl leading-[1.02] mt-5">
            Drop alerts &amp;
            <br />
            <span className="italic font-light">exclusive offers</span>
          </h2>
          <p className="text-white/60 mt-5 leading-relaxed">
            Be first to know about new arrivals, community events and
            members-only releases.
          </p>
          <NewsletterForm
            id="activewear-home-email"
            variant="activewear"
            className="mt-8 mx-auto"
          />
          <p className="text-white/35 text-xs mt-5">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
