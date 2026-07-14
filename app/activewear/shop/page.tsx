import type { Metadata } from "next";
import { getCategories } from "@/data/catalog";
import ActivewearCategoryView from "@/components/ActivewearCategoryView";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full KARMALU Activewear collection — men, women, accessories and more.",
};

export default function ActivewearShopPage() {
  const categories = getCategories("activewear");
  // Use the first category's image for the hero; defaultFilter="all" starts the grid showing everything
  const heroCategory = categories[0];

  return <ActivewearCategoryView category={heroCategory} defaultFilter="all" />;
}
