# Design & Performance Audit

**Site:** Baisampayan Dey Portfolio (`baisampayan1324.github.io`)
**Date:** 2026-06-29
**Auditor:** Impeccable skill (brand register)
**Stack:** Next.js 16 · React 19 · GSAP 3 · Framer Motion 12 · Lenis 1 · Spline · Tailwind v4

---

## Section 11.B — Brand Audit

### Brand Tokens in Use

| Token | Value | Role |
|-------|-------|------|
| Primary (Gold) | `#FFC000` / `hsl(45 100% 50%)` | CTAs, accents, eyebrows, selection |
| Secondary (Cyan) | `#29ABE2` / `hsl(198 76% 52%)` | Separator accents |
| Background | `#000000` (Obsidian) | Body |
| Surface 1 | `#16181f` | Cards, panels |
| Surface 2 | `#202020` (Charcoal) | |
| Surface 3 | `#181818` (Smoke) | |
| Text Primary | `#FFFFFF` | |
| Text Muted | `#7D7D7D` / `#969696` | |
| Type Display | Haglos (custom) + Deltha (custom) | Hero name / job title |
| Type Label | Syne (Google) | Section labels, buttons |
| Type Body | DM Sans (Google) | Prose, descriptions |
| Type Accent | Cormorant Garamond (Google) | (legacy, minimal use) |
| Radii | `999px` pills, `2xl` cards, `4px` sharp | Inconsistent across components |

### Information Architecture

```
/ (Home)
├── VideoIntro      full-screen cinematic hero; name + job titles + CV CTA
├── NextSection
│   ├── #about      split layout — bio text left, 3D Spline avatar right
│   ├── #education  FlowArt timeline, card-per-entry
│   ├── #experience sticky cascade of experience cards
│   ├── #projects   alternating parallax rows with clip-path scroll reveal
│   └── #technical-arsenal  TechSpheres WebGL-style ball animation
└── ContactSection  marquee + form + social flip-links + footer

/projects           extended project grid
```

No persistent navigation. Scroll is the only traversal mechanism. Back-to-top appears past the hero. All section anchors are reachable via URL hash.

### Patterns to Preserve

1. **Hero video layer** — full-screen video + cinematic gradient overlays. Distinctive when smooth.
2. **Lamborghini Gold on absolute black** — committed, recognisable. Don't dilute with neutrals.
3. **ExperienceStack sticky cascade** — cards stacking with slight tilt. Strong metaphor for stacked experience.
4. **FlipLink contact** — per-letter hover reveal in gold. Signature micro-interaction.
5. **ProjectsParallax clip-path** — scroll-linked directional reveal per project. Impressive when the frame budget holds.
6. **Liquid-metal button** (`lm-btn`) — pure CSS hover shimmer. Zero JS cost, brand-specific detail.

### Patterns Retired (with changes applied)

| Pattern | Location | Why | Fix Applied |
|---------|----------|-----|-------------|
| Eyebrow on every section | About, Experience, Projects, Technical Arsenal, Contact, Education | Absolute ban — AI scaffold | Removed from all sections |
| Side-stripe `borderTop` on experience cards | `experience-stack.tsx:84` | Absolute ban | Replaced with full tinted border + accent bg tint |
| `willChange` on individual char spans | `scroll-float.tsx` | Creates 30–50 compositor layers per heading | Removed |
| 24 animated SVG paths (`pathLength` + `pathOffset`) | `contact-section.tsx` | Forces repaint every frame; 48 paint calls/tick | Reduced to 8, opacity-only animation |
| Duplicate video element (bgBlur) | `video-intro.tsx` | Decodes same stream twice, saturates GPU decoder | Replaced with CSS radial gradient |
| Dead Discord link (`href="#"`) | `portfolio-data.tsx` | Broken link; jumps page | Removed from socials list |
| Page title truncated | `layout.tsx` | "Baisampayan De" missing "y" | Fixed + added full metadata |
| Content gated on `opacity-0` | `experience-stack.tsx` | Section ships blank if observer stalls | Changed to `translate-y` only; content always visible |

