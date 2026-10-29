/** Matches the three-column product page: info · photo · options. */
export default function OriginalsProductLoading() {
  return (
    <div className="theme-originals bg-[var(--aw-bg)]" aria-busy="true" aria-label="Loading product">
      <div className="flex flex-col lg:grid lg:h-[calc(100svh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Photo */}
        <div className="flex items-center justify-center lg:order-2 lg:h-full lg:[container-type:size]">
          <div className="skeleton aspect-[2/3] w-full lg:w-[min(100cqw,66.667cqh)]" />
        </div>

        {/* Left: description */}
        <div className="flex flex-col gap-4 px-5 pt-7 sm:px-8 lg:order-1 lg:justify-center lg:px-10 xl:px-14">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton mt-4 h-2.5 w-24 rounded-full" />
          <div className="skeleton h-8 w-4/5 rounded-lg" />
          <div className="skeleton h-8 w-3/5 rounded-lg" />
          <div className="mt-3 flex flex-col gap-2">
            <div className="skeleton h-3 w-full max-w-sm rounded-full" />
            <div className="skeleton h-3 w-11/12 max-w-sm rounded-full" />
            <div className="skeleton h-3 w-2/3 max-w-sm rounded-full" />
          </div>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-[var(--aw-ink)]/10 pt-5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-2.5 w-1/2 rounded-full" />
            ))}
          </div>
        </div>

        {/* Right: options */}
        <div className="flex flex-col gap-5 px-5 pb-12 pt-8 sm:px-8 lg:order-3 lg:items-end lg:justify-center lg:px-10 xl:px-14">
          <div className="flex w-full flex-col gap-5 lg:max-w-xs">
            <div className="skeleton h-6 w-32 rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="skeleton h-7 w-7 rounded-full" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="skeleton h-11 w-12" />
              ))}
            </div>
            <div className="skeleton h-12 w-full" />
            <div className="skeleton mx-auto h-3 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
