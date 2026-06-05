import type { Metadata } from "next";
import AboutView from "@/components/AboutView";

export const metadata: Metadata = { title: "About" };

export default function DecorAboutPage() {
  return (
    <AboutView
      content={{
        eyebrow: "Our story",
        title: "Crafting warmth, one piece at a time",
        intro:
          "KARMALU Living & Decor began with a simple belief — that a home should feel as good as it looks. We source organic textures and golden tones that bring quiet warmth to everyday living.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
        story: [
          "Every rug, lamp and vase in our collection is chosen for how it makes a room feel — softer, warmer, more lived-in.",
          "We work with makers who care about craft and materials that age beautifully, so the pieces you bring home only grow more characterful with time.",
          "From hand-thrown stoneware to hand-knotted wool, we celebrate the marks of the maker's hand.",
        ],
        stats: [
          { value: "12+", label: "Curated pieces" },
          { value: "5", label: "Categories" },
          { value: "100%", label: "Hand-selected" },
        ],
        values: [
          {
            title: "Natural materials",
            body: "Wool, linen, jute, stoneware and brass — honest materials that last.",
          },
          {
            title: "Considered design",
            body: "Each piece earns its place. Nothing is added for the sake of it.",
          },
          {
            title: "Warm & timeless",
            body: "A golden, organic palette that never goes out of style.",
          },
        ],
        ctaHref: "/living-decor/rugs",
      }}
    />
  );
}
