"use client";

import Link from "next/link";
import { useBrand } from "@/store/BrandProvider";
import { getCategories } from "@/data/catalog";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.96a8.27 8.27 0 0 0 4.84 1.55V7.06a4.85 4.85 0 0 1-1.07-.37z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

export default function BrandFooter() {
  const { brand, label, basePath } = useBrand();
  const categories = getCategories(brand);
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: "https://instagram.com/karmalu", label: "Follow KARMALU on Instagram", icon: <InstagramIcon /> },
    { href: "https://tiktok.com/@karmalu", label: "Follow KARMALU on TikTok", icon: <TikTokIcon /> },
    { href: "https://pinterest.com/karmalu", label: "Follow KARMALU on Pinterest", icon: <PinterestIcon /> },
  ];

  return (
    <footer className="border-t border-[var(--color-ink)]/8 bg-[var(--page-bg)] mt-auto">
      <div className="w-full px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-lg font-bold tracking-[0.12em] uppercase text-[var(--color-ink)]">
              KARMALU
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--brand)]">
              {label}
            </span>
          </div>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-xs">
            Crafted with intention. Made to last.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-3 mt-1">
            {socialLinks.map(({ href, label: ariaLabel, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                className="w-9 h-9 rounded-full border border-[var(--color-ink)]/12 flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop column */}
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

        {/* Company column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
            Company
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              { href: `${basePath}/about`, label: "About" },
              { href: `${basePath}/faq`, label: "FAQ" },
              { href: `${basePath}/contact`, label: "Contact" },
              { href: "/", label: "All brands" },
            ].map(({ href, label: linkLabel }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--color-ink)] hover:text-[var(--brand)] transition-colors"
                >
                  {linkLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
            Stay in touch
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            New arrivals and stories, straight to your inbox.
          </p>
          <form
            className="flex flex-col gap-2 mt-1"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <div className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="flex-1 min-w-0 px-3 py-2 rounded-full border border-[var(--color-ink)]/15 bg-white text-sm outline-none focus:ring-2 focus:ring-[var(--brand)] transition placeholder:text-[var(--color-ink-muted)]/60"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors"
              >
                Join
              </button>
            </div>
            <p className="text-[11px] text-[var(--color-ink-muted)]/60">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-ink)]/8 px-6 py-4 w-full flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-[var(--color-ink-muted)]">
          © {year} KARMALU {label}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href={`${basePath}/faq`} className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
            Privacy
          </Link>
          <Link href={`${basePath}/faq`} className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
            Terms
          </Link>
          <span className="text-xs text-[var(--color-ink-muted)]">Designed with intention.</span>
        </div>
      </div>
    </footer>
  );
}
