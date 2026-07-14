export default function DecorProductLoading() {
  return (
    <div className="theme-decor bg-[var(--page-bg)] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-ink)]/6 bg-white/70">
        <div className="w-full px-6 h-11 flex items-center gap-2">
          <div className="h-3 w-10 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-12 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main grid */}
      <div className="w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-start">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl bg-[var(--color-beige)] animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-[var(--color-beige)] animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-6">
            <div className="h-3 w-24 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />

            <div className="flex flex-col gap-3 pb-5 border-b border-[var(--color-ink)]/8">
              <div className="h-8 w-3/4 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-3 w-40 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>

            <div className="h-8 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />

            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-3 w-5/6 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-9 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
              <div className="h-12 w-full rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
            </div>

            <div className="h-24 rounded-2xl bg-white border border-[var(--color-ink)]/6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Complete the room */}
      <div className="bg-white border-t border-[var(--color-ink)]/6">
        <div className="w-full px-4 sm:px-6 py-14">
          <div className="h-5 w-40 bg-[var(--color-ink)]/8 rounded-full animate-pulse mb-8" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 shrink-0 w-48 sm:w-56">
                <div className="aspect-square rounded-2xl bg-[var(--color-beige)] animate-pulse" />
                <div className="h-3 w-3/4 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                <div className="h-3 w-1/2 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
