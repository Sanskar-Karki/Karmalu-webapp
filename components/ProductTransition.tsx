"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const DURATION_MS = 1150;
/** Share of the timeline spent staggering cells from the centre outwards. */
const SPREAD = 0.5;
const FRAMES = 28;
const PRODUCT_PATH = /\/product\/[^/]+\/?$/;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Builds mask keyframes for the incoming page: one mask layer per grid cell,
 * each growing from its centre, with cells nearest the screen centre first.
 */
function cubeKeyframes(): Keyframe[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cols = vw >= 768 ? 8 : 4;
  const rows = Math.min(10, Math.max(4, Math.round((cols * vh) / vw)));
  const w = 100 / cols; // vw
  const h = 100 / rows; // vh

  const cells: { c: number; r: number; delay: number }[] = [];
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const maxDist = Math.hypot(cx, cy) || 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ c, r, delay: (Math.hypot(c - cx, r - cy) / maxDist) * SPREAD });
    }
  }

  const image = cells.map(() => "linear-gradient(#000 0 0)").join(",");
  const repeat = cells.map(() => "no-repeat").join(",");

  return Array.from({ length: FRAMES }, (_, f) => {
    const t = f / (FRAMES - 1);
    const sizes: string[] = [];
    const positions: string[] = [];
    for (const { c, r, delay } of cells) {
      const s = easeInOut(Math.min(1, Math.max(0, (t - delay) / (1 - SPREAD))));
      // +1px once visible hides hairline seams between neighbouring cells
      sizes.push(s === 0 ? "0px 0px" : `calc(${(w * s).toFixed(3)}vw + 1px) calc(${(h * s).toFixed(3)}vh + 1px)`);
      positions.push(`${(c * w + ((1 - s) * w) / 2).toFixed(3)}vw ${(r * h + ((1 - s) * h) / 2).toFixed(3)}vh`);
    }
    return {
      offset: t,
      maskImage: image,
      maskRepeat: repeat,
      maskSize: sizes.join(","),
      maskPosition: positions.join(","),
    } as Keyframe;
  });
}

/**
 * Product-page transition: when a link to a product page is clicked, the
 * current page stays on screen while the product page appears over it in
 * cubes, starting at the centre and spreading outwards.
 *
 * Uses the View Transitions API (the browser snapshots the outgoing page).
 * Where that's unavailable, or with reduced motion, navigation is unchanged.
 */
export default function ProductTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const finishNavigation = useRef<(() => void) | null>(null);

  // The new route has committed — let the view transition capture it.
  // (Resolve directly: rendering, and so requestAnimationFrame, is paused
  // while the transition waits on this promise.)
  useEffect(() => {
    const finish = finishNavigation.current;
    if (!finish) return;
    finishNavigation.current = null;
    finish();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const target = e.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      // Buttons inside product cards (add to bag, wishlist) handle their own clicks.
      if (!anchor || target?.closest("button")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (!PRODUCT_PATH.test(url.pathname) || url.pathname === location.pathname) return;

      // Stops next/link from navigating; we navigate inside the transition.
      e.preventDefault();

      const root = document.documentElement;
      root.classList.add("cube-vt");
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            finishNavigation.current = resolve;
            // Safety net if the route never commits (e.g. navigation error).
            setTimeout(resolve, 4000);
            router.push(url.pathname + url.search + url.hash);
          }),
      );

      transition.ready
        .then(() => {
          root.animate(cubeKeyframes(), {
            duration: DURATION_MS,
            easing: "linear",
            fill: "both",
            pseudoElement: "::view-transition-new(root)",
          });
          root.animate(
            [
              { transform: "scale(1)", filter: "brightness(1)" },
              { transform: "scale(0.94)", filter: "brightness(0.55)" },
            ],
            {
              duration: DURATION_MS,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              fill: "both",
              pseudoElement: "::view-transition-old(root)",
            },
          );
        })
        .catch(() => {});
      transition.finished.finally(() => root.classList.remove("cube-vt"));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
