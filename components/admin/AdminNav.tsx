"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/media", label: "Photos & videos" },
];

/** Screens that control the order things appear in the shop. */
const DISPLAY_ORDER = [
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/new-arrivals", label: "New Arrivals" },
  { href: "/admin/product-order", label: "All products" },
];

function NavLink({ href, label, pathname, nested = false }: { href: string; label: string; pathname: string; nested?: boolean }) {
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${nested ? "lg:pl-6" : ""} ${
        active ? "bg-[#14100f] text-white" : "text-black/65 hover:bg-black/[0.04] hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const inDisplayOrder = DISPLAY_ORDER.some((l) => pathname.startsWith(l.href));

  return (
    <nav aria-label="Admin" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:items-stretch lg:overflow-visible lg:px-0">
      {MAIN.map((l) => (
        <NavLink key={l.href} {...l} pathname={pathname} />
      ))}

      <div role="group" aria-labelledby="admin-nav-display-order" className="flex items-center gap-1 lg:mt-4 lg:flex-col lg:items-stretch">
        <p
          id="admin-nav-display-order"
          className={`shrink-0 whitespace-nowrap px-3 text-[10px] font-semibold uppercase tracking-[0.18em] lg:pb-1 ${
            inDisplayOrder ? "text-[#59634a]" : "text-black/40"
          }`}
        >
          <span className="lg:hidden">·</span> Display order
        </p>
        {DISPLAY_ORDER.map((l) => (
          <NavLink key={l.href} {...l} pathname={pathname} nested />
        ))}
      </div>
    </nav>
  );
}
