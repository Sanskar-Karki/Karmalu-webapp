import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "KARMALU",
    template: "%s | KARMALU",
  },
  description:
    "Two worlds, one soul. KARMALU brings you thoughtfully crafted living & decor and performance activewear.",
  keywords: ["KARMALU", "living decor", "activewear", "home decor", "sportswear"],
  openGraph: {
    title: "KARMALU",
    description: "Two worlds, one soul.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
