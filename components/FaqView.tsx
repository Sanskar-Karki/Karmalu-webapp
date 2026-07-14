"use client";

import { useState } from "react";
import Link from "next/link";
import { useBrand } from "@/store/BrandProvider";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";

export interface FaqItem {
  q: string;
  a: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function FaqView({ items }: { items: FaqItem[] }) {
  const { basePath, brand } = useBrand();
  const isFullWidth = brand === "activewear";
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`${isFullWidth ? "w-full" : "max-w-3xl mx-auto"} px-6 py-16`}>
      <SectionHeader
        eyebrow="Help center"
        title="Frequently asked questions"
        subtitle="Everything you need to know about ordering, shipping and returns."
        align="center"
      />

      <ul className="mt-10 flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={i}
              className="rounded-2xl bg-white shadow-[var(--shadow-card)] overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-[var(--color-ink)]">
                  {item.q}
                </span>
                <span className="text-[var(--brand)]">
                  <Chevron open={isOpen} />
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[var(--color-ink-muted)] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 text-center flex flex-col items-center gap-3 rounded-2xl bg-[var(--brand-soft)] py-10 px-6">
        <h3 className="text-xl font-bold text-[var(--color-ink)]">
          Still have a question?
        </h3>
        <p className="text-sm text-[var(--color-ink-muted)] max-w-md">
          Our team is happy to help. Reach out and we&apos;ll get back to you within
          one business day.
        </p>
        <Button href={`${basePath}/contact`}>Contact us</Button>
      </div>
    </div>
  );
}
