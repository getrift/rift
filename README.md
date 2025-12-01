# Rift

Rift is a dark-only design rules toolkit. It keeps a local `.rift/` spec (tokens, typography, config, and design rules) aligned with both opinionated defaults and whatever your codebase is actually doing. The repo is a pnpm monorepo with:

- `apps/cli`: the `@getrift/rift` CLI (exposes the `rift` binary via Commander + shared logger).
- `packages/core`: default builders, type definitions, and JSON/YAML helpers.
- `packages/tsconfig`: shared TypeScript configuration for Node 20 targets.

## Getting started

```bash
pnpm install
pnpm build
pnpm test
```

All packages inherit the root scripts (`pnpm -r build/test/lint`). The CLI output is fully styled through the shared logger palette defined in `apps/cli/src/utils/logger.ts`.

## The `.rift/` spec

```
.rift/
  ├─ tokens.json        # colors, spacing, radius
  ├─ typography.json    # Geist Sans scale from xs → 3xl
  ├─ config.json        # version, figmaFileId, source metadata
  └─ designrules.yaml   # semantic slots + inferred_from_code trail
```

Defaults come from `packages/core/src/defaults.ts`, mirroring `design-system.md`. You can inspect a fully-populated example (with `inferred_from_code` entries) in `docs/designrules-example.yaml`.

## CLI commands

### `npx @getrift/rift init`
Walks up from the current working directory until it finds a `package.json`, creates `.rift/`, and writes the four spec files using the hard-coded design system. Use `--force` to overwrite existing files. Every write/skip is logged explicitly.

### `npx @getrift/rift pull [figmaFileId]`
Mocked Figma sync: merges mock tokens & typography onto your local spec, updates `config.json` with a deterministic `figmaFileId`, and injects `figma_styles` into `designrules.yaml`. Missing `FIGMA_TOKEN` only triggers a dim warning. The command logs how many color tokens and typography entries changed plus which files were touched.

### `npx @getrift/rift from-code [path]`
Scans `.tsx`/`.jsx` files (regex-only `className="..."` / `className={'...'}`) under `src`, `app`, `components`, or an explicit path. It aggregates Tailwind classes for `bg-*`, `text-*`, and `rounded-*`, then overwrites six semantic slots:

- `color.primary.action`
- `color.primary.surface`
- `radius.button`
- `radius.card`
- `typography.body`
- `typography.heading`

Each change is logged as `slot → class (confidence X.XX)` and tracked inside `designrules.yaml` under `inferred_from_code`.

> Prefer one-off executions with `npx @getrift/rift <command>`. After adding the package locally (`pnpm add -D @getrift/rift`), the `rift` binary is available in `node_modules/.bin`, so you can run `pnpm rift init` or reference it inside project scripts.

## Docs & Tailwind preset

- `docs/designrules-example.yaml` – snapshot of a mixed figma/code spec.
- `docs/usage-examples.md` – CLI walkthroughs and sample `.rift` contents.
- `docs/launch-video-script.md` – 45–60s launch video outline.
- `docs/tailwind.config.rift.cjs` – Tailwind preset (dark mode, palette, radius, Geist Sans).

## Example: Next.js + Shadcn + Rift

Rift Next.js Example CI [![Rift Example](https://github.com/getrift/rift/actions/workflows/rift-example.yml/badge.svg)](https://github.com/getrift/rift/actions/workflows/rift-example.yml)

There’s a minimal Next.js App Router starter that wires Tailwind and Shadcn primitives directly to Rift so you can see how the spec stays in sync with real UI code. It focuses on the ergonomics of editing components while Rift keeps tokens, typography, and usage data aligned.

The example lives in `examples/rift-next-shadcn-example` and walks `.rift/` (tokens, typography, config, designrules) into generated CSS variables, then into Tailwind semantic class helpers, and finally into Shadcn-style building blocks.

- Path: `examples/rift-next-shadcn-example`
- Run from the monorepo root:
  - `pnpm install` (once)
  - `pnpm dev:example`
- Run the Rift workflow:
  - `pnpm rift:example:from-code`
  - `pnpm ci:example` (runs lint + build + from-code together)
- `.rift/designrules.yaml` is enforced in CI; drift is caught by git diff in the “Rift Next.js Example” workflow.

## LLM prompt starter

```
You are Rift Copilot. Read ./design-system.md and the generated ./.rift spec.
When asked to build UI, stick to the provided tokens (background, surface,
accent, error) and typography scale (xs…3xl). Prefer the semantic slots
defined in ./.rift/designrules.yaml (color.primary.action, radius.card, etc).
Explain which slots you touched and why whenever you output code.
```

Use this prompt inside your editor/agent to keep code suggestions aligned with the design rules spec. Refer to `docs/usage-examples.md` for sample command transcripts.
