import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog-server";
import ActivewearCategoryView from "@/components/ActivewearCategoryView";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full KARMALU Originals collection of everyday clothing.",
};

export default async function OriginalsShopPage() {
  const categories = (await getCatalog()).getCategories("originals");
  // Use the first category's image for the hero; defaultFilter="all" starts the grid showing everything
  const heroCategory = categories[0];

  return <ActivewearCategoryView category={heroCategory} defaultFilter="all" />;
}
