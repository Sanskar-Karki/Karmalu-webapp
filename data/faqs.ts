import type { Brand } from "@/types";
import type { FaqItem } from "@/components/FaqView";

const shared: FaqItem[] = [
  {
    q: "How long does shipping take?",
    a: "Available delivery options and charges are shown during checkout. We will confirm the delivery estimate with you over WhatsApp.",
  },
  {
    q: "What is your return policy?",
    a: "For help with a return or exchange, contact us through the contact page and include your order ID.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Orders are submitted through checkout and confirmed with you on WhatsApp. Cash payment is due when your order is delivered.",
  },
  {
    q: "Can I track my order?",
    a: "We will share delivery updates with you over WhatsApp after confirming your order.",
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

const originals: FaqItem[] = [
  {
    q: "How do I choose the right size?",
    a: "Check the sizes available on each product page. If you need help choosing a fit, send us a message through the contact page.",
  },
  {
    q: "How should I care for my clothes?",
    a: "Follow the care details listed on each product page. For most everyday pieces, wash cold on a gentle cycle and hang to dry.",
  },
  {
    q: "Can I change or cancel an order?",
    a: "Contact us as soon as possible through WhatsApp after placing your order. We will confirm what changes can be made before dispatch.",
  },
];

export function getFaqs(brand: Brand): FaqItem[] {
  return brand === "decor" ? [...decor, ...shared] : [...originals, ...shared];
}
