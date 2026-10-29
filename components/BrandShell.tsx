import type { Brand } from "@/types";
import { BrandProvider } from "@/store/BrandProvider";
import { CatalogProvider } from "@/store/CatalogProvider";
import { getCatalogData } from "@/lib/catalog-server";
import BrandNavbar from "@/components/BrandNavbar";
import BrandFooter from "@/components/BrandFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductTransition from "@/components/ProductTransition";
import CartSync from "@/components/CartSync";

export default async function BrandShell({
  brand,
  themeClass,
  children,
}: {
  brand: Brand;
  themeClass: string;
  children: React.ReactNode;
}) {
  const catalog = await getCatalogData();

  return (
    <CatalogProvider data={catalog}>
    <BrandProvider brand={brand}>
      <div className={`${themeClass} min-h-screen flex flex-col bg-[var(--page-bg)]`}>
        <BrandNavbar />
        <main className="flex-1">{children}</main>
        <BrandFooter />
        <CartDrawer />
        <ProductTransition />
        <CartSync />
      </div>
    </BrandProvider>
    </CatalogProvider>
  );
}
