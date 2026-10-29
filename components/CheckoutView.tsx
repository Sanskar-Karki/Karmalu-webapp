"use client";

import ProductImage from "@/components/ProductImage";
import { useEffect, useState } from "react";
import { useBrand, useCart } from "@/store/BrandProvider";
import Button from "@/components/Button";
import { Check, ArrowLeft, ArrowRight, WhatsApp } from "@/components/icons";
import Link from "next/link";
import { formatNpr, FREE_SHIPPING_THRESHOLD, qualifiesForFreeShipping } from "@/lib/currency";
import type { OrderItem } from "@/types/order";

/* ── helpers ── */
const field =
  "w-full px-4 py-3 rounded-xl border border-[var(--color-ink)]/15 bg-white text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/35 outline-none focus:ring-2 focus:ring-[var(--brand)]/50 transition";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
      {children}
    </label>
  );
}

/* ── Step indicator ── */
const STEPS = ["Contact", "Delivery", "Review"];

/* ── WhatsApp order destination (Nepal). Override via env. ── */
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

/* Count digits in a phone string (ignores spaces, +, -, etc.) */
const phoneDigits = (v: string) => v.replace(/\D/g, "").length;

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < current
                  ? "bg-[var(--brand)] text-white"
                  : i === current
                  ? "bg-[var(--brand)] text-white ring-4 ring-[var(--brand)]/20"
                  : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/40"
              }`}
            >
              {i < current ? <Check size={15} /> : i + 1}
            </div>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                i <= current ? "text-[var(--brand)]" : "text-[var(--color-ink)]/30"
              }`}
            >
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                i < current ? "bg-[var(--brand)]" : "bg-[var(--color-ink)]/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* Delivery details and fees are confirmed with the customer before the request is accepted. */
const SHIPPING_METHODS = [
  {
    id: "confirm-on-whatsapp",
    label: "Confirm delivery over WhatsApp",
    detail: "Coverage, timing and any delivery charge are confirmed before acceptance.",
    price: 0,
  },
] as const;
type ShippingId = (typeof SHIPPING_METHODS)[number]["id"];

/* ── Order summary sidebar ── */
function OrderSummary({
  subtotal,
  shippingCost,
}: {
  subtotal: number;
  shippingCost: number;
}) {
  const cart = useCart();
  const items = cart.items;
  const total = subtotal + shippingCost;

  return (
    <aside className="bg-white rounded-2xl border border-[var(--color-ink)]/8 shadow-sm p-6 flex flex-col gap-5 lg:sticky lg:top-24">
      <h2 className="font-bold text-base text-[var(--color-ink)]">Order Summary</h2>

      {/* Items */}
      <ul className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-beige)] shrink-0">
              <ProductImage preset="thumb" src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--brand)] text-white text-[10px] font-extrabold flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{item.name}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                {item.category}
                {item.size && <span> · Size {item.size}</span>}
                {item.color && <span> · {item.color}</span>}
              </p>
            </div>
            <span className="text-sm font-bold text-[var(--color-ink)] shrink-0">
              {formatNpr(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="border-t border-[var(--color-ink)]/8 pt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--color-ink-muted)]">Delivery</span>
          {qualifiesForFreeShipping(subtotal) ? (
            <span className="text-right font-semibold text-emerald-700">Free</span>
          ) : (
            <span className="text-right font-semibold text-[var(--color-ink-muted)]">
              Confirmed on WhatsApp
            </span>
          )}
        </div>
        <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[var(--color-ink)]/8">
          <span>Products subtotal</span>
          <span className="text-[var(--brand)]">{formatNpr(total)}</span>
        </div>
      </div>

      <p className="text-[11px] leading-5 text-[var(--color-ink-muted)]">
        Delivery charges are not included in this subtotal. The team will confirm the final amount before accepting your request.
      </p>

      <div className="text-center text-[11px] leading-5 text-[var(--color-ink-muted)]">
        Your request is saved before WhatsApp opens. It is not confirmed until our team replies.
      </div>
    </aside>
  );
}

