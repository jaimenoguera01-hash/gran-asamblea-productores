# Design Brief

## Direction

Celeste Cívico — a warm, professional political event invitation in Venezuelan sky-blue with white type and a golden accent.

## Tone

Warm editorial civic pride — confident saturated celeste rather than pastel, so white text feels bold and trustworthy, not washed out.

## Differentiation

A full-bleed celeste atmosphere with layered translucent panels, a golden serif headline treatment, and a glowing hero card of the tractor-and-cornfield scene.

## Color Palette

| Token      | OKLCH        | Role                                  |
| ---------- | ------------ | ------------------------------------- |
| background | 0.62 0.128 235 | Dominant celeste page field          |
| foreground | 0.99 0.008 235 | White type on all surfaces           |
| card       | 0.55 0.14 237  | Deeper celeste panels and form card  |
| primary    | 0.82 0.155 84  | Warm gold CTAs (Guardar)             |
| accent     | 0.46 0.15 242  | Deep sky for outlines and links      |
| muted      | 0.58 0.115 236 | Recessive surfaces and dividers      |
| success    | 0.72 0.18 150  | "Registro exitoso" confirmation      |

## Typography

- Display: Fraunces — hero and section headings, warm editorial serif
- Body: Figtree — paragraphs, labels, form fields, UI
- Mono: Geist Mono — cédula/phone numeric inputs
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Celeste gradient field with translucent cards; soft `shadow-elevated` for panels and a white `shadow-glow` on the hero image card.

## Structural Zones

| Zone    | Background            | Border            | Notes                                      |
| ------- | --------------------- | ----------------- | ------------------------------------------ |
| Header  | `bg-card/70` + blur   | `border-b border-white/15` | Logo left, wordmark, municipality label |
| Content | celeste gradient field | —                | Alternating `bg-card/40` panels for rhythm |
| Footer  | `bg-accent/60`        | `border-t border-white/15` | Event identification, muted white type |

## Spacing & Rhythm

Sections separated by `py-16 md:py-24`; content grouped in `space-y-6`; micro-spacing `gap-3`/`gap-4`; generous whitespace keeps the celeste field breathing.

## Component Patterns

- Buttons: gold `bg-primary text-primary-foreground rounded-full px-7 py-3 font-semibold shadow-elevated`, hover lift via `transition-smooth`; secondary is transparent with `border border-white/40` white text
- Cards: `rounded-2xl` translucent celeste `bg-card/60 backdrop-blur` with `shadow-elevated`
- Badges: pill `rounded-full bg-white/15 text-white text-xs font-semibold tracking-widest uppercase`

## Motion

- Entrance: `animate-fade-up` staggered on hero copy and form, 0.6s ease-out
- Hover: buttons and cards lift with `transition-smooth` 0.3s
- Decorative: slow `animate-float` on the hero image card; ambient radial glow behind hero

## Constraints

- Celeste background with white text throughout; never dark text on celeste
- Success notice must render in green (`text-success` / `bg-success`)
- Interface in Spanish; warm and professional, no neon or garish gradients
- Never reference the design preview image from frontend code

## Signature Detail

A glowing white-rimmed hero card floating over the celeste field, pairing a golden serif headline with the warm tractor-and-cornfield scene — civic warmth, not corporate tech.
