interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const ArrowRight = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const ArrowLeft = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const Cart = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const Plus = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const Trash = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const Star = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const Check = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const Close = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Menu = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

export const Search = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const Heart = ({ size = 20, className, filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"} className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const Truck = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 18.5a1.5 1.5 0 1 0 0 .01M18.5 18.5a1.5 1.5 0 1 0 0 .01" />
  </svg>
);

export const Lock = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const WhatsApp = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.43 9.43zM20.5 3.49A11.78 11.78 0 0 0 12.04 0C5.55 0 .28 5.27.27 11.74c0 2.07.54 4.09 1.57 5.87L.17 24l6.55-1.72a11.75 11.75 0 0 0 5.32 1.35h.01c6.49 0 11.76-5.27 11.77-11.74a11.68 11.68 0 0 0-3.32-8.4z" />
  </svg>
);

export const Refresh = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export const GridSmall = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <rect x="13" y="13" width="8" height="8" rx="1" />
  </svg>
);

export const GridMedium = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    {[2, 9.5, 17].map((x) =>
      [2, 9.5, 17].map((y) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" />
      ))
    )}
  </svg>
);

export const GridDense = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    {[1, 6.3, 11.6, 16.9].map((x) =>
      [1, 6.3, 11.6, 16.9].map((y) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="3.5" height="3.5" rx="0.8" />
      ))
    )}
  </svg>
);

export const Tag = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const SlidersHorizontal = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="9" cy="6" r="1.8" fill="currentColor" stroke="none" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="11" cy="18" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);
