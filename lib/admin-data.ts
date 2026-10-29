import { staticCatalogData } from "@/data/catalog";
import type { AdminProductInput } from "@/lib/admin-types";
import { emptySizeChart, normalizeSizeChart, syncRows } from "@/lib/size-chart";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import type { Brand } from "@/types";

export type CategoryOption = { brand: Brand; slug: string; name: string };

type AdminSupabase = Awaited<ReturnType<typeof import("@/lib/admin-auth").adminClient>>;

/** Categories from the database, or the built-in ones before the first import. */
export async function loadCategoryOptions(supabase: AdminSupabase): Promise<CategoryOption[]> {
  const { data } = await supabase.from("catalog_categories").select("*").order("position");
  const rows = (data ?? []) as CategoryRow[];
  if (rows.length) return rows.map(({ brand, slug, name }) => ({ brand, slug, name }));
  return (["originals", "decor"] as Brand[]).flatMap((brand) =>
    staticCatalogData[brand].categories.map(({ slug, name }) => ({ brand, slug, name })),
  );
}

export function rowToInput(row: ProductRow): AdminProductInput {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    slug: row.slug,
    categorySlug: row.category_slug,
    price: Number(row.price),
    oldPrice: row.old_price === null ? null : Number(row.old_price),
    description: row.description,
    details: row.details ?? [],
    badge: row.badge,
    sizes: row.sizes ?? [],
    sizeChart: syncRows(normalizeSizeChart(row.size_chart) ?? emptySizeChart(), row.sizes ?? []),
    colors: row.colors ?? [],
    media: row.media ?? [],
    hoverUrl: row.hover_url,
    status: row.status,
  };
}

export const emptyProduct: AdminProductInput = {
  brand: "originals",
  name: "",
  slug: "",
  categorySlug: "",
  price: 0,
  oldPrice: null,
  description: "",
  details: [],
  badge: null,
  sizes: [],
  sizeChart: emptySizeChart(),
  colors: [],
  media: [],
  hoverUrl: null,
  status: "draft",
};
