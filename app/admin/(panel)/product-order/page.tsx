import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import ProductOrderManager from "@/components/admin/ProductOrderManager";

export const metadata: Metadata = { title: "All products order" };

export default async function AdminProductOrderPage() {
  const { supabase } = await requireAdmin();
  const [products, categories] = await Promise.all([
    supabase
      .from("catalog_products")
      .select("*")
      .neq("status", "archived")
      .order("position")
      .order("created_at"),
    supabase.from("catalog_categories").select("brand, slug, name"),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">All products</h1>
      <p className="mt-1 text-sm text-black/55">
        The order products appear in the shop when the filter is on <strong>All</strong>. Category pages keep the same
        order. Shoppers can still sort by price.
      </p>
      {products.error ? (
        <p className="mt-8 rounded-2xl bg-red-50 p-5 text-sm text-red-800">{products.error.message}</p>
      ) : (
        <ProductOrderManager
          products={(products.data ?? []) as ProductRow[]}
          categories={(categories.data ?? []) as Pick<CategoryRow, "brand" | "slug" | "name">[]}
        />
      )}
    </div>
  );
}
