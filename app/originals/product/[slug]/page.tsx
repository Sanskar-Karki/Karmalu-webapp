import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog-server";
import ProductDetail from "@/components/ProductDetail";

export async function generateStaticParams() {
  return (await getCatalog()).getProducts("originals").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getCatalog()).getProduct("originals", slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default async function OriginalsProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getCatalog()).getProduct("originals", slug);
  if (!product) notFound();

  return (
    <ProductDetail product={product} basePath="/originals" brand="originals" />
  );
}
