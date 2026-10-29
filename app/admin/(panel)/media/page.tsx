import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import type { MediaAsset } from "@/lib/admin-types";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Photos & videos" };

export default async function AdminMediaPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Photos &amp; videos</h1>
      <p className="mt-1 text-sm text-black/55">
        Everything uploaded here is stored on Cloudinary and can be added to any product.
      </p>
      {!cloudinaryConfigured() && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-medium">Uploads aren&apos;t set up yet.</p>
          <p className="mt-1">
            Add <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> and{" "}
            <code>CLOUDINARY_API_SECRET</code> to <code>.env.local</code>, then restart the site.
          </p>
        </div>
      )}
      {error ? (
        <p className="mt-6 rounded-2xl bg-red-50 p-5 text-sm text-red-800">{error.message}</p>
      ) : (
        <MediaLibrary initial={(data ?? []) as MediaAsset[]} />
      )}
    </div>
  );
}
