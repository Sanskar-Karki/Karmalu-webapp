import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = { title: "Order Request" };

export default function OriginalsCheckoutPage() {
  return <CheckoutView />;
}
