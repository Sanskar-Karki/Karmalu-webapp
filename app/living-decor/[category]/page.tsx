import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory } from "@/data/catalog";
import CategoryView from "@/components/CategoryView";

export function generateStaticParams() {
  return getCategories("decor").map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategory("decor", params.category);
  if (!category) return { title: "Not found" };
  return { title: category.name, description: category.tagline };
}

export default function DecorCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategory("decor", params.category);
  if (!category) notFound();

  return (
    <CategoryView brand="decor" basePath="/living-decor" category={category} />
  );
}
