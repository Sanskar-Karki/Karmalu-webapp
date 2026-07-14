export default function ActivewearProductLoading() {
  return (
    <div className="theme-activewear bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-ink)]/6 bg-white">
        <div className="w-full px-6 h-10 flex items-center gap-2">
          <div className="h-3 w-10 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main grid: gallery + info */}
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-start">
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
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 pb-4 border-b border-[var(--color-ink)]/8">
              <div className="h-4 w-20 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-7 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-3 w-40 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-3 w-5/6 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-9 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
              <div className="h-9 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
              <div className="h-12 w-full rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--color-ink)]/8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related row */}
      <div className="border-t border-[var(--color-ink)]/8 mt-12">
        <div className="w-full px-4 sm:px-6 py-12">
          <div className="h-5 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse mb-7" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 shrink-0 w-44 sm:w-52">
                <div className="aspect-[3/4] rounded-xl bg-[var(--color-beige)] animate-pulse" />
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
