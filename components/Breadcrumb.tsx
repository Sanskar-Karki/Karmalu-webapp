import Link from "next/link";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-[var(--color-ink-muted)] hover:text-[var(--brand)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--color-ink)] font-medium">{item.label}</span>
            )}
            {!last && <span className="text-[var(--color-ink-muted)]/50">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
