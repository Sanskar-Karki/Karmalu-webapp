"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useBrand } from "@/store/BrandProvider";
import Reveal from "@/components/Reveal";
import { ArrowRight, Check, Copy, Mail, MapPin, Phone, WhatsApp } from "@/components/icons";

const EMAIL = "karmaluoriginals20@gmail.com";
const PHONE_DISPLAY = "+977 9768990584";
const PHONE_TEL = "+9779768990584";
const LOCATION = "Teku, Kathmandu";
/** What Google Maps searches for — the shop's listing name plus area. */
const MAP_QUERY = "Karmalu Living & Decor, Teku, Kathmandu";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "").replace(/\D/g, "");

const TOPICS = ["An order", "Sizing & fit", "Collaboration", "Something else"] as const;

const SOCIALS = [
  { label: "Instagram", handle: "@karmalu_originals", href: "https://www.instagram.com/karmalu_originals/" },
  { label: "TikTok", handle: "@karmalu.originals", href: "https://www.tiktok.com/@karmalu.originals" },
  { label: "Facebook", handle: "Karmalu Originals", href: "https://www.facebook.com/profile.php?id=61594093221355" },
];

/** Input with a label that floats up on focus / when filled. */
function Field({
  label,
  textarea = false,
  ...props
}: {
  label: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const control =
    "peer w-full rounded-2xl border border-[var(--color-ink)]/12 bg-white px-4 pb-2.5 pt-6 text-sm text-[var(--color-ink)] outline-none transition-all duration-300 placeholder:text-transparent hover:border-[var(--color-ink)]/30 focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_var(--brand-soft)]";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea {...props} placeholder=" " rows={5} className={`${control} resize-none`} />
      ) : (
        <input {...props} placeholder=" " className={control} />
      )}
      <span className="pointer-events-none absolute left-4 top-4 text-sm text-[var(--color-ink-muted)] transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.15em] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.15em]">
        {label}
      </span>
    </label>
  );
}

function ContactCard({
  icon,
  label,
  value,
  action,
  href,
  external = false,
  copyValue,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  action: string;
  href: string;
  external?: boolean;
  copyValue?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue!);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the link still works */
    }
  };

  return (
    <div className="group relative flex h-full flex-col rounded-3xl border border-[var(--color-ink)]/8 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_24px_60px_-28px_rgba(20,16,15,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--color-ink)] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-[var(--brand)] group-hover:text-[var(--brand-contrast)]">
          {icon}
        </span>
        {copyValue && (
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
            className="relative z-10 flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-1.5 break-words text-[15px] font-medium text-[var(--color-ink)]">{value}</p>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink)] after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[var(--brand)]"
      >
        {action}
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
}

