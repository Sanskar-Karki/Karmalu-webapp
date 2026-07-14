"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import {
  IMAGE_QUALITY,
  CARD_SIZES,
  DETAIL_SIZES,
  BANNER_SIZES,
} from "@/lib/image";

type Preset = "card" | "detail" | "banner" | "thumb";

const PRESET_QUALITY: Record<Preset, number> = {
  card: IMAGE_QUALITY.card,
  detail: IMAGE_QUALITY.detail,
  banner: IMAGE_QUALITY.banner,
  thumb: IMAGE_QUALITY.card,
};

const PRESET_SIZES: Record<Preset, string> = {
  card: CARD_SIZES,
  detail: DETAIL_SIZES,
  banner: BANNER_SIZES,
  thumb: "72px",
};

type ProductImageProps = Omit<ImageProps, "quality" | "sizes" | "placeholder"> & {
  /** Sizing/quality preset — picks the right srcset breakpoints and compression for the context. */
  preset: Preset;
  /** Override the preset's default `sizes` string when the layout needs something custom. */
  sizes?: string;
  /** Override the preset's default quality. */
  quality?: number;
  /** Fires the fade-in once the optimized image has actually loaded. */
  className?: string;
};

/**
 * Thin, typed wrapper around `next/image` that standardizes sizing, quality
 * and loading behavior across product cards, detail galleries and banners.
 *
 * Shows a shimmer skeleton until the image loads, then fades it in — a
 * pragmatic stand-in for `placeholder="blur"`, which next/image can only
 * auto-generate for locally-imported (not remote-URL) images. Once real
 * product photos live under /public/images and are statically imported,
 * swap to `placeholder="blur"` with zero API changes here.
 */
export default function ProductImage({
  preset,
  sizes,
  quality,
  className = "",
  alt,
  onLoad,
  ...rest
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/5 via-black/10 to-black/5 bg-[length:200%_200%]"
        />
      )}
      <Image
        {...rest}
        alt={alt}
        quality={quality ?? PRESET_QUALITY[preset]}
        sizes={sizes ?? PRESET_SIZES[preset]}
        loading={rest.priority ? undefined : "lazy"}
        className={`${loaded ? "" : "opacity-0"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
