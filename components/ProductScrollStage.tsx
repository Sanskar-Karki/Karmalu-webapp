"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import ZoomSlide from "@/components/ZoomSlide";
import VideoSlide from "@/components/VideoSlide";
import type { ProductMedia } from "@/types";

/** Navbar height once scrolled (h-14) — the stage pins just below it. */
const HEADER_PX = 56;
/** Extra scroll distance (in svh) each additional photo takes up. */
const SCROLL_PER_IMAGE_SVH = 70;

/**
 * Pinned product stage (Originals PDP).
 *
 * Desktop (lg+): the three columns — info, photo, actions — pin to the
 * viewport while a tall scroll track passes underneath. Scrolling doesn't
 * move the page; it slides the next photo into place. When the last photo
 * is reached the stage releases and the page continues normally.
 *
 * Mobile: photos become a horizontal swipe carousel above the info/actions.
 */
export default function ProductScrollStage({
  images,
  name,
  info,
  actions,
}: {
  /** Ordered photos and videos. */
  images: ProductMedia[];
  name: string;
  info: ReactNode;
  actions: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  const count = images.length;

  // Desktop: map scroll progress through the track to the active photo.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el || !desktop.matches) return;
      const stageHeight = window.innerHeight - HEADER_PX;
      const distance = el.offsetHeight - stageHeight;
      const scrolled = HEADER_PX - el.getBoundingClientRect().top;
      const progress = distance > 0 ? Math.min(1, Math.max(0, scrolled / distance)) : 0;
      setActive(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  // Mobile: track which carousel slide is in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMobileActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { threshold: 0.6 },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  /** Page scroll positions where the stage pins/unpins and where photo `i` shows. */
  const trackGeometry = useCallback(() => {
    const el = trackRef.current;
    if (!el) return null;
    const distance = el.offsetHeight - (window.innerHeight - HEADER_PX);
    const start = el.getBoundingClientRect().top + window.scrollY - HEADER_PX;
    return {
      start,
      end: start + distance,
      photoAt: (i: number) => start + ((i + 0.5) / count) * distance,
    };
  }, [count]);

  /** Scroll the page to the point in the track where photo `i` is shown. */
  const goTo = (i: number) => {
    const g = trackGeometry();
    if (g) window.scrollTo({ top: g.photoAt(i), behavior: "smooth" });
  };

  // Desktop: one wheel notch / trackpad swipe = one photo while pinned.
  // The page position jumps instantly (invisible — the stage is pinned) and
  // the photo's own slide transition does the animating.
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    if (count < 2) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const LOCK_MS = 750; // ≈ the photo slide duration
    let lockedUntil = 0;
    let lastEventAt = 0;
    let lastDelta = 0;

    const onWheel = (e: WheelEvent) => {
      const el = trackRef.current;
      const g = trackGeometry();
      if (!el || !g || !desktop.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const now = performance.now();
      const gap = now - lastEventAt;
      const delta = Math.abs(e.deltaY);
      // Trackpads keep firing decaying "inertia" events after a swipe; only a
      // pause or a fresh, stronger push counts as a new gesture.
      const newGesture = gap > 180 || delta > lastDelta * 1.6;
      lastEventAt = now;
      lastDelta = delta;

      const rect = el.getBoundingClientRect();
      const pinned = rect.top <= HEADER_PX + 2 && rect.bottom >= window.innerHeight - 2;
      if (!pinned || e.deltaY === 0) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const target = activeRef.current + dir;

      e.preventDefault();
      if (now < lockedUntil || !newGesture) return;
      lockedUntil = now + LOCK_MS;

      if (target < 0 || target >= count) {
        // Past the first/last photo: release the stage straight away
        // instead of making the user scroll out the rest of the track.
        window.scrollTo({ top: dir > 0 ? g.end + 4 : g.start - 4, behavior: "instant" });
        lockedUntil = now + 250;
        return;
      }
      window.scrollTo({ top: g.photoAt(target), behavior: "instant" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [count, trackGeometry]);

  const alt = (i: number) => (i === 0 ? name : `${name} view ${i + 1}`);

  return (
    <div
      ref={trackRef}
      style={{ "--pdp-track": `${100 + (count - 1) * SCROLL_PER_IMAGE_SVH}svh` } as CSSProperties}
      className="relative lg:h-[var(--pdp-track)]"
    >
      <div className="flex flex-col lg:sticky lg:top-14 lg:grid lg:h-[calc(100svh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,1fr)] lg:overflow-hidden">
        {/* ── Centre: photos ── */}
        <section aria-label={`${name} images`} className="relative min-w-0 lg:order-2 lg:h-full">
          {/* Mobile swipe carousel */}
          <div className="relative lg:hidden">
            <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
              {images.map((m, i) =>
                m.type === "video" ? (
                  <VideoSlide
                    key={m.url + i}
                    slideRef={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    dataIndex={i}
                    src={m.url}
                    label={`${name} video`}
                    playing={i === mobileActive}
                    className="relative aspect-[2/3] w-full shrink-0 snap-center bg-[var(--aw-secondary)]"
                  />
                ) : (
                  <ZoomSlide
                    key={m.url + i}
                    buttonRef={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    dataIndex={i}
                    src={m.url}
                    alt={alt(i)}
                    priority={i === 0}
                    sizes="100vw"
                    label={`Zoom image ${i + 1} of ${count}`}
                    resetKey={mobileActive}
                    className="relative aspect-[2/3] w-full shrink-0 snap-center bg-[var(--aw-secondary)]"
                  />
                ),
              )}
            </div>
            {count > 1 && (
              <>
                <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-[var(--aw-ink)] backdrop-blur">
                  {mobileActive + 1} / {count}
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full bg-white transition-all duration-300 ${
                        i === mobileActive ? "w-6" : "w-1.5 opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop pinned stage — photos slide in as the page scrolls */}
          <div className="relative hidden h-full overflow-hidden [container-type:size] lg:flex lg:items-center lg:justify-center">
            {/* 2:3 photo frame — the largest that fits the column (width ≤ column, height ≤ stage) */}
            <div className="relative aspect-[2/3] w-[min(100cqw,66.667cqh)] overflow-hidden bg-[var(--aw-secondary)]">
            {images.map((m, i) =>
              m.type === "video" ? (
                <VideoSlide
                  key={m.url + i}
                  src={m.url}
                  label={`${name} video`}
                  playing={i === active}
                  ariaHidden={i !== active}
                  style={{ transform: `translate3d(0, ${(i - active) * 100}%, 0)` }}
                  className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                />
              ) : (
              <ZoomSlide
                key={m.url + i}
                src={m.url}
                alt={alt(i)}
                priority={i === 0}
                sizes="(min-width: 1024px) 45vw, 100vw"
                label={`Zoom image ${i + 1} of ${count}`}
                tabIndex={i === active ? 0 : -1}
                ariaHidden={i !== active}
                resetKey={active}
                style={{ transform: `translate3d(0, ${(i - active) * 100}%, 0)` }}
                wrapperClassName={`absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === active ? "scale-100" : "scale-110"
                }`}
                className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--aw-ink)]"
              />
              ),
            )}
            </div>

            {count > 1 && (
              <>
                <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-0.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-pressed={i === active}
                      className="group/dot flex w-6 justify-center rounded-full py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aw-ink)]"
                    >
                      <span
                        className={`block w-1 rounded-full transition-all duration-500 ${
                          i === active ? "h-8 bg-[var(--aw-ink)]" : "h-2 bg-[var(--aw-ink)]/25 group-hover/dot:bg-[var(--aw-ink)]/50"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="mt-2 text-[10px] font-medium tabular-nums tracking-[0.15em] text-[var(--aw-ink)]/60">
                    {String(active + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
                  </span>
                </div>
                <div
                  aria-hidden
                  className={`pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${
                    active === 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--aw-ink)]/60">
                    Scroll
                  </span>
                  <span className="relative h-8 w-px overflow-hidden bg-[var(--aw-ink)]/15">
                    <span className="absolute inset-0 animate-scroll-cue bg-[var(--aw-ink)]" />
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── Left: description ── */}
        <div className="no-scrollbar lg:order-1 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto">
          {/* my-auto centres when there is room, starts at the top when there isn't */}
          <div className="lg:my-auto">{info}</div>
        </div>

        {/* ── Right: sizing & add to bag ── */}
        <div className="no-scrollbar lg:order-3 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto">
          <div className="lg:my-auto">{actions}</div>
        </div>
      </div>

    </div>
  );
}
