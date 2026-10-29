"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient, requireAdmin } from "@/lib/admin-auth";
import { CATALOG_TAG } from "@/lib/catalog-server";
import { createUploadSignature, destroyAsset, isOwnCloudinaryUrl } from "@/lib/cloudinary";
import { staticCatalogData } from "@/data/catalog";
import { HOME_PICKS_LIMIT, NEW_BADGE } from "@/lib/home-picks";
import { hasMeasurements, MAX_COLUMNS, normalizeSizeChart, type SizeChart } from "@/lib/size-chart";
import type { ActionResult, AdminProductInput, MediaAsset, ProductStatus } from "@/lib/admin-types";
import type { Brand } from "@/types";

const BRANDS: Brand[] = ["decor", "originals"];
const STATUSES: ProductStatus[] = ["draft", "published", "archived"];

/** Storefront pages read a cached catalogue — refresh it after every change. */
function refreshStorefront() {
  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

function fail(error: string) {
  return { ok: false as const, error };
}

/* ── Auth ─────────────────────────────────────────────────────────── */

export async function signIn(_: unknown, formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await adminClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Network/config failures (status 0 / fetch errors) are not wrong passwords.
    const unreachable = !error.status || error.name === "AuthRetryableFetchError";
    return {
      error: unreachable
        ? "Can't reach the database. Check the Supabase settings in .env.local and that the project isn't paused."
        : "That email and password don't match an account.",
    };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access. Ask the owner to add your email." };
  }
  redirect(next.startsWith("/admin") ? next : "/admin/products");
}

export async function signOut() {
  const supabase = await adminClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ── Products ─────────────────────────────────────────────────────── */

const HEX = /^#[0-9a-f]{6}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validMediaUrl(url: string) {
  return url.startsWith("/images/") || url.startsWith("/Karmalu-images/") || url.startsWith("https://");
}

function validateSizeChart(chart: SizeChart): string | null {
  if (!chart || !Array.isArray(chart.columns) || !Array.isArray(chart.rows)) return "The size chart is invalid.";
  if (chart.unit !== "in" && chart.unit !== "cm") return "Choose inches or cm for the size chart.";
  if (chart.columns.length === 0) return "The size chart needs at least one column.";
  if (chart.columns.length > MAX_COLUMNS) return `The size chart can have up to ${MAX_COLUMNS} columns.`;
  const names = chart.columns.map((c) => String(c).trim());
  if (names.some((n) => !n)) return "Every size chart column needs a name.";
  if (names.some((n) => n.length > 24)) return "Keep size chart column names under 24 characters.";
  if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) return "Two size chart columns have the same name.";
  for (const row of chart.rows) {
    if (!row.size || !Array.isArray(row.values) || row.values.length !== names.length) return "The size chart is invalid.";
    if (row.values.some((v) => v !== null && (!Number.isFinite(v) || v < 0 || v > 1000)))
      return `Check the measurements for size ${row.size} — use numbers in ${chart.unit === "in" ? "inches" : "cm"}.`;
  }
  return null;
}

/** Trimmed chart with rows for the product's sizes only — or null when nothing is filled in. */
function cleanSizeChart(chart: SizeChart, sizes: string[]): SizeChart | null {
  const cleaned: SizeChart = {
    unit: chart.unit,
    columns: chart.columns.map((c) => c.trim()),
    rows: chart.rows.filter((r) => sizes.includes(r.size)),
  };
  return hasMeasurements(cleaned) ? cleaned : null;
}

