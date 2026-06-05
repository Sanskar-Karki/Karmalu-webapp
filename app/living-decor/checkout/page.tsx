import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function DecorCheckoutPage() {
  return <CheckoutView />;
}
