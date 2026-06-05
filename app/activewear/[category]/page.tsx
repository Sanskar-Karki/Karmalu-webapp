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
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory("activewear", slug);
  if (!category) return { title: "Not found" };
  return { title: category.name, description: category.tagline };
}

export default async function ActivewearCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory("activewear", slug);
  if (!category) notFound();

  return <ActivewearCategoryView category={category} />;
}
