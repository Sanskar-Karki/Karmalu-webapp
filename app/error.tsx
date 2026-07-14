"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error-tracking service (e.g. Sentry) here
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#080605] text-white">
      <header className="flex items-center justify-center h-14 border-b border-white/5">
        <Link
          href="/"
          className="text-base font-extrabold tracking-[0.22em] uppercase text-white hover:text-white/70 transition-colors"
        >
          KARMALU
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/20">
            Something went wrong
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            An unexpected error occurred.
          </h1>
          <p className="text-sm text-white/35 max-w-xs leading-relaxed mt-1">
            We&apos;re looking into it. Try refreshing the page, or head back home.
          </p>
          {error.digest && (
            <p className="text-[10px] text-white/15 font-mono mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={reset}
            className="px-7 py-3 rounded-full bg-white text-[#080605] text-sm font-bold uppercase tracking-widest hover:bg-white/85 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-7 py-3 rounded-full border border-white/15 text-white text-sm font-bold uppercase tracking-widest hover:border-white/40 transition-colors"
          >
            Go home
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
