import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/data/catalog";
import ActivewearGrid from "@/components/ActivewearGrid";
import ActivewearNewsletterForm from "@/components/ActivewearNewsletterForm";
import Button from "@/components/Button";
import { ArrowRight, Star } from "@/components/icons";

const basePath = "/activewear";

/* ── Marquee strip ── */
function LifestyleMarquee() {
  const words = ["MOVE WITH PURPOSE", "WEAR EVERYWHERE", "STUDIO TO STREET", "DESIGNED FOR LIFE", "KARMALU ACTIVEWEAR"];
  const strip = [...words, ...words];
  return (
    <div className="relative overflow-hidden bg-[var(--aw-ink)] py-3.5 select-none">
      <div className="flex w-max animate-marquee gap-10">
        {strip.map((w, i) => (
          <span
            key={i}
            className="text-[var(--aw-secondary)] font-extrabold uppercase tracking-[0.25em] text-xs flex items-center gap-10"
          >
            {w}
            <span className="text-[var(--aw-highlight)] opacity-60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Why Choose Us card ── */
function WhyCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--aw-secondary)]">
      <span className="text-3xl">{icon}</span>
      <h4 className="font-bold text-lg text-[var(--aw-ink)]">{title}</h4>
      <p className="text-sm text-[var(--aw-ink)]/70 leading-relaxed">{body}</p>
    </div>
  );
}

/* ── Community gallery photo ── */
function CommunityPhoto({ src, handle }: { src: string; handle: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={handle}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
        <span className="text-white text-xs font-bold">{handle}</span>
      </div>
    </div>
  );
}

export default function ActivewearHome() {
  const categories = getCategories("activewear");
  const products = getProducts("activewear");
  const bestSellers = products.filter((p) => p.badge === "Bestseller" || p.reviews > 150);
  const featuredSlice = (bestSellers.length >= 4 ? bestSellers : products).slice(0, 4);
  const gridProducts = products.filter((p) => p.badge).slice(0, 7);

  const communityPhotos = [
    { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", handle: "@karmalu_moves" },
    { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", handle: "@daily.reps" },
    { src: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80", handle: "@yoga.with.k" },
    { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80", handle: "@street.fit" },
    { src: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&q=80", handle: "@run.her.way" },
    { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", handle: "@karmalu.life" },
    { src: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", handle: "@pace.setter" },
    { src: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80", handle: "@studio.flows" },
  ];

  return (
    <div className="flex flex-col bg-[var(--aw-bg)]">

      {/* ────────────────────────────────
          1. HERO — fullscreen lifestyle
      ──────────────────────────────── */}
      <section className="relative h-[95vh] min-h-[600px] w-full overflow-hidden bg-[var(--aw-ink)]">
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1900&q=85"
          alt="KARMALU Activewear"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--aw-ink)]/80 via-[var(--aw-ink)]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--aw-ink)]/60 via-transparent to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <span className="rise-in rise-in-1 text-xs font-bold tracking-[0.4em] uppercase text-[var(--aw-highlight)] mb-5">
            KARMALU · Activewear
          </span>
          <h1 className="rise-in rise-in-2 text-6xl sm:text-8xl md:text-9xl font-extrabold uppercase leading-[0.88] tracking-tight text-white max-w-3xl">
            Move
            <br />
            <span className="italic font-light text-[var(--aw-highlight)]">with</span>
            <br />
            Purpose.
          </h1>
          <p className="rise-in rise-in-3 mt-6 text-lg text-white/75 max-w-sm leading-relaxed">
            Premium activewear designed for everyday performance — from the studio to the street.
          </p>
          <div className="rise-in rise-in-4 mt-8 flex flex-wrap gap-3">
            <Button href={`${basePath}/women`} size="lg">
              Shop Women <ArrowRight size={18} />
            </Button>
            <Button
              href={`${basePath}/men`}
              size="lg"
              variant="outline"
              className="!border-white/60 !text-white hover:!bg-white hover:!text-[var(--aw-ink)]"
            >
              Shop Men
            </Button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="w-px h-10 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ── Marquee ── */}
      <LifestyleMarquee />

      {/* ────────────────────────────────
          2. SHOP MEN / WOMEN — editorial cards
      ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            Shop the Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--aw-ink)] mt-2">
            Designed for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`${basePath}/${cat.slug}`}
              className={`group relative overflow-hidden rounded-3xl bg-[var(--aw-secondary)] ${
                i === 0 ? "md:row-span-2 aspect-[4/5] md:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)] mb-1">
                  Explore
                </span>
                <h3 className={`text-white font-extrabold uppercase leading-none mb-3 ${i === 0 ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"}`}>
                  {cat.name}
                </h3>
                <p className="text-white/70 text-sm mb-4 max-w-xs">{cat.tagline}</p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-bold translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Shop {cat.name} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────
          3. FEATURED COLLECTION — horizontal
      ──────────────────────────────── */}
      <section className="bg-[var(--aw-secondary)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
                Just Dropped
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--aw-ink)] mt-1">
                New Arrivals
              </h2>
            </div>
            <Button href={`${basePath}/women`} variant="outline" className="hidden sm:inline-flex shrink-0 !border-[var(--aw-ink)]/30 !text-[var(--aw-ink)] hover:!bg-[var(--aw-ink)] hover:!text-white">
              View all <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSlice.map((p) => (
              <Link
                key={p.id}
                href={`${basePath}/product/${p.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--aw-accent)]">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--aw-highlight)] text-[var(--aw-ink)] text-[10px] font-bold uppercase tracking-widest">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[var(--aw-ink)]/50 uppercase tracking-widest font-semibold">{p.category}</p>
                  <h4 className="font-bold text-[var(--aw-ink)] mt-0.5">{p.name}</h4>
                  <p className="font-extrabold text-[var(--aw-ink)] mt-1">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────
          4. BRAND STORY — editorial
      ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--aw-accent)]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80"
            alt="Our story"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            Our Story
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--aw-ink)] leading-none">
            Built for
            <br />
            <span className="italic font-light">every</span> moment.
          </h2>
          <p className="text-[var(--aw-ink)]/70 leading-relaxed">
            KARMALU Activewear was born from a simple belief: that the best clothes disappear when you wear them. You shouldn&apos;t be thinking about your leggings mid-run, or your hoodie at a coffee shop. You should just feel free.
          </p>
          <p className="text-[var(--aw-ink)]/70 leading-relaxed">
            We obsess over fabric, fit, and finish so you can focus on moving — wherever life takes you.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { n: "10K+", l: "Community" },
              { n: "4.9★", l: "Avg Rating" },
              { n: "30d", l: "Returns" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col">
                <span className="text-3xl font-extrabold text-[var(--aw-ink)]">{s.n}</span>
                <span className="text-xs uppercase tracking-widest text-[var(--aw-ink)]/50 font-semibold mt-0.5">{s.l}</span>
              </div>
            ))}
          </div>
          <Button href={`${basePath}/about`} variant="outline" className="self-start !border-[var(--aw-ink)]/30 !text-[var(--aw-ink)] hover:!bg-[var(--aw-ink)] hover:!text-white">
            Read our story <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* ────────────────────────────────
          5. CAMPAIGN — full-width emotional
      ──────────────────────────────── */}
      <section className="relative overflow-hidden h-[70vh] min-h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=1900&q=85"
          alt="Built for every rep"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--aw-ink)]/85 to-[var(--aw-ink)]/30" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase leading-[0.9] tracking-tight text-white max-w-2xl">
            Built for<br />
            <span className="text-[var(--aw-highlight)]">every</span> rep.<br />
            Every run.<br />
            Every day.
          </h2>
          <p className="mt-6 text-white/70 max-w-sm leading-relaxed">
            Versatile activewear that moves from your morning workout to your afternoon errands without missing a beat.
          </p>
          <Button href={`${basePath}/women`} size="lg" className="mt-8 self-start !bg-[var(--aw-highlight)] !text-[var(--aw-ink)] hover:!bg-white">
            Explore Collection <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* ────────────────────────────────
          6. BEST SELLERS — lookbook grid
      ──────────────────────────────── */}
      <section className="bg-[var(--aw-ink)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
                Community Favourites
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-1">
                Best Sellers
              </h2>
            </div>
            <Button
              href={`${basePath}/women`}
              variant="outline"
              className="hidden sm:inline-flex shrink-0 !border-white/30 !text-white hover:!bg-white hover:!text-[var(--aw-ink)]"
            >
              Shop all <ArrowRight size={16} />
            </Button>
          </div>

          <ActivewearGrid products={gridProducts.length > 0 ? gridProducts : products.slice(0, 7)} />
        </div>
      </section>

      {/* ────────────────────────────────
          7. WHY CHOOSE US
      ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            The KARMALU Difference
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--aw-ink)] mt-2">
            Why Choose Us
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <WhyCard
            icon="🧵"
            title="Premium Fabrics"
            body="Every piece is crafted from performance-grade materials that move with you and hold their shape, wash after wash."
          />
          <WhyCard
            icon="✦"
            title="Designed to Last"
            body="We don't chase trends. We design timeless pieces with construction that outlasts the seasons."
          />
          <WhyCard
            icon="🌿"
            title="Thoughtfully Made"
            body="Produced in ethical facilities with environmentally conscious materials and processes we're proud to stand behind."
          />
          <WhyCard
            icon="↩"
            title="Easy Returns"
            body="Love it or return it — no questions asked within 30 days. We stand behind every piece we make."
          />
        </div>
      </section>

      {/* ────────────────────────────────
          8. SOCIAL PROOF
      ──────────────────────────────── */}
      <section className="bg-[var(--aw-secondary)] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)] mb-4">
            Trusted by thousands
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-[var(--aw-ink)]">
            10,000+ Happy Athletes
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4 mb-10">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={22} className="text-[var(--aw-highlight)]" />
            ))}
            <span className="ml-2 text-lg font-bold text-[var(--aw-ink)]">4.9</span>
            <span className="text-[var(--aw-ink)]/50 text-sm ml-1">/ 5 from 2,400+ reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {[
              {
                name: "Priya S.",
                handle: "@priya.moves",
                text: "The Zen Flow leggings are literally perfect. I've been buying the same pair every 6 months for 2 years now.",
                rating: 5,
              },
              {
                name: "Marcus W.",
                handle: "@mw.fitness",
                text: "Finally found joggers that look good AND perform. Wore them to the gym, then dinner. Zero complaints.",
                rating: 5,
              },
              {
                name: "Aisha T.",
                handle: "@aisha.runs",
                text: "The quality is unreal for the price. Gymshark quality without the Gymshark price tag. I'm converted.",
                rating: 5,
              },
            ].map((r) => (
              <div key={r.name} className="bg-[var(--aw-bg)] rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[var(--aw-highlight)]" />
                  ))}
                </div>
                <p className="text-[var(--aw-ink)]/80 leading-relaxed text-sm">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-[var(--aw-ink)] text-sm">{r.name}</p>
                  <p className="text-[var(--aw-ink)]/40 text-xs">{r.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────
          9. COMMUNITY GALLERY
      ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            Join the movement
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--aw-ink)] mt-2">
            #KARMALU
          </h2>
          <p className="text-[var(--aw-ink)]/60 mt-3 max-w-md mx-auto">
            Tag us in your best moments — the best photos get featured right here.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {communityPhotos.map((p) => (
            <CommunityPhoto key={p.handle} src={p.src} handle={p.handle} />
          ))}
        </div>
      </section>

      {/* ────────────────────────────────
          10. NEWSLETTER
      ──────────────────────────────── */}
      <section className="bg-[var(--aw-ink)] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--aw-highlight)]">
            Stay in the loop
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-white mt-3">
            Drop Alerts &
            <br />
            <span className="italic font-light text-[var(--aw-highlight)]">Exclusive</span> Offers
          </h2>
          <p className="text-white/60 mt-4 leading-relaxed">
            Be the first to know about new arrivals, community events, and members-only deals.
          </p>
          <ActivewearNewsletterForm />
          <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
