import type { Metadata } from "next";
import AboutView from "@/components/AboutView";

export const metadata: Metadata = { title: "About" };

export default function ActivewearAboutPage() {
  return (
    <AboutView
      content={{
        eyebrow: "Our story",
        title: "Built for movement, made to last",
        intro:
          "KARMALU Activewear exists for the people who show up — at the gym, on the road, in the ring, on the mat. We make gear that performs as hard as you do, without compromise.",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
        story: [
          "We obsess over the details that matter under load — flatlock seams, four-way stretch, fabrics that breathe and recover.",
          "Every product is tested in real sessions, not just in a lab, so it earns its place in your kit bag.",
          "From the first rep to the final mile, our gear is designed to disappear so you can focus on the work.",
        ],
        stats: [
          { value: "12+", label: "Products" },
          { value: "5", label: "Disciplines" },
          { value: "4.7★", label: "Avg rating" },
        ],
        values: [
          {
            title: "Performance first",
            body: "Engineered fabrics and construction that keep up with every session.",
          },
          {
            title: "Tested for real",
            body: "Proven in the gym, on the road and in the ring — not just on paper.",
          },
          {
            title: "Sharp by design",
            body: "Gear that looks as good off-duty as it performs on.",
          },
        ],
        ctaHref: "/activewear/gym",
      }}
    />
  );
}
