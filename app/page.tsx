import type { Metadata } from "next";
import LandingExperience from "@/components/LandingExperience";

export const metadata: Metadata = {
  title: "KARMALU — Two Worlds, One Soul",
};

export default function Home() {
  return <LandingExperience />;
}
