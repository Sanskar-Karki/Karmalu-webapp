# 03 — Data Models (TypeScript Interfaces)

All interfaces live in `types/index.ts`.

```ts
// types/index.ts

export type Sport = "GYM" | "RUNNING" | "BOXING" | "YOGA" | "NORMAL";

export interface ActivewearProduct {
  id: string;        // stable, used as React key (e.g. "aw-1")
  name: string;      // display name
  category: string;  // product type, e.g. "Leggings", "Tank Top"
  price: number;     // USD, no currency symbol
  sport: Sport;      // used for filtering
  image: string;     // path under /public, e.g. "/images/aw/flex-tee.jpg"
}

export interface LivingDecorProduct {
  id: string;
  name: string;
  category: "Rugs" | "Cushions" | "Vases" | "Wall Art" | "Lamps";
  price: number;
  image: string;     // e.g. "/images/ld/rug.jpg"
}
```

## Notes
- `Sport` is a closed union — the Active Wear category filter buttons map 1:1 to it,
  plus an "ALL" pseudo-option handled in UI (not part of the type).
- `LivingDecorProduct.category` is a closed union matching the 5 decor categories.
- Prices are plain numbers; format with `$` in the UI layer.
- Keep `id` prefixes consistent: `aw-*` for activewear, `ld-*` for living & decor.
