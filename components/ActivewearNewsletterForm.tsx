"use client";

export default function ActivewearNewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-5 py-3.5 rounded-full bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-[var(--aw-highlight)] transition-colors text-sm"
      />
      <button
        type="submit"
        className="px-7 py-3.5 rounded-full bg-[var(--aw-highlight)] text-[var(--aw-ink)] font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors whitespace-nowrap"
      >
        Join Now
      </button>
    </form>
  );
}
