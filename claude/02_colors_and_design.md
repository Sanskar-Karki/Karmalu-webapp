# 02 — Colors & Design System

## Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| Cherry Cola | `#9E2A2B` | Primary buttons, accents, Active Wear theme |
| Beige | `#F5F0E6` | Living & Decor backgrounds |
| White / Cream | `#FFF9F0` | Page background, cards |
| Text Dark | `#2D2A24` | Body text, headings |

### Tailwind config (`tailwind.config.ts`)
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cherry: "#9E2A2B",
        beige:  "#F5F0E6",
        cream:  "#FFF9F0",
        ink:    "#2D2A24",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
```

## Typography
- **Headings:** display font — `Poppins` or `Plus Jakarta Sans` via `next/font/google`.
- **Body:** `Inter` via `next/font/google`.
- Load with `next/font` for zero layout shift; apply font variables on `<body>`.

## Global base (`app/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-cream text-ink antialiased;
}
```

## Theming per surface
| Surface | Background | Accent |
|---------|-----------|--------|
| Landing | cream | cherry + beige cards |
| Living & Decor | beige | cherry buttons |
| Active Wear | white/cream | cherry accents |

## Interaction patterns
- **Card hover:** lift (`-translate-y-1`) + soft glow (`shadow-lg` / colored shadow) + smooth `transition`.
- **Button hover:** slight scale + darken cherry.
- **Focus states:** visible ring for accessibility (`focus-visible:ring`).
