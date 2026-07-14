"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

/**
 * Full-width lifestyle banner hero (Kibu-inspired).
 * One image, seasonal kicker, bold headline, single Shop Now CTA.
 */
export default function ActivewearHero() {
  return (
    <section
      className="relative bg-[var(--aw-bg)] min-h-[78vh] lg:min-h-[86vh] overflow-hidden"
      aria-label="Featured collection hero"
    >
      <ProductImage
        preset="banner"
        src="/images/activewear/hero/heroimage.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="relative z-10 h-full min-h-[78vh] lg:min-h-[86vh] w-full px-6 sm:px-10 flex flex-col justify-end pb-16 lg:pb-24">
        <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/80 mb-5">
          The Active Lifestyle Edit
        </span>

        <h1 className="font-display text-white text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.01em] max-w-2xl">
          Move with intention.
        </h1>

        <p className="mt-6 max-w-md text-white/85 leading-relaxed text-[15px]">
          Considered activewear for the way you actually live — engineered to
          move, refined enough to wear anywhere.
        </p>

        <Link
          href="/activewear/shop"
          className="mt-9 inline-flex items-center gap-2 self-start px-9 py-4 rounded-full bg-[var(--aw-highlight)] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--aw-maroon)] transition-colors active:scale-[0.98]"
        >
          Shop Now <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