function validateProduct(input: AdminProductInput): string | null {
  if (!BRANDS.includes(input.brand)) return "Choose a shop.";
  if (!input.name?.trim()) return "Add a product name.";
  if (!SLUG.test(input.slug ?? "")) return "The URL name can only use lowercase letters, numbers and dashes.";
  if (!input.categorySlug) return "Choose a category.";
  if (!Number.isFinite(input.price) || input.price < 0) return "Enter a valid price.";
  if (input.oldPrice !== null && (!Number.isFinite(input.oldPrice) || input.oldPrice <= input.price))
    return "The original price must be higher than the sale price.";
  if (!STATUSES.includes(input.status)) return "Choose a status.";
  if (input.colors.some((c) => !HEX.test(c.hex) || !c.label.trim())) return "Every colour needs a name and a colour.";
  const chartProblem = validateSizeChart(input.sizeChart);
  if (chartProblem) return chartProblem;
  if (input.media.some((m) => !validMediaUrl(m.url) || (m.type !== "image" && m.type !== "video")))
    return "One of the photos has an invalid address.";
  if (input.status === "published" && !input.media.some((m) => m.type === "image"))
    return "Add at least one photo before publishing.";
  if (input.hoverUrl && !input.media.some((m) => m.url === input.hoverUrl)) return "The hover photo must be one of this product's photos.";
  return null;
}

function toRow(input: AdminProductInput) {
  return {
    brand: input.brand,
    name: input.name.trim(),
    slug: input.slug,
    category_slug: input.categorySlug,
    price: input.price,
    old_price: input.oldPrice,
    description: input.description.trim(),
    details: input.details.map((d) => d.trim()).filter(Boolean),
    badge: input.badge || null,
    sizes: input.sizes,
    size_chart: cleanSizeChart(input.sizeChart, input.sizes),
    colors: input.colors.map((c) => ({ hex: c.hex.toUpperCase(), label: c.label.trim() })),
    media: input.media.map(({ url, type, publicId }) => ({ url, type, ...(publicId ? { publicId } : {}) })),
    hover_url: input.hoverUrl,
    status: input.status,
  };
}

export async function saveProduct(input: AdminProductInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();
  const problem = validateProduct(input);
  if (problem) return fail(problem);

  // The category must exist in this shop (once categories live in the database).
  const { data: shopCategories } = await supabase.from("catalog_categories").select("slug").eq("brand", input.brand);
  if (shopCategories?.length && !shopCategories.some((c) => c.slug === input.categorySlug))
    return fail("That category doesn't exist in this shop any more — choose another.");

  const row = toRow(input);
  let query;
  if (input.id) {
    query = supabase.from("catalog_products").update(row).eq("id", input.id).select("id").single();
  } else {
    // New products go to the end of the shop's "All products" order.
    const { data: last } = await supabase
      .from("catalog_products")
      .select("position")
      .eq("brand", input.brand)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    query = supabase
      .from("catalog_products")
      .insert({ ...row, position: (last?.position ?? -1) + 1 })
      .select("id")
      .single();
  }
  const { data, error } = await query;
  if (error) {
    if (error.code === "23505") return fail("Another product in this shop already uses that URL name.");
    return fail(error.message);
  }
  // New Arrivals only holds products tagged "New" — drop it if the tag was removed.
  // (Ignored if supabase/home_picks.sql hasn't been run yet.)
  if (input.badge !== NEW_BADGE) {
    await supabase.from("catalog_products").update({ home_rank: null }).eq("id", data.id).not("home_rank", "is", null);
  }
  refreshStorefront();
  revalidatePath("/admin/products");
  revalidatePath("/admin/new-arrivals");
  return { ok: true, data: { id: data.id as string } };
}

export async function setProductStatus(id: string, status: ProductStatus): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!STATUSES.includes(status)) return fail("Unknown status.");
  if (status === "published") {
    const { data } = await supabase.from("catalog_products").select("media").eq("id", id).single();
    const media = (data?.media ?? []) as { type: string }[];
    if (!media.some((m) => m.type === "image")) return fail("Add at least one photo before publishing.");
  }
  const { error } = await supabase.from("catalog_products").update({ status }).eq("id", id);
  if (error) return fail(error.message);
  refreshStorefront();
  revalidatePath("/admin/products");
  return { ok: true };
}

