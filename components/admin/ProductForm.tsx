"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/app/admin/actions";
import { BADGES, COMMON_SIZES, slugify, type AdminProductInput, type ProductStatus } from "@/lib/admin-types";
import type { CategoryOption } from "@/lib/admin-data";
import { buttonPrimary, buttonSecondary, inputClass, labelClass } from "@/lib/admin-ui";
import { discountPercent, priceAfterDiscount } from "@/lib/pricing";
import { formatNpr } from "@/lib/currency";
import MediaPicker from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toaster";
import MediaThumb from "@/components/admin/MediaThumb";
import SizeChartEditor from "@/components/admin/SizeChartEditor";
import { syncRows } from "@/lib/size-chart";
import type { Brand } from "@/types";

const SHOPS: { value: Brand; label: string; path: string }[] = [
  { value: "originals", label: "Originals", path: "/originals" },
  { value: "decor", label: "Living & Decor", path: "/living-decor" },
];

/** Discount % as shown in the form field ("" when there is no discount). */
function discountLabel(price: number, oldPrice: number | null) {
  const d = discountPercent(price, oldPrice);
  return d > 0 ? String(d) : "";
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-black/50">{hint}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className="text-[11px] text-black/45">{hint}</span>}
    </label>
  );
}

export default function ProductForm({
  initial,
  categories,
}: {
  initial: AdminProductInput;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [p, setP] = useState<AdminProductInput>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customSize, setCustomSize] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, start] = useTransition();

  const dirty = useMemo(() => JSON.stringify(p) !== JSON.stringify(initial), [p, initial]);
  const set = <K extends keyof AdminProductInput>(key: K, value: AdminProductInput[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  /* ── Sizes ↔ size chart ── */
  // Measurements of sizes that were deselected, so re-selecting restores them.
  const removedRows = useRef(new Map<string, (number | null)[]>());

  /** Sets the sizes (in standard order) and gives each one a size chart row. */
  const setSizes = (next: string[]) => {
    const rank = (s: string) => {
      const i = (COMMON_SIZES as readonly string[]).indexOf(s);
      return i === -1 ? COMMON_SIZES.length : i;
    };
    const ordered = [...new Set(next)]
      .map((s, i) => ({ s, i }))
      .sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i)
      .map(({ s }) => s);
    setP((prev) => ({ ...prev, sizes: ordered, sizeChart: syncRows(prev.sizeChart, ordered, removedRows.current) }));
  };

  const addCustomSize = () => {
    const s = customSize.trim().slice(0, 20);
    if (s && !p.sizes.includes(s)) setSizes([...p.sizes, s]);
    setCustomSize("");
  };

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ── Discount ── */
  const [discountInput, setDiscountInput] = useState(() => discountLabel(initial.price, initial.oldPrice));
  const discount = discountPercent(p.price, p.oldPrice);

  // After a save the server sends back the stored (trimmed/cleaned) product —
  // adopt it so the form doesn't report phantom "unsaved changes".
  useEffect(() => {
    setP(initial);
    setDiscountInput(discountLabel(initial.price, initial.oldPrice));
  }, [initial]);

  /** Typing a % turns the current price into the original and works out the sale price. */
  const applyDiscount = (value: string) => {
    setDiscountInput(value);
    const pct = Number(value);
    if (value === "") {
      // Back to full price: the original price becomes the price again.
      setP((prev) => ({ ...prev, price: prev.oldPrice ?? prev.price, oldPrice: null }));
      return;
    }
    if (!Number.isFinite(pct) || pct < 1 || pct > 95) return;
    setP((prev) => {
      const base = prev.oldPrice ?? prev.price;
      if (!Number.isFinite(base) || base <= 0) return prev;
      return {
        ...prev,
        oldPrice: base,
        price: priceAfterDiscount(base, pct),
        // Label it as a sale unless another badge was chosen.
        badge: prev.badge ?? "Sale",
      };
    });
  };

  const shopCategories = categories.filter((c) => c.brand === p.brand);
  const shop = SHOPS.find((s) => s.value === p.brand)!;

  /* ── Media helpers ── */
  const moveMedia = (from: number, to: number) => {
    if (to < 0 || to >= p.media.length || from === to) return;
    const media = [...p.media];
    const [item] = media.splice(from, 1);
    media.splice(to, 0, item);
    set("media", media);
  };
  const removeMedia = (i: number) => {
    const url = p.media[i].url;
    setP((prev) => ({
      ...prev,
      media: prev.media.filter((_, j) => j !== i),
      hoverUrl: prev.hoverUrl === url ? null : prev.hoverUrl,
    }));
  };

  /* ── Save ── */
  const save = (status?: ProductStatus) => {
    const payload = { ...p, status: status ?? p.status };
    const name = payload.name.trim() || "Product";
    const isNew = !p.id;
    start(async () => {
      let res: Awaited<ReturnType<typeof saveProduct>>;
      try {
        res = await saveProduct(payload);
      } catch {
        toast.error("Couldn't save", "The connection dropped. Check your internet and try again — your changes are still here.");
        return;
      }
      if (!res.ok) {
        // Stay on the form so nothing typed is lost.
        toast.error("Couldn't save", res.error);
        return;
      }

      const verb = isNew ? "added" : "saved";
      if (payload.status === "published") {
        toast.success(`“${name}” is live`, `${isNew ? "Added" : "Saved"} and published to ${shop.label}.`, {
          action: { label: "View on site", href: `${shop.path}/product/${payload.slug}`, external: true },
        });
      } else if (payload.status === "draft") {
        toast.success(`“${name}” ${verb} as a draft`, "It's hidden from the shop until you publish it.", {
          action: { label: "Keep editing", href: `/admin/products/${res.data.id}` },
        });
      } else {
        toast.success(`“${name}” ${verb} and archived`, "It's hidden from the shop.");
      }
      setP(payload); // clears "unsaved changes" so leaving doesn't warn
      router.push("/admin/products");
    });
  };

  return (
    <div className="mx-auto max-w-6xl pb-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/products" className="text-sm text-black/50 hover:text-black">
            ← Products
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.02em]">
            {p.id ? p.name || "Untitled product" : "New product"}
          </h1>
        </div>
        {p.id && p.status === "published" && (
          <a href={`${shop.path}/product/${p.slug}`} target="_blank" rel="noreferrer" className={buttonSecondary}>
            View on site ↗
          </a>
        )}
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <Section title="Details">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Shop">
              {SHOPS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={p.brand === s.value}
                  onClick={() => setP((prev) => ({ ...prev, brand: s.value, categorySlug: "" }))}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    p.brand === s.value ? "border-[#14100f] bg-[#14100f] text-white" : "border-black/12 hover:border-black/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Field label="Product name">
              <input
                className={inputClass}
                value={p.name}
                onChange={(e) =>
                  setP((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: slugTouched ? prev.slug : slugify(e.target.value),
                  }))
                }
                placeholder="e.g. Everyday Oversized Hoodie"
              />
            </Field>
            <Field label="URL name" hint={`${shop.path}/product/${p.slug || "…"}`}>
              <input
                className={inputClass}
                value={p.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select className={inputClass} value={p.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
                  <option value="">Choose…</option>
                  {shopCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Link href="/admin/categories" className="text-[11px] text-black/45 hover:text-black hover:underline">
                  Manage categories →
                </Link>
              </Field>
              <Field label="Badge">
                <select className={inputClass} value={p.badge ?? ""} onChange={(e) => set("badge", e.target.value || null)}>
                  <option value="">None</option>
                  {BADGES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                {p.badge === "New" ? (
                  <Link href="/admin/new-arrivals" className="text-[11px] text-black/45 hover:text-black hover:underline">
                    Can be added to New Arrivals — arrange it →
                  </Link>
                ) : (
                  <span className="text-[11px] text-black/45">Choose “New” to make it eligible for New Arrivals.</span>
                )}
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={p.oldPrice !== null ? "Sale price (NPR)" : "Price (NPR)"}>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="1"
                  value={Number.isFinite(p.price) ? p.price : ""}
                  onChange={(e) => {
                    const price = e.target.value === "" ? NaN : Number(e.target.value);
                    set("price", price);
                    setDiscountInput(discountLabel(price, p.oldPrice));
                  }}
                />
              </Field>
              <Field label="Original price (NPR)" hint="Optional — shown crossed out.">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="1"
                  value={p.oldPrice ?? ""}
                  onChange={(e) => {
                    const oldPrice = e.target.value === "" ? null : Number(e.target.value);
                    set("oldPrice", oldPrice);
                    setDiscountInput(discountLabel(p.price, oldPrice));
                  }}
                />
              </Field>
              <Field label="Discount %" hint="Type a % to work out the sale price.">
                <div className="relative">
                  <input
                    className={`${inputClass} pr-8`}
                    type="number"
                    min={1}
                    max={95}
                    step="1"
                    value={discountInput}
                    placeholder="—"
                    onChange={(e) => applyDiscount(e.target.value)}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-black/40">%</span>
                </div>
              </Field>
            </div>
            {discount > 0 && Number.isFinite(p.price) && p.oldPrice !== null && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-800/70">Shoppers see</span>
                <span className="font-semibold">{formatNpr(p.price)}</span>
                <span className="text-black/45 line-through">{formatNpr(p.oldPrice)}</span>
                <span className="rounded bg-[#59634a] px-1.5 py-0.5 text-[11px] font-medium text-white">−{discount}%</span>
                <span className="text-emerald-800">Saves {formatNpr(p.oldPrice - p.price)}</span>
                <button
                  type="button"
                  onClick={() => applyDiscount("")}
                  className="ml-auto text-xs font-medium text-black/55 hover:text-black hover:underline"
                >
                  Remove discount
                </button>
              </div>
            )}
            <Field label="Description">
              <textarea className={`${inputClass} min-h-28 resize-y`} value={p.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label="Feature bullets" hint="One per line.">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={p.details.join("\n")}
                onChange={(e) => set("details", e.target.value.split("\n"))}
              />
            </Field>
          </Section>

          <Section title="Sizes" hint="Leave empty for one-size products. Each size you select gets a row in the size chart below.">
            <div className="flex flex-wrap gap-2">
              {[...new Set([...COMMON_SIZES, ...p.sizes])].map((s) => {
                const on = p.sizes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSizes(on ? p.sizes.filter((x) => x !== s) : [...p.sizes, s])}
                    className={`min-w-11 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      on ? "border-[#14100f] bg-[#14100f] text-white" : "border-black/12 hover:border-black/30"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="Other size, e.g. 32 or 3XL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSize();
                  }
                }}
              />
              <button type="button" className={buttonSecondary} onClick={addCustomSize}>
                Add
              </button>
            </div>
          </Section>

          <Section title="Size chart" hint="Shown in the size guide on the product page. Fill it in inches or cm — shoppers can view either.">
            <SizeChartEditor
              chart={p.sizeChart}
              onChange={(chart) => {
                // Remembered rows of deselected sizes are in the old unit — forget them.
                if (chart.unit !== p.sizeChart.unit) removedRows.current.clear();
                set("sizeChart", chart);
              }}
              onRemoveSize={(size) => setSizes(p.sizes.filter((x) => x !== size))}
            />
          </Section>

          <Section title="Colours">
            {p.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#000000"}
                  onChange={(e) => {
                    const colors = [...p.colors];
                    colors[i] = { ...c, hex: e.target.value };
                    set("colors", colors);
                  }}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-black/12 bg-white p-1"
                  aria-label={`Colour ${i + 1}`}
                />
                <input
                  className={inputClass}
                  value={c.label}
                  placeholder="Colour name, e.g. Olive"
                  onChange={(e) => {
                    const colors = [...p.colors];
                    colors[i] = { ...c, label: e.target.value };
                    set("colors", colors);
                  }}
                />
                <button
                  type="button"
                  onClick={() => set("colors", p.colors.filter((_, j) => j !== i))}
                  className="px-2 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${buttonSecondary} self-start`}
              onClick={() => set("colors", [...p.colors, { hex: "#1B1716", label: "" }])}
            >
              + Add colour
            </button>
          </Section>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-6">
          <Section title="Status">
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-black/[0.04] p-1">
              {(["draft", "published", "archived"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`rounded-xl py-2 text-xs font-medium capitalize transition ${
                    p.status === s ? "bg-white shadow-sm" : "text-black/55 hover:text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-black/50">
              {p.status === "published"
                ? "Visible in the shop."
                : p.status === "draft"
                  ? "Hidden from the shop until you publish it."
                  : "Hidden and kept for your records."}
            </p>
          </Section>

          <Section title="Photos & videos" hint="Drag to reorder. The first photo is the main one.">
            {p.media.length > 0 && (
              <ul className="grid grid-cols-3 gap-2">
                {p.media.map((m, i) => (
                  <li
                    key={m.url}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null) moveMedia(dragIndex, i);
                      setDragIndex(null);
                    }}
                    className={`group relative cursor-grab overflow-hidden rounded-xl border bg-white ${
                      dragIndex === i ? "opacity-40" : ""
                    } ${i === 0 ? "border-[#59634a] ring-1 ring-[#59634a]" : "border-black/[0.07]"}`}
                  >
                    <MediaThumb url={m.url} type={m.type} className="aspect-[4/5]" sizes="110px" />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-[#59634a] px-2 py-0.5 text-[10px] font-medium text-white">
                        Main
                      </span>
                    )}
                    {p.hoverUrl === m.url && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-[#14100f] px-2 py-0.5 text-[10px] font-medium text-white">
                        Hover
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-1 px-1.5 py-1 text-[11px]">
                      <span className="flex">
                        <button type="button" aria-label="Move earlier" onClick={() => moveMedia(i, i - 1)} disabled={i === 0} className="px-1 disabled:opacity-25">
                          ←
                        </button>
                        <button type="button" aria-label="Move later" onClick={() => moveMedia(i, i + 1)} disabled={i === p.media.length - 1} className="px-1 disabled:opacity-25">
                          →
                        </button>
                      </span>
                      <button type="button" aria-label="Remove" onClick={() => removeMedia(i)} className="px-1 text-red-600">
                        ✕
                      </button>
                    </div>
                    {m.type === "image" && i !== 0 && (
                      <button
                        type="button"
                        onClick={() => set("hoverUrl", p.hoverUrl === m.url ? null : m.url)}
                        className="absolute inset-x-1.5 bottom-8 rounded-lg bg-white/90 py-1 text-[10px] font-medium opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
                      >
                        {p.hoverUrl === m.url ? "Remove hover" : "Use on hover"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => setPickerOpen(true)} className={buttonSecondary}>
              + Add photos or videos
            </button>
            <p className="text-[11px] text-black/45">
              The &ldquo;hover&rdquo; photo shows when shoppers hover a product card.
            </p>
          </Section>
        </div>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.07] bg-white/95 px-5 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-2 text-sm ${dirty ? "text-amber-700" : "text-black/50"}`}>
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${saving ? "animate-ping bg-[#59634a]" : dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
            {saving ? "Saving…" : dirty ? "Unsaved changes" : p.id ? "All changes saved" : "New product — not saved yet"}
          </p>
          <div className="flex gap-2">
            {p.status !== "published" && (
              <button type="button" disabled={saving} onClick={() => save("published")} className={buttonSecondary}>
                Save &amp; publish
              </button>
            )}
            <button type="button" disabled={saving || (!dirty && Boolean(p.id))} onClick={() => save()} className={buttonPrimary}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        exclude={p.media.map((m) => m.url)}
        onPick={(assets) => {
          set("media", [...p.media, ...assets.map((a) => ({ url: a.url, type: a.type, publicId: a.public_id }))]);
          toast.toast({
            title: `Added ${assets.length} ${assets.length === 1 ? "file" : "files"}`,
            description: "Save the product to keep them.",
            duration: 3000,
          });
        }}
      />
    </div>
  );
}
