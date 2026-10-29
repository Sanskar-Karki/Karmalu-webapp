"use client";

import { useEffect, useRef, useState } from "react";
import { listMedia } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/admin-types";
import Uploader from "@/components/admin/Uploader";
import MediaThumb from "@/components/admin/MediaThumb";
import { buttonPrimary, buttonSecondary } from "@/lib/admin-ui";

/** Modal for choosing library photos/videos (or uploading new ones) for a product. */
export default function MediaPicker({
  open,
  onClose,
  onPick,
  exclude,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (assets: MediaAsset[]) => void;
  /** URLs already on the product. */
  exclude: string[];
}) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Latest onClose without re-running the open effect on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    setSelected([]);
    setError(null);
    listMedia().then((res) => (res.ok ? setAssets(res.data) : setError(res.error)));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const available = (assets ?? []).filter((a) => !exclude.includes(a.url));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add photos and videos"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-[#f6f5f2] sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-black/[0.07] bg-white px-6 py-4">
          <h2 className="font-semibold">Add photos &amp; videos</h2>
          <button type="button" onClick={onClose} className="text-sm text-black/55 hover:text-black">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Uploader
            compact
            onUploaded={(a) => {
              setAssets((as) => [a, ...(as ?? [])]);
              setSelected((s) => [...s, a.id]);
            }}
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {assets === null && !error ? (
            <p className="mt-8 text-center text-sm text-black/45">Loading library…</p>
          ) : available.length === 0 ? (
            <p className="mt-8 text-center text-sm text-black/45">
              No other files in the library yet — upload some above.
            </p>
          ) : (
            <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {available.map((a) => {
                const order = selected.indexOf(a.id);
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => toggle(a.id)}
                      aria-pressed={order >= 0}
                      className={`relative block w-full overflow-hidden rounded-xl ring-offset-2 transition ${
                        order >= 0 ? "ring-2 ring-[#59634a]" : "hover:opacity-85"
                      }`}
                    >
                      <MediaThumb url={a.url} type={a.type} className="aspect-square" />
                      {order >= 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#59634a] text-xs font-semibold text-white">
                          {order + 1}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-black/[0.07] bg-white px-6 py-4">
          <button type="button" onClick={onClose} className={buttonSecondary}>
            Cancel
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => {
              const byId = new Map((assets ?? []).map((a) => [a.id, a]));
              onPick(selected.map((id) => byId.get(id)!).filter(Boolean));
              onClose();
            }}
            className={buttonPrimary}
          >
            Add {selected.length || ""} {selected.length === 1 ? "file" : "files"}
          </button>
        </div>
      </div>
    </div>
  );
}
