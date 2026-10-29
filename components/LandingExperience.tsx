import Link from "next/link";
import ProductImage from "@/components/ProductImage";

const worlds = [
  {
    href: "/living-decor",
    num: "01",
    label: "Collection 01",
    title: "Living\n& Decor",
    sub: "Warm, organic pieces for the home — rugs, lamps, vases and more in a golden, timeless palette.",
    cta: "Explore",
    accent: "var(--color-world-decor)",
    accentMuted: "var(--color-world-decor-soft)",
    chip: "Home & Lifestyle",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80",
  },
  {
    href: "/originals",
    num: "02",
    label: "Collection 02",
    title: "Karmalu\nOriginals",
    sub: "Thoughtful clothing and everyday essentials for men and women, made for wherever the day takes you.",
    cta: "Explore",
    accent: "var(--color-world-originals)",
    accentMuted: "var(--color-world-originals-soft)",
    chip: "Everyday Clothing",
    image: "/Karmalu-images/main%20image.webp",
  },
];

export default function LandingExperience() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      {/* ── Header ── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 h-14 border-b border-black/[0.06]">
        <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-black/30">Karmalu Nepal</span>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span
            className="text-base font-extrabold tracking-[0.22em] uppercase text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KARMALU
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-world-originals animate-pulse-soft" />
        </div>
        <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-black/30 hidden sm:block">
          Two Collections
        </span>
      </header>

      {/* ── Choose prompt ── */}
      <div className="flex flex-col items-center gap-2 py-7 px-4">
        <p className="text-[9px] uppercase tracking-[0.45em] text-black/35 font-semibold">
          Choose a collection
        </p>
        <p className="text-center text-sm text-black/55">
          Two collections, one soul. Find your Karmalu.
        </p>
        <div className="flex items-center gap-3 text-black/15">
          <span className="h-px w-14 bg-current" />
          <span className="text-[10px] font-bold">✦</span>
          <span className="h-px w-14 bg-current" />
        </div>
      </div>

      {/* ── Two portals ── */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {worlds.map((w, i) => (
            <Link
              key={w.href}
              href={w.href}
              className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[3/4] flex flex-col justify-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5] shadow-[0_8px_32px_-8px_rgba(45,42,36,0.18)] hover:shadow-[0_16px_48px_-10px_rgba(45,42,36,0.28)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 active:scale-[0.97] active:duration-150"
              style={{
                "--accent": w.accent,
                "--tw-ring-color": w.accent,
              } as React.CSSProperties}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <ProductImage
                  preset="banner"
                  src={w.image}
                  alt={w.title.replace("\n", " ")}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  priority={i === 0}
                />
                {/* Overlay */}
                <div className="absolute inset-0 world-overlay transition-opacity duration-500" />
                {/* Accent glow at bottom on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: w.accent }}
                />
              </div>

              {/* Border ring on hover */}
              <div
                className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ borderColor: `color-mix(in srgb, ${w.accent} 55%, transparent)` }}
              />

              {/* Large ghost number — top right */}
              <div
                className="absolute top-4 right-5 text-[5.5rem] sm:text-[6.5rem] font-extrabold leading-none select-none pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                style={{ color: w.accent, opacity: 0.08 }}
              >
                {w.num}
              </div>

              {/* Chip — top left */}
              <div className="absolute top-5 left-5">
                <span
                  className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-sm"
                  style={{ color: w.accent, borderColor: `color-mix(in srgb, ${w.accent} 40%, transparent)`, background: w.accentMuted }}
                >
                  {w.chip}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-3">
                {/* Collection label */}
                <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: w.accent }}>
                  {w.label}
                </span>

                {/* Title */}
                <h2
                  className="text-4xl sm:text-5xl font-extrabold uppercase leading-[0.88] tracking-tight text-white whitespace-pre-line transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {w.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-white/55 leading-relaxed max-w-[260px]">
                  {w.sub}
                </p>

                {/* CTA */}
                <div className="mt-1">
                  <span
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/15 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-300"
                  >
                    {w.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-5 flex items-center justify-between border-t border-black/[0.06]">
        <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-black/25">
          © {new Date().getFullYear()} KARMALU
        </span>
        <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-black/25">
          Two collections, one soul
        </span>
      </footer>

    </div>
  );
}
