"use client";

import { useEffect, useState, type CSSProperties, type Ref } from "react";
import ProductImage from "@/components/ProductImage";

const LENS = 220;
const ZOOM = 2.5;
/** On touch the lens floats above the finger so the finger doesn't hide it. */
const TOUCH_LIFT = LENS / 2 + 24;

type Lens = {
  x: number;
  y: number;
  lift: number;
  url: string;
  /** The image as drawn with object-cover: rendered size and offset in the box. */
  dw: number;
  dh: number;
  ox: number;
  oy: number;
};

/**
 * Product photo with a click-to-magnify lens.
 * Click / tap turns the magnifier on at that point; it then follows the
 * cursor (or finger). Click again, move off the photo, or press Escape to
 * turn it off. `resetKey` turns it off when the visible photo changes.
 */
export default function ZoomSlide({
  src,
  alt,
  priority,
  sizes,
  label,
  className = "",
  style,
  tabIndex,
  ariaHidden,
  dataIndex,
  buttonRef,
  wrapperClassName = "absolute inset-0",
  resetKey,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  label: string;
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
  ariaHidden?: boolean;
  dataIndex?: number;
  buttonRef?: Ref<HTMLButtonElement>;
  wrapperClassName?: string;
  resetKey?: unknown;
}) {
  const [lens, setLens] = useState<Lens | null>(null);
  const zoomed = lens !== null;

  useEffect(() => setLens(null), [resetKey]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLens(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  const measure = (el: HTMLElement, clientX: number | null, clientY: number | null, touch: boolean): Lens => {
    const rect = el.getBoundingClientRect();
    const img = el.querySelector("img");
    const nw = img?.naturalWidth || rect.width;
    const nh = img?.naturalHeight || rect.height;
    const cover = Math.max(rect.width / nw, rect.height / nh);
    const dw = nw * cover;
    const dh = nh * cover;
    // Keyboard activation has no pointer position — start in the centre.
    const x = clientX === null ? rect.width / 2 : clientX - rect.left;
    const y = clientY === null ? rect.height / 2 : clientY - rect.top;
    return {
      x: Math.min(Math.max(x, 0), rect.width),
      y: Math.min(Math.max(y, 0), rect.height),
      lift: touch ? TOUCH_LIFT : 0,
      url: img?.currentSrc || src,
      dw,
      dh,
      ox: (rect.width - dw) / 2,
      oy: (rect.height - dh) / 2,
    };
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-index={dataIndex}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      aria-label={label}
      aria-pressed={zoomed}
      style={{ ...style, touchAction: zoomed ? "none" : undefined }}
      onClick={(e) => {
        if (zoomed) {
          setLens(null);
          return;
        }
        const keyboard = e.detail === 0;
        const touch = e.currentTarget.dataset.touch === "1";
        setLens(measure(e.currentTarget, keyboard ? null : e.clientX, keyboard ? null : e.clientY, touch));
      }}
      onPointerDown={(e) => {
        // Remember touch so the lens opens above the finger.
        if (e.pointerType !== "mouse") e.currentTarget.dataset.touch = "1";
        else delete e.currentTarget.dataset.touch;
      }}
      onPointerMove={(e) => {
        if (!zoomed) return;
        setLens(measure(e.currentTarget, e.clientX, e.clientY, e.pointerType !== "mouse"));
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setLens(null);
      }}
      className={`group overflow-hidden ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"} ${className}`}
    >
      <div className={wrapperClassName}>
        <ProductImage
          preset="detail"
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-opacity duration-700"
        />
      </div>

      {lens && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-20 rounded-full border-[3px] border-white bg-white bg-no-repeat shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.08)] animate-[lens-in_0.25s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{
            width: LENS,
            height: LENS,
            left: lens.x - LENS / 2,
            top: lens.y - LENS / 2 - lens.lift,
            backgroundImage: `url("${lens.url}")`,
            backgroundSize: `${lens.dw * ZOOM}px ${lens.dh * ZOOM}px`,
            backgroundPosition: `${-((lens.x - lens.ox) * ZOOM - LENS / 2)}px ${-((lens.y - lens.oy) * ZOOM - LENS / 2)}px`,
          }}
        />
      )}

      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-5 left-5 z-10 hidden rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--aw-ink)] backdrop-blur transition-opacity duration-300 lg:block ${
          zoomed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {zoomed ? "Click to close zoom" : "Click to Magnify"}
      </span>
    </button>
  );
}
