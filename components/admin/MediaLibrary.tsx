"use client";

import { useState, useTransition } from "react";
import { deleteMedia } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/admin-types";
import Uploader from "@/components/admin/Uploader";
import MediaThumb from "@/components/admin/MediaThumb";
import { useToast } from "@/components/admin/Toaster";

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibrary({ initial }: { initial: MediaAsset[] }) {
  const [assets, setAssets] = useState(initial);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  const visible = assets.filter((a) => filter === "all" || a.type === filter);

  const fileName = (a: MediaAsset) => a.original_filename ?? "File";

  const remove = (a: MediaAsset) =>
    start(async () => {
      let res: Awaited<ReturnType<typeof deleteMedia>>;
      try {
        res = await deleteMedia(a.id);
      } catch {
        res = { ok: false, error: "The connection dropped. Check your internet and try again." };
      }
      setConfirmId(null);
      if (res.ok) {
        setAssets((as) => as.filter((x) => x.id !== a.id));
        toast.success(`Deleted “${fileName(a)}”`, "Removed from Cloudinary and the library.");
      } else {
        toast.error(`Couldn't delete “${fileName(a)}”`, res.error);
      }
    });

  const copy = async (a: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(a.url);
      setCopied(a.id);
      setTimeout(() => setCopied(null), 1500);
      toast.success("Link copied", fileName(a), { duration: 2000 });
    } catch {
      toast.error("Couldn't copy the link", "Your browser blocked clipboard access.");
    }
  };

  return (
    <div className="mt-6">
      <Uploader onUploaded={(a) => setAssets((as) => [a, ...as])} />

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="flex gap-1 rounded-2xl bg-white p-1">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                filter === f ? "bg-[#14100f] text-white" : "text-black/60 hover:text-black"
              }`}
            >
              {f === "all" ? `All (${assets.length})` : f === "image" ? "Photos" : "Videos"}
            </button>
          ))}
        </div>
      </div>


      {visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-black/45">Nothing uploaded yet.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((a) => (
            <li key={a.id} className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
              <a href={a.url} target="_blank" rel="noreferrer">
                <MediaThumb url={a.url} type={a.type} className="aspect-square" sizes="(max-width: 640px) 50vw, 220px" />
              </a>
              <div className="p-3">
                <p className="truncate text-xs font-medium" title={a.original_filename ?? a.public_id}>
                  {a.original_filename ?? a.public_id}
                </p>
                <p className="mt-0.5 text-[11px] text-black/45">
                  {[a.width && a.height ? `${a.width}×${a.height}` : null, formatBytes(a.bytes)].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-2 flex gap-3 text-xs">
                  <button type="button" onClick={() => copy(a)} className="font-medium hover:underline">
                    {copied === a.id ? "Copied" : "Copy link"}
                  </button>
                  {confirmId === a.id ? (
                    <>
                      <button type="button" disabled={pending} onClick={() => remove(a)} className="font-medium text-red-600 hover:underline">
                        Confirm
                      </button>
                      <button type="button" onClick={() => setConfirmId(null)} className="text-black/50 hover:underline">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmId(a.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
