import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog-server";
import CategoryView from "@/components/CategoryView";

export async function generateStaticParams() {
  return (await getCatalog()).getCategories("decor").map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getCatalog()).getCategory("decor", slug);
  if (!category) return { title: "Not found" };
  return { title: category.name, description: category.tagline };
}

export default async function DecorCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = (await getCatalog()).getCategory("decor", slug);
  if (!category) notFound();

  return (
    <CategoryView brand="decor" basePath="/living-decor" category={category} />
  );
}
