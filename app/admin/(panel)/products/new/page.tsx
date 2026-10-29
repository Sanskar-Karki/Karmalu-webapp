import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { emptyProduct, loadCategoryOptions } from "@/lib/admin-data";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const categories = await loadCategoryOptions(supabase);
  return <ProductForm initial={emptyProduct} categories={categories} />;
}
