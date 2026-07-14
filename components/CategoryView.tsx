"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { Brand, Category } from "@/types";
import { getCategories, getProducts } from "@/data/catalog";
import DecorShopCard from "@/components/DecorShopCard";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Tag,
  GridSmall,
  GridMedium,
  GridDense,
  SlidersHorizontal,
} from "@/components/icons";

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32] as const;

const SORT_OPTIONS = [
  { val: "price-asc", label: "Price: Low to High" },
  { val: "price-desc", label: "Price: High to Low" },
  { val: "rating", label: "Top Rated" },
] as const;
type SortVal = (typeof SORT_OPTIONS)[number]["val"];

const DENSITY_OPTIONS = [
  { key: "small", cols: "lg:grid-cols-3", icon: GridSmall, label: "Fewer per row" },
  { key: "medium", cols: "lg:grid-cols-4", icon: GridMedium, label: "Default grid" },
  { key: "dense", cols: "lg:grid-cols-5", icon: GridDense, label: "More per row" },
] as const;
type DensityVal = (typeof DENSITY_OPTIONS)[number]["key"];

export default function CategoryView({
  brand,
  basePath,
  category,
  defaultFilter,
}: {
  brand: Brand;
  basePath: string;
  category: Category;
  defaultFilter?: string;
}) {
  const allProducts = getProducts(brand);
  const allCategories = getCategories(brand);

  const [activeFilter, setActiveFilter] = useState<string>(defaultFilter ?? category.slug);
  const [sort, setSort] = useState<SortVal>("price-asc");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [density, setDensity] = useState<DensityVal>("medium");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: allProducts.length };
    allCategories.forEach((c) => {
      m[c.slug] = allProducts.filter((p) => p.categorySlug === c.slug).length;
    });
    m.sale = allProducts.filter((p) => (p.oldPrice ?? 0) > 0).length;
    m.new = allProducts.filter((p) => p.badge === "New").length;
    return m;
  }, [allProducts, allCategories]);

  const filtered = useMemo(() => {
    let list = allProducts;
    if (activeFilter === "sale") list = list.filter((p) => (p.oldPrice ?? 0) > 0);
    else if (activeFilter === "new") list = list.filter((p) => p.badge === "New");
    else if (activeFilter !== "all") list = list.filter((p) => p.categorySlug === activeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice.trim() && !Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    if (maxPrice.trim() && !Number.isNaN(max)) list = list.filter((p) => p.price <= max);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [allProducts, activeFilter, search, sort, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const shownCount = Math.min(safePage * pageSize, filtered.length);
  const activeDensity = DENSITY_OPTIONS.find((d) => d.key === density) ?? DENSITY_OPTIONS[1];

  const goTo = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterItems = [
    { key: "all", label: "All" },
    ...allCategories.map((c) => ({ key: c.slug, label: c.name })),
    { key: "new", label: "New In" },
    { key: "sale", label: "Sale" },
  ];

  const handleFilter = (key: string) => {
    setActiveFilter(key);
    setPage(1);
  };

  const heroTitle = defaultFilter === "all" ? "All Products" : category.name;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--page-bg)]">

      {/* ── Header ── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-6 sm:pb-10">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
        >
          <ArrowLeft size={12} />
          Home
        </Link>

        <div className="flex items-end justify-between gap-6 mt-6 flex-wrap">
          <div>
           
            <h1 className="text-2xl sm:text-5xl font-light tracking-tight text-[var(--color-ink)]">
              {heroTitle}
            </h1>
          </div>

          <div className="pb-1">
            {searchOpen ? (
              <label htmlFor="product-search-header" className="flex items-center gap-2 border-b border-[var(--color-ink)] pb-1">
                <Search size={15} className="text-[var(--color-ink-muted)]" />
                <input
                  id="product-search-header"
                  type="search"
                  autoFocus
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-48 sm:w-64 bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearch(""); setPage(1); }}
                  aria-label="Close search"
                  className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                  ✕
                </button>
              </label>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center gap-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors"
              >
                <Search size={15} />
                Search
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="border-t border-[var(--color-ink)]/10" />

      {/* ── Mobile/tablet filter + sort bar ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-[var(--page-bg)]/95 backdrop-blur-md border-b border-[var(--color-ink)]/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 sm:pb-4 flex items-center gap-4">

          {/* Filter links */}
          <nav
            aria-label="Filter products"
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar w-full sm:flex-1 sm:min-w-0"
          >
            {filterItems.map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => handleFilter(key)}
                  aria-pressed={isActive}
                  className={`shrink-0 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] border-b transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-ink)] border-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)] border-transparent hover:text-[var(--color-ink)]"
                  }`}
                >
                  {label}
                  {counts[key] !== undefined && (
                    <span className="ml-1 text-[var(--color-ink-muted)] font-normal">{counts[key]}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sort + Search */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            <label htmlFor="sort-select" className="sr-only">Sort products</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortVal); setPage(1); }}
              className="bg-transparent text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-[0.12em] focus:outline-none cursor-pointer appearance-none pr-5 border-b border-transparent hover:border-[var(--color-ink)]/30 transition-colors"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b6560' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.val} value={o.val}>{o.label}</option>
              ))}
            </select>

            <button
              onClick={() => setPriceOpen((v) => !v)}
              aria-label="Toggle price range"
              aria-pressed={priceOpen}
              className={`transition-colors ${priceOpen ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"}`}
            >
              <Tag size={15} />
            </button>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              aria-pressed={searchOpen}
              className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* Mobile sort + search row */}
        <div className="sm:hidden w-full px-4 pb-3 flex items-center justify-between gap-4 border-t border-[var(--color-ink)]/8 pt-2.5">
          <label htmlFor="sort-select-mobile" className="sr-only">Sort products</label>
          <select
            id="sort-select-mobile"
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortVal); setPage(1); }}
            className="bg-transparent text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-[0.12em] focus:outline-none cursor-pointer appearance-none pr-5"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b6560' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right center",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.val} value={o.val}>{o.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPriceOpen((v) => !v)}
              aria-label="Toggle price range"
              aria-pressed={priceOpen}
              className={`transition-colors ${priceOpen ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"}`}
            >
              <Tag size={15} />
            </button>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              aria-pressed={searchOpen}
              className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {priceOpen && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-4 -mt-1 flex items-center gap-2">
            <label htmlFor="price-min-mobile" className="sr-only">Minimum price</label>
            <input
              id="price-min-mobile"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-full sm:w-32 bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
            <span className="text-[var(--color-ink-muted)]">–</span>
            <label htmlFor="price-max-mobile" className="sr-only">Maximum price</label>
            <input
              id="price-max-mobile"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full sm:w-32 bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </div>
        )}

        {searchOpen && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-4 -mt-1">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input
              id="product-search"
              type="search"
              autoFocus
              placeholder="Search products…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full sm:w-72 bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </div>
        )}
      </div>

      {/* ── Sidebar + Product grid ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 lg:flex lg:gap-12 items-start">

        {/* Desktop sidebar */}
        {sidebarOpen && (
          <aside className="hidden lg:block w-52 shrink-0 sticky top-10">
            <nav aria-label="Filter products" className="flex flex-col items-start gap-3.5">
              {filterItems.map(({ key, label }) => {
                const isActive = activeFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleFilter(key)}
                    aria-pressed={isActive}
                    className={`text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {label}
                    {counts[key] !== undefined && (
                      <span className="ml-1.5 text-[var(--color-ink-muted)] font-normal">{counts[key]}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-10 pt-8 border-t border-[var(--color-ink)]/10 flex flex-col gap-5">
              <label htmlFor="sort-select-desktop" className="sr-only">Sort products</label>
              <select
                id="sort-select-desktop"
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortVal); setPage(1); }}
                className="bg-transparent text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-[0.12em] focus:outline-none cursor-pointer appearance-none pr-5 self-start"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b6560' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.val} value={o.val}>{o.label}</option>
                ))}
              </select>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-2.5">
                  Price Range
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="price-min-desktop" className="sr-only">Minimum price</label>
                  <input
                    id="price-min-desktop"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
                  />
                  <span className="text-[var(--color-ink-muted)]">–</span>
                  <label htmlFor="price-max-desktop" className="sr-only">Maximum price</label>
                  <input
                    id="price-max-desktop"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
                  />
                </div>
              </div>

              <label htmlFor="product-search-desktop" className="sr-only">Search products</label>
              <input
                id="product-search-desktop"
                type="search"
                placeholder="Search…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-transparent border-b border-[var(--color-ink)]/30 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)] transition-colors"
              />
            </div>
          </aside>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-[var(--color-ink-muted)] font-semibold uppercase tracking-[0.15em]">
                Show: {shownCount} / {filtered.length}
                {search && <> &middot; &ldquo;{search}&rdquo;</>}
              </p>
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="text-[10px] text-[var(--brand-dark)] font-semibold uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
                >
                  Clear ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Page size */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                {PAGE_SIZE_OPTIONS.map((n, i) => (
                  <span key={n} className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setPageSize(n); setPage(1); }}
                      aria-pressed={pageSize === n}
                      className={`transition-colors ${
                        pageSize === n ? "text-[var(--color-ink)]" : "hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {n}
                    </button>
                    {i < PAGE_SIZE_OPTIONS.length - 1 && <span className="text-[var(--color-ink)]/20">/</span>}
                  </span>
                ))}
              </div>

              <div className="hidden sm:block w-px h-4 bg-[var(--color-ink)]/15" />

              {/* Grid density */}
              <div className="hidden sm:flex items-center gap-2.5">
                {DENSITY_OPTIONS.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setDensity(key)}
                    aria-label={label}
                    aria-pressed={density === key}
                    className={`transition-colors ${
                      density === key ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]/50 hover:text-[var(--color-ink-muted)]"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>

              <div className="hidden sm:block w-px h-4 bg-[var(--color-ink)]/15" />

              {/* Filters toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                aria-pressed={sidebarOpen}
                className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4 border-t border-[var(--color-ink)]/10">
              <p className="text-[var(--color-ink-muted)] text-sm">No items found.</p>
              <button
                onClick={() => { setActiveFilter("all"); setSearch(""); setPage(1); }}
                className="text-[11px] text-[var(--color-ink)] font-semibold uppercase tracking-[0.15em] border-b border-[var(--color-ink)] pb-0.5 hover:opacity-70 transition-opacity"
              >
                Show all
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${activeDensity.cols} gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-14`}>
              {paginated.map((p) => (
                <DecorShopCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-6 border-t border-[var(--color-ink)]/10 pt-8">
              <button
                onClick={() => goTo(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Previous page"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-20 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft size={15} />
              </button>

              <div className="flex items-center gap-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => goTo(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === safePage ? "page" : undefined}
                    className={`text-[12px] font-semibold pb-0.5 border-b transition-colors ${
                      n === safePage
                        ? "text-[var(--color-ink)] border-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] border-transparent hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {String(n).padStart(2, "0")}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goTo(safePage + 1)}
                disabled={safePage >= totalPages}
                aria-label="Next page"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-20 disabled:pointer-events-none transition-colors"
              >
                <ArrowRight size={15} />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ── Editorial CTA strip ── */}
      <section className="border-t border-[var(--color-ink)]/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-dark)] block mb-3">
              New Season
            </span>
            <h3 className="text-2xl sm:text-4xl font-light text-[var(--color-ink)] leading-tight max-w-md">
              Fresh pieces, warm spaces.
            </h3>
          </div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-1 hover:opacity-70 transition-opacity shrink-0"
          >
            Explore all <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  );
}
