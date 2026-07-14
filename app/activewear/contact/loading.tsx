export default function ActivewearContactLoading() {
  return (
    <div className="theme-activewear w-full px-6 py-16 grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: info */}
      <div className="flex flex-col gap-6">
        <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        <div className="h-8 w-64 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
        <div className="h-4 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />

        <ul className="flex flex-col gap-4 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-16 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-4 w-40 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
            </li>
          ))}
        </ul>
      </div>

      {/* Right: form */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 sm:p-8 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-11 rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
          <div className="h-11 rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
        </div>
        <div className="h-11 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
        <div className="h-28 w-full rounded-xl bg-[var(--color-ink)]/6 animate-pulse" />
        <div className="h-12 w-full rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
      </div>
    </div>
  );
}
