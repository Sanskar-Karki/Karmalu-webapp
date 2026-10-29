"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHomePicks } from "@/app/admin/actions";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import { HOME_PICKS_LIMIT, NEW_BADGE } from "@/lib/home-picks";
import { discountPercent } from "@/lib/pricing";
import { formatNpr } from "@/lib/currency";
import { buttonPrimary, buttonSecondary, inputClass } from "@/lib/admin-ui";
import MediaThumb from "@/components/admin/MediaThumb";
import { useToast } from "@/components/admin/Toaster";
import type { Brand } from "@/types";

const SHOPS: { value: Brand; label: string; section: string; path: string; perRow: number }[] = [
  { value: "originals", label: "Originals", section: "New Arrivals", path: "/originals", perRow: 3 },
  { value: "decor", label: "Living & Decor", section: "Featured this season", path: "/living-decor", perRow: 4 },
];

const isNew = (p: ProductRow) => p.badge === NEW_BADGE;

/** Saved order per shop — only products that are still tagged "New". */
function picksFrom(products: ProductRow[]): Record<Brand, string[]> {
  const ranked = products
    .filter((p) => typeof p.home_rank === "number" && isNew(p))
    .sort((a, b) => a.home_rank! - b.home_rank!);
  return {
    originals: ranked.filter((p) => p.brand === "originals").map((p) => p.id),
    decor: ranked.filter((p) => p.brand === "decor").map((p) => p.id),
  };
}

