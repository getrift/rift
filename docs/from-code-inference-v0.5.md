# Rift from-code Inference v0.5

## Overview
- Purpose: enrich `rift from-code` so design rules capture evidence from the codebase, not just a single class pick per slot.
- Scope for v0.5: add usage stats (`usageCount`, `files`) to inferred entries and introduce a light-weight typography mapping from Tailwind classes to semantic slots.
- Non-goals: role detection (buttons/cards/layout), AST parsing, new CLI flags, or live Figma/HTTP calls.

## Current vs v0.5 Behavior
- **Current (v0)**: `inferred_from_code` entries only include `slot`, `className`, `confidence`, `sampleFiles`.
  ```yaml
  inferred_from_code:
    - slot: color.primary.action
      className: bg-accent
      confidence: 0.76
      sampleFiles:
        - app/components/Button.tsx
  ```
- **Target (v0.5)**: enrich entries with usage stats; fields remain optional for backward compatibility.
  ```yaml
  inferred_from_code:
    - slot: color.primary.action
      className: bg-accent
      confidence: 0.76
      usageCount: 46
      files:
        - app/components/Button.tsx
        - app/components/CTA.tsx
    - slot: color.primary.action
      className: bg-sky-500
      confidence: 0.05
      usageCount: 3
      files:
        - app/modals/WeirdModal.tsx
  ```

## Typography Mapping (Tailwind → Semantic Slots)
- Mapping used during inference (strongest/most-specific wins when multiple classes appear together):

| Tailwind class            | Semantic slot            |
| ------------------------- | ------------------------ |
| `text-xs`, `text-sm`      | `typography.body` (body.small) |
| `text-base`, `text-lg`    | `typography.body` (body.default) |
| `text-xl`, `text-2xl+`    | `typography.heading` |

- Ambiguity resolution:
  - If multiple typography classes are present on the same element, prefer the larger/heading class.
  - Aggregation across files: pick the most frequent class per semantic slot when writing back to `designrules.yaml`.

## Data Model Impact
- `InferredFromCodeEntry` (packages/core/src/types.ts):
  - Add optional `usageCount?: number`
  - Add optional `files?: string[]`
- YAML compatibility:
  - Older specs without these fields remain valid; new fields are additive.
  - `sampleFiles` stays supported; `files` is for aggregated per-entry evidence (deduped, truncated).

## Invariants
- Ordering: sort `inferred_from_code` by `slot`, then `className` to keep diffs stable.
- File list cap: store only a small number of file paths per entry (e.g., first 10 unique) to keep YAML readable.
- Aggregation: counts accumulate per class across all scanned files; files are de-duplicated.
- Slot updates: slot `className` picks the most frequent candidate per semantic slot; sources move to `code`/`mixed` as before.

## Non-goals
- No role detection (buttons/cards/layout).
- No AST parsing or heavy parsers; stay regex/string-based.
- No new CLI flags unless unavoidable (v0.5 reuses existing surface).
- No real Figma/HTTP calls; mocks only.
