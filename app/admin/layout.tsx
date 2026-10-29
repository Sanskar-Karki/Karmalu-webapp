import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | KARMALU Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f6f5f2] text-[#14100f]">{children}</div>;
}
