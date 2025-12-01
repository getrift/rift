# Rift + Next.js + Shadcn Example

This is the Rift Next.js + Shadcn example app. It demonstrates how the local `.rift/` spec (tokens, typography, config, designrules) flows into Tailwind CSS variables and Shadcn-style primitives inside a Next.js App Router project.

CI: Rift Next.js Example [![Rift Example](https://github.com/getrift/rift/actions/workflows/rift-example.yml/badge.svg)](https://github.com/getrift/rift/actions/workflows/rift-example.yml)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS 3.4 with semantic tokens backed by CSS variables
- Hand-rolled Shadcn-inspired components (`Button`, `Card`) that stay on the semantic Tailwind surface
- Rift CLI (`@getrift/rift`) generating `.rift/tokens.json`, `.rift/typography.json`, `.rift/config.json`, and `.rift/designrules.yaml`

## Quick start

This folder lives inside the Rift pnpm workspace—run everything from the monorepo root.

- `pnpm install` (once, installs workspace deps)
- `pnpm dev:example` (serves this app at http://localhost:3000)
- Optional: `pnpm build:example`, `pnpm lint:example`

All colors, typography, and radii come from the CSS variables defined in `app/globals.css`, which mirror the latest `.rift` tokens.

## Rift workflow

Rift scripts live alongside the other workspace commands:

- `pnpm rift:example:init` regenerates `.rift/tokens.json`, `.rift/typography.json`, `.rift/config.json`, and `.rift/designrules.yaml` using the bundled dark design defaults.
- `pnpm rift:example:from-code` runs `npx @getrift/rift from-code app`, scanning `app/**/*.tsx` for classes like `bg-*`, `text-*`, and `rounded-*`, then updating `.rift/designrules.yaml` under `inferred_from_code` so the spec reflects actual usage.

Tailwind wiring remains untouched: `app/globals.css` defines the CSS variables, `tailwind.config.ts` exposes semantic utility names, and the Shadcn-style primitives (`components/ui/*`) only consume those utilities.

## Repo layout

```
.rift/
  tokens.json         # Generated via Rift CLI (colors, radii, spacing)
  typography.json     # Generated via Rift CLI (font sizes, line heights)
  config.json         # Rift project metadata
  designrules.yaml    # Semantic rules + from-code inference
app/
  globals.css         # Tailwind directives + Rift-linked CSS variables
  layout.tsx          # App Router root layout (`class="dark"`)
  page.tsx            # Renders the RiftDemo composition
components/
  rift-demo.tsx       # Dark UI section with semantic Tailwind usage
  ui/button.tsx       # Shadcn-style button backed by tokens
  ui/card.tsx         # Shadcn-style card primitives
lib/
  utils.ts            # `cn` helper for class merging
```

## CI & drift checks

The GitHub Actions workflow `Rift Next.js Example` (`.github/workflows/rift-example.yml`) runs `pnpm ci:example`, which performs lint, build, and `pnpm rift:example:from-code`. The job fails if `examples/rift-next-shadcn-example/.rift/designrules.yaml` changes relative to git HEAD, ensuring the committed spec always matches the generated output.
