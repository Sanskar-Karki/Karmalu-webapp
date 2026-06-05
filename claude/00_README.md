# 00 — README & Working Instructions

## What this is
KARMALU is a **Next.js 14 (App Router) monolith** in TypeScript + Tailwind CSS.
One codebase hosts a landing page and **two sub-brands**:

- **KARMALU Living & Decor** (`/living-decor`)
- **KARMALU Active Wear** (`/activewear`)

Phase 1 is **fully static** — no database, no API routes, hardcoded data.

## How to use this folder
This `claude/` folder is the **single source of truth**. Read all files 00→06
before writing code. Each file owns one concern:

| File | Owns |
|------|------|
| `00_README.md` | Overview, rules, definition of done |
| `01_architecture.md` | Folder tree, routes, tech conventions |
| `02_colors_and_design.md` | Colors, fonts, UI primitives |
| `03_data_models.md` | TypeScript interfaces |
| `04_sample_data.json` | Example product data |
| `05_component_specs.md` | Component-by-component specs |
| `06_page_requirements.md` | Page-by-page requirements |

## Tech stack (non-negotiable for Phase 1)
- Next.js 14, App Router
- TypeScript (strict)
- Tailwind CSS **only** (no other CSS frameworks, no inline hex)
- Static data in `data/` (TS constants) — no DB, no API
- Server Components by default; `"use client"` only where interactivity is needed

## Working rules
1. Use Tailwind tokens (`cherry`, `beige`, `cream`, `ink`) — never raw hex in JSX.
2. All product images via `next/image`.
3. Product `id`s are stable strings, used as React keys.
4. Keep components small and reusable; co-locate nothing brand-specific in shared UI.
5. Fully responsive: mobile → tablet → desktop.

## Definition of Done (Phase 1)
- [ ] `/`, `/living-decor`, `/activewear` render and route correctly.
- [ ] Landing cards link to the right sub-brands with hover lift + glow.
- [ ] Living & Decor: responsive 3-col grid from static data.
- [ ] Active Wear: filter by sport (GYM/RUNNING/BOXING/YOGA/NORMAL), UI-only.
- [ ] Navbar + Footer on every page.
- [ ] No console errors; `next build` passes.

## Build phases (feed)
- **P0** Scaffold (`create-next-app`, Tailwind tokens, folders)
- **P1** Shared components (Button, Card, Badge, Navbar, Footer)
- **P2** Landing page (hero + 2 routing cards)
- **P3** Living & Decor (ProductCard + grid)
- **P4** Active Wear (CategoryFilter + filterable grid)
- **P5** Polish & ship (responsive QA, a11y, metadata, deploy)
