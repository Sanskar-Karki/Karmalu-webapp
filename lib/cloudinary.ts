import { createHash } from "node:crypto";

/** Folder all admin uploads go into on Cloudinary. */
export const CLOUDINARY_FOLDER = "karmalu";

/** Reads Cloudinary's one-line `CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD` setting. */
function fromUrl() {
  // Strip the <placeholder> brackets Cloudinary's example shows, if pasted along.
  const raw = process.env.CLOUDINARY_URL?.trim().replace(/[<>]/g, "");
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "cloudinary:") return null;
    const cloudName = u.hostname;
    const apiKey = decodeURIComponent(u.username);
    const apiSecret = decodeURIComponent(u.password);
    return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
  } catch {
    return null;
  }
}

function config() {
  // CLOUDINARY_URL wins: it carries a matching key + secret + cloud in one value.
  const url = fromUrl();
  if (url) return url;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function cloudinaryConfigured() {
  return config() !== null;
}

/** Cloudinary request signature: SHA-1 of the sorted params + API secret. */
function sign(params: Record<string, string | number>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Everything the browser needs to upload one file directly to Cloudinary. */
export function createUploadSignature() {
  const c = config();
  if (!c) throw new Error("Cloudinary is not configured. Add CLOUDINARY_* keys to .env.local.");
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: CLOUDINARY_FOLDER, timestamp };
  return {
    cloudName: c.cloudName,
    apiKey: c.apiKey,
    folder: CLOUDINARY_FOLDER,
    timestamp,
    signature: sign(params, c.apiSecret),
  };
}

/** True when a URL is a delivery URL from this account's Cloudinary. */
export function isOwnCloudinaryUrl(url: string) {
  const c = config();
  if (!c) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com" && u.pathname.startsWith(`/${c.cloudName}/`);
  } catch {
    return false;
  }
}

/** Permanently removes an asset from Cloudinary. */
export async function destroyAsset(publicId: string, type: "image" | "video") {
  const c = config();
  if (!c) throw new Error("Cloudinary is not configured.");
  const timestamp = Math.round(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: c.apiKey,
    signature: sign(params, c.apiSecret),
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/${type}/destroy`, {
    method: "POST",
    body,
  });
  const json = (await res.json().catch(() => ({}))) as { result?: string; error?: { message: string } };
  if (!res.ok || (json.result !== "ok" && json.result !== "not found")) {
    throw new Error(json.error?.message ?? `Cloudinary delete failed (${json.result ?? res.status})`);
  }
}
