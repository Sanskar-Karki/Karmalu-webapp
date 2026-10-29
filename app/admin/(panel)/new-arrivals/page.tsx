import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import HomePicksManager from "@/components/admin/HomePicksManager";

export const metadata: Metadata = { title: "New Arrivals" };

export default async function AdminNewArrivalsPage() {
  const { supabase } = await requireAdmin();
  const [products, categories] = await Promise.all([
    supabase.from("catalog_products").select("*").eq("status", "published").order("position").order("created_at"),
    supabase.from("catalog_categories").select("brand, slug, name"),
  ]);

  const rows = (products.data ?? []) as ProductRow[];
  // `select *` only returns home_rank once supabase/home_picks.sql has been run.
  const needsMigration = rows.length > 0 && !("home_rank" in rows[0]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">New Arrivals</h1>
      <p className="mt-1 text-sm text-black/55">
        Choose which products tagged &ldquo;New&rdquo; appear in each shop&apos;s home page section, and in what order.
      </p>

      {products.error ? (
        <p className="mt-8 rounded-2xl bg-red-50 p-5 text-sm text-red-800">{products.error.message}</p>
      ) : needsMigration ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-medium">One quick database update is needed.</p>
          <p className="mt-1">
            In Supabase, open <strong>SQL Editor → New query</strong>, paste the contents of{" "}
            <code>supabase/home_picks.sql</code>, click <strong>Run</strong>, then refresh this page.
          </p>
        </div>
      ) : (
        <HomePicksManager products={rows} categories={(categories.data ?? []) as Pick<CategoryRow, "brand" | "slug" | "name">[]} />
      )}
    </div>
  );
}
