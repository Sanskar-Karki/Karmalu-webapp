"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow, ProductRow } from "@/lib/catalog-server";
import type { ProductStatus } from "@/lib/admin-types";
import { deleteProduct, duplicateProduct, setProductStatus } from "@/app/admin/actions";
import { formatNpr } from "@/lib/currency";
import { discountPercent } from "@/lib/pricing";
import { inputClass } from "@/lib/admin-ui";
import { useToast, type ToastInput } from "@/components/admin/Toaster";
import Dropdown from "@/components/admin/Dropdown";
import type { Brand } from "@/types";

const SHOP_LABEL: Record<Brand, string> = { originals: "Originals", decor: "Living & Decor" };

const STATUS_STYLE: Record<ProductStatus, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  archived: "bg-black/[0.05] text-black/50",
};

export default function ProductsTable({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [shop, setShop] = useState<Brand | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "active" | "sale">("active");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [, start] = useTransition();

  const categoryName = useMemo(() => {
    const m = new Map(categories.map((c) => [`${c.brand}:${c.slug}`, c.name]));
    return (p: ProductRow) => m.get(`${p.brand}:${p.category_slug}`) ?? p.category_slug;
  }, [categories]);

  const visible = products.filter((p) => {
    if (shop !== "all" && p.brand !== shop) return false;
    const onSale = discountPercent(Number(p.price), p.old_price === null ? null : Number(p.old_price)) > 0;
    if (status === "sale" ? !onSale || p.status === "archived" : status === "active" ? p.status === "archived" : p.status !== status)
      return false;
    const q = query.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.slug.includes(q);
  });

  type Result = { ok: boolean; error?: string; data?: { id: string } };
  type Messages = { done: string; detail?: string; failed: string; action?: ToastInput["action"] };

  /** Runs a row action and reports the outcome as a toast. */
  const run = (id: string, fn: () => Promise<Result>, msg: Messages, after?: (r: Result) => void) => {
    setBusyId(id);
    start(async () => {
      let res: Result;
      try {
        res = await fn();
      } catch {
        res = { ok: false, error: "The connection dropped. Check your internet and try again." };
      }
      setBusyId(null);
      setConfirmDelete(null);
      if (!res.ok) {
        toast.error(msg.failed, res.error ?? "Something went wrong.");
        return;
      }
      toast.success(msg.done, msg.detail, msg.action ? { action: msg.action } : undefined);
      after?.(res);
      router.refresh();
    });
  };

  const shopPath = (p: ProductRow) => (p.brand === "originals" ? "/originals" : "/living-decor");

  const counts = {
    active: products.filter((p) => p.status !== "archived").length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    archived: products.filter((p) => p.status === "archived").length,
    sale: products.filter(
      (p) => p.status !== "archived" && discountPercent(Number(p.price), p.old_price === null ? null : Number(p.old_price)) > 0,
    ).length,
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          {(["all", "originals", "decor"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShop(s)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                shop === s ? "bg-[#14100f] text-white" : "text-black/60 hover:text-black"
              }`}
            >
              {s === "all" ? "All shops" : SHOP_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Dropdown
            label="Filter by status"
            value={status}
            onChange={setStatus}
            className="sm:w-56"
            options={[
              { value: "active", label: "Live & drafts", count: counts.active, dot: "bg-[#14100f]" },
              { value: "published", label: "Published", count: counts.published, dot: "bg-emerald-500" },
              { value: "draft", label: "Drafts", count: counts.draft, dot: "bg-amber-400" },
              { value: "sale", label: "On sale", count: counts.sale, dot: "bg-[#59634a]", dividerBefore: true },
              { value: "archived", label: "Archived", count: counts.archived, dot: "bg-black/25", dividerBefore: true },
            ]}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className={`${inputClass} sm:w-64`}
          />
        </div>
      </div>


      <div className="mt-4 overflow-x-auto rounded-3xl border border-black/[0.07] bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-black/[0.07] text-left text-[11px] uppercase tracking-[0.12em] text-black/45">
              <th className="py-3 pl-5 pr-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Shop</th>
              <th className="px-3 py-3 font-medium">Price</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="py-3 pl-3 pr-5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const thumb = p.media?.find((m) => m.type === "image")?.url;
              const busy = busyId === p.id;
              return (
                <tr key={p.id} className={`border-b border-black/[0.05] last:border-0 ${busy ? "opacity-50" : ""}`}>
                  <td className="py-3 pl-5 pr-3">
                    <Link href={`/admin/products/${p.id}`} className="group flex items-center gap-3">
                      <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-black/[0.05]">
                        {thumb && (
                          <Image src={thumb} alt="" fill sizes="44px" className="object-cover" unoptimized={thumb.startsWith("/")} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium group-hover:underline">{p.name}</span>
                        <span className="block truncate text-xs text-black/45">{categoryName(p)}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-black/65">{SHOP_LABEL[p.brand]}</td>
                  <td className="px-3 py-3">
                    {formatNpr(Number(p.price))}
                    {discountPercent(Number(p.price), p.old_price === null ? null : Number(p.old_price)) > 0 && (
                      <>
                        <span className="ml-1.5 text-xs text-black/40 line-through">{formatNpr(Number(p.old_price))}</span>
                        <span className="ml-1.5 rounded bg-[#59634a] px-1.5 py-0.5 text-[10px] font-medium text-white">
                          −{discountPercent(Number(p.price), Number(p.old_price))}%
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pl-3 pr-5">
                    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[13px]">
                      <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                        Edit
                      </Link>
                      {p.status === "draft" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            run(p.id, () => setProductStatus(p.id, "published"), {
                              done: `“${p.name}” is live`,
                              detail: `Published to ${SHOP_LABEL[p.brand]}.`,
                              failed: `Couldn't publish “${p.name}”`,
                              action: { label: "View on site", href: `${shopPath(p)}/product/${p.slug}`, external: true },
                            })
                          }
                          className="text-emerald-700 hover:underline"
                        >
                          Publish
                        </button>
                      )}
                      {p.status === "published" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            run(p.id, () => setProductStatus(p.id, "draft"), {
                              done: `“${p.name}” unpublished`,
                              detail: "It's now a hidden draft.",
                              failed: `Couldn't unpublish “${p.name}”`,
                            })
                          }
                          className="text-black/60 hover:underline"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          run(
                            p.id,
                            () => duplicateProduct(p.id),
                            {
                              done: `Copied “${p.name}”`,
                              detail: "The copy is a hidden draft — edit it and publish when ready.",
                              failed: `Couldn't copy “${p.name}”`,
                            },
                            (r) => r.data && router.push(`/admin/products/${r.data.id}`),
                          )
                        }
                        className="text-black/60 hover:underline"
                      >
                        Duplicate
                      </button>
                      {p.status !== "archived" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            run(p.id, () => setProductStatus(p.id, "archived"), {
                              done: `“${p.name}” archived`,
                              detail: "Hidden from the shop. Find it under Archived to restore or delete.",
                              failed: `Couldn't archive “${p.name}”`,
                            })
                          }
                          className="text-black/60 hover:underline"
                        >
                          Archive
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              run(p.id, () => setProductStatus(p.id, "draft"), {
                                done: `“${p.name}” restored`,
                                detail: "It's back as a hidden draft — publish it to show it in the shop.",
                                failed: `Couldn't restore “${p.name}”`,
                              })
                            }
                            className="text-black/60 hover:underline"
                          >
                            Restore
                          </button>
                          {confirmDelete === p.id ? (
                            <span className="flex items-center gap-2">
                              <button type="button" disabled={busy} onClick={() =>
                                  run(p.id, () => deleteProduct(p.id), {
                                    done: `“${p.name}” deleted`,
                                    detail: "It's been permanently removed.",
                                    failed: `Couldn't delete “${p.name}”`,
                                  })
                                } className="font-medium text-red-600 hover:underline">
                                Confirm delete
                              </button>
                              <button type="button" onClick={() => setConfirmDelete(null)} className="text-black/50 hover:underline">
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button type="button" onClick={() => setConfirmDelete(p.id)} className="text-red-600 hover:underline">
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-black/45">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-black/40">
        Archived products are hidden from the shop. Delete is only available for archived products.
      </p>
    </div>
  );
}
