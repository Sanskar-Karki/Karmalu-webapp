import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory } from "@/data/catalog";
import ActivewearCategoryView from "@/components/ActivewearCategoryView";

export function generateStaticParams() {
  return getCategories("activewear").map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategory("activewear", params.category);
  if (!category) return { title: "Not found" };
  return { title: category.name, description: category.tagline };
}

export default function ActivewearCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategory("activewear", params.category);
  if (!category) notFound();

  return <ActivewearCategoryView category={category} />;
}
