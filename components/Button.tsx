import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  fullWidth,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)] disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2",
  };

  const variants = {
    primary:
      "bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm hover:bg-[var(--brand-dark)] hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
    ghost:
      "bg-transparent text-[var(--brand)] hover:bg-[var(--brand-soft)] active:scale-[0.98]",
    outline:
      "border-2 border-[var(--brand)] text-[var(--brand)] bg-transparent hover:bg-[var(--brand)] hover:text-[var(--brand-contrast)] active:scale-[0.98]",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
