import type { Metadata } from "next";
import FaqView from "@/components/FaqView";
import { getFaqs } from "@/data/faqs";

export const metadata: Metadata = { title: "FAQ" };

export default function OriginalsFaqPage() {
  return <FaqView items={getFaqs("originals")} />;
}
