# `.rift/` Specification (v0)

The `.rift/` directory is a local design spec workspace shared by the Rift CLI, Tailwind/Shadcn UI kits, and automation agents. Every file captures the dark-only v0 design system used in React + Tailwind projects so downstream code can stay aligned without reverse engineering the CLI. This spec keeps the shapes stable for humans and LLMs editing the folder.

## File Relationships

```
tokens.json ─────────────────┐
                             ├──► designrules.yaml references token values
typography.json ─────────────┘    via Tailwind class names (bg-*, text-*, rounded-*)

config.json ──────────────────────► metadata only, no runtime coupling
```

- Adding a color to `tokens.json` makes `bg-<color>` / `text-<color>` utilities available to `designrules.yaml`.
- `designrules.yaml` slots must only reference Tailwind classes backed by `tokens.json` or `typography.json`.
- `inferred_from_code` entries are generated from actual code scans and should never be authored manually.

## Per-file Schema Descriptions

### `tokens.json`

**Shape (TypeScript `Tokens`):**

```json
{
  "colors": {
    "background": "string",
    "surface": "string",
    "surfaceHover": "string",
    "border": "string",
    "text": "string",
    "textMuted": "string",
    "textSubtle": "string",
    "accent": "string",
    "accentHover": "string",
    "error": "string"
  },
  "spacing": ["number", "..."],
  "radius": {
    "none": "string",
    "sm": "string",
    "md": "string",
    "lg": "string"
  }
}
```

**Example (`createDefaultTokens()`):**

```json
{
  "colors": {
    "background": "#0D0D0D",
    "surface": "#1A1A1A",
    "surfaceHover": "#262626",
    "border": "#333333",
    "text": "#FFFFFF",
    "textMuted": "#A3A3A3",
    "textSubtle": "#737373",
    "accent": "#00FF99",
    "accentHover": "#00CC77",
    "error": "#FF3333"
  },
  "spacing": [4, 8, 12, 16, 20, 24, 32, 48, 64],
  "radius": {
    "none": "0px",
    "sm": "2px",
    "md": "6px",
    "lg": "8px"
  }
}
```

### `typography.json`

**Shape (TypeScript `TypographyScale`):** record whose keys (defaults: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`) each contain `{ "fontSize": string, "lineHeight": string }`.

**Example (`createDefaultTypography()`):**

```json
{
  "xs": { "fontSize": "11px", "lineHeight": "16px" },
  "sm": { "fontSize": "12px", "lineHeight": "18px" },
  "base": { "fontSize": "14px", "lineHeight": "20px" },
  "lg": { "fontSize": "16px", "lineHeight": "24px" },
  "xl": { "fontSize": "20px", "lineHeight": "28px" },
  "2xl": { "fontSize": "24px", "lineHeight": "32px" },
  "3xl": { "fontSize": "30px", "lineHeight": "36px" }
}
```

### `config.json`

**Shape (TypeScript `RiftConfig`):**

```json
{
  "version": "string",
  "source": "core|figma|code|mixed",
  "figmaFileId": "string?",
  "lastSyncedAt": "string?"
}
```

- `version` → stamped by `rift init` (v0 = `0.0.1`) and only changes with CLI schema bumps.
- `source` → reflects which workflow last touched the folder (`core` on init, `figma`/`mixed` after `rift pull`, `code` after `rift from-code`).
- `figmaFileId` → populated by `rift pull <fileId>`; user may update to point at a different file before the next pull.
- `lastSyncedAt` → ISO timestamp set during pull to track integration recency.

**Example (v0 `createDefaultConfig()`):**

```json
{
  "version": "0.0.1",
  "source": "core"
}
```

### `designrules.yaml`

**Shape (TypeScript `DesignRules`):**

```yaml
version: string
source: core|figma|code|mixed
color:
  primary:
    action: DesignRuleSlot
    surface: DesignRuleSlot
radius:
  button: DesignRuleSlot
  card: DesignRuleSlot
typography:
  body: DesignRuleSlot
  heading: DesignRuleSlot
inferred_from_code: InferredFromCodeEntry[]
figma_styles?: string[]
```

`DesignRuleSlot` requires `className` and `source` and may include `description`, `confidence`, `scale`, or `sampleFiles`. `InferredFromCodeEntry` captures telemetry (`slot`, `className`, `confidence`, `sampleFiles`) from `rift from-code`.

**Example (default-inspired):**

```yaml
version: 0.0.1
source: core
color:
  primary:
    action:
      className: bg-accent text-black
      source: core
      description: Primary action buttons use the neon accent on dark backgrounds.
    surface:
      className: bg-surface text-text
      source: core
      description: Primary surfaces contrast against the background.
radius:
  button:
    className: rounded-md
    source: core
    description: Default button radius (6px).
  card:
    className: rounded-lg
    source: core
    description: Card radius (8px) for panels.
typography:
  body:
    className: text-base text-text
    scale: base
    source: core
    description: Default body copy derived from base scale.
  heading:
    className: text-3xl text-text
    scale: 3xl
    source: core
    description: Hero/heading style anchored to the 3xl size.
inferred_from_code: []
figma_styles: []
```

## Contract & Invariants

- Slot identifiers always use dot-separated semantic keys (e.g., `color.primary.action`, `radius.card`).
- `tokens.json` and `typography.json` remain the source of truth; `designrules.yaml` must only reference Tailwind utilities derived from those values.
- `designrules.yaml` sections (`color`, `radius`, `typography`, `inferred_from_code`, `figma_styles`) retain their structure; no additional top-level groups without explicit approval.
- `inferred_from_code` is CLI-owned evidence; edits happen by re-running commands, not by hand.
- Versions stay in sync across files and only change alongside schema migrations.

## Agent Do / Don't Guidance

**Do**

1. Update a slot’s `className` when token values change so Tailwind utilities stay accurate.
2. Add new semantic slots only when they map back to existing token/typography entries.
3. Reference `tokens.json` values via their Tailwind class equivalents (`bg-accent`, `text-text`, `rounded-md`).
4. Preserve the existing `inferred_from_code` trail when editing slots surfaced by `rift from-code`.
5. Keep `version` aligned with CLI schema updates if you land a migration (otherwise leave it untouched).

**Don’t**

1. Invent new top-level sections in `designrules.yaml`.
2. Manually edit `inferred_from_code` entries; they are CLI-generated.
3. Add Tailwind class references that lack backing values in `tokens.json` / `typography.json`.
4. Delete core semantic slots unless the corresponding code and components change in the same patch.
5. Change the spec `version` arbitrarily or without a coordinated schema migration.

## Known Divergences

None observed; this spec mirrors `packages/core/src/types.ts` and `packages/core/src/defaults.ts`. Update both the code and this document together if the schema evolves.

