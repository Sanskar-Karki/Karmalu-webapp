"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonPrimary, buttonSecondary } from "@/lib/admin-ui";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-black/[0.07] bg-white p-8 text-center">
      <p className="font-display text-xl font-semibold">Something went wrong</p>
      <p className="mt-2 text-sm text-black/55">
        This page couldn&apos;t load. It&apos;s usually a connection problem with the database — try again in a
        moment. If it keeps happening, check that the Supabase project isn&apos;t paused.
      </p>
      {error.digest && <p className="mt-3 font-mono text-[11px] text-black/35">Ref: {error.digest}</p>}
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" onClick={reset} className={buttonPrimary}>
          Try again
        </button>
        <Link href="/admin/products" className={buttonSecondary}>
          Back to products
        </Link>
      </div>
    </div>
  );
}
