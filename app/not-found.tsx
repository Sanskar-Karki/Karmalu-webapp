import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080605] text-white">
      {/* Header */}
      <header className="flex items-center justify-center h-14 border-b border-white/5">
        <Link
          href="/"
          className="text-base font-extrabold tracking-[0.22em] uppercase text-white hover:text-white/70 transition-colors"
        >
          KARMALU
        </Link>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/20">
            Error 404
          </p>
          <h1
            className="text-[7rem] sm:text-[10rem] font-extrabold leading-none tracking-tight"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            404
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-white -mt-6">
            This page doesn&apos;t exist.
          </p>
          <p className="text-sm text-white/35 max-w-xs leading-relaxed mt-1">
            The page you&apos;re looking for may have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="px-7 py-3 rounded-full bg-white text-[#080605] text-sm font-bold uppercase tracking-widest hover:bg-white/85 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/living-decor"
            className="px-7 py-3 rounded-full border border-white/15 text-white text-sm font-bold uppercase tracking-widest hover:border-white/40 transition-colors"
          >
            Living &amp; Decor
          </Link>
          <Link
            href="/activewear"
            className="px-7 py-3 rounded-full border border-white/15 text-white text-sm font-bold uppercase tracking-widest hover:border-white/40 transition-colors"
          >
            Activewear
          </Link>
        </div>
      </main>

      <footer className="px-6 py-5 flex items-center justify-center border-t border-white/5">
        <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/15">
          © {new Date().getFullYear()} KARMALU · Two worlds, one soul
        </p>
      </footer>
    </div>
  );
}
