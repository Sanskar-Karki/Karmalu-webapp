"use client";

import ProductImage from "@/components/ProductImage";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";

const LENS_SIZE = 260;
const ZOOM = 1.6;

export default function ProductGallery({
  images,
  name,
  fitViewport = false,
}: {
  images: string[];
  name: string;
  /** Cap the main image's height so it fits within the viewport instead of overflowing. */
  fitViewport?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [magnifying, setMagnifying] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const THUMB_VISIBLE = 4;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = Math.min(Math.max(x - LENS_SIZE / 2, 0), rect.width - LENS_SIZE);
    const lensY = Math.min(Math.max(y - LENS_SIZE / 2, 0), rect.height - LENS_SIZE);
    setLensPos({ x: lensX, y: lensY });

    // background-size is ZOOM*100% of the lens box, so the source image (at
    // natural display size rect.width×rect.height) is ZOOM× larger than the
    // lens. Offset the background so the point under the cursor stays fixed
    // inside the lens regardless of the lens's own on-screen position.
    const bgX = -(x * ZOOM - LENS_SIZE / 2);
    const bgY = -(y * ZOOM - LENS_SIZE / 2);
    const bgWidth = rect.width * ZOOM;
    const bgHeight = rect.height * ZOOM;
    const clampedX = Math.min(Math.max(bgX, LENS_SIZE - bgWidth), 0);
    const clampedY = Math.min(Math.max(bgY, LENS_SIZE - bgHeight), 0);
    setBgPos({ x: clampedX, y: clampedY });
    setBgSize({ width: bgWidth, height: bgHeight });
  };

  const canUp = thumbOffset > 0;
  const canDown = thumbOffset < images.length - THUMB_VISIBLE;

  const scrollUp = () => setThumbOffset((v) => Math.max(0, v - 1));
  const scrollDown = () => setThumbOffset((v) => Math.min(images.length - THUMB_VISIBLE, v + 1));

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + THUMB_VISIBLE);

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex gap-3">
        {/* ── Left: thumbnail strip ── */}
        <div className="hidden sm:flex flex-col items-center gap-2 w-[72px] shrink-0">
          {/* Up arrow */}
          <button
            onClick={scrollUp}
            disabled={!canUp}
            aria-label="Previous images"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]/40 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <ArrowLeft size={13} className="rotate-90" />
          </button>

          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {visibleThumbs.map((img, idx) => {
              const i = idx + thumbOffset;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative w-[72px] h-[90px] rounded-lg overflow-hidden bg-[var(--color-beige)] transition-all duration-200 ${
                    active === i
                      ? "ring-2 ring-[var(--color-ink)] ring-offset-1"
                      : "opacity-55 hover:opacity-100"
                  }`}
                >
                  <ProductImage
                    preset="thumb"
                    src={img}
                    alt={`${name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Down arrow */}
          <button
            onClick={scrollDown}
            disabled={!canDown}
            aria-label="Next images"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]/40 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <ArrowRight size={13} className="rotate-90" />
          </button>
        </div>

        {/* ── Main image ── */}
        <div className="flex-1 flex flex-col gap-2 relative">
          <div
            ref={imageRef}
            className={`relative w-full overflow-hidden bg-[var(--color-beige)] cursor-zoom-in xl:cursor-crosshair ${
              fitViewport ? "" : "aspect-[4/5]"
            } ${zoomed ? "rounded-none" : "rounded-2xl"}`}
            style={fitViewport ? { height: "calc(100vh - 7rem)" } : undefined}
            onClick={() => setZoomed((v) => !v)}
            onMouseEnter={() => setMagnifying(true)}
            onMouseLeave={() => setMagnifying(false)}
            onMouseMove={handleMouseMove}
          >
            <ProductImage
              preset="detail"
              src={images[active]}
              alt={name}
              fill
              priority
              className={`object-cover transition-transform duration-500 ${
                zoomed ? "scale-150" : "scale-100"
              }`}
            />
            {/* Hover magnifier lens: shows a zoomed view of exactly the area under the cursor */}
            {magnifying && (
              <div
                className="hidden xl:block absolute rounded-full overflow-hidden border-2 border-white shadow-2xl pointer-events-none z-20"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPos.x,
                  top: lensPos.y,
                  backgroundImage: `url(${images[active]})`,
                  backgroundSize: `${bgSize.width}px ${bgSize.height}px`,
                  backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            {/* Badge overlay: prev / next navigation */}
            {images.length > 1 && (
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between sm:hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); setActive((v) => (v - 1 + images.length) % images.length); }}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="text-xs font-semibold bg-white/80 px-2.5 py-1 rounded-full">
                  {active + 1} / {images.length}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setActive((v) => (v + 1) % images.length); }}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile thumbnails (horizontal strip) */}
      {images.length > 1 && (
        <div className="flex sm:hidden gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-20 rounded-lg overflow-hidden bg-[var(--color-beige)] shrink-0 transition-all ${
                active === i ? "ring-2 ring-[var(--color-ink)] ring-offset-1" : "opacity-50 hover:opacity-100"
              }`}
            >
              <ProductImage preset="thumb" src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
