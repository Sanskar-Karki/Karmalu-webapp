import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog-server";
import ActivewearCategoryView from "@/components/ActivewearCategoryView";

export async function generateStaticParams() {
  return (await getCatalog()).getCategories("originals").map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getCatalog()).getCategory("originals", slug);
  if (!category) return { title: "Not found" };
  return { title: category.name, description: category.tagline };
}

export default async function OriginalsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = (await getCatalog()).getCategory("originals", slug);
  if (!category) notFound();

  return <ActivewearCategoryView category={category} />;
}
