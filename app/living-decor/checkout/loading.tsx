export default function DecorCheckoutLoading() {
  return (
    <div className="theme-decor min-h-screen bg-[var(--color-cream)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-ink)]/8 bg-white/70">
        <div className="w-full px-6 h-12 flex items-center gap-2">
          <div className="h-3 w-10 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-10 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left: form area */}
          <div>
            <div className="mb-8">
              <div className="h-4 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse mb-6" />
              <div className="h-8 w-40 bg-[var(--color-ink)]/8 rounded-full animate-pulse mb-6" />
              {/* Step bar */}
              <div className="flex items-center gap-0 mb-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-ink)]/10 animate-pulse" />
                    {i < 2 && <div className="flex-1 h-0.5 mx-2 bg-[var(--color-ink)]/10 animate-pulse" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                <div className="h-4 w-40 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                    <div className="h-11 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[var(--color-ink)]/8 p-6 flex flex-col gap-4">
                <div className="h-4 w-36 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                    <div className="h-11 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="h-14 w-full rounded-2xl bg-[var(--color-ink)]/8 animate-pulse" />
            </div>
          </div>

          {/* Right: order summary */}
          <aside className="bg-white rounded-2xl border border-[var(--color-ink)]/8 shadow-sm p-6 flex flex-col gap-5">
            <div className="h-4 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
            <ul className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-beige)] shrink-0 animate-pulse" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3 w-3/4 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                    <div className="h-3 w-1/2 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>
            <div className="h-10 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
            <div className="border-t border-[var(--color-ink)]/8 pt-4 flex flex-col gap-2">
              <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-5 w-full bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
