# stripe-ds

A standalone, buildable React design system **reverse-extracted from [stripe.dev](https://stripe.dev/)** — a monochrome "developer terminal" aesthetic: near-black ink on light-grey paper, a single mono typeface, dotted 1px hairlines, tiny radii, an 8px grid, and light (300) weight throughout.

Built with the [`url-to-design-system`](../../.claude/skills/url-to-design-system) skill as its first real run. Its **Storybook is the source of truth for `/design-sync`**.

| Source (stripe.dev) | Reconstruction (Showcase/Homepage) |
| --- | --- |
| ![source](docs/source-reference.png) | ![reconstruction](docs/homepage-reconstruction.png) |

## Install

```bash
npm install   # then:
npm run storybook        # browse components on :6006
npm run build            # library → dist/
npm run build-storybook  # static Storybook
```

## Usage

```tsx
import { DisplayHeading, FeedRow, Card, Button, Tag } from "stripe-ds";
import "stripe-ds/styles.css"; // compiled tokens + component CSS

<DisplayHeading level="display" marker="24">Feed</DisplayHeading>
<FeedRow index="01" title="Stripe Stamps Build Day" meta="Jun 18" href="#" />
```

Importing the package entry also injects the tokens + fonts, so it is self-contained.

## Tokens

`--sd-*` CSS custom properties in `src/styles/tokens.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--sd-paper` | `#e9e9e9` | page / surface background |
| `--sd-ink` | `#1e1e1e` | primary text / foreground |
| `--sd-hairline` | `rgba(30,30,30,.27)` | dotted borders & rules |
| `--sd-muted` | `rgba(30,30,30,.45)` | secondary / meta text |
| `--sd-fill` | `rgba(30,30,30,.067)` | subtle hover / inset fill |
| `--sd-font-mono` | `"Söhne Mono", "IBM Plex Mono"…` | signature face |
| `--sd-fs-mono` / `-body` / `-display` / `-hero` | `12 / 14 / 26 / clamp(56–102)px` | type scale |
| `--sd-module` / `-gutter` | `8px` / `24px` | grid & space |
| `--sd-radius` / `-radius-pill` | `3px` / `99px` | corners |
| `--sd-border-dotted` / `-solid` | `1px dotted` / `1px solid` | the two border treatments |

## Components

Two primitives; everything else composes from them.

| Component | Kind | Notes |
| --- | --- | --- |
| `Frame` | primitive | bordered box (dotted/solid/none, sm/pill radius, interactive/active) |
| `Mono` | primitive | mono text (micro/mono/body/title, ink/muted/inherit, light/medium, caps) |
| `HairlineRule` | composite | dotted divider, horizontal/vertical |
| `Marker` | composite | superscript micro label (the `Feed²⁴` mark) |
| `DisplayHeading` | composite | light-weight hero/section heading + optional Marker |
| `Tag` | composite | pill — Frame + Mono micro |
| `Button` | composite | outlined / primary action — Frame + Mono caps |
| `Card` | composite | dotted tile: media slot + title + body + footer |
| `FeedRow` | composite | feed line: index + title + trailing meta, dotted baseline |

## Fidelity notes

- **Fonts are substituted.** stripe.dev ships Klim's licensed **Söhne / Söhne Mono**; this package names them first in the stack and falls back to free **IBM Plex Mono / Inter** (loaded from Google Fonts). Swap in self-hosted `@font-face` for the genuine faces if licensed.
- **Monochrome by design.** stripe.dev uses no chromatic accent; `--sd-accent` (Stripe blurple) is provided as an opt-in token but unused by default.
- Generative/canvas thumbnails in the source feed are represented by a neutral media slot — they are content, not a reusable token.

## Scripts

| Script | Action |
| --- | --- |
| `npm run build` | `tsc --noEmit && vite build` → `dist/` (ESM + CJS + CSS + `index.d.ts`) |
| `npm run dev` | library watch build |
| `npm run storybook` | Storybook dev on :6006 |
| `npm run build-storybook` | static Storybook |
| `npm run design-cards` | regenerate the `/design-sync` HTML card bundle in `.design-sync/` (run after `build`) |

## /design-sync

Synced to the Claude Design project **"Stripe Dot Dev DS"**. Claude Design renders static HTML preview cards, so `npm run design-cards` emits one `@dsCard`-marked HTML file per component (+ a `styles.css` copied from `dist/`) into `.design-sync/`, then the `DesignSync` tool pushes them (`finalize_plan` → `write_files`). The Storybook remains the human-facing source of truth. See `AGENTS.md` for the re-sync steps.

## License

MIT.
