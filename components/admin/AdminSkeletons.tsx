/** Loading placeholders that mirror the admin page layouts. */

export function ProductsListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading products">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="skeleton h-8 w-40 rounded-lg" />
          <div className="skeleton mt-2 h-3.5 w-80 max-w-full rounded-full" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:justify-between">
        <div className="skeleton h-11 w-72 rounded-2xl" />
        <div className="flex gap-2">
          <div className="skeleton h-11 w-48 rounded-xl" />
          <div className="skeleton h-11 w-64 rounded-xl" />
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-black/[0.07] bg-white">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-black/[0.05] px-5 py-3 last:border-0">
            <div className="skeleton h-14 w-11 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-3.5 w-48 max-w-full rounded-full" />
              <div className="skeleton h-2.5 w-24 rounded-full" />
            </div>
            <div className="skeleton hidden h-3 w-20 rounded-full sm:block" />
            <div className="skeleton hidden h-3 w-16 rounded-full sm:block" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
      <div className="skeleton h-4 w-28 rounded-full" />
      <div className="mt-5 flex flex-col gap-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="skeleton h-2.5 w-20 rounded-full" />
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductFormSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading product">
      <div className="skeleton h-3 w-20 rounded-full" />
      <div className="skeleton mt-2 h-8 w-72 max-w-full rounded-lg" />
      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <SectionSkeleton rows={5} />
          <SectionSkeleton rows={2} />
        </div>
        <div className="flex flex-col gap-5">
          <SectionSkeleton rows={1} />
          <div className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
            <div className="skeleton h-4 w-32 rounded-full" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton aspect-[4/5] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading photos and videos">
      <div className="skeleton h-8 w-56 rounded-lg" />
      <div className="skeleton mt-2 h-3.5 w-96 max-w-full rounded-full" />
      <div className="skeleton mt-6 h-32 w-full rounded-2xl" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
            <div className="skeleton aspect-square" />
            <div className="flex flex-col gap-2 p-3">
              <div className="skeleton h-3 w-3/4 rounded-full" />
              <div className="skeleton h-2.5 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading categories">
      <div className="skeleton h-8 w-44 rounded-lg" />
      <div className="skeleton mt-2 h-3.5 w-96 max-w-full rounded-full" />
      <div className="mt-8 flex justify-between">
        <div className="skeleton h-11 w-64 rounded-2xl" />
        <div className="skeleton h-10 w-36 rounded-xl" />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-3xl border border-black/[0.07] bg-white p-4">
            <div className="skeleton h-12 w-6 rounded-lg" />
            <div className="skeleton h-16 w-24 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-3.5 w-32 rounded-full" />
              <div className="skeleton h-2.5 w-56 max-w-full rounded-full" />
            </div>
            <div className="skeleton h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePicksSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading new arrivals">
      <div className="skeleton h-8 w-40 rounded-lg" />
      <div className="skeleton mt-2 h-3.5 w-96 max-w-full rounded-full" />
      <div className="skeleton mt-8 h-11 w-64 rounded-2xl" />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {[6, 8].map((rows, col) => (
          <div key={col} className="rounded-3xl border border-black/[0.07] bg-white p-5 sm:p-6">
            <div className="skeleton h-4 w-40 rounded-full" />
            <div className="mt-5 flex flex-col gap-2">
              {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-1.5">
                  <div className="skeleton h-12 w-10 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="skeleton h-3 w-40 max-w-full rounded-full" />
                    <div className="skeleton h-2.5 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
