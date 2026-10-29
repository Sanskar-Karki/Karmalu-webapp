import type { Metadata } from "next";
import BrandShell from "@/components/BrandShell";
import WorldEntrance from "@/components/WorldEntrance";

export const metadata: Metadata = {
  title: {
    default: "Originals",
    template: "%s | KARMALU Originals",
  },
  description:
    "Thoughtful everyday clothing for men and women, from KARMALU Originals.",
};

export default function OriginalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandShell brand="originals" themeClass="theme-originals">
      <WorldEntrance>{children}</WorldEntrance>
    </BrandShell>
  );
}
