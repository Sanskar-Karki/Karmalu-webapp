import Image from "next/image";

/** Square preview for a photo or video in the admin. */
export default function MediaThumb({
  url,
  type,
  className = "",
  sizes = "160px",
}: {
  url: string;
  type: "image" | "video";
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`relative block overflow-hidden bg-black/[0.05] ${className}`}>
      {type === "video" ? (
        <>
          <video src={url} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
            Video
          </span>
        </>
      ) : (
        <Image src={url} alt="" fill sizes={sizes} className="object-cover" unoptimized={url.startsWith("/")} />
      )}
    </span>
  );
}
