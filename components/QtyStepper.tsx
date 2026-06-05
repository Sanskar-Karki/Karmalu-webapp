"use client";

import { Plus, Minus } from "@/components/icons";

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export default function QtyStepper({ value, onChange, min = 1 }: QtyStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--color-ink)]/15 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-ink)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)] transition disabled:opacity-40"
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-ink)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)] transition"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
