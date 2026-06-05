import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { ArrowRight } from "@/components/icons";

export default function CategoryCard({
  category,
  href,
  count,
}: {
  category: Category;
  href: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[var(--radius-card)] min-h-[260px] flex flex-col justify-end p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-1 text-white">
        {count !== undefined && (
          <span className="text-[11px] font-semibold tracking-widest uppercase text-white/70">
            {count} item{count !== 1 ? "s" : ""}
          </span>
        )}
        <h3 className="text-2xl font-bold leading-tight">{category.name}</h3>
        <p className="text-sm text-white/80 leading-snug max-w-[22ch]">
          {category.tagline}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 group-hover:gap-2.5 transition-all">
          Explore <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
