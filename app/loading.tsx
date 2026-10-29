export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080605]">
      <div className="flex flex-col items-center gap-4">
        <span className="text-sm font-extrabold tracking-[0.22em] uppercase text-white/30 skeleton">
          KARMALU
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/20 skeleton"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
