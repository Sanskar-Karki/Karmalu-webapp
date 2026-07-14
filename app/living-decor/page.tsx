import DecorHome from "@/components/DecorHome";

export default function LivingDecorHome() {
  return (
    <DecorHome
      brand="decor"
      basePath="/living-decor"
      hero={{
        eyebrow: "Curated home essentials",
        title: "Modern pieces for a calmer, warmer home.",
        subtitle:
          "Shop rugs, lamps, vases and textiles selected for honest materials, sculptural shapes, and rooms that feel lived in.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85",
        highlights: [
          "Natural materials",
          "Quiet luxury",
          "Made for daily living",
        ],
        overlayEyebrow: "This season",
        overlayTitle: "Layered neutrals, warm textures.",
        overlayText:
          "Explore a refined edit of rugs, woven textures, and sculptural accents.",
      }}
    />
  );
}
