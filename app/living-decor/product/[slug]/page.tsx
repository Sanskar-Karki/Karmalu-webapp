import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/data/catalog";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getProducts("decor").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct("decor", slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default async function DecorProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct("decor", slug);
  if (!product) notFound();

  return (
    <ProductDetail product={product} basePath="/living-decor" brand="decor" />
  );
}
