export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--brand)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--color-ink-muted)] max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
