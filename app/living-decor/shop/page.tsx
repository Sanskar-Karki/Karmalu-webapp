import type { Metadata } from "next";
import { getCategories } from "@/data/catalog";
import CategoryView from "@/components/CategoryView";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full KARMALU Living & Decor collection — rugs, cushions, vases, wall art, lamps and more.",
};

export default function DecorShopPage() {
  const categories = getCategories("decor");
  // Use the first category's image for the hero; defaultFilter="all" starts the grid showing everything
  const heroCategory = categories[0];

  return (
    <CategoryView
      brand="decor"
      basePath="/living-decor"
      category={heroCategory}
      defaultFilter="all"
    />
  );
}
