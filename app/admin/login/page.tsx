import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-xl font-extrabold tracking-[0.14em]">KARMALU</p>
        <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-black/45">Admin</p>
        <div className="mt-8 rounded-3xl border border-black/[0.07] bg-white p-7 shadow-[0_30px_80px_-50px_rgba(20,16,15,0.45)]">
          <h1 className="text-lg font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-black/55">Manage products, photos and videos.</p>
          <LoginForm
            next={next}
            initialError={error === "not-admin" ? "This account doesn't have admin access." : undefined}
          />
        </div>
      </div>
    </div>
  );
}