/** Permanent delete — only allowed once a product is archived. */
export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("catalog_products").select("status").eq("id", id).single();
  if (data?.status !== "archived") return fail("Archive the product first, then delete it.");
  const { error } = await supabase.from("catalog_products").delete().eq("id", id);
  if (error) return fail(error.message);
  refreshStorefront();
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function duplicateProduct(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();
  const { data: src, error } = await supabase.from("catalog_products").select("*").eq("id", id).single();
  if (error || !src) return fail("Product not found.");
  const copy = { ...src };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  copy.name = `${src.name} (copy)`;
  copy.slug = `${src.slug}-copy-${Math.random().toString(36).slice(2, 6)}`;
  copy.status = "draft";
  if ("home_rank" in copy) copy.home_rank = null; // a copy isn't on the home page
  const { data, error: insertError } = await supabase.from("catalog_products").insert(copy).select("id").single();
  if (insertError) return fail(insertError.message);
  revalidatePath("/admin/products");
  return { ok: true, data: { id: data.id as string } };
}

/**
 * One-time import of the products and categories that ship in the code.
 * Existing rows are left untouched, so it is safe to run again.
 */
export async function importBuiltInCatalog(): Promise<ActionResult<{ products: number; categories: number }>> {
  const { supabase } = await requireAdmin();

  const categories = BRANDS.flatMap((brand) =>
    staticCatalogData[brand].categories.map((c, i) => ({
      brand,
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      image: c.image,
      position: i,
    })),
  );
  const products = BRANDS.flatMap((brand) =>
    staticCatalogData[brand].products.map((p, i) => {
      const photos = p.gallery.length ? p.gallery : [p.image];
      return {
        id: p.id,
        brand,
        slug: p.slug,
        name: p.name,
        category_slug: p.categorySlug,
        tags: p.tags ?? [],
        price: p.price,
        old_price: p.oldPrice ?? null,
        description: p.description,
        details: p.details,
        badge: p.badge ?? null,
        rating: p.rating,
        reviews: p.reviews,
        sizes: p.sizes ?? [],
        size_chart: normalizeSizeChart(p.sizeChart),
        colors: p.colors ?? [],
        media: photos.filter(Boolean).map((url) => ({ url, type: "image" })),
        hover_url: p.hoverImage && photos.includes(p.hoverImage) ? p.hoverImage : null,
        status: "published",
        position: i,
      };
    }),
  );

  const cat = await supabase
    .from("catalog_categories")
    .upsert(categories, { onConflict: "brand,slug", ignoreDuplicates: true })
    .select("slug");
  if (cat.error) return fail(cat.error.message);
  const prod = await supabase
    .from("catalog_products")
    .upsert(products, { onConflict: "id", ignoreDuplicates: true })
    .select("id");
  if (prod.error) return fail(prod.error.message);

  refreshStorefront();
  revalidatePath("/admin/products");
  return { ok: true, data: { products: prod.data.length, categories: cat.data.length } };
}

/* ── Categories ───────────────────────────────────────────────────── */

/** URL names that would collide with the shop's own pages (/originals/shop, …). */
const RESERVED_CATEGORY_SLUGS = new Set(["shop", "product", "products", "cart", "checkout", "about", "faq", "contact", "admin", "api"]);

export interface CategoryInput {
  brand: Brand;
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

/** Creates a category (`isNew`) or updates name/tagline/image. The URL name never changes after creation. */
export async function saveCategory(input: CategoryInput, isNew: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!BRANDS.includes(input.brand)) return fail("Choose a shop.");
  const name = input.name.trim();
  if (!name) return fail("Add a category name.");
  if (name.length > 60) return fail("Keep the name under 60 characters.");
  if (!input.image) return fail("Add a photo — it's shown on the home page and category banner.");
  if (!validMediaUrl(input.image)) return fail("The photo has an invalid address.");

  const row = { name, tagline: input.tagline.trim().slice(0, 160), image: input.image };