### Dial Readings

| Dial | Reading | Evidence |
|------|---------|----------|
| DESIGN_VARIANCE | **High** | Custom fonts, bespoke Spline scene, cinematic video system, per-letter animations |
| MOTION_INTENSITY | **Very High** | GSAP SplitText + ScrollFloat, Framer Motion parallax + clip-path, FlipText, TechSpheres, FloatingPaths, liquid-metal CSS hover |
| VISUAL_DENSITY | **Medium** | Dark bg + generous padding; multiple animation layers add perceptual density |

### SEO Baseline (pre-fix)

- Title: `Baisampayan De` *(truncated bug — fixed)*
- No meta description *(added)*
- No OG tags *(added)*
- Anchors to preserve: `#about` `#education` `#experience` `#projects` `#technical-arsenal` `#contact`
- Routes: `/` `/projects`

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | Title truncated; no prefers-reduced-motion; content gated on opacity; dead link |
| 2 | Performance | 1/4 | Dual auto-play videos; GSAP + FM both tracking scroll; 24 animated SVG paths; willChange on char spans |
| 3 | Responsive Design | 3/4 | Generally solid; hero `whitespace-nowrap` could overflow sub-360px; no persistent mobile nav |
| 4 | Theming | 2/4 | Hard-coded hex mixed with tokens; surface tokens not mapped to Tailwind utilities |
| 5 | Anti-Patterns | 1/4 | Eyebrow on every section (absolute ban); side-stripe border (absolute ban) |
| **Total** | | **9/20** | **Poor → addressed in this pass** |

---

## Detailed Findings

### P0 (Blocking — Fixed)

**P0-1: Page title truncated**
- File: `src/app/layout.tsx:6`
- Was: `'Baisampayan De'`
- Fixed: `'Baisampayan Dey — AI/ML Engineer'` + OG metadata added

**P0-2: Content gated on opacity-0 (ExperienceStack header)**
- File: `src/features/portfolio/components/experience-stack.tsx:48`
- Was: `opacity-0 translate-y-10` — invisible until IntersectionObserver fires; ships blank if JS stalls
- Fixed: Removed `opacity` from the transition; only `translate-y` animates. Content always visible.

**P0-3: Zero prefers-reduced-motion coverage**
- Files: `scroll-float.tsx`, `projects-parallax.tsx`, `contact-section.tsx`, `lenis-provider.tsx`
- Fixed: ScrollFloat skips GSAP animation when reduced-motion active (chars remain visible). ProjectsParallax uses `useReducedMotion()` to zero out all transform/clip values. FloatingPaths hidden when reduced-motion active. Lenis uses `lerp: 1` (instant) when reduced-motion active.

### P1 (Major — Fixed)

**P1-1: Dual auto-play video decode**
- File: `src/features/portfolio/components/video-intro.tsx`
- Was: Two `<video src="/hero-video.mp4">` playing simultaneously — one blurred ambient, one foreground
- Fixed: Removed bgBlur video. CSS `radial-gradient` replicates the ambient glow at zero GPU decode cost. `bgVideoRef` and all related state removed.

**P1-2: willChange on individual character spans**
- File: `src/components/ui/scroll-float.tsx:68`
- Was: `willChange: 'opacity, transform'` in GSAP `fromTo` `from` config — one compositor layer per `<span>`. A 40-char heading = 40 layers.
- Fixed: Removed. GSAP promotes elements automatically during animation. No manual hint needed.

**P1-3: 24 FloatingPaths with pathLength + pathOffset animation**
- File: `src/features/portfolio/components/contact-section.tsx`
- Was: 24 `motion.path` elements animating `pathLength` + `pathOffset` + `opacity` — `pathLength`/`pathOffset` force SVG repaint every frame
- Fixed: Reduced to 8 paths. Animation is opacity-only (`transform`-equivalent for SVG) — compositor-only, no repaint.

