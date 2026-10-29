"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProductOrder } from "@/app/admin/actions";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import { discountPercent } from "@/lib/pricing";
import { formatNpr } from "@/lib/currency";
import { buttonPrimary, buttonSecondary } from "@/lib/admin-ui";
import MediaThumb from "@/components/admin/MediaThumb";
import { useToast } from "@/components/admin/Toaster";
import type { Brand } from "@/types";

const SHOPS: { value: Brand; label: string; path: string }[] = [
  { value: "originals", label: "Originals", path: "/originals" },
  { value: "decor", label: "Living & Decor", path: "/living-decor" },
];

function orderFrom(products: ProductRow[]): Record<Brand, string[]> {
  return {
    originals: products.filter((p) => p.brand === "originals").map((p) => p.id),
    decor: products.filter((p) => p.brand === "decor").map((p) => p.id),
  };
}

export default function ProductOrderManager({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: Pick<CategoryRow, "brand" | "slug" | "name">[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [shop, setShop] = useState<Brand>("originals");
  const saved = useMemo(() => orderFrom(products), [products]);
  const [order, setOrder] = useState(saved);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => setOrder(saved), [saved]);

  const info = SHOPS.find((s) => s.value === shop)!;
  const byId = new Map(products.map((p) => [p.id, p]));
  const catName = new Map(categories.map((c) => [`${c.brand}:${c.slug}`, c.name]));
  const list = order[shop].map((id) => byId.get(id)).filter((p): p is ProductRow => Boolean(p));
  const dirty = JSON.stringify(order[shop]) !== JSON.stringify(saved[shop]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    const ids = [...order[shop]];
    const [id] = ids.splice(from, 1);
    ids.splice(to, 0, id);
    setOrder((o) => ({ ...o, [shop]: ids }));
  };

  const save = () =>
    start(async () => {
      let res: Awaited<ReturnType<typeof saveProductOrder>>;
      try {
        res = await saveProductOrder(shop, order[shop]);
      } catch {
        toast.error("Couldn't save the order", "The connection dropped. Check your internet and try again.");
        return;
      }
      if (!res.ok) {
        toast.error("Couldn't save the order", res.error);
        return;
      }
      toast.success(`${info.label} product order saved`, "The shop shows products in this order under “All”.", {
        action: { label: "View shop", href: `${info.path}/shop`, external: true },
      });
      router.refresh();
    });

  const thumb = (p: ProductRow) => p.media?.find((m) => m.type === "image")?.url;

  return (
    <div className="mt-8 pb-24">
      <div className="flex gap-1 self-start rounded-2xl bg-white p-1">
        {SHOPS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => {
              if (dirty && !window.confirm("You have unsaved changes for this shop. Switch anyway?")) return;
              setOrder(saved);
              setShop(s.value);
            }}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              shop === s.value ? "bg-[#14100f] text-white" : "text-black/60 hover:text-black"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/50">
          No products in this shop yet.
        </p>
      ) : (
        <ol className="mt-5 flex flex-col gap-2">
          {list.map((p, i) => {
            const d = discountPercent(Number(p.price), p.old_price === null ? null : Number(p.old_price));
            return (
              <li
                key={p.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
                onDrop={() => {
                  if (dragIndex !== null) move(dragIndex, i);
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                className={`flex cursor-grab items-center gap-3 rounded-2xl border bg-white p-2.5 pr-3 transition active:cursor-grabbing ${
                  dragIndex === i
                    ? "border-black/[0.07] opacity-40"
                    : overIndex === i && dragIndex !== null
                      ? "border-[#59634a] ring-1 ring-[#59634a]"
                      : "border-black/[0.07] hover:border-black/20"
                }`}
              >
                <span aria-hidden className="select-none px-1 text-black/25">⋮⋮</span>
                <span className="w-6 text-center text-xs font-semibold tabular-nums text-black/40">{i + 1}</span>
                {thumb(p) ? (
                  <MediaThumb url={thumb(p)!} type="image" className="h-14 w-11 shrink-0 rounded-lg" sizes="44px" />
                ) : (
                  <span className="h-14 w-11 shrink-0 rounded-lg bg-black/[0.05]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {p.name}
                    {p.status === "draft" && (
                      <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Draft</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-black/45">
                    {catName.get(`${p.brand}:${p.category_slug}`) ?? p.category_slug} · {formatNpr(Number(p.price))}
                    {d > 0 && ` · −${d}%`}
                    {p.badge && ` · ${p.badge}`}
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  <button type="button" aria-label={`Move ${p.name} to top`} disabled={i === 0} onClick={() => move(i, 0)} className="hidden rounded-lg px-2 py-1 text-[11px] text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20 sm:block">
                    Top
                  </button>
                  <button type="button" aria-label={`Move ${p.name} up`} disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                    ↑
                  </button>
                  <button type="button" aria-label={`Move ${p.name} down`} disabled={i === list.length - 1} onClick={() => move(i, i + 1)} className="rounded-lg px-2 py-1 text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20">
                    ↓
                  </button>
                  <button type="button" aria-label={`Move ${p.name} to bottom`} disabled={i === list.length - 1} onClick={() => move(i, list.length - 1)} className="hidden rounded-lg px-2 py-1 text-[11px] text-black/50 hover:bg-black/5 hover:text-black disabled:opacity-20 sm:block">
                    Bottom
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-3 text-xs text-black/45">
        Drafts are included so they&apos;re already in place when you publish them. New products are added at the end.
      </p>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.07] bg-white/95 px-5 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-2 text-sm ${dirty ? "text-amber-700" : "text-black/50"}`}>
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pending ? "animate-ping bg-[#59634a]" : dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
            {pending ? "Saving…" : dirty ? "Unsaved changes" : "Saved — this is the order shoppers see"}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button type="button" onClick={() => setOrder(saved)} className={buttonSecondary}>
                Undo changes
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