export default function HomePicksManager({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: Pick<CategoryRow, "brand" | "slug" | "name">[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [shop, setShop] = useState<Brand>("originals");
  const saved = useMemo(() => picksFrom(products), [products]);
  const [picks, setPicks] = useState(saved);
  const [query, setQuery] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => setPicks(saved), [saved]);

  const info = SHOPS.find((s) => s.value === shop)!;
  const byId = new Map(products.map((p) => [p.id, p]));
  const catName = new Map(categories.map((c) => [`${c.brand}:${c.slug}`, c.name]));
  const current = picks[shop].map((id) => byId.get(id)).filter((p): p is ProductRow => Boolean(p));
  const dirty = JSON.stringify(picks[shop]) !== JSON.stringify(saved[shop]);
  const full = current.length >= HOME_PICKS_LIMIT;

  const taggedNew = products.filter((p) => p.brand === shop && isNew(p));
  const q = query.trim().toLowerCase();
  const available = taggedNew.filter((p) => !picks[shop].includes(p.id) && (!q || p.name.toLowerCase().includes(q)));

  const setShopPicks = (ids: string[]) => setPicks((all) => ({ ...all, [shop]: ids }));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= current.length || from === to) return;
    const ids = [...picks[shop]];
    const [id] = ids.splice(from, 1);
    ids.splice(to, 0, id);
    setShopPicks(ids);
  };

  const save = () =>
    start(async () => {
      let res: Awaited<ReturnType<typeof saveHomePicks>>;
      try {
        res = await saveHomePicks(shop, picks[shop]);
      } catch {
        toast.error("Couldn't save New Arrivals", "The connection dropped. Check your internet and try again.");
        return;
      }
      if (!res.ok) {
        toast.error("Couldn't save New Arrivals", res.error);
        return;
      }
      toast.success(
        picks[shop].length ? `${info.section} updated` : `${info.section} set to automatic`,
        picks[shop].length
          ? `${picks[shop].length} product${picks[shop].length === 1 ? "" : "s"} in your chosen order.`
          : "The shop shows its “New” products by itself again.",
        { action: { label: "View home page", href: info.path, external: true } },
      );
      router.refresh();
    });

  const thumb = (p: ProductRow) => p.media?.find((m) => m.type === "image")?.url;
  const price = (p: ProductRow) => {
    const d = discountPercent(Number(p.price), p.old_price === null ? null : Number(p.old_price));
    return `${formatNpr(Number(p.price))}${d > 0 ? ` · −${d}%` : ""}`;
  };

  return (
    <div className="mt-8 pb-24">
      <div className="flex gap-1 self-start rounded-2xl bg-white p-1">
        {SHOPS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => {
              if (dirty && !window.confirm("You have unsaved changes for this shop. Switch anyway?")) return;
              setPicks(saved);
              setShop(s.value);
              setQuery("");
            }}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              shop === s.value ? "bg-[#14100f] text-white" : "text-black/60 hover:text-black"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* The section, in order */}
        <section className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-semibold">“{info.section}” on the {info.label} home page</h2>
            <span className="text-xs text-black/45">
              {current.length}/{HOME_PICKS_LIMIT} · {info.perRow} per row on desktop
            </span>
          </div>

          {current.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center">
              <p className="text-sm font-medium">Automatic</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-black/50">
                The shop shows its “New” products by itself. Add products on the right to choose which ones appear and
                in what order.
              </p>
            </div>
          ) : (
            <ol className="mt-4 flex flex-col gap-2">
              {current.map((p, i) => (
                <li
                  key={p.id}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null) move(dragIndex, i);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex cursor-grab items-center gap-3 rounded-2xl border border-black/[0.07] bg-white p-2.5 pr-3 transition active:cursor-grabbing ${
                    dragIndex === i ? "opacity-40" : "hover:border-black/20"
                  }`}
                >
                  <span className="w-6 text-center text-xs font-semibold tabular-nums text-black/40">{i + 1}</span>
                  {thumb(p) ? (
                    <MediaThumb url={thumb(p)!} type="image" className="h-14 w-11 shrink-0 rounded-lg" sizes="44px" />
                  ) : (
                    <span className="h-14 w-11 shrink-0 rounded-lg bg-black/[0.05]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-black/45">
                      {catName.get(`${p.brand}:${p.category_slug}`) ?? p.category_slug} · {price(p)}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <button type="button" aria-label={`Move ${p.name} up`} disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                      ↑
                    </button>
                    <button type="button" aria-label={`Move ${p.name} down`} disabled={i === current.length - 1} onClick={() => move(i, i + 1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => setShopPicks(picks[shop].filter((id) => id !== p.id))}
                      className="ml-1 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {current.length > 0 && current.length % info.perRow !== 0 && (
            <p className="mt-3 text-xs text-black/45">
              Tip: {info.perRow * Math.ceil(current.length / info.perRow)} products fills the last row on desktop.
            </p>
          )}
          {shop === "originals" && current.length > 0 && (
            <p className="mt-2 text-xs text-black/45">The first product is also shown on the hero&apos;s “Just dropped” card.</p>
          )}
        </section>

        {/* Products tagged "New" that can be added */}
        <section className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <h2 className="font-semibold">Products tagged “New”</h2>
          <p className="mt-0.5 text-xs text-black/50">
            Only published products with the <strong>New</strong> badge can be added. Set it under{" "}
            <em>Badge</em> when editing a product.
          </p>

          {taggedNew.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-900">
              <p className="font-medium">No {info.label} products are tagged “New” yet.</p>
              <p className="mt-1 text-amber-900/80">
                Open a product, set <strong>Badge → New</strong>, save it, and it will appear here.
              </p>
              <Link href="/admin/products" className="mt-2 inline-block font-medium underline">
                Go to products →
              </Link>
            </div>
          ) : (
            <>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className={`${inputClass} mt-4`}
              />
              <ul className="mt-3 flex max-h-[28rem] flex-col gap-1.5 overflow-y-auto pr-1">
                {available.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-black/[0.03]">
                    {thumb(p) ? (
                      <MediaThumb url={thumb(p)!} type="image" className="h-11 w-9 shrink-0 rounded-md" sizes="36px" />
                    ) : (
                      <span className="h-11 w-9 shrink-0 rounded-md bg-black/[0.05]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.name}</p>
                      <p className="truncate text-[11px] text-black/45">{price(p)}</p>
                    </div>
                    <button
                      type="button"
                      disabled={full}
                      onClick={() => setShopPicks([...picks[shop], p.id])}
                      className="rounded-lg border border-black/12 px-2.5 py-1 text-xs font-medium transition hover:border-black/40 disabled:opacity-30"
                    >
                      + Add
                    </button>
                  </li>
                ))}
                {available.length === 0 && (
                  <li className="py-6 text-center text-sm text-black/45">
                    {q ? "No matches." : "Every “New” product is already in the section."}
                  </li>
                )}
              </ul>
            </>
          )}
          {full && <p className="mt-2 text-xs text-amber-700">The section is full ({HOME_PICKS_LIMIT}). Remove one to add another.</p>}
        </section>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.07] bg-white/95 px-5 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-2 text-sm ${dirty ? "text-amber-700" : "text-black/50"}`}>
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pending ? "animate-ping bg-[#59634a]" : dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
            {pending ? "Saving…" : dirty ? "Unsaved changes" : "Saved — this is what the home page shows"}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button type="button" onClick={() => setPicks(saved)} className={buttonSecondary}>
                Undo changes
              </button>
            )}
            {!dirty && current.length > 0 && (
              <button type="button" disabled={pending} onClick={() => setShopPicks([])} className={buttonSecondary}>
                Clear (go automatic)
              </button>
            )}
            <button type="button" disabled={!dirty || pending} onClick={save} className={buttonPrimary}>
              {pending ? "Saving…" : "Save order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
