# 05 — Component Specs

All components in `components/`. Use Tailwind tokens, not raw hex.

---

## Button
**File:** `components/Button.tsx`
- Props: `children`, `onClick?`, `href?` (renders `<Link>` if present), `variant?` ("primary" | "ghost"), `className?`.
- **Primary:** `bg-cherry text-white rounded-full px-6 py-3 font-medium`.
- Hover: slight scale + darker cherry; `transition`.
- `focus-visible:ring-2 ring-cherry/50` for a11y.

## Card
**File:** `components/Card.tsx`
- Generic container: `bg-cream rounded-2xl shadow p-6`.
- Hover: `hover:-translate-y-1 hover:shadow-lg transition`.
- Optional colored glow on hover.
- Props: `children`, `className?`, optional `href?` to make whole card a link.

## Badge
**File:** `components/Badge.tsx`
- Small pill for sport category.
- `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold`.
- Cherry-tinted: `bg-cherry/10 text-cherry`.
- Props: `children` (sport label).

## Navbar
**File:** `components/Navbar.tsx`
- Sticky top, cream/translucent background, subtle bottom border.
- Left: **KARMALU** logo (links to `/`).
- Right: links → `Living & Decor` (`/living-decor`), `Activewear` (`/activewear`).
- Responsive: collapse to a simple menu on mobile (hamburger or stacked).

## Footer
**File:** `components/Footer.tsx`
- Brand name + tagline + `© {year} KARMALU`.
- Muted text, centered or simple columns.

## ProductCard
**File:** `components/ProductCard.tsx`
- Used by both sub-brands (props cover both shapes).
- Props: `name`, `price`, `image`, optional `sport?` (shows Badge), optional `onAdd?`.
- Layout: `next/image` (fixed aspect ratio), name, `$price`, optional Badge, optional quick-add Button.
- Wrapped in `Card` styling; hover lift.

## CategoryFilter (client)
**File:** `components/CategoryFilter.tsx`
- `"use client"`.
- Props: `categories: string[]`, `active: string`, `onChange: (c) => void`.
- Renders pill buttons including **ALL** + each sport.
- Active pill: `bg-cherry text-white`; inactive: `bg-cherry/10 text-cherry`.
