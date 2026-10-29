import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog-server";
import DecorProductDetail from "@/components/DecorProductDetail";

export async function generateStaticParams() {
  return (await getCatalog()).getProducts("decor").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getCatalog()).getProduct("decor", slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default async function DecorProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getCatalog()).getProduct("decor", slug);
  if (!product) notFound();

  return (
    <DecorProductDetail product={product} basePath="/living-decor" brand="decor" />
  );
}
