import type { Brand } from "@/types";
import { BrandProvider } from "@/store/BrandProvider";
import BrandNavbar from "@/components/BrandNavbar";
import BrandFooter from "@/components/BrandFooter";
import CartDrawer from "@/components/CartDrawer";

export default function BrandShell({
  brand,
  themeClass,
  children,
}: {
  brand: Brand;
  themeClass: string;
  children: React.ReactNode;
}) {
  return (
    <BrandProvider brand={brand}>
      <div className={`${themeClass} min-h-screen flex flex-col bg-[var(--page-bg)]`}>
        <BrandNavbar />
        <main className="flex-1">{children}</main>
        <BrandFooter />
        <CartDrawer />
      </div>
    </BrandProvider>
  );
}
