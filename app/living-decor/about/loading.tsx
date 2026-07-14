export default function DecorAboutLoading() {
  return (
    <div className="theme-decor flex flex-col">
      {/* Hero */}
      <section className="w-full px-6 pt-16 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5">
          <div className="h-3 w-24 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          <div className="h-10 w-full bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
          <div className="h-10 w-3/4 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-44 rounded-full bg-[var(--color-ink)]/8 animate-pulse" />
        </div>
        <div className="aspect-[4/3] rounded-[var(--radius-card)] bg-[var(--color-beige)] animate-pulse" />
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[var(--color-ink)]/8">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-9 w-16 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-3 w-20 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto w-full px-6 py-16 flex flex-col items-center gap-6">
        <div className="h-3 w-20 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
        <div className="h-8 w-64 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-full">
            <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            <div className="h-3 w-5/6 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="w-full px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] p-6 flex flex-col gap-3"
            >
              <div className="h-4 w-32 bg-[var(--color-ink)]/8 rounded-full animate-pulse" />
              <div className="h-3 w-full bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
              <div className="h-3 w-3/4 bg-[var(--color-ink)]/6 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
