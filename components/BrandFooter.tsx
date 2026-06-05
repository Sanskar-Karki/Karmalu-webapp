"use client";

import Link from "next/link";
import { useBrand } from "@/store/BrandProvider";
import { getCategories } from "@/data/catalog";

export default function BrandFooter() {
  const { brand, label, basePath } = useBrand();
  const categories = getCategories(brand);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-ink)]/8 bg-[var(--page-bg)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
          <span className="font-display text-lg font-bold tracking-[0.12em] uppercase text-[var(--color-ink)]">
            KARMALU
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--brand)]">
            {label}
          </span>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-xs mt-1">
            Crafted with intention. Made to last.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
            Shop
          </h3>
          <ul className="flex flex-col gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${basePath}/${c.slug}`}
                  className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
            Company
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href={`${basePath}/about`} className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/faq`} className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/contact`} className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors">
                All brands
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
            Stay in touch
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            New arrivals and stories, straight to your inbox.
          </p>
          <form className="flex gap-2 mt-1" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 min-w-0 px-3 py-2 rounded-full border border-[var(--color-ink)]/15 bg-white text-sm outline-none focus:ring-2 focus:ring-[var(--brand)] transition"
            />
            <button className="px-4 py-2 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-dark)] transition">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[var(--color-ink)]/8 px-6 py-4 max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-[var(--color-ink-muted)]">
          © {year} KARMALU {label}. All rights reserved.
        </p>
        <p className="text-xs text-[var(--color-ink-muted)]">Designed with intention.</p>
      </div>
    </footer>
  );
}
