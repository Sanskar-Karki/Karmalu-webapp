import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import ProductsTable from "@/components/admin/ProductsTable";
import ImportCatalogButton from "@/components/admin/ImportCatalogButton";
import { buttonPrimary } from "@/lib/admin-ui";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const [products, categories] = await Promise.all([
    supabase.from("catalog_products").select("*").order("brand").order("position").order("created_at"),
    supabase.from("catalog_categories").select("*").order("position"),
  ]);

  const error = products.error ?? categories.error;
  const rows = (products.data ?? []) as ProductRow[];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Products</h1>
          <p className="mt-1 text-sm text-black/55">
            Add, edit and publish products for both shops. Changes show on the site within seconds.
          </p>
        </div>
        <Link href="/admin/products/new" className={buttonPrimary}>
          + Add product
        </Link>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p className="font-medium">Couldn&apos;t load products from the database.</p>
          <p className="mt-1">{error.message}</p>
          <p className="mt-2 text-red-700/80">
            If this is a new setup, run <code>supabase/catalog.sql</code> in the Supabase SQL editor first.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center">
          <p className="font-medium">No products in the database yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-black/55">
            The shop is currently showing the products built into the code. Import them once to start
            editing them here.
          </p>
          <div className="mt-5 flex justify-center">
            <ImportCatalogButton />
          </div>
        </div>
      ) : (
        <ProductsTable products={rows} categories={(categories.data ?? []) as CategoryRow[]} />
      )}
    </div>
  );
}
