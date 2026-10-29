"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { inputClass } from "@/lib/admin-ui";

export default function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, { error: initialError });

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-black/60">Email</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-black/60">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-xl bg-[#14100f] py-3 text-sm font-medium text-white transition hover:bg-[#59634a] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
