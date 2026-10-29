"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import ProductImage from "@/components/ProductImage";
import { ArrowRight } from "@/components/icons";

export type HeroFeature = {
  name: string;
  href: string;
  image: string;
  price: string;
};

const headline = [["Dress", "for", "your"], ["own", "rhythm."]];

/**
 * Full-bleed Originals hero: slow drifting image with scroll parallax,
 * word-by-word headline rise, and a floating "just dropped" card.
 */
export default function OriginalsHero({ feature }: { feature?: HeroFeature }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    // The hero dims through a sibling overlay rather than fading the content:
    // opacity on the content wrapper would break its backdrop blurs and leave
    // invisible-but-focusable CTAs.
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = Math.min(window.scrollY, vh);
      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      }
      if (shadeRef.current) {
        shadeRef.current.style.opacity = `${Math.min(0.6, y / vh)}`;
      }
    };
    const reset = () => {
      for (const el of [mediaRef.current, contentRef.current, shadeRef.current]) {
        el?.style.removeProperty("transform");
        el?.style.removeProperty("opacity");
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const start = () => {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      update();
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      reset();
    };
    const onMotionChange = () => (motion.matches ? stop() : start());

    if (!motion.matches) start();
    motion.addEventListener("change", onMotionChange);
    return () => {
      motion.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  let wordIndex = 0;

  return (
    <section
      aria-label="Karmalu Originals introduction"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[var(--aw-accent)]"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 animate-hero-drift">
          <ProductImage
            preset="banner"
            src="/Karmalu-images/mainimage.png"
            alt="Karmalu Originals everyday fashion"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-opacity duration-1000"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      <div ref={shadeRef} aria-hidden className="absolute inset-0 bg-black opacity-0" />

      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-10 px-6 pb-12 pt-28 will-change-transform sm:px-10 sm:pb-16 lg:flex-row lg:items-end lg:justify-between lg:px-16"
      >
        <div className="max-w-3xl">
          <p className="rise-in rise-in-1 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-white/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Everyday clothing, made personal
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.9rem,8.5vw,7rem)] font-medium leading-[0.92] tracking-[-0.035em] text-white">
            {headline.map((line, li) => (
              <span key={li} className="block">
                {line.map((word, wi) => {
                  const d = 200 + wordIndex++ * 90;
                  return (
                    <Fragment key={word}>
                      {wi > 0 && " "}
                      <span className="word-mask">
                        <span style={{ "--d": `${d}ms` } as CSSProperties}>
                          {li === 1 && word === "rhythm." ? (
                            <em className="font-serif font-normal italic tracking-[-0.02em]">
                              {word}
                            </em>
                          ) : (
                            word
                          )}
                        </span>
                      </span>
                    </Fragment>
                  );
                })}{" "}
              </span>
            ))}
          </h1>

          <p
            className="rise-in mt-6 max-w-md text-[15px] leading-relaxed text-white/80"
            style={{ animationDelay: "0.75s" }}
          >
            Thoughtful everyday pieces for men and women, easy to wear and made
            to feel like you.
          </p>

          <div
            className="rise-in mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.9s" }}
          >
            <Link
              href="/originals/shop"
              className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--aw-ink)] transition-transform active:scale-[0.97]"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--aw-highlight)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-white">
                Shop now
              </span>
              <ArrowRight
                size={14}
                className="relative transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
              />
            </Link>
            <a
              href="#categories"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white/10"
            >
              Explore categories
            </a>
          </div>
        </div>

        {feature && (
          <Link
            href={feature.href}
            className="rise-in group hidden w-72 shrink-0 items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-3 pr-5 text-white backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/20 lg:flex"
            style={{ animationDelay: "1.1s" }}
          >
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10">
              <ProductImage
                preset="thumb"
                src={feature.image}
                alt={feature.name}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/60">
                Just dropped
              </p>
              <p className="mt-1 truncate font-display text-sm">{feature.name}</p>
              <p className="mt-0.5 text-xs text-white/70">{feature.price}</p>
            </div>
            <ArrowRight
              size={14}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      <div
        aria-hidden
        className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <span className="absolute inset-0 animate-scroll-cue bg-white" />
        </span>
      </div>
    </section>
  );
}