**P1-4: Eyebrow label on every section (absolute ban)**
- Files: `about-hero.tsx`, `experience-stack.tsx`, `projects-parallax.tsx`, `technical-arsenal.tsx`, `contact-section.tsx`, `education.tsx`
- Was: Identical `text-xs font-bold uppercase tracking-[0.22em] text-primary` above every section heading. Classic AI scaffold.
- Fixed: Removed from all sections. Education keeps its sequence counter (`01 / 02`) — that's not an eyebrow, it's meaningful sequence data.

**P1-5: Side-stripe borderTop on experience cards (absolute ban)**
- File: `src/features/portfolio/components/experience-stack.tsx:84`
- Was: `borderTop: '2px solid ${exp.accent}50'` — side-stripe pattern with accent color
- Fixed: Full border using `color-mix(in oklch, accent 22%, transparent)` + subtle background tint `color-mix(in oklch, accent 6%, #16181f)`. Each card now has a unique ambient colour from its company accent, without the stripe.

**P1-6: Dead Discord social link**
- File: `src/features/portfolio/constants/portfolio-data.tsx`
- Was: `href: "#"` — page jump and broken link
- Fixed: Discord entry removed from socials array.

### P2 (Minor — Fixed)

**P2-1: Lenis `lerp` too slow + conflicting `duration`**
- File: `src/providers/lenis-provider.tsx`
- Was: `lerp: 0.08, duration: 1.15` — `duration` is ignored when `lerp` is set; 0.08 causes ~12 frame lag
- Fixed: `lerp: 0.11` (snappier), `duration` removed, prefers-reduced-motion sets `lerp: 1` (instant native scroll).

**P2-2: OG metadata missing**
- File: `src/app/layout.tsx`
- Fixed: Added `openGraph` and `twitter` metadata.

**P2-3: Surface tokens not mapped to Tailwind**
- File: `src/app/globals.css`
- Fixed: Added `--color-surface-1`, `--color-surface-2`, `--color-surface-3`, `--color-gold`, `--color-gold-dark`, `--color-obsidian` to `@theme inline`. Components can now use `bg-surface-1`, `text-gold`, etc. Education card migrated from `bg-[#16181f]` to `bg-surface-1`.

---

## Positive Findings (Preserved)

- **Lenis + GSAP ticker integration** — architecturally correct; ticker-driven sync avoids rAF competition
- **`React.memo` on ProjectRow** — prevents re-renders from parent state
- **IntersectionObserver lazy-load for Spline** — 3D scene only initialises when About enters viewport
- **`font-display: swap`** on custom fonts and Google Fonts
- **`overflow-x: clip`** on body/html — correct approach (doesn't hide scroll context)
- **`lm-btn` liquid-metal CSS treatment** — zero JS, brand-distinctive CTA style
- **FlipLink** contact interaction — genuine signature moment
- **`contactAurora` and `contactMarqueeTrack`** already had `prefers-reduced-motion` in CSS — good practice replicated in JS layer

---

## Remaining Recommendations (Not yet applied)

| Priority | Command | Target |
|----------|---------|--------|
| P2 | `/impeccable typeset` | Replace remaining hard-coded hex in `about-hero.tsx` (`bg-[#0a0a0a]`) and `contact-section.tsx` (inline `#494949`) with token classes |
| P2 | `/impeccable harden` | Add OG image (screenshot or generated preview); add `<meta name="theme-color">` |
| P3 | `/impeccable polish` | Verify all touch targets ≥ 44px on mobile; check `whitespace-nowrap` hero name at 360px viewport |
| P3 | `/impeccable adapt` | Add anchor-based section navigation for mobile (no persistent nav currently) |

---

*Re-run `/impeccable audit` after applying remaining changes to verify score improvement. Target: 14+/20.*
