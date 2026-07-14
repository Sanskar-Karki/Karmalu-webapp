"use client";

import ProductImage from "@/components/ProductImage";
import { useEffect, useState } from "react";
import { useBrand, useCart } from "@/store/BrandProvider";
import Button from "@/components/Button";
import { Check, Lock, ArrowLeft, ArrowRight, Truck, WhatsApp } from "@/components/icons";
import Link from "next/link";
import { formatNpr, qualifiesForFreeShipping } from "@/lib/currency";

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
const STEPS = ["Contact", "Shipping", "Review"];

/* ── WhatsApp order destination (Nepal). Override via env. ── */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "9779803182768"; // +977 98031 82768

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

/* ── Shipping methods (location-based flat rates) ── */
const SHIPPING_METHODS = [
  { id: "inside-ktm", label: "Inside Kathmandu Valley", detail: "1 business days", price: 100 },
  { id: "outside-ktm", label: "Outside Kathmandu Valley", detail: "2–3 business days", price: 165 },
] as const;
type ShippingId = (typeof SHIPPING_METHODS)[number]["id"];

/* ── Order summary sidebar ── */
function OrderSummary({
  subtotal,
  shippingCost,
  shippingKnown,
  discount,
  promoCode,
  setPromoCode,
  onApplyPromo,
  promoApplied,
}: {
  subtotal: number;
  shippingCost: number;
  shippingKnown: boolean;
  discount: number;
  promoCode: string;
  setPromoCode: (v: string) => void;
  onApplyPromo: () => void;
  promoApplied: boolean;
}) {
  const cart = useCart();
  const items = cart.items;
  const total = subtotal - discount + (shippingKnown ? shippingCost : 0);

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

      {/* Promo code */}
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Promo code"
          className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-beige)]/50 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/35 outline-none focus:ring-2 focus:ring-[var(--brand)]/40 transition"
        />
        <button
          onClick={onApplyPromo}
          className="px-4 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:bg-[var(--brand-dark)] transition-colors"
        >
          Apply
        </button>
      </div>
      {promoApplied && (
        <p className="text-xs text-green-600 font-semibold -mt-3">
          ✓ Promo applied — 10% off!
        </p>
      )}

      {/* Totals */}
      <div className="border-t border-[var(--color-ink)]/8 pt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-ink-muted)]">Subtotal</span>
          <span className="font-semibold">{formatNpr(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promo discount</span>
            <span className="font-semibold">−{formatNpr(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[var(--color-ink-muted)]">Shipping</span>
          <span className={`font-semibold ${!shippingKnown ? "text-[var(--color-ink-muted)] italic" : ""}`}>
            {!shippingKnown
              ? "Calculated at next step"
              : shippingCost === 0
              ? "Free"
              : formatNpr(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[var(--color-ink)]/8">
          <span>Total</span>
          <span className="text-[var(--brand)]">{formatNpr(total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-ink)]/40 font-medium">
        <Lock size={12} /> Secure 256-bit SSL encryption
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
}: {
  basePath: string;
  orderNumber: string;
  items: ReturnType<typeof useCart>["items"];
  total: number;
  whatsappUrl: string;
}) {
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
          Order Recorded
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)]">
          Thank you!
        </h1>
        <p className="text-[var(--color-ink-muted)] mt-3">
          Your order has been recorded successfully.
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
          press <span className="font-semibold">Send</span> in the WhatsApp
          window that just opened to complete your order. We&apos;ll confirm and
          arrange delivery there.
        </p>

        {/* Fallback link in case the WhatsApp tab was blocked */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#1da851] transition-colors"
        >
          <WhatsApp size={16} /> Open WhatsApp again
        </a>
      </div>

      {/* Delivery timeline */}
      <div className="w-full bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
            <Truck size={20} />
          </div>
          <div>
            <p className="font-bold text-[var(--color-ink)] text-sm">Estimated Delivery</p>
            <p className="text-xs text-[var(--color-ink-muted)]">5–7 business days</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {["Order Placed", "Processing", "Shipped", "Delivered"].map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? "bg-[var(--brand)] text-white" : "bg-[var(--color-ink)]/8 text-[var(--color-ink)]/30"
                }`}>
                  {i === 0 ? <Check size={13} /> : i + 1}
                </div>
                <span className="text-[9px] text-center font-semibold uppercase tracking-wide text-[var(--color-ink)]/40 w-14 leading-tight">
                  {step}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-0.5 mx-1 mb-5 bg-[var(--color-ink)]/8 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Items recap */}
      <div className="w-full bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6">
        <h2 className="font-bold text-sm text-[var(--color-ink)] mb-4">Items Ordered</h2>
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
          <span>Order total</span>
          <span className="text-[var(--brand)]">{formatNpr(total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button href={basePath} size="lg" fullWidth>
          Continue Shopping
        </Button>
        <Button href={`${basePath}/contact`} variant="outline" size="lg" fullWidth>
          Need Help?
        </Button>
      </div>

      <p className="text-xs text-[var(--color-ink)]/30 text-center">
        Payment is arranged directly over WhatsApp after we confirm your order.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main CheckoutView
══════════════════════════════════════════ */
export default function CheckoutView() {
  const { basePath, brand } = useBrand();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* steps: 0 = Contact, 1 = Shipping, 2 = Payment, 3 = Confirmed */
  const [step, setStep] = useState(0);

  /* form state */
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");
  const [shippingMethod, setShippingMethod] = useState<ShippingId>("inside-ktm");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [placedItems, setPlacedItems] = useState<ReturnType<typeof useCart>["items"]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!mounted) return <div className="min-h-[60vh]" />;

  const items = cart.items;
  const subtotal = cart.subtotal();
  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethod)!;
  // Free shipping once the subtotal reaches the threshold; otherwise the
  // location-based flat rate applies.
  const shippingCost = qualifiesForFreeShipping(subtotal)
    ? 0
    : selectedMethod.price;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount + shippingCost;

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
      />
    );
  }

  const handleContactNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName.trim() ||
      phoneDigits(phone) < 10 ||
      !city.trim() ||
      !address.trim()
    ) {
      setSubmitError(
        "Please enter your full name, a valid WhatsApp number, city and landmark address.",
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
  const buildWhatsAppMessage = (orderNum: string) => {
    const lines: string[] = [];
    lines.push(`*New KARMALU Order — #${orderNum}*`);
    lines.push("");
    lines.push("*Items:*");
    items.forEach((item) => {
      const sizeSuffix = item.size ? `, Size ${item.size}` : "";
      const colorSuffix = item.color ? `, ${item.color}` : "";
      lines.push(
        `• ${item.name} (${item.category}${sizeSuffix}${colorSuffix}) ×${item.qty} — ${formatNpr(
          item.price * item.qty,
        )}`,
      );
    });
    lines.push("");
    lines.push(`Subtotal: ${formatNpr(subtotal)}`);
    if (discount > 0) lines.push(`Discount: -${formatNpr(discount)}`);
    lines.push(
      `Shipping (${selectedMethod.label}): ${
        shippingCost === 0 ? "Free" : formatNpr(shippingCost)
      }`,
    );
    lines.push(`*Total: ${formatNpr(total)}*`);
    lines.push("");
    lines.push("*Deliver to:*");
    lines.push(fullName);
    lines.push(`City: ${city}`);
    lines.push(`Landmark: ${address}`);
    lines.push(`Phone (WhatsApp): ${phone}`);
    if (email) lines.push(`Email: ${email}`);
    if (notes) {
      lines.push("");
      lines.push(`*Notes:* ${notes}`);
    }
    return lines.join("\n");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Client-side guard for required fields (server validates again).
    if (
      !fullName.trim() ||
      phoneDigits(phone) < 10 ||
      !city.trim() ||
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
          email: email.trim() || undefined,
          address: {
            street: address.trim(),
            city: city.trim(),
            state: state.trim(),
            zip: zip.trim(),
            country,
          },
          notes: notes.trim() || undefined,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.qty,
            price: i.price,
            size: i.size,
            color: i.color,
          })),
          subtotal,
          deliveryCharge: shippingCost,
          total,
          deliveryMethod: selectedMethod.label,
          paymentMethod: "WhatsApp (Cash/arranged)",
        }),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const { order } = (await res.json()) as { order: { orderId: string } };

      // 2. Only after a successful save, build the WhatsApp message + redirect.
      const message = buildWhatsAppMessage(order.orderId);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      setWhatsappUrl(url);
      setOrderNumber(order.orderId);
      setPlacedItems(items);
      setPlacedTotal(total);
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

  const handleApplyPromo = () => {
    if (promoCode === "KARMALU10") setPromoApplied(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Top breadcrumb */}
      <div className="border-b border-[var(--color-ink)]/8 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
          <Link href={basePath} className="hover:text-[var(--brand)] transition-colors font-medium">Shop</Link>
          <span>/</span>
          <Link href={`${basePath}/cart`} className="hover:text-[var(--brand)] transition-colors font-medium">Cart</Link>
          <span>/</span>
          <span className="text-[var(--brand)] font-semibold capitalize">{STEPS[step]}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── Left: form area ── */}
          <div>
            {/* Logo + step bar */}
            <div className="mb-8">
              <Link href={basePath} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors mb-6">
                <ArrowLeft size={15} /> Back
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] mb-6">
                Checkout
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
                    {phoneDigits(phone) < 10 && (
                      <p className="text-xs text-[var(--brand)] mt-0.5">
                        Please give a WhatsApp number.
                      </p>
                    )}
                  </div>

                  {/* Email (optional, last) */}
                  <div className="flex flex-col gap-1">
                    <Label>Email address (optional)</Label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={field}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  <h2 className="font-bold text-[var(--color-ink)]">Shipping Address</h2>
                  <div className="flex flex-col gap-1">
                    <Label>City *</Label>
                    <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kathmandu" className={field} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Landmark address *</Label>
                    <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Near XYZ, street / area" className={field} />
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
                  Continue to Shipping <ArrowRight size={17} />
                </button>
              </form>
            )}

            {/* ── STEP 1: Shipping method ── */}
            {step === 1 && (
              <form onSubmit={handleShippingNext} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                  {/* Recap */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[var(--color-ink)]">Delivery Method</h2>
                    <button type="button" onClick={() => setStep(0)} className="text-xs text-[var(--brand)] font-semibold hover:underline">
                      Edit address
                    </button>
                  </div>

                  <div className="text-sm text-[var(--color-ink-muted)] bg-[var(--color-beige)]/60 rounded-xl px-4 py-3">
                    <p className="font-semibold text-[var(--color-ink)]">{fullName}</p>
                    <p>{city} · {address}</p>
                    <p>{phone}{email ? ` · ${email}` : ""}</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    {SHIPPING_METHODS.map((m) => {
                      const cost = m.price;
                      const active = shippingMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
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
                          <span className="font-bold text-sm text-[var(--color-ink)] shrink-0">
                            {qualifiesForFreeShipping(subtotal) ? "Free" : formatNpr(cost)}
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
                  Continue to Payment <ArrowRight size={17} />
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
                  <p className="text-[var(--color-ink-muted)]">{city} · {address}</p>
                  <p className="text-[var(--color-ink-muted)]">{phone}{email ? ` · ${email}` : ""}</p>
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
                    Your order is recorded first, then your summary and delivery
                    details are sent to us on
                    <span className="font-semibold text-[var(--color-ink)]"> WhatsApp</span> to
                    confirm and arrange payment. No card details needed here.
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
                    : `Confirm Order — ${formatNpr(total)}`}
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
            shippingKnown={step >= 1}
            discount={discount}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onApplyPromo={handleApplyPromo}
            promoApplied={promoApplied}
          />
        </div>
      </div>
    </div>
  );
}
