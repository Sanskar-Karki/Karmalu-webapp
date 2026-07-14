"use client";

import { useState } from "react";
import { Check } from "@/components/icons";

const VARIANT_STYLES = {
  default: {
    input:
      "bg-[var(--brand-contrast)]/10 border border-[var(--brand-contrast)]/20 text-[var(--brand-contrast)] placeholder:text-[var(--brand-contrast)]/40 focus:ring-2 focus:ring-[var(--brand-contrast)]/40",
    button: "bg-[var(--brand-contrast)] text-[var(--brand)] hover:opacity-85",
    message: "text-[var(--brand-contrast)]/70",
    cta: "Subscribe",
  },
  activewear: {
    input:
      "bg-[var(--aw-bg)]/15 border border-[var(--aw-bg)]/30 text-[var(--aw-bg)] placeholder:text-[var(--aw-bg)]/40 focus:border-[var(--aw-bg)]/70",
    button: "bg-[var(--aw-bg)] text-[var(--aw-ink)] hover:bg-[var(--aw-maroon)] hover:text-[var(--aw-bg)]",
    message: "text-[var(--aw-bg)]/70",
    cta: "Join Now",
  },
} as const;

export default function NewsletterForm({
  id = "newsletter-email",
  variant = "default",
  className = "",
}: {
  id?: string;
  variant?: keyof typeof VARIANT_STYLES;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");
  const styles = VARIANT_STYLES[variant];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem(id) as HTMLInputElement | null)?.value ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitted");
    e.currentTarget.reset();
  }

  if (status === "submitted") {
    return (
      <p className={`flex items-center gap-2 text-sm font-medium ${styles.message} ${className}`}>
        <Check size={16} />
        You&apos;re on the list — thanks for subscribing.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex flex-col sm:flex-row gap-3 max-w-md ${className}`}
      aria-label="Newsletter signup"
      noValidate
    >
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className="flex-1 flex flex-col gap-1.5">
        <input
          id={id}
          name={id}
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          required
          aria-invalid={status === "error"}
          onChange={() => status === "error" && setStatus("idle")}
          className={`w-full px-5 py-3.5 rounded-full text-sm focus:outline-none transition ${styles.input}`}
        />
        {status === "error" && (
          <span className="px-2 text-xs text-left font-medium" style={{ color: "#e0635f" }}>
            Please enter a valid email address.
          </span>
        )}
      </div>
      <button
        type="submit"
        className={`px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap ${styles.button}`}
      >
        {styles.cta}
      </button>
    </form>
  );
}
