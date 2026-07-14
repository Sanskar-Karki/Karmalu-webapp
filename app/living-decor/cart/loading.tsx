export default function DecorCartLoading() {
  return (
    <div className="theme-decor w-full px-6 py-12">
      <div className="h-9 w-48 bg-[var(--color-ink)]/8 rounded-full animate-pulse mb-8" />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Line items */}
        <ul className="flex flex-col divide-y divide-[var(--color-ink)]/8">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex gap-4 py-5">
              <div className="w-24 h-24 rounded-xl bg-[var(--color-beige)] shrink-0 animate-pulse" />
              <div className="flex flex-1 flex-col gap-2 min-w-0 justify-center">
                <div className="h-3 w-20 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
                <div className="h-4 w-3/4 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-ink)]/6 animate-pulse" />
                <div className="h-8 w-20 rounded-full bg-[var(--color-ink)]/6 animate-pulse" />
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 flex flex-col gap-4">
          <div className="h-5 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
          <div className="h-14 w-full rounded-lg bg-[var(--brand-soft)] animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            <div className="h-4 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          </div>
          <div className="h-5 w-full bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
          <div className="h-12 w-full rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
        </aside>
      </div>
    </div>
  );
}
