import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/data/catalog";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getProducts("activewear").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getProduct("activewear", params.slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default function ActivewearProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct("activewear", params.slug);
  if (!product) notFound();

  return (
    <ProductDetail product={product} basePath="/activewear" brand="activewear" />
  );
}
