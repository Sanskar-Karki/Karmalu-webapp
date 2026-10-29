"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, reorderCategories, saveCategory } from "@/app/admin/actions";
import type { CategoryRow } from "@/lib/catalog-server";
import { slugify } from "@/lib/admin-types";
import { buttonPrimary, buttonSecondary, inputClass, labelClass } from "@/lib/admin-ui";
import MediaPicker from "@/components/admin/MediaPicker";
import MediaThumb from "@/components/admin/MediaThumb";
import { useToast } from "@/components/admin/Toaster";
import type { Brand } from "@/types";

export type CategoryUsage = Record<string, { live: number; total: number }>;

const SHOPS: { value: Brand; label: string; path: string }[] = [
  { value: "originals", label: "Originals", path: "/originals" },
  { value: "decor", label: "Living & Decor", path: "/living-decor" },
];

type Draft = { slug: string; name: string; tagline: string; image: string; isNew: boolean };

const NETWORK_ERROR = "The connection dropped. Check your internet and try again.";

export default function CategoriesManager({ categories, usage }: { categories: CategoryRow[]; usage: CategoryUsage }) {
  const router = useRouter();
  const toast = useToast();
  const [shop, setShop] = useState<Brand>("originals");
  const [order, setOrder] = useState<Record<Brand, string[]>>(() => orderFrom(categories));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleting, setDeleting] = useState<{ slug: string; moveTo: string } | null>(null);
  const [pending, start] = useTransition();

  // Server data changed (after a save/delete) — re-sync the local order.
  useEffect(() => setOrder(orderFrom(categories)), [categories]);

  const shopInfo = SHOPS.find((s) => s.value === shop)!;
  const bySlug = new Map(categories.filter((c) => c.brand === shop).map((c) => [c.slug, c]));
  const list = order[shop].map((slug) => bySlug.get(slug)).filter((c): c is CategoryRow => Boolean(c));
  const count = (slug: string) => usage[`${shop}:${slug}`] ?? { live: 0, total: 0 };

  /* ── Reorder ── */
  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= list.length) return;
    const previous = order[shop];
    const next = [...previous];
    [next[index], next[to]] = [next[to], next[index]];
    setOrder((o) => ({ ...o, [shop]: next }));
    start(async () => {
      try {
        const res = await reorderCategories(shop, next);
        if (!res.ok) throw new Error(res.error);
        router.refresh();
      } catch (e) {
        setOrder((o) => ({ ...o, [shop]: previous }));
        toast.error("Couldn't change the order", e instanceof Error && e.message !== "Failed to fetch" ? e.message : NETWORK_ERROR);
      }
    });
  };

  /* ── Add / edit ── */
  const openNew = () => {
    setSlugTouched(false);
    setDraft({ slug: "", name: "", tagline: "", image: "", isNew: true });
  };
  const openEdit = (c: CategoryRow) => {
    setDraft({ slug: c.slug, name: c.name, tagline: c.tagline, image: c.image, isNew: false });
  };

  const submit = () => {
    if (!draft) return;
    const d = draft;
    start(async () => {
      let res: Awaited<ReturnType<typeof saveCategory>>;
      try {
        res = await saveCategory({ brand: shop, slug: d.slug, name: d.name, tagline: d.tagline, image: d.image }, d.isNew);
      } catch {
        toast.error("Couldn't save the category", NETWORK_ERROR);
        return;
      }
      if (!res.ok) {
        toast.error("Couldn't save the category", res.error);
        return;
      }
      toast.success(d.isNew ? `“${d.name.trim()}” added` : `“${d.name.trim()}” saved`, `Showing in ${shopInfo.label}.`, {
        action: { label: "View on site", href: `${shopInfo.path}/${d.slug}`, external: true },
      });
      setDraft(null);
      router.refresh();
    });
  };

  /* ── Delete ── */
  const confirmDelete = (c: CategoryRow) => {
    const moveTo = deleting?.moveTo ?? "";
    start(async () => {
      let res: Awaited<ReturnType<typeof deleteCategory>>;
      try {
        res = await deleteCategory(shop, c.slug, moveTo || undefined);
      } catch {
        toast.error(`Couldn't delete “${c.name}”`, NETWORK_ERROR);
        return;
      }
      if (!res.ok) {
        toast.error(`Couldn't delete “${c.name}”`, res.error);
        return;
      }
      const target = bySlug.get(moveTo)?.name;
      toast.success(
        `“${c.name}” deleted`,
        res.data.moved > 0 ? `${res.data.moved} product${res.data.moved === 1 ? "" : "s"} moved to ${target}.` : undefined,
      );
      setDeleting(null);
      router.refresh();
    });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-2xl bg-white p-1">
          {SHOPS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                setShop(s.value);
                setDeleting(null);
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                shop === s.value ? "bg-[#14100f] text-white" : "text-black/60 hover:text-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={openNew} className={buttonPrimary}>
          + Add category
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {list.map((c, i) => {
          const n = count(c.slug);
          const isDeleting = deleting?.slug === c.slug;
          const others = list.filter((o) => o.slug !== c.slug);
          return (
            <li key={c.slug} className={`rounded-3xl border bg-white p-4 transition ${isDeleting ? "border-red-200" : "border-black/[0.07]"}`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <button type="button" aria-label={`Move ${c.name} up`} disabled={i === 0 || pending} onClick={() => move(i, -1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                    ↑
                  </button>
                  <button type="button" aria-label={`Move ${c.name} down`} disabled={i === list.length - 1 || pending} onClick={() => move(i, 1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                    ↓
                  </button>
                </div>
                <MediaThumb url={c.image} type="image" className="h-16 w-24 shrink-0 rounded-xl" sizes="96px" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="truncate text-xs text-black/50">{c.tagline || "No tagline"}</p>
                  <p className="mt-1 font-mono text-[11px] text-black/40">
                    {shopInfo.path}/{c.slug}
                  </p>
                </div>
                <p className="text-sm text-black/60">
                  <span className="font-medium text-black">{n.live}</span> live
                  {n.total > n.live && <span className="text-black/40"> · {n.total - n.live} hidden</span>}
                </p>
                <div className="flex gap-3 text-[13px]">
                  <a href={`${shopInfo.path}/${c.slug}`} target="_blank" rel="noreferrer" className="text-black/60 hover:underline">
                    View ↗
                  </a>
                  <button type="button" onClick={() => openEdit(c)} className="font-medium hover:underline">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(isDeleting ? null : { slug: c.slug, moveTo: "" })}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isDeleting && (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-red-50 p-4 text-sm sm:flex-row sm:items-center">
                  {list.length <= 1 ? (
                    <p className="flex-1 text-red-800">A shop needs at least one category — add another one first.</p>
                  ) : n.total > 0 ? (
                    <label className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-red-900">
                        Move its {n.total} product{n.total === 1 ? "" : "s"} to
                      </span>
                      <select
                        className={`${inputClass} sm:w-56`}
                        value={deleting.moveTo}
                        onChange={(e) => setDeleting({ slug: c.slug, moveTo: e.target.value })}
                      >
                        <option value="">Choose a category…</option>
                        {others.map((o) => (
                          <option key={o.slug} value={o.slug}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="flex-1 text-red-900">No products use this category. Delete it?</p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDeleting(null)} className={buttonSecondary}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={pending || list.length <= 1 || (n.total > 0 && !deleting.moveTo)}
                      onClick={() => confirmDelete(c)}
                      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-40"
                    >
                      {pending ? "Deleting…" : "Delete category"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add / edit panel */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setDraft(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={draft.isNew ? "Add category" : "Edit category"}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
          >
            <div className="border-b border-black/[0.07] px-6 py-4">
              <h2 className="font-semibold">{draft.isNew ? `New ${shopInfo.label} category` : `Edit “${draft.name}”`}</h2>
            </div>
            <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-5">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Name</span>
                <input
                  autoFocus
                  className={inputClass}
                  value={draft.name}
                  placeholder="e.g. Shirts"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      name: e.target.value,
                      slug: draft.isNew && !slugTouched ? slugify(e.target.value) : draft.slug,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>URL name</span>
                <input
                  className={`${inputClass} ${draft.isNew ? "" : "bg-black/[0.03] text-black/50"}`}
                  value={draft.slug}
                  disabled={!draft.isNew}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setDraft({ ...draft, slug: slugify(e.target.value) });
                  }}
                />
                <span className="text-[11px] text-black/45">
                  {draft.isNew
                    ? `${shopInfo.path}/${draft.slug || "…"} — can't be changed later, so shared links keep working.`
                    : "Fixed after creation so existing links and Google results keep working."}
                </span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Tagline</span>
                <input
                  className={inputClass}
                  value={draft.tagline}
                  maxLength={160}
                  placeholder="A short line shown on the category card"
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                />
              </label>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Photo</span>
                <div className="flex items-center gap-3">
                  {draft.image ? (
                    <MediaThumb url={draft.image} type="image" className="h-20 w-28 shrink-0 rounded-xl" sizes="112px" />
                  ) : (
                    <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-black/15 text-[11px] text-black/40">
                      No photo
                    </span>
                  )}
                  <button type="button" onClick={() => setPickerOpen(true)} className={buttonSecondary}>
                    {draft.image ? "Change photo" : "Choose photo"}
                  </button>
                </div>
                <span className="text-[11px] text-black/45">Shown on the home page and as the category banner.</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-black/[0.07] px-6 py-4">
              <button type="button" onClick={() => setDraft(null)} className={buttonSecondary}>
                Cancel
              </button>
              <button type="button" disabled={pending} onClick={submit} className={buttonPrimary}>
                {pending ? "Saving…" : draft.isNew ? "Add category" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        exclude={draft?.image ? [draft.image] : []}
        onPick={(assets) => {
          const photo = assets.find((a) => a.type === "image");
          if (!photo) {
            toast.error("Choose a photo", "Category images need to be photos, not videos.");
            return;
          }
          setDraft((d) => (d ? { ...d, image: photo.url } : d));
        }}
      />
    </div>
  );
}

function orderFrom(categories: CategoryRow[]): Record<Brand, string[]> {
  const sorted = [...categories].sort((a, b) => a.position - b.position);
  return {
    originals: sorted.filter((c) => c.brand === "originals").map((c) => c.slug),
    decor: sorted.filter((c) => c.brand === "decor").map((c) => c.slug),
  };
}
