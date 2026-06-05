# 06 — Page Requirements

---

## Landing — `app/page.tsx`
**Theme:** cream background, KARMALU brand hero.

- **Hero:** large "KARMALU" wordmark + tagline (e.g. "Two worlds, one soul.").
- **Two cards side-by-side** (stack vertically on mobile):
  - **Card 1 — Living & Decor:** beige theme, links to `/living-decor`.
    Short blurb ("Warm, organic pieces for the home.") + CTA.
  - **Card 2 — Active Wear:** cherry-cola **gradient** theme, white text,
    links to `/activewear`. Blurb ("Modern gear for every sport.") + CTA.
- **Hover:** each card lifts + subtle glow.
- Responsive: `grid-cols-1 md:grid-cols-2`, generous gap.

---

## Living & Decor — `app/living-decor/page.tsx`
**Theme:** warm, organic, home-focused. Beige backgrounds, cherry buttons.

- Page header: "Living & Decor" + intro line.
- **Product grid** from `data/livingDecor.ts`:
  - Responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
  - Each cell = `ProductCard` (image, name, `$price`, optional CTA button).
- Categories present in data: Rugs, Cushions, Vases, Wall Art, Lamps.
- (No filter required in Phase 1 — grid shows all.)
- Server Component (static data import).

---

## Active Wear — `app/activewear/page.tsx`
**Theme:** modern, energetic, athletic. White/cream backgrounds, cherry accents.

- Page header: "Active Wear" + intro line.
- **Category filter (UI only):** `CategoryFilter` with options
  `ALL, GYM, RUNNING, BOXING, YOGA, NORMAL`.
  - Filtering happens client-side over `data/activewear.ts` by `sport`.
  - `ALL` shows everything.
- **Product grid:** responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
  - Each `ProductCard` shows: **sport Badge**, title, `$price`, **quick-add** button.
  - Quick-add is UI-only (no cart yet) — can `console.log` or no-op.
- Because of the filter state, the page (or a child) is a **client component**
  (`"use client"`), or wrap just the filter+grid in a client child and keep the
  page a Server Component that passes data in. **Prefer the latter.**

---

## Cross-page requirements
- Navbar + Footer on every page (via `app/layout.tsx`).
- All images via `next/image` with `alt` text = product name.
- No raw hex in JSX; Tailwind tokens only.
- Fully responsive; no console errors; `next build` passes.
