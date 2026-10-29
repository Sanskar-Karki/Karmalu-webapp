import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import type { CategoryRow } from "@/lib/catalog-server";
import CategoriesManager, { type CategoryUsage } from "@/components/admin/CategoriesManager";
import ImportCatalogButton from "@/components/admin/ImportCatalogButton";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const [categories, products] = await Promise.all([
    supabase.from("catalog_categories").select("*").order("position"),
    supabase.from("catalog_products").select("brand, category_slug, status"),
  ]);

  const error = categories.error ?? products.error;
  const rows = (categories.data ?? []) as CategoryRow[];

  // Product counts per category: { "originals:jacket": { live, total } }
  const usage: CategoryUsage = {};
  for (const p of products.data ?? []) {
    const key = `${p.brand}:${p.category_slug}`;
    usage[key] ??= { live: 0, total: 0 };
    usage[key].total++;
    if (p.status === "published") usage[key].live++;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Categories</h1>
      <p className="mt-1 text-sm text-black/55">
        Categories appear in the shop menu, filters and the home page, in the order shown here.
      </p>

      {error ? (
        <p className="mt-8 rounded-2xl bg-red-50 p-5 text-sm text-red-800">{error.message}</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center">
          <p className="font-medium">No categories in the database yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-black/55">
            Import the current products first — that also brings in their categories.
          </p>
          <div className="mt-5 flex justify-center">
            <ImportCatalogButton />
          </div>
        </div>
      ) : (
        <CategoriesManager categories={rows} usage={usage} />
      )}
    </div>
  );
}
