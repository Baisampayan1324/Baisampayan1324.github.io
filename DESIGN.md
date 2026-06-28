# Design System

**Project:** Baisampayan Dey Portfolio
**Register:** Brand (design IS the product)
**Last updated:** 2026-06-29

---

## Identity

**Personality:** Cinematic · Precision-engineered · Quietly aggressive

The site reads like a Lamborghini spec sheet shot by a film director. Black is load-bearing — the gold accent only hits because the obsidian earns it. Motion is intentional; every animated element is doing a job, not decorating.

---

## Color

### Strategy: Committed

One saturated color (Lamborghini Gold) carries 10–15% of the surface. Everything else is obsidian, dark iron, and white type. Cyan appears as a secondary accent — never competing with gold, only complementing it.

### Palette

```
--obsidian:      #000000   Body background. Absolute black.
--smoke:         #181818   Dark Iron. Secondary background areas.
--charcoal:      #202020   Charcoal. Surface panels.
--surface-1:     #16181f   Card background. Slightly blue-shifted.
--surface-2:     #202020   Charcoal panel.
--surface-3:     #181818   Smoke / dark iron.

--gold:          #FFC000   Lamborghini Gold. Primary accent. CTAs only.
--gold-dark:     #917300   Hover / pressed gold.
--gold-text:     #FFCE3E   Inline gold text accents.

--blue-glow:     #29ABE2   Cyan Pulse. Secondary accent. Sparingly.

--text-primary:  #FFFFFF   Pure white body text.
--text-secondary:#7D7D7D   Ash. Muted text.
--text-muted:    #969696   Steel. Placeholder text.

--glass-bg:      #202020   Glass card fill.
--glass-border:  rgba(255,255,255,0.10)  Glass card border.
```

### Tailwind Token Mapping (via `@theme inline` in globals.css)

```
bg-background    → hsl(240 10% 3.9%)   ≈ near-black
bg-surface-1     → #16181f             card bg
bg-surface-2     → #202020             charcoal panel
bg-surface-3     → #181818             smoke
bg-gold          → #FFC000             primary CTA bg
text-gold        → #FFC000             gold text
text-primary     → hsl(0 0% 98%)       white
text-muted-foreground → hsl(240 5% 64.9%)
border-border    → hsl(240 3.7% 15.9%)
```

### Contrast Notes

