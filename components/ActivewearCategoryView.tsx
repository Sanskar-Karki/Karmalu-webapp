"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import type { Category, Product } from "@/types";
import { getCategories, getProducts } from "@/data/catalog";
import ActivewearShopCard from "@/components/ActivewearShopCard";
import { Search, ArrowRight, ArrowLeft, GridSmall, GridMedium, GridDense, Check } from "@/components/icons";
import { formatNpr } from "@/lib/currency";

const basePath = "/activewear";
const PAGE_SIZE_OPTIONS = [8, 12, 16, 24] as const;

const GRID_COLS = {
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
} as const;
type ColCount = keyof typeof GRID_COLS;

/* ── Sidebar filter item ── */
function FilterItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)]"
          : "text-[var(--aw-ink)] hover:bg-[var(--aw-secondary)]"
      }`}
    >
      <span className="flex items-center gap-2">
        {active && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--aw-bg)] inline-block" />
        )}
        {label}
      </span>
      <span
        className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center ${
          active ? "bg-[var(--aw-bg)]/20 text-[var(--aw-bg)]" : "bg-[var(--aw-secondary)] text-[var(--aw-ink)]/50"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ── Custom "N per page" dropdown (native <select> can't be styled open) ── */
function PageSizeDropdown({
  value,
  options,
  onChange,
}: {
  value: number;
  options: readonly number[];
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
          open
            ? "border-[var(--aw-ink)] text-[var(--aw-ink)]"
            : "border-[var(--aw-ink)]/20 text-[var(--aw-ink)] hover:border-[var(--aw-ink)]/40"
        }`}
      >
        {value} per page
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[var(--aw-ink)]/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-30 w-36 py-1.5 rounded-xl bg-[var(--aw-bg)] border border-[var(--aw-ink)]/10 shadow-lg animate-fade-in-up"
        >
          {options.map((n) => (
            <li key={n}>
              <button
                type="button"
                role="option"
                aria-selected={value === n}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                  value === n
                    ? "text-[var(--aw-highlight)] font-semibold"
                    : "text-[var(--aw-ink)] hover:bg-[var(--aw-secondary)]"
                }`}
              >
                {n} per page
                {value === n && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Mini product card for recommendations row ── */
function RecommendCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col bg-[var(--aw-bg)] rounded-2xl border border-[var(--aw-ink)]/8 overflow-hidden hover:shadow-sm transition-shadow">
      <Link href={`${basePath}/product/${product.slug}`} className="relative aspect-square bg-[var(--aw-secondary)] overflow-hidden">
        <ProductImage
          preset="card"
          src={product.image}
          alt={product.name}
          fill
          sizes="220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--aw-bg)] text-[var(--aw-ink)] text-[10px] font-medium uppercase tracking-widest">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] text-[var(--aw-ink)]/40 uppercase tracking-widest">{product.category}</p>
        <p className="font-display text-[var(--aw-ink)] text-sm leading-snug line-clamp-1 group-hover:text-[var(--aw-maroon)] transition-colors">
          {product.name}
        </p>
        <p className="text-[var(--aw-ink)] text-sm">{formatNpr(product.price)}</p>
        <div className="flex gap-1.5 mt-1">
          <Link
            href={`${basePath}/product/${product.slug}`}
            className="flex-1 py-2 text-center rounded-full border border-[var(--aw-ink)]/20 text-[var(--aw-ink)] text-xs font-medium uppercase tracking-wide hover:border-[var(--aw-ink)] transition-colors"
          >
            Details
          </Link>
          <Link
            href={`${basePath}/product/${product.slug}`}
            className="flex-1 py-2 text-center rounded-full bg-[var(--aw-ink)] text-[var(--aw-bg)] text-xs font-medium uppercase tracking-wide hover:bg-[var(--aw-maroon)] transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

const scrollToGrid = (ref: React.RefObject<HTMLElement | null>) => {
  // Wait for the pending state update (new page/filter) to actually paint
  // before measuring — otherwise we scroll against the previous layout.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - 88; // clear the sticky navbar
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
};

export default function ActivewearCategoryView({
  category,
  defaultFilter,
}: {
  category: Category;
  defaultFilter?: string;
}) {
  const allProducts = getProducts("activewear");
  const allCategories = getCategories("activewear");

  /* ── Filter state ── */
  type BadgeFilter = "new" | "bestseller" | "sale";
  const [activeBadges, setActiveBadges] = useState<Set<BadgeFilter>>(new Set());
  const [activeSizes, setActiveSizes] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(12);
  const [cols, setCols] = useState<ColCount>(4);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const gridSectionRef = useRef<HTMLElement>(null);

  /* ── Base list: current category (or all products on the shop-all page) ── */
  const baseProducts = useMemo(
    () => (defaultFilter === "all" ? allProducts : allProducts.filter((p) => p.categorySlug === category.slug)),
    [allProducts, defaultFilter, category.slug],
  );

  /* ── All sizes available within the base list ── */
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    baseProducts.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [baseProducts]);

  /* ── Counts for sidebar ── */
  const counts = useMemo(() => {
    const bySlug: Record<string, number> = {};
    bySlug["new"] = baseProducts.filter((p) => p.badge === "New").length;
    bySlug["bestseller"] = baseProducts.filter((p) => p.badge === "Bestseller").length;
    bySlug["sale"] = baseProducts.filter((p) => p.badge === "Sale" || (p.oldPrice ?? 0) > 0).length;
    allSizes.forEach((s) => {
      bySlug[`size:${s}`] = baseProducts.filter((p) => p.sizes?.includes(s)).length;
    });
    return bySlug;
  }, [baseProducts, allSizes]);

  const scrollToTop = () => scrollToGrid(gridSectionRef);

  const toggleBadge = (key: BadgeFilter) => {
    setActiveBadges((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setPage(1);
    scrollToTop();
  };

  const toggleSize = (size: string) => {
    setActiveSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
    setPage(1);
    scrollToTop();
  };

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let list = baseProducts;

    if (activeBadges.size > 0) {
      list = list.filter((p) => {
        if (activeBadges.has("new") && p.badge === "New") return true;
        if (activeBadges.has("bestseller") && p.badge === "Bestseller") return true;
        if (activeBadges.has("sale") && (p.badge === "Sale" || (p.oldPrice ?? 0) > 0)) return true;
        return false;
      });
    }

    if (activeSizes.size > 0) {
      list = list.filter((p) => p.sizes?.some((s) => activeSizes.has(s)));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [baseProducts, activeBadges, activeSizes, search, sort]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePageSize = (size: (typeof PAGE_SIZE_OPTIONS)[number]) => {
    setPageSize(size);
    setPage(1);
    scrollToTop();
  };

  const goTo = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    scrollToTop();
  };

  /* ── Recommendations: when viewing all, show featured; otherwise show cross-category ── */
  const recommendations = (defaultFilter === "all"
    ? allProducts.filter((p) => p.badge)
    : allProducts.filter((p) => p.categorySlug !== category.slug)
  ).slice(0, 5);

  const badgeItems: { key: BadgeFilter; label: string }[] = [
    { key: "new", label: "New Arrivals" },
    { key: "bestseller", label: "Best Sellers" },
    { key: "sale", label: "On Sale" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--aw-bg)]">

      {/* ── Category tab strip ── */}
      <section className="bg-[var(--aw-bg)] border-b border-[var(--aw-ink)]/8">
        <div className="w-full px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <Link
            href={`${basePath}/shop`}
            className={`shrink-0 px-4 py-4 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors ${
              defaultFilter === "all"
                ? "border-[var(--aw-highlight)] text-[var(--aw-ink)]"
                : "border-transparent text-[var(--aw-ink)]/50 hover:text-[var(--aw-ink)]"
            }`}
          >
            All
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.slug}
              href={`${basePath}/${c.slug}`}
              className={`shrink-0 px-4 py-4 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors ${
                defaultFilter !== "all" && category.slug === c.slug
                  ? "border-[var(--aw-highlight)] text-[var(--aw-ink)]"
                  : "border-transparent text-[var(--aw-ink)]/50 hover:text-[var(--aw-ink)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
      {/* ── Main layout: sidebar + grid ── */}
      <section ref={gridSectionRef} className="w-full px-4 sm:px-6 py-8 flex gap-8 items-start">

        {/* Sidebar — sticky, stays in place while the grid scrolls */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
          {/* Badge filters */}
          <div className="mb-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--aw-ink)]/50 px-3 mb-2">
              Filter
            </p>
            <div className="flex flex-col gap-0.5">
              {badgeItems.map(({ key, label }) => (
                <FilterItem
                  key={key}
                  label={label}
                  count={counts[key] ?? 0}
                  active={activeBadges.has(key)}
                  onClick={() => toggleBadge(key)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          {allSizes.length > 0 && (
            <div className="border-t border-[var(--aw-ink)]/8 pt-4 mt-2">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--aw-ink)]/50 px-3 mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2 px-3">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold border transition-colors ${
                      activeSizes.has(s)
                        ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)] border-[var(--aw-highlight)]"
                        : "border-[var(--aw-ink)]/15 text-[var(--aw-ink)] hover:border-[var(--aw-ink)]/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div className="border-t border-[var(--aw-ink)]/8 pt-4 mt-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--aw-ink)]/50 px-3 mb-2">
              Sort By
            </p>
            <div className="flex flex-col gap-0.5">
              {([
                { val: "default", label: "Featured" },
                { val: "price-asc", label: "Price: Low → High" },
                { val: "price-desc", label: "Price: High → Low" },
                { val: "rating", label: "Top Rated" },
              ] as const).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setSort(opt.val)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    sort === opt.val
                      ? "text-[var(--aw-highlight)] font-semibold"
                      : "text-[var(--aw-ink)]/60 hover:text-[var(--aw-ink)] hover:bg-[var(--aw-secondary)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right column */}
        <div className="flex-1 min-w-0">

          {/* Mobile: filter pills + sort row */}
          <div className="lg:hidden mb-4 flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="px-4 py-2 rounded-full bg-[var(--aw-secondary)] text-[var(--aw-ink)] text-xs font-bold uppercase tracking-wide"
            >
              {mobileFiltersOpen ? "Hide Filters ↑" : "Filters ↓"}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 rounded-full border border-[var(--aw-ink)]/15 bg-[var(--aw-bg)] text-[var(--aw-ink)] text-xs font-medium focus:outline-none"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mb-4 p-4 rounded-2xl bg-[var(--aw-secondary)] flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {badgeItems.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleBadge(key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                      activeBadges.has(key)
                        ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)]"
                        : "bg-[var(--aw-bg)] text-[var(--aw-ink)] hover:bg-[var(--aw-highlight)]/10"
                    }`}
                  >
                    {label} <span className="opacity-60">({counts[key] ?? 0})</span>
                  </button>
                ))}
              </div>
              {allSizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`w-10 h-9 rounded-lg text-xs font-bold border transition-colors ${
                        activeSizes.has(s)
                          ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)] border-[var(--aw-highlight)]"
                          : "bg-[var(--aw-bg)] border-[var(--aw-ink)]/15 text-[var(--aw-ink)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sort + result count bar (desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-6 gap-4">
            <p className="text-sm text-[var(--aw-ink-muted)] shrink-0">
              Showing <span className="font-bold text-[var(--aw-ink)]">{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</span> of{" "}
              <span className="font-bold text-[var(--aw-ink)]">{filtered.length}</span> results
            </p>

            <div className="flex items-center gap-4">
              {/* Page size */}
              <div className="flex items-center gap-2 text-sm text-[var(--aw-ink-muted)]">
                Show
                <PageSizeDropdown
                  value={pageSize}
                  options={PAGE_SIZE_OPTIONS}
                  onChange={(n) => handlePageSize(n as (typeof PAGE_SIZE_OPTIONS)[number])}
                />
              </div>

              {/* Grid density */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--aw-secondary)]">
                {([
                  { cols: 2 as ColCount, icon: GridSmall, label: "2 columns" },
                  { cols: 3 as ColCount, icon: GridMedium, label: "3 columns" },
                  { cols: 4 as ColCount, icon: GridDense, label: "4 columns" },
                ]).map(({ cols: c, icon: Icon, label }) => (
                  <button
                    key={c}
                    onClick={() => setCols(c)}
                    aria-label={label}
                    aria-pressed={cols === c}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      cols === c
                        ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)]"
                        : "text-[var(--aw-ink)]/50 hover:text-[var(--aw-ink)]"
                    }`}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-24 text-[var(--aw-ink)]/40">
              <p className="text-5xl mb-4">✦</p>
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`grid ${GRID_COLS[cols]} gap-4 sm:gap-5`}>
              {paginated.map((p) => (
                <ActivewearShopCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--aw-ink)]/20 text-sm font-bold uppercase tracking-wide disabled:opacity-30 hover:border-[var(--aw-highlight)] hover:text-[var(--aw-highlight)] transition-colors"
              >
                <ArrowLeft size={15} /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => goTo(n)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                      n === safePage
                        ? "bg-[var(--aw-highlight)] text-[var(--aw-bg)]"
                        : "text-[var(--aw-ink)]/50 hover:bg-[var(--aw-secondary)] hover:text-[var(--aw-ink)]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goTo(safePage + 1)}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--aw-ink)]/20 text-sm font-bold uppercase tracking-wide disabled:opacity-30 hover:border-[var(--aw-highlight)] hover:text-[var(--aw-highlight)] transition-colors"
              >
                Next <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Explore Recommendations ── */}
      <section className="bg-[var(--aw-secondary)] py-14 px-6 border-t border-[var(--aw-ink)]/8">
        <div className="w-full">
          <div className="flex items-end justify-between mb-7">
            <h2 className="font-display text-2xl sm:text-3xl tracking-[-0.01em] text-[var(--aw-ink)]">
              Explore Our Recommendations
            </h2>
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href={`${basePath}/${allCategories.find((c) => c.slug !== category.slug)?.slug ?? allCategories[0].slug}`}
                className="w-10 h-10 rounded-full border-2 border-[var(--aw-ink)]/20 flex items-center justify-center hover:border-[var(--aw-highlight)] hover:text-[var(--aw-highlight)] transition-colors"
              >
                <ArrowLeft size={16} />
              </Link>
              <Link
                href={`${basePath}/${allCategories.find((c) => c.slug !== category.slug)?.slug ?? allCategories[0].slug}`}
                className="w-10 h-10 rounded-full border-2 border-[var(--aw-ink)]/20 flex items-center justify-center hover:border-[var(--aw-highlight)] hover:text-[var(--aw-highlight)] transition-colors"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations.map((p) => (
              <RecommendCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[var(--aw-accent)] py-16 px-6">
        <div className="w-full grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.02] text-[var(--aw-bg)]">
              Ready to Get<br />Our New Stuff?
            </h2>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-4 py-3 rounded-full bg-[var(--aw-bg)]/10 border border-[var(--aw-bg)]/20 text-[var(--aw-bg)] placeholder:text-[var(--aw-bg)]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--aw-highlight)]"
              />
              <button className="px-6 py-3 rounded-full bg-[var(--aw-highlight)] text-[var(--aw-bg)] text-sm font-bold uppercase tracking-wide hover:bg-[var(--aw-maroon)] transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
          <div className="text-[var(--aw-bg)]/60 text-sm leading-relaxed">
            <p className="font-bold text-[var(--aw-bg)] mb-2">Made for Movers and Makers</p>
            We believe the best clothes disappear when you wear them. Obsessively engineered for performance — from the studio to the street, the trail to the table.
          </div>
        </div>
      </section>

    </div>
  );
}
