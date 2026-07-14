export default function ActivewearLoading() {
  return (
    <div className="theme-activewear min-h-screen bg-[var(--page-bg)] flex flex-col">
      {/* Hero skeleton */}
      <div className="relative min-h-screen bg-[var(--aw-secondary)] animate-pulse" />

      {/* Grid skeleton */}
      <div className="w-full px-6 py-16">
        <div className="h-8 w-48 bg-[var(--aw-ink)]/8 rounded-full mb-8 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/5] rounded-2xl bg-[var(--aw-ink)]/6 animate-pulse" />
              <div className="h-3 w-3/4 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
              <div className="h-3 w-1/2 bg-[var(--aw-ink)]/6 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
