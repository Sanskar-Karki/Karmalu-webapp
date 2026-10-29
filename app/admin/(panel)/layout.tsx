import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { signOut } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { ToastProvider } from "@/components/admin/Toaster";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <ToastProvider>
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-black/[0.07] bg-white px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r lg:py-7">
        <Link href="/admin/products" className="block">
          <p className="font-display text-lg font-extrabold tracking-[0.14em]">KARMALU</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/45">Admin</p>
        </Link>
        <AdminNav />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/[0.07] pt-4 text-sm lg:mt-auto lg:flex-col lg:items-start lg:gap-3 lg:pt-5">
          <Link href="/originals" target="_blank" className="text-black/60 hover:text-black">
            View Originals ↗
          </Link>
          <Link href="/living-decor" target="_blank" className="text-black/60 hover:text-black">
            View Living &amp; Decor ↗
          </Link>
          <p className="truncate text-xs text-black/40" title={email}>
            {email}
          </p>
          <form action={signOut}>
            <button type="submit" className="text-left text-sm font-medium text-black/70 hover:text-black">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
    </ToastProvider>
  );
}
