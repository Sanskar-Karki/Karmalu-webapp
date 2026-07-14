"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";

const worlds = [
  {
    href: "/living-decor",
    num: "01",
    label: "Collection 01",
    title: "Living\n& Decor",
    sub: "Warm, organic pieces for the home — rugs, lamps, vases and more in a golden, timeless palette.",
    cta: "Enter World",
    accent: "var(--color-world-decor)",
    accentMuted: "var(--color-world-decor-soft)",
    chip: "Premium Homewear",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80",
  },
  {
    href: "/activewear",
    num: "02",
    label: "Collection 02",
    title: "Active\nwear",
    sub: "Performance-ready gear for gym, running, boxing, yoga and everyday. Built to move. Designed to last.",
    cta: "Enter World",
    accent: "var(--color-world-activewear)",
    accentMuted: "var(--color-world-activewear-soft)",
    chip: "Performance Active",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80",
  },
];

export default function LandingExperience() {
  const router = useRouter();
  const [transition, setTransition] = useState<{ x: number; y: number; accent: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const enterWorld = (e: React.MouseEvent<HTMLAnchorElement>, href: string, accent: string) => {
    e.preventDefault();
    if (transition) return;
    setTransition({ x: e.clientX, y: e.clientY, accent });
    requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
    setTimeout(() => router.push(href), 620);
  };

  return (
    <div className="flex flex-col min-h-screen bg-noir">

      {/* ── Transition overlay ── */}
      {transition && (
        <div
          aria-hidden
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: transition.accent,
            clipPath: `circle(${expanded ? 150 : 0}% at ${transition.x}px ${transition.y}px)`,
            transition: "clip-path 0.65s cubic-bezier(.65,0,.35,1)",
          }}
        />
      )}

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 h-14 border-b border-white/5 rise-in">
        <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/20">SS 2025</span>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span
            className="text-base font-extrabold tracking-[0.22em] uppercase text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KARMALU
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-world-activewear animate-pulse-soft" />
        </div>
        <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/20 hidden sm:block">
          Two Worlds
        </span>
      </header>

      {/* ── Choose prompt ── */}
      <div className="flex flex-col items-center gap-2 py-7 px-4 rise-in rise-in-1">
        <p className="text-[9px] uppercase tracking-[0.45em] text-white/20 font-semibold">
          Choose your world
        </p>
        <div className="flex items-center gap-3 text-white/10">
          <span className="h-px w-14 bg-current" />
          <span className="text-[10px] font-bold">✦</span>
          <span className="h-px w-14 bg-current" />
        </div>
      </div>

      {/* ── Two portals ── */}
      <section className="flex-1 px-4 sm:px-6 pb-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {worlds.map((w, i) => (
          <a
            key={w.href}
            href={w.href}
            onClick={(e) => enterWorld(e, w.href, w.accent)}
            className={`group relative overflow-hidden rounded-2xl min-h-[520px] md:min-h-0 flex flex-col justify-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-noir rise-in ${
              i === 0 ? "rise-in-2" : "rise-in-3"
            }`}
            style={{ "--accent": w.accent, "--tw-ring-color": w.accent } as React.CSSProperties}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <ProductImage
                preset="banner"
                src={w.image}
                alt={w.title.replace("\n", " ")}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 world-overlay transition-opacity duration-500" />
              {/* Accent glow at bottom on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: w.accent }}
              />
            </div>

            {/* Large ghost number — top right */}
            <div
              className="absolute top-4 right-5 text-[7rem] sm:text-[9rem] font-extrabold leading-none select-none pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              style={{ color: w.accent, opacity: 0.07 }}
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
            <div className="relative z-10 p-7 sm:p-9 flex flex-col gap-4">
              {/* Collection label */}
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: w.accent }}>
                {w.label}
              </span>

              {/* Title */}
              <h2
                className="text-5xl sm:text-6xl font-extrabold uppercase leading-[0.88] tracking-tight text-white whitespace-pre-line transition-transform duration-500 group-hover:-translate-y-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {w.title}
              </h2>

              {/* Description */}
              <p className="text-xs text-white/55 leading-relaxed max-w-[280px]">
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
          </a>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-5 flex items-center justify-between border-t border-white/5 rise-in rise-in-4">
        <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/15">
          © {new Date().getFullYear()} KARMALU
        </span>
        <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/15">
          Two worlds, one soul
        </span>
      </footer>

    </div>
  );
}
