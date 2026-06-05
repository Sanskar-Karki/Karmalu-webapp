import type { Metadata } from "next";
import BrandShell from "@/components/BrandShell";

export const metadata: Metadata = {
  title: {
    default: "Activewear",
    template: "%s | KARMALU Activewear",
  },
  description:
    "Modern, performance-ready gear for gym, running, boxing, yoga and everyday from KARMALU Activewear.",
};

export default function ActivewearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandShell brand="activewear" themeClass="theme-activewear">
      {children}
    </BrandShell>
  );
}
