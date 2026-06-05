import type { Brand } from "@/types";
import type { FaqItem } from "@/components/FaqView";

const shared: FaqItem[] = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–5 business days. Express options are available at checkout. Orders over $150 ship free.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return window on unused items in their original packaging. Returns are free — just reach out and we'll send a prepaid label.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept all major credit and debit cards. (This is a demo store, so no real payment is processed at checkout.)",
  },
  {
    q: "Can I track my order?",
    a: "Yes — once your order ships you'll receive a tracking link by email so you can follow it every step of the way.",
  },
];

const decor: FaqItem[] = [
  {
    q: "Are your pieces handmade?",
    a: "Many are. We work with small makers and artisans, so items like our stoneware vases and wool rugs carry the subtle, beautiful marks of the maker's hand.",
  },
  {
    q: "How do I care for natural materials?",
    a: "Each product page lists specific care notes. As a rule, spot-clean rugs and cushions, dust lamps with a dry cloth, and keep stoneware out of the dishwasher.",
  },
  {
    q: "Do you offer interior styling advice?",
    a: "Absolutely. Drop us a note via the contact page with a photo of your space and we'll suggest pieces that work together.",
  },
];

const activewear: FaqItem[] = [
  {
    q: "How do I choose the right size?",
    a: "Every product page includes a fit note (athletic, relaxed, compression). If you're between sizes, size up for a relaxed fit or down for compression.",
  },
  {
    q: "Is the gear sweat-wicking?",
    a: "Most of our tops and leggings use moisture-wicking, quick-dry fabrics. Look for the fabric details listed on each product page.",
  },
  {
    q: "Can I machine wash my activewear?",
    a: "Yes — wash cold on a gentle cycle and hang to dry to preserve stretch and technical finishes. Avoid fabric softener.",
  },
];

export function getFaqs(brand: Brand): FaqItem[] {
  return brand === "decor" ? [...decor, ...shared] : [...activewear, ...shared];
}
