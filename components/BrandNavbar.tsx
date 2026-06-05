"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBrand } from "@/store/BrandProvider";
import { getCategories } from "@/data/catalog";
import CartIcon from "@/components/CartIcon";
import { Menu, Close, ArrowRight } from "@/components/icons";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function BrandNavbar() {
  const { brand, label, basePath } = useBrand();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef<HTMLLIElement>(null);
  const categories = getCategories(brand);

  const links = [
    { href: `${basePath}/about`, label: "About" },
    { href: `${basePath}/faq`, label: "FAQ" },
    { href: `${basePath}/contact`, label: "Contact" },
  ];

  const isActive = (href: string) =>
    href === basePath ? pathname === basePath : pathname.startsWith(href);

  const shopActive = categories.some((c) =>
    pathname.startsWith(`${basePath}/${c.slug}`)
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!shopOpen) return;
    const onClick = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [shopOpen]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--page-bg)]/90 border-b border-[var(--color-ink)]/8">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={basePath} className="flex items-center gap-2 shrink-0">
          <span className="font-display text-lg font-bold tracking-[0.12em] uppercase text-[var(--color-ink)]">
            KARMALU
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold tracking-widest uppercase text-[var(--brand)] border-l border-[var(--color-ink)]/15 pl-2">
            {label}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {/* Shop dropdown */}
          <li className="relative" ref={shopRef}>
            <button
              onClick={() => setShopOpen((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                shopActive || shopOpen
                  ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
              aria-expanded={shopOpen}
            >
              Shop <Chevron open={shopOpen} />
            </button>

            {/* Mega-menu */}
            <div
              className={`absolute left-0 top-full mt-2 w-[360px] rounded-2xl bg-white shadow-[var(--shadow-card-hover)] border border-[var(--color-ink)]/8 p-2 transition-all duration-200 origin-top ${
                shopOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`${basePath}/${c.slug}`}
                    onClick={() => setShopOpen(false)}
                    className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 hover:bg-[var(--brand-soft)] transition group"
                  >
                    <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--brand)]">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] line-clamp-1">
                      {c.tagline}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={`${basePath}/${categories[0].slug}`}
                onClick={() => setShopOpen(false)}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--brand)] bg-[var(--brand-soft)] hover:brightness-95 transition"
              >
                Shop all {label} <ArrowRight size={15} />
              </Link>
            </div>
          </li>

          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(href)
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/"
            className="hidden md:inline-flex text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--brand)] px-3 py-2 transition-colors"
          >
            ← All brands
          </Link>
          <CartIcon />
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--brand-soft)] transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <Close size={20} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[560px] pb-4 border-t border-[var(--color-ink)]/8" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-3 flex flex-col gap-3">
          {/* Shop section */}
          <div>
            <p className="px-4 text-[11px] font-semibold tracking-widest uppercase text-[var(--color-ink-muted)] mb-1">
              Shop
            </p>
            <ul className="grid grid-cols-2 gap-0.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`${basePath}/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      pathname.startsWith(`${basePath}/${c.slug}`)
                        ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                        : "text-[var(--color-ink-muted)] hover:bg-[var(--brand-soft)]"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <ul className="flex flex-col gap-0.5 border-t border-[var(--color-ink)]/8 pt-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive(href)
                      ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--brand-soft)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--brand-soft)]"
              >
                ← All brands
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
