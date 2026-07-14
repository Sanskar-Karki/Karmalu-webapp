export default function DecorFaqLoading() {
  return (
    <div className="theme-decor max-w-3xl mx-auto px-6 py-16">
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        <div className="h-8 w-72 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
        <div className="h-4 w-full max-w-md bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
      </div>

      <ul className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="rounded-2xl bg-white shadow-[var(--shadow-card)] px-6 py-5 flex items-center justify-between gap-4"
          >
            <div className="h-4 w-3/4 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
            <div className="w-5 h-5 rounded-full bg-[var(--color-ink)]/6 shrink-0 animate-pulse" />
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl bg-[var(--brand-soft)] py-10 px-6">
        <div className="h-6 w-56 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
        <div className="h-4 w-full max-w-md bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        <div className="h-10 w-36 rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
      </div>
    </div>
  );
}
