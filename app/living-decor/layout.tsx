import type { Metadata } from "next";
import BrandShell from "@/components/BrandShell";

export const metadata: Metadata = {
  title: {
    default: "Living & Decor",
    template: "%s | KARMALU Living & Decor",
  },
  description:
    "Warm, organic pieces for the home — rugs, cushions, vases, wall art and lamps from KARMALU Living & Decor.",
};

export default function LivingDecorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandShell brand="decor" themeClass="theme-decor">
      {children}
    </BrandShell>
  );
}
