import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";

interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  story: string[];
  stats: { value: string; label: string }[];
  values: { title: string; body: string }[];
  ctaHref: string;
}

export default function AboutView({ content }: { content: AboutContent }) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="w-full px-6 pt-16 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand)]">
            {content.eyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-ink)] tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed">
            {content.intro}
          </p>
          <div>
            <Button href={content.ctaHref} size="lg">
              Shop the collection
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-beige)]">
          <ProductImage
            preset="card"
            src={content.image}
            alt={content.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[var(--color-ink)]/8">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {content.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[var(--brand)]">
                {s.value}
              </span>
              <span className="text-xs sm:text-sm text-[var(--color-ink-muted)] uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto w-full px-6 py-16 flex flex-col gap-6">
        <SectionHeader eyebrow="Our story" title="Why we do this" align="center" />
        {content.story.map((p, i) => (
          <p key={i} className="text-[var(--color-ink-muted)] leading-relaxed text-center">
            {p}
          </p>
        ))}
      </section>

      {/* Values */}
      <section className="w-full px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {content.values.map((v) => (
            <div
              key={v.title}
              className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] p-6 flex flex-col gap-2"
            >
              <h3 className="font-bold text-[var(--color-ink)]">{v.title}</h3>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
