# Local product image structure

```
images/
  activewear/
    men/<product-slug>/
    women/<product-slug>/
    accessories/<product-slug>/
    categories/       — one image per category (men, women, accessories)
    hero/              — homepage hero banner photo(s)
    lifestyle/          — homepage "lifestyle gallery" / community photos
  decor/
    rugs/<product-slug>/
    cushions/<product-slug>/
    vases/<product-slug>/
    wall-art/<product-slug>/
    lamps/<product-slug>/
    categories/
    hero/
    lifestyle/
```

## Inside each `<product-slug>/` folder

Drop up to 6 files, named by role:

| File | Used for |
|---|---|
| `main.jpg` | Product card thumbnail (`Product.image`) |
| `hover.jpg` | Card hover-swap image (`Product.hoverImage`) |
| `gallery-1.jpg` … `gallery-4.jpg` | Product detail page gallery (`Product.gallery`) — add as many as you have, `gallery-1`/`gallery-2` are usually the same as `main`/`hover` |

Any image format works (`.jpg`, `.png`, `.webp`) — just keep the filename prefix (`main`, `hover`, `gallery-N`) and use the matching extension when you reference it in the data file.

## Product slug ↔ folder map

**Activewear — Men:** `essential-training-tee`, `everyday-jogger-men`, `performance-quarter-zip`, `training-shorts-men`
**Activewear — Women:** `zen-flow-legging`, `sculpt-sports-bra`, `studio-crop-hoodie`, `flow-shorts-women`
**Activewear — Accessories:** `performance-water-bottle`, `sport-crossbody-bag`, `grip-training-gloves`, `resistance-band-set`

**Decor — Rugs:** `saffron-wool-rug`, `braided-jute-rug`, `berber-flatweave-rug`
**Decor — Cushions:** `linen-throw-cushion`, `velvet-lumbar-cushion`
**Decor — Vases:** `terracotta-vase`, `stoneware-bud-vase`
**Decor — Wall Art:** `sunset-canvas-print`, `botanical-line-print`, `boho-macrame-wall-hanging`
**Decor — Lamps:** `warm-glow-table-lamp`, `arc-floor-lamp`

## After uploading

Update the matching product's `image`, `hoverImage`, and `gallery` fields in its data file
(`data/activewear/products/<category>.ts` or `data/decor/products/<category>.ts`) to point at
`/images/<brand>/<category>/<slug>/<filename>` instead of the Unsplash URL.

Example:
```ts
image: "/images/activewear/men/essential-training-tee/main.jpg",
hoverImage: "/images/activewear/men/essential-training-tee/hover.jpg",
gallery: [
  "/images/activewear/men/essential-training-tee/gallery-1.jpg",
  "/images/activewear/men/essential-training-tee/gallery-2.jpg",
  "/images/activewear/men/essential-training-tee/gallery-3.jpg",
  "/images/activewear/men/essential-training-tee/gallery-4.jpg",
],
```
