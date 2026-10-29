"use client";

import { useEffect, useRef, useState, type CSSProperties, type Ref } from "react";

/**
 * Product video slide: muted, looping, plays only while it's the visible
 * slide. With reduced motion it doesn't autoplay and shows controls instead.
 */
export default function VideoSlide({
  src,
  label,
  playing,
  className = "",
  style,
  ariaHidden,
  dataIndex,
  slideRef,
}: {
  src: string;
  label: string;
  playing: boolean;
  className?: string;
  style?: CSSProperties;
  ariaHidden?: boolean;
  dataIndex?: number;
  slideRef?: Ref<HTMLDivElement>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, reducedMotion]);

  return (
    <div ref={slideRef} data-index={dataIndex} aria-hidden={ariaHidden} style={style} className={`overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reducedMotion}
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
