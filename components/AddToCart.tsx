"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useCart, useCartDrawer } from "@/store/BrandProvider";
import Button from "@/components/Button";
import QtyStepper from "@/components/QtyStepper";
import { Cart, Check } from "@/components/icons";

export default function AddToCart({ product }: { product: Product }) {
  const cart = useCart();
  const { openDrawer } = useCartDrawer();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    cart.add(product, qty);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <QtyStepper value={qty} onChange={setQty} />
      <Button onClick={handleAdd} size="lg" className="flex-1">
        {added ? (
          <>
            <Check size={18} /> Added to cart
          </>
        ) : (
          <>
            <Cart size={18} /> Add to cart — ${(product.price * qty).toFixed(0)}
          </>
        )}
      </Button>
    </div>
  );
}
