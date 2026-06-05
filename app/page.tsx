import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "KARMALU — Two Worlds, One Soul",
};

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-cream)" }}>
      {/* Minimal top bar */}
      <header className="px-6 h-16 flex items-center justify-center">
        <span className="font-display text-xl font-bold tracking-[0.18em] uppercase text-[var(--color-ink)]" style={{ background: "radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)" }}>
          KARMALU
        </span>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-12 pb-12 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40"
         
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 w-[450px] h-[450px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--color-cherry-light) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-ink-muted)]">
            Est. 2024
          </span>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-[-0.03em] leading-none text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Two worlds,
            <br />
            <span className="text-[var(--color-cherry)]">one</span> soul.
          </h1>
          
        </div>
      </section>

      {/* Two brand portals */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Living & Decor */}
        <Link
          href="/living-decor"
          className="group relative overflow-hidden rounded-[1.5rem] min-h-[520px] flex flex-col justify-end p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80"
              alt="Living & Decor"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A24]/90 via-[#2D2A24]/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 text-white">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-gold-light)]">
              Collection 01
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Living &amp; Decor
            </h2>
            <p className="text-sm text-white/80 max-w-xs leading-relaxed">
              Warm, organic pieces for the home — rugs, lamps, vases and more in a
              golden, timeless palette.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold mt-2 group-hover:gap-3 transition-all">
              Enter <ArrowRight />
            </span>
          </div>
        </Link>

        {/* Activewear */}
        <Link
          href="/activewear"
          className="group relative overflow-hidden rounded-[1.5rem] min-h-[520px] flex flex-col justify-end p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cherry-light)]"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80"
              alt="Activewear"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(122,31,32,0.92) 0%, rgba(158,42,43,0.35) 45%, transparent 100%)" }}
            />
          </div>

          <div className="relative z-10 flex flex-col gap-4 text-white">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/70">
              Collection 02
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Activewear
            </h2>
            <p className="text-sm text-white/85 max-w-xs leading-relaxed">
              Performance-ready gear for gym, running, boxing, yoga and everyday.
              Built to move. Designed to last.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold mt-2 group-hover:gap-3 transition-all">
              Enter <ArrowRight />
            </span>
          </div>
        </Link>
      </section>

      <footer className="px-6 py-6 text-center border-t border-[var(--color-ink)]/8">
        <p className="text-xs text-[var(--color-ink-muted)]">
          © {new Date().getFullYear()} KARMALU. Two worlds, one soul.
        </p>
      </footer>
    </div>
  );
}
