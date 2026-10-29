"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  /** Small number shown on the right (e.g. how many products match). */
  count?: number;
  /** Tailwind classes for a coloured dot before the label. */
  dot?: string;
  /** Draws a divider above this option. */
  dividerBefore?: boolean;
}

/**
 * Styled single-select dropdown (listbox) for the admin.
 * Keyboard: Enter/Space/↓ opens, ↑/↓ moves, Home/End jump, Enter selects,
 * Escape closes. Clicking outside closes.
 */
export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  className = "",
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name, e.g. "Filter by status". */
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Focus the list when it opens so arrow keys work straight away.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((a) => Math.min(options.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") buttonRef.current?.focus();
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            openMenu();
          }
        }}
        className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition ${
          open
            ? "border-[#59634a] shadow-[0_0_0_3px_rgba(89,99,74,0.15)]"
            : "border-black/12 hover:border-black/30"
        }`}
      >
        {selected?.dot && <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${selected.dot}`} />}
        <span className="flex-1 truncate font-medium">{selected?.label}</span>
        {selected?.count !== undefined && (
          <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] tabular-nums text-black/55">{selected.count}</span>
        )}
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-black/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className="absolute right-0 z-30 mt-2 w-full min-w-56 origin-top animate-[dropdown-in_0.16s_cubic-bezier(0.22,1,0.36,1)_both] overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-1.5 shadow-[0_24px_60px_-24px_rgba(20,16,15,0.4)] outline-none"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li key={o.value} role="presentation">
                {o.dividerBefore && <div role="separator" className="mx-2 my-1.5 h-px bg-black/[0.07]" />}
                <div
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                    i === active ? "bg-black/[0.045]" : ""
                  } ${isSelected ? "font-medium text-[#14100f]" : "text-black/75"}`}
                >
                  {o.dot ? <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${o.dot}`} /> : <span className="w-2" />}
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.count !== undefined && <span className="text-[11px] tabular-nums text-black/40">{o.count}</span>}
                  <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-[#59634a] ${isSelected ? "" : "invisible"}`}>
                    <path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