/* ── Confirmation screen ── */
function OrderConfirmation({
  basePath,
  orderNumber,
  items,
  total,
  whatsappUrl,
  whatsappMessage,
}: {
  basePath: string;
  orderNumber: string;
  items: ReturnType<typeof useCart>["items"];
  total: number;
  whatsappUrl: string;
  whatsappMessage: string;
}) {
  const [copyStatus, setCopyStatus] = useState("");

  const copyOrderDetails = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopyStatus("Order details copied.");
    } catch {
      setCopyStatus("Copy is unavailable in this browser. Use Open WhatsApp again instead.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
      {/* Success ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[var(--brand)]/10 animate-ping absolute" />
        <div className="w-24 h-24 rounded-full bg-[var(--brand)] flex items-center justify-center z-10">
          <Check size={40} className="text-white" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--brand)] mb-2">
          Request Saved · Pending WhatsApp
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)]">
          Thank you!
        </h1>
        <p className="text-[var(--color-ink-muted)] mt-3">
          Your request is saved, but your order is not confirmed yet.
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Order ID:{" "}
          <span className="font-mono font-bold text-[var(--color-ink)] tracking-wider">
            {orderNumber}
          </span>
        </p>
        <p className="text-[var(--color-ink-muted)] mt-4 max-w-md mx-auto">
          <span className="font-semibold text-[var(--color-ink)]">
            One last step:
          </span>{" "}
          open WhatsApp and press <span className="font-semibold">Send</span> to share your request. Our team will review it and confirm availability, delivery and the final amount with you. Opening WhatsApp does not send or confirm the request.
        </p>

        {/* Fallback link in case the WhatsApp tab was blocked */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#1da851] transition-colors"
        >
          <WhatsApp size={16} /> Continue to WhatsApp
        </a>
        <button
          type="button"
          onClick={copyOrderDetails}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-[var(--color-ink)]/15 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          Copy order details
        </button>
        <p aria-live="polite" className="mt-2 min-h-4 text-xs text-[var(--color-ink-muted)]">{copyStatus}</p>
      </div>


      {/* Items recap */}
      <div className="w-full bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6">
        <h2 className="font-bold text-sm text-[var(--color-ink)] mb-4">Items in this request</h2>
        <ul className="flex flex-col divide-y divide-[var(--color-ink)]/6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-beige)] shrink-0">
                <ProductImage preset="thumb" src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{item.name}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Qty: {item.qty}
                  {item.size && <span> · Size {item.size}</span>}
                  {item.color && <span> · {item.color}</span>}
                </p>
              </div>
              <span className="text-sm font-bold">{formatNpr(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-base font-extrabold pt-4 border-t border-[var(--color-ink)]/8 mt-2">
          <span>Products subtotal</span>
          <span className="text-[var(--brand)]">{formatNpr(total)}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--color-ink-muted)]">
          Delivery charges and the final amount will be confirmed by the team on WhatsApp.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button href={basePath} size="lg" fullWidth>
          Continue Shopping
        </Button>
        <Button href={`${basePath}/contact`} variant="outline" size="lg" fullWidth>
          Need Help?
        </Button>
      </div>

      <p className="text-xs text-[var(--color-ink-muted)] text-center">
        This is a pending order request, not a completed checkout.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main CheckoutView
══════════════════════════════════════════ */
export default function CheckoutView() {
  const { basePath, brand } = useBrand();
  const isFullWidth = brand === "originals";
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* steps: 0 = Contact, 1 = Delivery, 2 = Review, 3 = Request saved */
  const [step, setStep] = useState(0);

  /* form state */
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [ward, setWard] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingId>("confirm-on-whatsapp");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [placedItems, setPlacedItems] = useState<ReturnType<typeof useCart>["items"]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!mounted) return <div className="min-h-[60vh]" />;

  const items = cart.items;
  const subtotal = cart.subtotal();
  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethod)!;
  const shippingCost = selectedMethod.price;

  /* empty cart guard */
  if (items.length === 0 && step < 3) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-3xl">🛍️</div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">Nothing to check out</h1>
        <p className="text-[var(--color-ink-muted)]">Add some items to your cart first.</p>
        <Button href={basePath} size="lg">Continue shopping</Button>
      </div>
    );
  }

  /* order confirmed */
  if (step === 3) {
    return (
      <OrderConfirmation
        basePath={basePath}
        orderNumber={orderNumber}
        items={placedItems}
        total={placedTotal}
        whatsappUrl={whatsappUrl}
        whatsappMessage={whatsappMessage}
      />
    );
  }

  const handleContactNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName.trim() ||
      phoneDigits(phone) < 10 ||
      phoneDigits(phone) > 15 ||
      !province.trim() ||
      !district.trim() ||
      !municipality.trim() ||
      !ward.trim() ||
      !address.trim()
    ) {
      setSubmitError(
        "Please enter your name, a valid phone number and complete delivery address.",
      );
      return;
    }
    setSubmitError("");
    setStep(1);
  };

  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    cart.setShippingMethod({ id: selectedMethod.id, cost: shippingCost });
    setStep(2);
  };

  /* Build the WhatsApp order message from the cart snapshot + address */
  const buildWhatsAppMessage = (
    orderNum: string,
    requestItems: OrderItem[],
    productsSubtotal: number,
  ) => {
    const lines: string[] = [];
    const brandName = brand === "originals" ? "KARMALU Originals" : "KARMALU Living & Decor";
    lines.push(`*${brandName} order request — #${orderNum}*`);
    lines.push("");
    lines.push("*Items:*");
    requestItems.forEach((item) => {
      const sizeSuffix = item.size ? `, Size ${item.size}` : "";
      const colorSuffix = item.color ? `, ${item.color}` : "";
      lines.push(
        `• ${item.name}${sizeSuffix}${colorSuffix} ×${item.quantity} — ${formatNpr(
          item.price * item.quantity,
        )}`,
      );
    });
    lines.push("");
    lines.push(
      qualifiesForFreeShipping(productsSubtotal)
        ? `Delivery: FREE (order over ${formatNpr(FREE_SHIPPING_THRESHOLD)}) — timing to be confirmed with the Karmalu team`
        : "Delivery charge and timing: To be confirmed with the Karmalu team",
    );
    lines.push(`Products subtotal: ${formatNpr(productsSubtotal)}`);
    lines.push("*This is a pending request, not a confirmed order.*");
    lines.push("");
    lines.push("*Deliver to:*");
    lines.push(fullName);
    lines.push(`Province: ${province}`);
    lines.push(`District: ${district}`);
    lines.push(`Municipality: ${municipality}, Ward ${ward}`);
    lines.push(`Address / landmark: ${address}`);
    if (notes) {
      lines.push("");
      lines.push(`*Notes:* ${notes}`);
    }
    return lines.join("\n");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (WHATSAPP_NUMBER.length < 10 || WHATSAPP_NUMBER.length > 15) {
      setSubmitError("WhatsApp ordering is not configured. Please contact Karmalu for help.");
      return;
    }

    // Client-side guard for required fields (server validates again).
    if (
      !fullName.trim() ||
      phoneDigits(phone) < 10 ||
      phoneDigits(phone) > 15 ||
      !province.trim() ||
      !district.trim() ||
      !municipality.trim() ||
      !ward.trim() ||
      !address.trim() ||
      items.length === 0
    ) {
      setSubmitError("Please complete your contact and delivery details.");
      setStep(0);
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      // 1. Persist the order to the Karmify database BEFORE WhatsApp.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          customerName: fullName.trim(),
          whatsappNumber: phone.trim(),
          address: {
            street: address.trim(),
            province: province.trim(),
            district: district.trim(),
            municipality: municipality.trim(),
            ward: ward.trim(),
            country: "Nepal",
          },
          notes: notes.trim() || undefined,
          items: items.map((i) => ({
            productSlug: i.slug,
            name: i.name,
            quantity: i.qty,
            price: i.price,
            size: i.size,
            color: i.color,
          })),
          deliveryMethod: selectedMethod.label,
        }),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const { order } = (await res.json()) as {
        order: { orderId: string; items: OrderItem[]; subtotal: number };
      };

      // 2. Only after a successful save, build the WhatsApp message + redirect.
      const message = buildWhatsAppMessage(order.orderId, order.items, order.subtotal);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      setWhatsappUrl(url);
      setWhatsappMessage(message);
      setOrderNumber(order.orderId);
      setPlacedItems(
        items.map((item) => {
          const saved = order.items.find(
            (line) =>
              line.productSlug === item.slug &&
              line.size === item.size &&
              line.color === item.color,
          );
          return saved
            ? { ...item, name: saved.name, price: saved.price, qty: saved.quantity }
            : item;
        }),
      );
      setPlacedTotal(order.subtotal);
      setStep(3);
      cart.clear();
    } catch (err) {
      console.error(err);
      // 3. On failure, do NOT open WhatsApp — surface the error, stay on review.
      setSubmitError("We couldn't save your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Top breadcrumb */}
      <div className="border-b border-[var(--color-ink)]/8 bg-white/70 backdrop-blur-sm">
        <div className={`${isFullWidth ? "w-full" : "max-w-6xl mx-auto"} px-6 h-12 flex items-center gap-2 text-xs text-[var(--color-ink-muted)]`}>
          <Link href={basePath} className="hover:text-[var(--brand)] transition-colors font-medium">Shop</Link>
          <span>/</span>
          <Link href={`${basePath}/cart`} className="hover:text-[var(--brand)] transition-colors font-medium">Cart</Link>
          <span>/</span>
          <span className="text-[var(--brand)] font-semibold capitalize">{STEPS[step]}</span>
        </div>
      </div>

      <div className={`${isFullWidth ? "w-full" : "max-w-6xl mx-auto"} px-4 sm:px-6 py-10`}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── Left: form area ── */}
          <div>
            {/* Logo + step bar */}
            <div className="mb-8">
              <Link href={basePath} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors mb-6">
                <ArrowLeft size={15} /> Back
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] mb-6">
                Order request
              </h1>
              <StepBar current={step} />
            </div>

            {/* ── STEP 0: Contact ── */}
            {step === 0 && (
              <form onSubmit={handleContactNext} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  <h2 className="font-bold text-[var(--color-ink)]">Contact Information</h2>

                  {/* Full name */}
                  <div className="flex flex-col gap-1">
                    <Label>Full name *</Label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className={field}
                    />
                  </div>

                  {/* Phone (required, WhatsApp) with digit-count hint */}
                  <div className="flex flex-col gap-1">
                    <Label>Phone number *</Label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className={field}
                    />
                    {(phoneDigits(phone) < 10 || phoneDigits(phone) > 15) && phone.length > 0 && (
                      <p className="text-xs text-[var(--brand)] mt-0.5">
                        Enter a phone number with 10–15 digits, including the country code if needed.
                      </p>
                    )}
                  </div>

                </div>

                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  <h2 className="font-bold text-[var(--color-ink)]">Delivery address</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label>Province *</Label>
                      <input required value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Bagmati" className={field} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>District *</Label>
                      <input required value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Kathmandu" className={field} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Municipality / rural municipality *</Label>
                      <input required value={municipality} onChange={(e) => setMunicipality(e.target.value)} placeholder="Municipality name" className={field} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Ward number *</Label>
                      <input required inputMode="numeric" value={ward} onChange={(e) => setWard(e.target.value)} placeholder="Ward" className={field} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Street, area and landmark *</Label>
                    <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / street, area and a nearby landmark" className={field + " resize-y"} />
                  </div>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[var(--brand)] text-white font-extrabold text-sm uppercase tracking-widest hover:bg-[var(--brand-dark)] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  Continue to Delivery <ArrowRight size={17} />
                </button>
              </form>
            )}

            {/* ── STEP 1: Delivery details ── */}
            {step === 1 && (
              <form onSubmit={handleShippingNext} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  {/* Recap */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[var(--color-ink)]">Delivery details</h2>
                    <button type="button" onClick={() => setStep(0)} className="text-xs text-[var(--brand)] font-semibold hover:underline">
                      Edit address
                    </button>
                  </div>

                  <div className="text-sm text-[var(--color-ink-muted)] bg-[var(--color-beige)]/60 rounded-xl px-4 py-3">
                    <p className="font-semibold text-[var(--color-ink)]">{fullName}</p>
                    <p>{province} Province · {district} District</p>
                    <p>{municipality}, Ward {ward} · {address}</p>
                    <p>{phone}</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    {SHIPPING_METHODS.map((m) => {
                      const active = shippingMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setShippingMethod(m.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                            active
                              ? "border-[var(--brand)] bg-[var(--brand)]/5"
                              : "border-[var(--color-ink)]/10 hover:border-[var(--brand)]/40"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            active ? "border-[var(--brand)]" : "border-[var(--color-ink)]/20"
                          }`}>
                            {active && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand)]" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-[var(--color-ink)]">{m.label}</p>
                            <p className="text-xs text-[var(--color-ink-muted)]">{m.detail}</p>
                          </div>
                          <span className="max-w-28 text-right text-xs font-semibold text-[var(--color-ink-muted)]">
                            Confirmed later
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[var(--brand)] text-white font-extrabold text-sm uppercase tracking-widest hover:bg-[var(--brand-dark)] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  Continue to Review <ArrowRight size={17} />
                </button>
                <button type="button" onClick={() => setStep(0)} className="text-sm text-center text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors">
                  ← Back
                </button>
              </form>
            )}

            {/* ── STEP 2: Review & order via WhatsApp ── */}
            {step === 2 && (
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  <h2 className="font-bold text-[var(--color-ink)]">Review your order</h2>

                  {/* Items recap */}
                  <ul className="flex flex-col divide-y divide-[var(--color-ink)]/6">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 py-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-beige)] shrink-0">
                          <ProductImage preset="thumb" src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{item.name}</p>
                          <p className="text-xs text-[var(--color-ink-muted)]">
                  Qty: {item.qty}
                  {item.size && <span> · Size {item.size}</span>}
                  {item.color && <span> · {item.color}</span>}
                </p>
                        </div>
                        <span className="text-sm font-bold shrink-0">{formatNpr(item.price * item.qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery recap */}
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-5 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)] mb-1">
                    <span>Deliver to</span>
                    <button type="button" onClick={() => setStep(0)} className="text-[var(--brand)] font-semibold hover:underline">Edit</button>
                  </div>
                  <p className="font-semibold text-[var(--color-ink)]">{fullName}</p>
                  <p className="text-[var(--color-ink-muted)]">{province} Province · {district} District</p>
                  <p className="text-[var(--color-ink-muted)]">{municipality}, Ward {ward} · {address}</p>
                  <p className="text-[var(--color-ink-muted)]">{phone}</p>
                  <p className="text-[var(--color-ink-muted)] pt-1">{selectedMethod.label} · {selectedMethod.detail}</p>
                </div>

                {/* Optional notes */}
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-5 flex flex-col gap-2">
                  <Label>Order notes (optional)</Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Sizes, colours, delivery instructions…"
                    className={field + " resize-none"}
                  />
                </div>

                {/* WhatsApp ordering info */}
                <div className="flex items-start gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 text-sm">
                  <WhatsApp size={20} className="text-[#25D366] mt-0.5 shrink-0" />
                  <p className="text-[var(--color-ink-muted)]">
                    This creates a pending request. Continue to
                    <span className="font-semibold text-[var(--color-ink)]"> WhatsApp</span> to send it; our team will then confirm product availability, delivery and the final amount.
                  </p>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-extrabold text-sm uppercase tracking-widest hover:bg-[#1da851] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <WhatsApp size={17} />{" "}
                  {submitting
                    ? "Saving your order…"
                    : `Save order request — ${formatNpr(subtotal)}`}
                </button>
                <button type="button" onClick={() => setStep(1)} className="text-sm text-center text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors">
                  ← Back
                </button>
              </form>
            )}
          </div>

          {/* ── Right: order summary ── */}
          <OrderSummary
            subtotal={subtotal}
            shippingCost={shippingCost}
          />
        </div>
      </div>
    </div>
  );
}
