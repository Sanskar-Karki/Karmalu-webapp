import { amountToFreeShipping, formatNpr, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";

/** "You save" line + free-delivery progress, shared by the cart page and drawer. */
export default function CartPerks({ subtotal, savings }: { subtotal: number; savings: number }) {
  const remaining = amountToFreeShipping(subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-[var(--brand-soft)] px-3.5 py-3">
        <p className="text-xs font-semibold text-[var(--color-ink)]">
          {remaining > 0 ? (
            <>
              Add <span className="text-[var(--brand-dark)]">{formatNpr(remaining)}</span> more for free delivery
            </>
          ) : (
            "🎉 You've unlocked free delivery"
          )}
        </p>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70"
          role="progressbar"
          aria-label="Progress to free delivery"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {savings > 0 && (
        <div className="flex justify-between text-sm font-semibold text-emerald-700">
          <span>You save</span>
          <span>−{formatNpr(savings)}</span>
        </div>
      )}
    </div>
  );
}