- `#FFFFFF` on `#000000` → 21:1 ✓ (AAA)
- `#7D7D7D` on `#000000` → ~4.5:1 ✓ (AA body minimum; borderline — don't go lower)
- `#969696` on `#000000` → ~5.5:1 ✓ (AA)
- `#FFC000` on `#000000` → ~10.7:1 ✓ (AAA large text; decorative only for body)
- `#000000` on `#FFC000` → 10.7:1 ✓ (button label — AAA)

**Do not use `--text-secondary` (#7D7D7D) for body text over surfaces lighter than `#000000`.** Contrast drops below AA on `#16181f`.

### Color Rules

- Gold is for CTAs, accent marks, and brand moments only. Not for body text, not for decorative fills.
- Never pair gold and cyan in the same element. Use one per context.
- Surface tints must derive from brand accent: `color-mix(in oklch, accent 6%, #16181f)` for subtle card identity.
- No warm-neutral tints (cream/sand/beige) — the warmth is carried by the gold, not the bg.

---

## Typography

### Type Stack

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display | Haglos (custom OTF) | Regular | Hero name — `font-family: 'Haglos'` |
| Secondary display | Deltha (custom OTF) | Regular | Job title flip animation |
| Label / UI | Syne (Google) | 600–800 | Section headings, button text, metadata |
| Body | DM Sans (Google) | 200–400 | Prose, descriptions, UI copy |

> **Note:** Cormorant Garamond is loaded but minimally used. Do not extend its usage — it is on the reflex-reject list and conflicts with the precision-engineered brand voice.

### Scale

```
Hero name:     clamp(36px, 6.5vw, 84px)    Haglos, via Tailwind text-7xl/9xl
Section head:  clamp(1.8rem, 4.5vw, 3.6rem) Syne 800, via .scroll-float-text
Sub-heading:   text-xl → text-3xl           Syne 700
Body:          text-sm (14px) → text-base (16px)  DM Sans 300–400
Label/eyebrow: [RETIRED — no eyebrows]
Monospace tag: font-family: monospace       Period badges on cards
```

### Rules

- Body line-height: `leading-relaxed` (1.625). Dark-on-dark needs more air.
- Max body width: `max-w-xl` (576px) or `65ch` — not exceeded in current bio blocks.
- Heading letter-spacing: `-0.01em` (tight, engineered look). Never tighten below `-0.04em`.
- `text-wrap: balance` recommended on section headings for even line breaks — add when editing ScrollFloat.
- All-caps: reserved for button labels (`tracking-[0.14em]`) and period/location chips. Never body copy.

---

## Motion

### Philosophy

Cinematic restraint. One well-orchestrated entrance per section. Motion should feel like a documentary, not a trailer.

### Animation Inventory

| Component | Library | Technique | Budget |
|-----------|---------|-----------|--------|
| Hero name | GSAP SplitText (via custom SplitText) | Char stagger from yPercent=120, scaleY=2.3 | Heavy on load, once only |
| Job title | Custom FlipText | Per-char GSAP flip | Repeats every 3s |
| Section headings | GSAP (ScrollFloat) | Char stagger from yPercent=120 | Per section, on scroll |
| Projects | Framer Motion | clip-path + scale + textY + opacity, all scroll-linked via useSpring | Per project row |
| TechSpheres | Framer Motion | Multi-axis useTransform per ball | On scroll |
| FloatingPaths (contact) | Framer Motion | Opacity animation, 8 paths | Continuous but cheap |
| Marquee (contact) | CSS animation | `translateX` loop | Continuous, CSS only |
| Contact aurora | CSS animation | `scale` + `opacity` breathe | Continuous, CSS only |
| Buttons (`lm-btn`) | CSS only | Shine sweep via `::before translateX` | On hover |
| FlipLink (contact) | CSS transitions | Per-letter `translateY` on hover | On hover |
| Scroll | Lenis | `lerp: 0.11`, smoothWheel | Persistent |

### Reduced Motion

All animated components respect `prefers-reduced-motion: reduce`:
- **Lenis**: `lerp: 1` (native scroll speed, no smoothing)
- **ScrollFloat**: GSAP animation skipped; chars visible at final state
- **ProjectsParallax**: All `useTransform` values zeroed; content immediately visible
- **FloatingPaths**: Not rendered when reduced motion active
- **Contact aurora + marquee**: CSS `animation: none` via existing media query

### Performance Rules

- No `willChange` on individual elements. Set on containers only, remove after animation via `onComplete`.
- No `pathLength` or `pathOffset` SVG animations in production — both force repaint.
- No layout property animations (`width`, `height`, `top`, `left`).
- Clip-path and `transform` are compositor-safe — preferred for reveals.
- Two animation libraries (GSAP + Framer Motion) co-exist: GSAP owns enter animations + Lenis ticker; Framer Motion owns scroll-linked parallax. Don't add a third.

---

## Components

### `lm-btn` — Liquid Metal Button

CSS-only shimmer effect applied to CTAs. No JS, no weight.

```css
/* See globals.css — .lm-btn */
position: relative; overflow: hidden; isolation: isolate;
/* ::after = top sheen gradient */
/* ::before = diagonal shine sweep on hover */
/* :active = translateY(1px) scale(0.98) */
```

Apply to: `<a>`, `<button>`, any interactive element that represents a primary CTA.

**Do not apply to:** ghost/text buttons, icon-only buttons, nav links.

### Experience Cards (`.sticky` cascade)

Cards stack with tilt (`rotate-1`, `-rotate-2`, `rotate-2` alternating) and sticky positioning.

```
top: calc(150px + index * 16px)
background: color-mix(in oklch, accent 6%, #16181f)
border: 1px solid color-mix(in oklch, accent 22%, transparent)
```

Each card's accent color derives from `exp.accent` in `portfolio-data.tsx`. The full border + bg tint replaces the retired side-stripe.

### FlipLink

Per-letter hover animation. Used in contact section for social links.

```tsx
// Two stacked divs: one translates up on hover, one reveals from below.
// Delay = letter-index * 25ms
// Color: foreground → primary (gold)
```

### ScrollFloat

GSAP-driven heading reveal. Splits text into words → chars, animates from `yPercent: 120 scaleY: 2.3`.

**Key:** chars are visible by default (`opacity` is only set in the GSAP `fromTo`, never in CSS). If GSAP doesn't run (reduced motion, slow parse), headings appear immediately at full opacity.

### Glass Card (`.contactGlass`)

```css
background: linear-gradient(145deg, glass-1 0%, glass-2 100%);
border: 1px solid glass-line;
backdrop-filter: blur(12px);
/* Mobile: backdrop-filter removed for performance */
```

### SplineScene

Lazy-loaded via IntersectionObserver (`rootMargin: 200px`). Only initialises when the About section is approaching. The container has a fallback radial gradient glow while loading.

---

## Layout

### Grid Structure

- Max content width: `max-w-4xl` (experience), `max-w-6xl` (contact, technical-arsenal), `max-w-7xl` (projects)
- Padding rhythm: `px-4 sm:px-6 md:px-12`
- Section separation: `border-t border-border/50` — thin rule between every section on black
- About section: `md:flex-row`, `md:w-3/5` content / `md:w-2/5` 3D scene

### Spacing Tokens

```
Section vertical padding:  pt-16 sm:pt-20 md:pt-24
Section bottom padding:    pb-[15vh] (experience), pb-0 (tech arsenal)
Card padding:              p-6 sm:p-8 md:p-12
```

### Z-Index Scale

```
1   bgBlur (removed)
2   mainVideo
3   overlays (gradient layers)
8   hero content
10  scroll indicator
50  section content
60  floatingControls (back-to-top)
```

---

## Do / Don't

### Do

- Use `bg-surface-1` / `bg-surface-2` from Tailwind tokens (not hard-coded `#16181f`)
- Use `lm-btn` class on all primary CTAs
- Use `color-mix(in oklch, accent X%, base)` for tinted surfaces
- Test animations on a throttled CPU (DevTools → Performance → CPU 4x slowdown)
- Respect `prefers-reduced-motion` in every new animated component

### Don't

- Add eyebrow labels (small uppercase tracked text above headings) — retired pattern
- Use `border-top` or `border-left` > 1px as an accent colour stripe — retired pattern
- Set `willChange` on individual elements — set on containers only
- Add `pathLength` / `pathOffset` SVG animations — they force repaint
- Introduce a third animation library — GSAP and Framer Motion already co-exist
- Use `duration: 1.15` with Lenis when `lerp` is set — `duration` is ignored, creates confusion
- Hard-code surface hex values (`#16181f`, `#0a0a0a`) — use `bg-surface-1`, `bg-background`
- Render the ambient video layer as a second `<video>` element — use CSS gradient
