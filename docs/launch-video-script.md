# Rift launch video (45–60s)

1. **0–5s — Hook**
   - Visual: Terminal with neon-green cursor on black.
   - Line: “What if your UI kit actually matched your code?”

2. **5–15s — Problem**
   - Show split screen of Figma vs repo drifting apart.
   - Voiceover: “Design tokens rot the moment they’re copied into code. Nobody keeps `.json` specs in sync.”

3. **15–30s — Solution demo**
   - Run `npx @getrift/rift init` → highlight `.rift/` folder.
   - Run `rift pull` (mocked) and flash the updated `figma_styles` list.
   - Overlay: “Dark-only defaults, deterministic palette, Geist Sans scale.”

4. **30–45s — From code insight**
   - Run `rift from-code` while showing JSX with Tailwind classes.
   - Animate the `designrules.yaml` diff (semantic slots updating, confidence numbers ticking up).
   - Voiceover: “Regex-only scan picks up bg/text/rounded classes and maps them to six semantic slots.”

5. **45–55s — Tailwind + docs**
   - Show `docs/tailwind.config.rift.cjs` and usage-examples snippets.
   - Line: “Drop the preset, keep everything dark, never guess a radius again.”

6. **55–60s — CTA**
   - Fade to CLI prompt with `rift` brand mark.
   - Line: “pnpm dlx rift@latest — keep the spec where it belongs: right next to your code.”
