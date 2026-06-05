import type { Metadata } from "next";
import ContactView from "@/components/ContactView";

export const metadata: Metadata = { title: "Contact" };

export default function ActivewearContactPage() {
  return <ContactView />;
}
