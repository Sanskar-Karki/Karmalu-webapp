export default function DecorLoading() {
  return (
    <div className="theme-decor min-h-screen bg-[var(--page-bg)] flex flex-col">
      {/* Hero skeleton */}
      <div className="relative h-[55vh] min-h-[320px] bg-[var(--color-beige)] skeleton" />

      {/* Grid skeleton */}
      <div className="w-full px-6 py-16">
        <div className="h-8 w-48 bg-[var(--color-ink)]/8 rounded-full mb-8 skeleton" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[3/4] rounded-xl bg-[var(--color-ink)]/6 skeleton" />
              <div className="h-3 w-3/4 bg-[var(--color-ink)]/6 rounded-full skeleton" />
              <div className="h-3 w-1/2 bg-[var(--color-ink)]/6 rounded-full skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
