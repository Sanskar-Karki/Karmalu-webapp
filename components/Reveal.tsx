"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "fade" | "clip" | "scale";

/**
 * Reveals its children once they scroll into view (fires once).
 * Motion lives in globals.css (`.reveal*`) so reduced-motion users get the
 * content immediately with no transition.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