  if (isNew) {
    if (!SLUG.test(input.slug)) return fail("The URL name can only use lowercase letters, numbers and dashes.");
    if (RESERVED_CATEGORY_SLUGS.has(input.slug)) return fail(`“${input.slug}” is used by another page — pick a different URL name.`);
    const { data: last } = await supabase
      .from("catalog_categories")
      .select("position")
      .eq("brand", input.brand)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase
      .from("catalog_categories")
      .insert({ ...row, brand: input.brand, slug: input.slug, position: (last?.position ?? -1) + 1 });
    if (error) {
      if (error.code === "23505") return fail("This shop already has a category with that URL name.");
      return fail(error.message);
    }
  } else {
    const { data, error } = await supabase
      .from("catalog_categories")
      .update(row)
      .eq("brand", input.brand)
      .eq("slug", input.slug)
      .select("slug");
    if (error) return fail(error.message);
    if (!data?.length) return fail("That category no longer exists.");
  }

  refreshStorefront();
  revalidatePath("/admin/categories");
  return { ok: true };
}

/**
 * Deletes a category. If products still use it they're moved to `moveTo`
 * first (required in that case). A shop always keeps at least one category.
 */
export async function deleteCategory(brand: Brand, slug: string, moveTo?: string): Promise<ActionResult<{ moved: number }>> {
  const { supabase } = await requireAdmin();

  const { data: cats } = await supabase.from("catalog_categories").select("slug").eq("brand", brand);
  if (!cats?.some((c) => c.slug === slug)) return fail("That category no longer exists.");
  if (cats.length <= 1) return fail("A shop needs at least one category. Add another before deleting this one.");

  const { count } = await supabase
    .from("catalog_products")
    .select("id", { count: "exact", head: true })
    .eq("brand", brand)
    .eq("category_slug", slug);
  const moved = count ?? 0;

  if (moved > 0) {
    if (!moveTo || moveTo === slug || !cats.some((c) => c.slug === moveTo))
      return fail(`${moved} product${moved === 1 ? " uses" : "s use"} this category — choose where to move ${moved === 1 ? "it" : "them"}.`);
    const { error: moveError } = await supabase
      .from("catalog_products")
      .update({ category_slug: moveTo })
      .eq("brand", brand)
      .eq("category_slug", slug);
    if (moveError) return fail(moveError.message);
  }

  const { error } = await supabase.from("catalog_categories").delete().eq("brand", brand).eq("slug", slug);
  if (error) return fail(error.message);

  refreshStorefront();
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { ok: true, data: { moved } };
}

