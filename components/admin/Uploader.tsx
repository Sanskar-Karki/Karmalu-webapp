"use client";

import { useRef, useState } from "react";
import { getUploadSignature, recordUpload } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/admin-types";
import { useToast } from "@/components/admin/Toaster";

/** Cloudinary free-plan limits. */
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;

type Job = { id: string; name: string; progress: number; error?: string; done?: boolean };

function uploadToCloudinary(
  file: File,
  sig: { cloudName: string; apiKey: string; folder: string; timestamp: number; signature: string },
  onProgress: (pct: number) => void,
) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sig.apiKey);
    body.append("timestamp", String(sig.timestamp));
    body.append("folder", sig.folder);
    body.append("signature", sig.signature);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let json: Record<string, unknown> = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        /* handled below */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(json);
      else reject(new Error((json.error as { message?: string })?.message ?? `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.send(body);
  });
}

/** Drag-and-drop / click uploader for photos and videos. */
export default function Uploader({
  onUploaded,
  compact = false,
}: {
  onUploaded: (asset: MediaAsset) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const update = (id: string, patch: Partial<Job>) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    let uploaded = 0;
    let firstError: string | null = null;
    const fail = (id: string, error: string) => {
      update(id, { error });
      firstError ??= error;
    };

    for (const file of list) {
      const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;
      setJobs((js) => [...js, { id, name: file.name, progress: 0 }]);

      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        fail(id, "Only photos and videos can be uploaded.");
        continue;
      }
      const limit = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
      if (file.size > limit * 1024 * 1024) {
        fail(id, `Too large — ${isVideo ? "videos" : "photos"} can be up to ${limit} MB.`);
        continue;
      }

      const sig = await getUploadSignature();
      if (!sig.ok) {
        fail(id, sig.error);
        continue;
      }
      try {
        const result = await uploadToCloudinary(file, sig.data, (progress) => update(id, { progress }));
        const saved = await recordUpload(result as Parameters<typeof recordUpload>[0]);
        if (!saved.ok) {
          fail(id, saved.error);
          continue;
        }
        uploaded++;
        update(id, { progress: 100, done: true });
        onUploaded(saved.data);
        setTimeout(() => setJobs((js) => js.filter((j) => j.id !== id)), 2500);
      } catch (e) {
        fail(id, e instanceof Error ? e.message : "Upload failed.");
      }
    }

    // One summary toast per batch.
    const failed = list.length - uploaded;
    const noun = (n: number) => (n === 1 ? "file" : "files");
    if (failed === 0) {
      toast.success(uploaded === 1 ? `Uploaded “${list[0].name}”` : `${uploaded} files uploaded`, "Ready to add to products.");
    } else if (uploaded === 0) {
      toast.error(`Upload failed`, `${failed} ${noun(failed)} couldn't be uploaded. ${firstError ?? ""}`.trim());
    } else {
      toast.error(`${uploaded} uploaded, ${failed} failed`, firstError ?? undefined);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${
          compact ? "gap-1 px-4 py-5" : "gap-2 px-6 py-10"
        } ${dragging ? "border-[#59634a] bg-[#59634a]/5" : "border-black/15 bg-white hover:border-black/30"}`}
      >
        <span className="text-sm font-medium">Drop photos or videos here, or click to choose</span>
        <span className="text-xs text-black/45">
          Photos up to {MAX_IMAGE_MB} MB · videos up to {MAX_VIDEO_MB} MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {jobs.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {jobs.map((j) => (
            <li key={j.id} className="rounded-xl bg-white px-3.5 py-2.5 text-xs shadow-[0_1px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate">{j.name}</span>
                <span className={j.error ? "text-red-600" : j.done ? "text-emerald-700" : "text-black/50"}>
                  {j.error ? "Failed" : j.done ? "Uploaded" : `${j.progress}%`}
                </span>
              </div>
              {j.error ? (
                <p className="mt-1 text-red-600">{j.error}</p>
              ) : (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <div className="h-full rounded-full bg-[#59634a] transition-[width]" style={{ width: `${j.progress}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