export default function ContactView() {
  const { label, brand, basePath } = useBrand();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Hi Karmalu ${label}!`,
      `Topic: ${topic}`,
      `Name: ${form.name}`,
      ...(form.email ? [`Email: ${form.email}`] : []),
      "",
      form.message,
    ].join("\n");
    const url = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`
      : `mailto:${EMAIL}?subject=${encodeURIComponent(`${topic} — ${form.name}`)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const headline = ["Let's", "talk."];

  return (
    <div className="relative isolate overflow-hidden">
      {/* Ambient brand glows */}
      <div aria-hidden className="animate-blob absolute -left-32 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[var(--brand-soft)] blur-3xl" />
      <div aria-hidden className="animate-blob-slow absolute -right-24 top-72 -z-10 h-[22rem] w-[22rem] rounded-full bg-[var(--brand-soft)] blur-3xl" />

      {/* ── Hero ── */}
      <section className="flex flex-col gap-12 px-5 pb-12 pt-14 sm:px-8 sm:pt-20 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:pb-16 lg:pt-24">
        <div>
        <p className="rise-in inline-flex items-center gap-3 rounded-full border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-ink-muted)] backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-[var(--brand)]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
          </span>
          Get in touch
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.25rem,11vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)]">
          {headline.map((word, i) => (
            <span key={word}>
              {i > 0 && " "}
              <span className="word-mask">
                <span style={{ "--d": `${150 + i * 110}ms` } as CSSProperties}>
                  {i === 1 ? <em className="font-serif font-normal italic">{word}</em> : word}
                </span>
              </span>
            </span>
          ))}
        </h1>
        <p
          className="rise-in mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-ink-muted)]"
          style={{ animationDelay: "0.45s" }}
        >
          Questions about {label}, an order, sizing or a collaboration? We&apos;d
          love to hear from you — message us and we&apos;ll get back to you within
          one business day.
        </p>
        </div>

        {brand === "originals" && (
          <div
            className="rise-in w-full lg:max-w-sm"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-ink-muted)]">
              <span aria-hidden className="h-px w-8 bg-[var(--brand)]" />
              Follow us
            </p>
            <ul className="mt-4 border-t border-[var(--color-ink)]/10">
              {SOCIALS.map((s) => (
                <li key={s.label} className="border-b border-[var(--color-ink)]/10">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between gap-4 overflow-hidden px-1 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]"
                  >
                    <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[var(--color-ink)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                    <span className="transition-all duration-500 group-hover:translate-x-3">
                      <span className="block font-display text-xl font-medium tracking-[-0.02em] text-[var(--color-ink)] transition-colors duration-300 group-hover:text-white">
                        {s.label}
                      </span>
                      <span className="block text-xs text-[var(--color-ink-muted)] transition-colors duration-300 group-hover:text-white/60">
                        {s.handle}
                      </span>
                    </span>
                    <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)] transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-white group-hover:bg-white">
                      <ArrowRight size={14} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Ways to reach us ── */}
      <section className="grid gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
        {[
          WHATSAPP_NUMBER && {
            icon: <WhatsApp size={20} />,
            label: "WhatsApp",
            value: "Chat with our team",
            action: "Start a chat",
            href: `https://wa.me/${WHATSAPP_NUMBER}`,
            external: true,
          },
          {
            icon: <Mail size={20} />,
            label: "Email",
            value: EMAIL,
            action: "Send an email",
            href: `mailto:${EMAIL}`,
            copyValue: EMAIL,
          },
          {
            icon: <Phone size={20} />,
            label: "Phone",
            value: PHONE_DISPLAY,
            action: "Call us",
            href: `tel:${PHONE_TEL}`,
            copyValue: PHONE_DISPLAY,
          },
          {
            icon: <MapPin size={20} />,
            label: "Visit",
            value: LOCATION,
            action: "Open in Maps",
            href: MAPS_URL,
            external: true,
          },
        ]
          .filter((card) => !!card)
          .map((card, i) => (
            <Reveal key={card.label} delay={i * 100} className="h-full">
              <ContactCard {...card} />
            </Reveal>
          ))}
      </section>

      {/* ── Form + map ── */}
      <section className="grid gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-14 lg:py-20">
        <Reveal>
          <div className="rounded-[2rem] border border-[var(--color-ink)]/8 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(20,16,15,0.45)] sm:p-10">
            {sent ? (
              <div className="animate-fade-in-up flex flex-col items-center gap-4 py-12 text-center">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-contrast)]">
                  <span className="absolute inset-0 animate-ping-slow rounded-full bg-[var(--brand)] opacity-40" />
                  <Check size={28} className="relative" />
                </span>
                <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-[var(--color-ink)]">
                  Almost there!
                </h2>
                <p className="max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  We opened {WHATSAPP_NUMBER ? "WhatsApp" : "your email app"} with your message ready — just
                  press send there and our team will reply within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-2 rounded-full border border-[var(--color-ink)]/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
                >
                  Edit message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-ink-muted)]">
                    Send us a message
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-[var(--color-ink)] sm:text-3xl">
                    What&apos;s it about?
                  </h2>
                </div>

                <div role="radiogroup" aria-label="Topic" className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={topic === t}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
                        topic === t
                          ? "scale-105 border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                          : "border-[var(--color-ink)]/15 text-[var(--color-ink)] hover:border-[var(--color-ink)]/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name" required value={form.name} onChange={set("name")} autoComplete="name" />
                  <Field label="Email (optional)" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </div>
                <Field label="Your message" textarea required value={form.message} onChange={set("message")} />

                <button
                  type="submit"
                  className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--color-ink)] px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-transform active:scale-[0.98]"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--brand)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <span className="relative flex items-center gap-3 transition-colors duration-300 group-hover:text-[var(--brand-contrast)]">
                    {WHATSAPP_NUMBER ? <WhatsApp size={16} /> : <Mail size={16} />}
                    {WHATSAPP_NUMBER ? "Send via WhatsApp" : "Send via email"}
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-[var(--color-ink-muted)]">
                  Your message opens in {WHATSAPP_NUMBER ? "WhatsApp" : "your email app"}, ready to send.
                </p>
              </form>
            )}
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={120} className="flex-1">
            <div className="group relative h-full min-h-[300px] overflow-hidden rounded-[2rem] border border-[var(--color-ink)]/8 bg-[var(--color-ink)]/5">
              <iframe
                title={`Map of ${LOCATION}`}
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale transition-[filter] duration-700 group-hover:grayscale-0"
              />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[11px] font-medium text-[var(--color-ink)] shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MapPin size={14} />
                {LOCATION}
              </a>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <Link
              href={`${basePath}/faq`}
              className="group flex items-center justify-between gap-4 rounded-[2rem] bg-[var(--color-ink)] p-6 text-white transition-transform duration-500 hover:-translate-y-1 sm:p-7"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
                  Quick answers
                </p>
                <p className="mt-1.5 font-display text-lg font-medium">
                  Sizing, delivery &amp; orders — see the FAQ
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-white group-hover:text-[var(--color-ink)]">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
