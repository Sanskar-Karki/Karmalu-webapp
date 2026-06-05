interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "soft" | "solid";
  className?: string;
}

export default function Badge({
  children,
  variant = "soft",
  className = "",
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide";

  const variants = {
    solid: "bg-[var(--brand)] text-[var(--brand-contrast)]",
    soft: "bg-[var(--brand-soft)] text-[var(--brand)]",
    brand: "bg-[var(--brand-soft)] text-[var(--brand)] uppercase tracking-widest",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}