/** Saves the display order of a shop's categories (navbar, filters, home page). */
export async function reorderCategories(brand: Brand, slugs: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const results = await Promise.all(
    slugs.map((slug, position) =>
      supabase.from("catalog_categories").update({ position }).eq("brand", brand).eq("slug", slug),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(failed.error.message);
  refreshStorefront();
  revalidatePath("/admin/categories");
  return { ok: true };
}

/* ── All products order ───────────────────────────────────────────── */

/**
 * Sets the order products appear in a shop when browsing "All" (and within
 * each category page, which keeps the same relative order).
 */
export async function saveProductOrder(brand: Brand, ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!BRANDS.includes(brand)) return fail("Choose a shop.");
  const unique = [...new Set(ids)];

  const { data, error } = await supabase.from("catalog_products").select("id").eq("brand", brand).in("id", unique);
  if (error) return fail(error.message);
  if ((data ?? []).length !== unique.length) return fail("Some of these products no longer exist — refresh the page and try again.");

  const results = await Promise.all(
    unique.map((id, position) => supabase.from("catalog_products").update({ position }).eq("id", id).eq("brand", brand)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(failed.error.message);

  refreshStorefront();
  revalidatePath("/admin/product-order");
  revalidatePath("/admin/products");
  return { ok: true };
}

/* ── Home page picks ──────────────────────────────────────────────── */

const HOME_PICKS_MIGRATION_HINT =
  "The database needs a small update first: run supabase/home_picks.sql in the Supabase SQL editor, then try again.";

function isMissingColumn(error: { code?: string; message?: string }) {
  return error.code === "42703" || error.code === "PGRST204" || /home_rank/.test(error.message ?? "");
}

/**
 * Sets which published products appear in a shop's home page section
 * ("New Arrivals" / "Featured this season") and in what order.
 * An empty list switches the section back to automatic.
 */
export async function saveHomePicks(brand: Brand, ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!BRANDS.includes(brand)) return fail("Choose a shop.");
  const unique = [...new Set(ids)];
  if (unique.length > HOME_PICKS_LIMIT) return fail(`Pick up to ${HOME_PICKS_LIMIT} products.`);

  if (unique.length) {
    const { data, error } = await supabase
      .from("catalog_products")
      .select("id, name, status, badge")
      .eq("brand", brand)
      .in("id", unique);
    if (error) return fail(error.message);
    if ((data ?? []).length !== unique.length) return fail("Some of these products no longer exist in this shop.");
    const hidden = (data ?? []).filter((p) => p.status !== "published");
    if (hidden.length) return fail(`Only published products can be shown: ${hidden.map((p) => p.name).join(", ")}.`);
    const notNew = (data ?? []).filter((p) => p.badge !== NEW_BADGE);
    if (notNew.length)
      return fail(`Only products tagged “New” can be in New Arrivals: ${notNew.map((p) => p.name).join(", ")}.`);
  }

  // Clear the shop's current picks, then number the new ones in order.
  const cleared = await supabase
    .from("catalog_products")
    .update({ home_rank: null })
    .eq("brand", brand)
    .not("home_rank", "is", null);
  if (cleared.error) return fail(isMissingColumn(cleared.error) ? HOME_PICKS_MIGRATION_HINT : cleared.error.message);

  const results = await Promise.all(
    unique.map((id, rank) => supabase.from("catalog_products").update({ home_rank: rank }).eq("id", id).eq("brand", brand)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(isMissingColumn(failed.error) ? HOME_PICKS_MIGRATION_HINT : failed.error.message);

  refreshStorefront();
  revalidatePath("/admin/new-arrivals");
  return { ok: true };
}

/* ── Media library ────────────────────────────────────────────────── */

export async function getUploadSignature(): Promise<
  ActionResult<ReturnType<typeof createUploadSignature>>
> {
  await requireAdmin();
  try {
    return { ok: true, data: createUploadSignature() };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Upload is not available.");
  }
}

type CloudinaryUpload = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  original_filename?: string;
};

/** Saves a finished Cloudinary upload into the media library. */
export async function recordUpload(upload: CloudinaryUpload): Promise<ActionResult<MediaAsset>> {
  const { supabase } = await requireAdmin();
  if (!isOwnCloudinaryUrl(upload.secure_url)) return fail("Upload came from an unexpected address.");
  const type = upload.resource_type === "video" ? "video" : "image";
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      url: upload.secure_url,
      public_id: upload.public_id,
      type,
      width: upload.width ?? null,
      height: upload.height ?? null,
      bytes: upload.bytes ?? null,
      format: upload.format ?? null,
      original_filename: upload.original_filename ?? null,
    })
    .select("*")
    .single();
  if (error) return fail(error.message);
  revalidatePath("/admin/media");
  return { ok: true, data: data as MediaAsset };
}

export async function listMedia(): Promise<ActionResult<MediaAsset[]>> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return fail(error.message);
  return { ok: true, data: (data ?? []) as MediaAsset[] };
}

/** Deletes from Cloudinary and the library. Refuses while a product still uses it. */
export async function deleteMedia(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: asset, error } = await supabase.from("media_assets").select("*").eq("id", id).single();
  if (error || !asset) return fail("File not found.");

  const { data: users } = await supabase
    .from("catalog_products")
    .select("name")
    .contains("media", [{ url: asset.url }]);
  if (users && users.length > 0) {
    return fail(`Still used by: ${users.map((u) => u.name).join(", ")}. Remove it from those products first.`);
  }

  try {
    await destroyAsset(asset.public_id, asset.type);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not delete from Cloudinary.");
  }
  const { error: delError } = await supabase.from("media_assets").delete().eq("id", id);
  if (delError) return fail(delError.message);
  revalidatePath("/admin/media");
  return { ok: true };
}
