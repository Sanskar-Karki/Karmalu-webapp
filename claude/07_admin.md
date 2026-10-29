# 07 — Admin (products, categories, photos & videos)

## Where things live
| Piece | Location |
|-------|----------|
| Admin pages | `/admin` → `app/admin/` (`login/`, `(panel)/products`, `(panel)/categories`, `(panel)/new-arrivals`, `(panel)/media`) |
| Server actions (all writes) | `app/admin/actions.ts` |
| Products & categories | Supabase tables `catalog_products`, `catalog_categories` |
| Media library | Supabase `media_assets` + files on Cloudinary (`karmalu/` folder) |
| Admin accounts | Supabase Auth users whose email is in `admin_users` |
| Schema + security (RLS) | `supabase/catalog.sql` |

## How the storefront reads products
- `lib/catalog-server.ts` → `getCatalog()` / `getCatalogData()` loads **published**
  products from Supabase, cached under the `catalog` tag (refreshed on every admin save).
- Server components: `const { getProducts } = await getCatalog();`
- Client components: `const { getProducts } = useCatalog();` (provided by `BrandShell`).
- Fallback: if the tables are missing, empty, or unreachable, the site uses the built-in
  data in `data/` (`staticCatalogData`). Do not import product data from `data/` directly.

## Setup checklist
1. Run `supabase/catalog.sql` in the Supabase SQL editor.
2. Supabase → Authentication → Users → **Add user** (email + password).
3. SQL editor: `insert into public.admin_users (email) values ('that@email.com');`
4. Fill `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env.local`
   (and in the hosting provider's env vars), then restart.
5. Sign in at `/admin` → **Import current products** (safe to re-run; never overwrites edits).

## Rules
- Product delete = archive first, then permanent delete (orders reference products by slug).
- Media can't be deleted while a product still uses it.
- Product photos: first photo is the main image; an optional "hover" photo shows on cards.
  Videos play in the product page gallery (VideoSlide); the first media item should be a photo.
- Categories: URL name (slug) is fixed after creation; deleting one requires moving its products;
  a shop keeps at least one category (otherwise the storefront falls back to built-in categories).
  Reserved slugs (shop, product, cart, checkout, about, faq, contact, admin, api) are refused.
- Admin feedback uses toasts (`components/admin/Toaster.tsx`, `useToast()`), mounted in `(panel)/layout.tsx`.
- Home page picks: `catalog_products.home_rank` (null = not picked; added by `supabase/home_picks.sql`).
  `lib/home-picks.ts` → `homePicks()` orders them for Originals "New Arrivals" and Decor "Featured
  this season"; with no picks each home page uses its automatic choice. Only published products
  with badge "New" (`NEW_BADGE`) qualify; saving a product without that badge clears its home_rank.
- Display order (admin nav group): Categories, New Arrivals, All products (`(panel)/product-order`).
  "All products" writes `catalog_products.position` per shop; storefront lists use that order by default.
- Size charts: `lib/size-chart.ts` — stored as `{ unit: "in"|"cm", columns, rows: [{ size, values }] }` (no unit = cm); legacy
  `[{ size, chest, waist, hip }]` is read via `normalizeSizeChart()`. Rows mirror `sizes` (`syncRows`);
  saved as null when no measurement is filled in, and the storefront size guide only shows when filled.
