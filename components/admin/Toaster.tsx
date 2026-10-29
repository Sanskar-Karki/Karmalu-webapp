"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";

export interface ToastInput {
  kind?: ToastKind;
  title: string;
  description?: string;
  /** Optional link shown in the toast, e.g. "View on site". */
  action?: { label: string; href: string; external?: boolean };
  /** Milliseconds before it hides itself (errors stay longer). */
  duration?: number;
}

interface Toast extends ToastInput {
  id: number;
  kind: ToastKind;
  leaving?: boolean;
}

type ToastApi = {
  toast: (t: ToastInput) => void;
  success: (title: string, description?: string, extra?: Partial<ToastInput>) => void;
  error: (title: string, description?: string, extra?: Partial<ToastInput>) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const STYLE: Record<ToastKind, { ring: string; icon: string; symbol: string }> = {
  success: { ring: "border-emerald-200", icon: "bg-emerald-600 text-white", symbol: "✓" },
  error: { ring: "border-red-200", icon: "bg-red-600 text-white", symbol: "!" },
  info: { ring: "border-black/10", icon: "bg-[#14100f] text-white", symbol: "i" },
};

const EXIT_MS = 220;

/**
 * Admin toasts. Lives in the admin panel layout, so toasts survive moving
 * between admin pages (e.g. "Saved" stays visible after returning to the list).
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setToasts((ts) => ts.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), EXIT_MS);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      const kind = input.kind ?? "info";
      setToasts((ts) => [...ts.slice(-3), { ...input, id, kind }]);
      const duration = input.duration ?? (kind === "error" ? 7000 : 4000);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      toast,
      success: (title, description, extra) => toast({ ...extra, kind: "success", title, description }),
      error: (title, description, extra) => toast({ ...extra, kind: "error", title, description }),
    }),
    [toast],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-5 sm:items-end"
      >
        {toasts.map((t) => {
          const s = STYLE[t.kind];
          return (
            <div
              key={t.id}
              role={t.kind === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_18px_50px_-20px_rgba(20,16,15,0.45)] ${s.ring} ${
                t.leaving ? "animate-[toast-out_0.22s_ease-in_both]" : "animate-[toast-in_0.35s_cubic-bezier(0.22,1,0.36,1)_both]"
              }`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.icon}`}>
                {s.symbol}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#14100f]">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[13px] leading-5 text-black/60">{t.description}</p>}
                {t.action &&
                  (t.action.external ? (
                    <a
                      href={t.action.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-block text-[13px] font-medium text-[#59634a] hover:underline"
                    >
                      {t.action.label} ↗
                    </a>
                  ) : (
                    <Link href={t.action.href} className="mt-1.5 inline-block text-[13px] font-medium text-[#59634a] hover:underline">
                      {t.action.label}
                    </Link>
                  ))}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 rounded-lg px-1.5 py-0.5 text-black/40 transition hover:bg-black/5 hover:text-black"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
