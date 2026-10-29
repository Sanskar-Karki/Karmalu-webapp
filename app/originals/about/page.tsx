import type { Metadata } from "next";
import AboutView from "@/components/AboutView";

export const metadata: Metadata = { title: "About" };

export default function OriginalsAboutPage() {
  return (
    <AboutView
      content={{
        eyebrow: "Our story",
        title: "Everyday pieces, thoughtfully made",
        intro:
          "Karmalu Originals is a clothing collection for the everyday. We focus on comfortable fits, versatile pieces and considered details that make getting dressed feel easy.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80",
        story: [
          "KARMALU Originals is a clothing collection for the everyday. We focus on comfortable fits, versatile pieces and considered details that make getting dressed feel easy.",
          "Explore clothing across men's and women's collections, with tops, bottoms, outerwear and useful finishing touches.",
          "Browse the collection, choose your size and color, then place your order through our simple WhatsApp-confirmed checkout.",
        ],
        stats: [
          { value: "12+", label: "Pieces" },
          { value: "6", label: "Collections" },
          { value: "XS–XXL", label: "Size range" },
        ],
        values: [
          {
            title: "Made for everyday",
            body: "Versatile staples designed to fit naturally into your wardrobe.",
          },
          {
            title: "Easy to choose",
            body: "Browse clear categories, sizes and colors before adding a piece to your cart.",
          },
          {
            title: "Simple checkout",
            body: "Place an order online and confirm delivery with us over WhatsApp.",
          },
        ],
        ctaHref: "/originals/shop",
      }}
    />
  );
}
