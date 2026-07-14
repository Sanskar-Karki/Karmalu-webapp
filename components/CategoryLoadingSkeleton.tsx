export function ActivewearCategoryLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--aw-bg)]">
      {/* Search bar strip skeleton */}
      <section className="bg-[var(--aw-secondary)] border-b border-[var(--aw-ink)]/8 py-5 px-6">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-[var(--aw-ink)]/8 rounded-full animate-pulse" />
            <div className="h-3 w-24 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-full sm:w-72 rounded-full bg-[var(--aw-ink)]/6 animate-pulse" />
        </div>
      </section>

      {/* Main layout: sidebar + grid */}
      <section className="w-full px-4 sm:px-6 py-8 flex gap-8">
        <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-full rounded-xl bg-[var(--aw-ink)]/6 animate-pulse" />
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="h-4 w-40 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
            <div className="h-9 w-40 rounded-full bg-[var(--aw-ink)]/6 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/5] rounded-2xl bg-[var(--aw-ink)]/6 animate-pulse" />
                <div className="h-3 w-3/4 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
                <div className="h-3 w-1/2 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function DecorCategoryLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--page-bg)]">
      {/* Header skeleton */}
      <header className="w-full px-4 sm:px-6 pt-8 sm:pt-14 pb-6 sm:pb-10">
        <div className="h-3 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        <div className="flex items-end justify-between gap-6 mt-6 flex-wrap">
          <div className="h-10 w-56 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        </div>
      </header>

      <div className="border-t border-[var(--color-ink)]/10" />

      {/* Sidebar + grid skeleton */}
      <section className="w-full px-4 sm:px-6 py-10 sm:py-14 flex-1 lg:flex lg:gap-12 items-start">
        <aside className="hidden lg:flex flex-col w-52 shrink-0 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-32 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="h-3 w-40 bg-[var(--color-ink)]/6 rounded-full animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-14">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
                <div className="h-3 w-3/4 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                <div className="h-3 w-1/2 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
