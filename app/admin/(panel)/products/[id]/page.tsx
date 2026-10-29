import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { loadCategoryOptions, rowToInput } from "@/lib/admin-data";
import type { ProductRow } from "@/lib/catalog-server";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data }, categories] = await Promise.all([
    supabase.from("catalog_products").select("*").eq("id", id).maybeSingle(),
    loadCategoryOptions(supabase),
  ]);
  if (!data) notFound();
  return <ProductForm key={id} initial={rowToInput(data as ProductRow)} categories={categories} />;
}
