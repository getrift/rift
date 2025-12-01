# Rift usage examples

## 1. Initialize a project
```
$ cd path/to/app
$ npx @getrift/rift init
rift Wrote tokens.json
rift Wrote typography.json
rift Wrote config.json
rift Wrote designrules.yaml
rift /.rift
```
Inspect the generated `.rift/tokens.json` to confirm the neon-dark palette:
```
{
  "colors": {
    "background": "#0D0D0D",
    "surface": "#1A1A1A",
    "accent": "#00FF99",
    "error": "#FF3333"
  }
}
```

## 2. Mock a Figma pull
```
$ FIGMA_TOKEN=demo npx @getrift/rift pull my-file-id
color tokens merged: 3
typography styles merged: 2
Figma styles: Neon/Accent, Surface/Base, Typography/Body
Updated .rift/tokens.json
Updated .rift/typography.json
Updated .rift/config.json
Updated .rift/designrules.yaml
.rift
```
`config.json` now contains the provided file id and `designrules.yaml` lists the mocked `figma_styles` section.

## 3. Infer from code
Given JSX such as:
```
export const Button = () => (
  <button className="bg-accent text-base rounded-md">
    Launch Rift
  </button>
);
```
Running `npx @getrift/rift from-code` updates `.rift/designrules.yaml`:
```
color:
  primary:
    action:
      className: bg-accent text-black
      confidence: 0.67
radius:
  button:
    className: rounded-md
    confidence: 0.72
typography:
  body:
    className: text-base text-text
    confidence: 0.63
inferred_from_code:
  - slot: color.primary.action
    className: bg-accent
    confidence: 0.67
    sampleFiles:
      - src/components/Button.tsx
```
Use the updated semantic slots inside your Tailwind components or as prompts for assistants.

## 4. Tailwind preset
Use `docs/tailwind.config.rift.cjs` as a preset:
```
// tailwind.config.cjs
const riftPreset = require('./docs/tailwind.config.rift.cjs');

module.exports = {
  darkMode: 'class',
  presets: [riftPreset],
};
```
This exposes `bg-background`, `bg-surface`, `text-muted`, `rounded-lg`, and Geist Sans as `font-sans`.

For a full Next.js + Tailwind + Shadcn example wired to Rift, see `examples/rift-next-shadcn-example`.
