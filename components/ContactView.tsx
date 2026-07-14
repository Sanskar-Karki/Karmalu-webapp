"use client";

import { useState } from "react";
import { useBrand } from "@/store/BrandProvider";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import { Check } from "@/components/icons";

const field =
  "w-full px-4 py-3 rounded-xl border border-[var(--color-ink)]/15 bg-white text-sm outline-none focus:ring-2 focus:ring-[var(--brand)] transition";

export default function ContactView() {
  const { label } = useBrand();
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full px-6 py-16 grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: info */}
      <div className="flex flex-col gap-6">
        <SectionHeader
          eyebrow="Get in touch"
          title="We'd love to hear from you"
          subtitle={`Questions about ${label}, an order, or a collaboration? Send us a note.`}
        />

        <ul className="flex flex-col gap-4 mt-2">
          {[
            { label: "Email", value: "hello@karmalu.com" },
            { label: "Phone", value: "+1 (555) 012-3456" },
            { label: "Hours", value: "Mon–Fri · 9am–6pm" },
          ].map((row) => (
            <li key={row.label} className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-muted)]">
                {row.label}
              </span>
              <span className="text-[var(--color-ink)] font-medium">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: form */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 sm:p-8">
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-10">
            <div className="w-16 h-16 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] flex items-center justify-center">
              <Check size={30} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-ink)]">Message sent!</h3>
            <p className="text-sm text-[var(--color-ink-muted)] max-w-xs">
              Thanks for reaching out. We&apos;ll reply within one business day.
              (Demo — nothing was actually sent.)
            </p>
            <Button onClick={() => setSent(false)} variant="outline">
              Send another
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Name" className={field} />
              <input required type="email" placeholder="Email" className={field} />
            </div>
            <input placeholder="Subject" className={field} />
            <textarea
              required
              placeholder="Your message"
              rows={5}
              className={`${field} resize-none`}
            />
            <Button type="submit" size="lg" fullWidth>
              Send message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
