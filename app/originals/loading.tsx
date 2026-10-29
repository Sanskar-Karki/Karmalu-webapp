/** Matches the Originals home: dark full-screen hero, strip, then product grid. */
export default function OriginalsLoading() {
  return (
    <div className="theme-originals flex min-h-screen flex-col bg-[var(--aw-bg)]" aria-busy="true" aria-label="Loading">
      <div className="relative h-[100svh] min-h-[600px] bg-[var(--aw-accent)]">
        <div className="skeleton skeleton-dark absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16">
          <div className="skeleton skeleton-dark h-3 w-52 rounded-full" />
          <div className="skeleton skeleton-dark h-14 w-4/5 max-w-2xl rounded-xl sm:h-20" />
          <div className="skeleton skeleton-dark h-14 w-3/5 max-w-xl rounded-xl sm:h-20" />
          <div className="mt-4 flex gap-3">
            <div className="skeleton skeleton-dark h-12 w-36 rounded-full" />
            <div className="skeleton skeleton-dark h-12 w-44 rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-11 bg-[var(--aw-accent)]" />

      <div className="px-5 py-20 sm:px-8 lg:px-14">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton mt-4 h-10 w-64 rounded-lg" />
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-7">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="skeleton aspect-[4/5]" />
              <div className="skeleton h-2.5 w-16 rounded-full" />
              <div className="skeleton h-3.5 w-3/4 rounded-full" />
              <div className="skeleton h-3.5 w-1/3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
