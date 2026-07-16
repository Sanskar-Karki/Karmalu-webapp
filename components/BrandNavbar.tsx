"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBrand } from "@/store/BrandProvider";
import { getCategories } from "@/data/catalog";
import CartIcon from "@/components/CartIcon";
import { Menu, Close, ArrowRight, Search } from "@/components/icons";


export default function BrandNavbar() {
  const { brand, label, basePath } = useBrand();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categories = getCategories(brand);

  const links = [
    { href: `${basePath}/about`, label: "About" },
    { href: `${basePath}/faq`, label: "FAQ" },
    { href: `${basePath}/contact`, label: "Contact" },
  ];

  const isActive = (href: string) =>
    href === basePath ? pathname === basePath : pathname.startsWith(href);

  const shopActive =
    pathname.startsWith(`${basePath}/shop`) ||
    categories.some((c) => pathname.startsWith(`${basePath}/${c.slug}`));

  // Shrink + solidify on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xs bg-[var(--page-bg)]/85 border-b border-[var(--color-ink)]/10 shadow-[0_4px_24px_-12px_rgba(45,42,36,0.25)]"
          : "backdrop-blur-xs bg-[var(--page-bg)]/60 border-b border-transparent"
      }`}
    >
      <nav
        className={`relative w-full px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? "h-14" : "h-16 sm:h-20"
        }`}
      >
        {/* Logo */}
        <Link href={basePath} className="group flex items-center gap-2.5 shrink-0">
          <span className="relative inline-flex items-center">
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-[0.14em] uppercase text-[var(--color-ink)]">
              KARMALU
            </span>
            <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)] translate-y-1.5 transition-transform duration-300 group-hover:scale-150" />
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--brand)] border-l border-[var(--color-ink)]/15 pl-2.5">
            {label}
          </span>
        </Link>

        {/* Desktop links — centered */}
        <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {/* Shop link */}
          <li>
            <Link
              href={`${basePath}/shop`}
              className={`group relative px-3.5 py-2 text-sm font-medium transition-colors ${
                shopActive
                  ? "text-[var(--brand)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              Shop
              <span
                className={`pointer-events-none absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--brand)] origin-left transition-transform duration-300 ${
                  shopActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </li>

          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`group relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-[var(--brand)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {label}
                <span
                  className={`pointer-events-none absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--brand)] origin-left transition-transform duration-300 ${
                    isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Search"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-ink-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)] transition-colors"
          >
            <Search size={19} />
          </button>
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--brand)] px-3 py-2 rounded-full hover:bg-[var(--brand-soft)] transition-colors"
          >
            <ArrowRight size={14} className="rotate-180" /> All brands
          </Link>
          <CartIcon />
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--brand-soft)] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <Close size={20} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[600px] pb-4 border-t border-[var(--color-ink)]/8" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-3 flex flex-col gap-3">
          {/* Shop section */}
          <div>
            <div className="flex items-center justify-between px-4 mb-1">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-ink-muted)]">
                Shop
              </p>
              <Link
                href={`${basePath}/shop`}
                onClick={() => setMobileOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand)]"
              >
                All →
              </Link>
            </div>
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
