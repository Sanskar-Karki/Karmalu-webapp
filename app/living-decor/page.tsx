import BrandHome from "@/components/BrandHome";

export default function LivingDecorHome() {
  return (
    <BrandHome
      brand="decor"
      basePath="/living-decor"
      hero={{
        eyebrow: "KARMALU · Collection 01",
        title: "Warm pieces for the spaces you love",
        subtitle:
          "Thoughtfully crafted rugs, lamps, vases and more — organic textures and golden warmth that turn a house into a home.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80",
      }}
    />
  );
}
