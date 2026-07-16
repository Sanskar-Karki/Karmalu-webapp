"use client";

import { useEffect, useState } from "react";

/**
 * Wraps a section's page content so that arriving via the landing page's
 * "Enter World" transition triggers a matching fade/rise-in here, instead of
 * the page just snapping into view once the circle-wipe overlay clears.
 * Direct visits (refresh, back button, external link) skip the animation.
 */
export default function WorldEntrance({ children }: { children: React.ReactNode }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const cameFromLanding = sessionStorage.getItem("karmalu-world-entry") === "1";
    if (cameFromLanding) {
      sessionStorage.removeItem("karmalu-world-entry");
      setAnimate(true);
    }
  }, []);

  return (
    <div className={animate ? "animate-world-fade-in" : undefined}>
      {children}
    </div>
  );
}
