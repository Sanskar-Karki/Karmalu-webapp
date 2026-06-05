# 01 — Architecture: Folder Structure & Routes

## Routes
```
/                    → Landing page (2 cards)
/living-decor        → KARMALU Living & Decor (product grid)
/activewear          → KARMALU Active Wear (filterable grid)
```

## Folder structure
```
karmalu/
├── app/
│   ├── layout.tsx              # Root layout: fonts + Navbar + Footer
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind directives + base styles
│   ├── living-decor/
│   │   └── page.tsx
│   └── activewear/
│       └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── ProductCard.tsx
│   └── CategoryFilter.tsx      # client component (Active Wear)
├── data/
│   ├── livingDecor.ts
│   └── activewear.ts
├── types/
│   └── index.ts
├── public/images/
│   ├── aw/                     # activewear images
│   └── ld/                     # living & decor images
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

## Tech conventions
- **Server Components by default.** Add `"use client"` only to `CategoryFilter`
  and any quick-add interactivity.
- Import static data directly into Server Components from `data/`.
- Use `next/image` for all images. If using remote images later, configure
  `images.remotePatterns` in `next.config.mjs`.
- No raw hex in JSX — use Tailwind tokens from `02_colors_and_design.md`.
- Strict TypeScript; all data typed via `types/index.ts`.

## Layout composition
`app/layout.tsx` wraps every page with:
- `next/font` loaded fonts (applied to `<body>`)
- `<Navbar />` at top
- `{children}`
- `<Footer />` at bottom
- Base background `bg-cream`, text `text-ink`
