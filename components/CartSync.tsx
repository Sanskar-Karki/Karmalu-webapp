"use client";

import { useEffect } from "react";
import { useBrand, useCart } from "@/store/BrandProvider";
import { useCatalog } from "@/store/CatalogProvider";

/** Keeps the saved cart's prices in step with the live catalogue. */
export default function CartSync() {
  const { brand } = useBrand();
  const { getProducts } = useCatalog();
  const cart = useCart();
  const products = getProducts(brand);
  const { syncWithCatalog } = cart;
  const itemCount = cart.items.length;

  useEffect(() => {
    if (itemCount > 0) syncWithCatalog(products);
  }, [products, itemCount, syncWithCatalog]);

  return null;
}
