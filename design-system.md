# **TTFW Design System**

```markdown
# figspec Design System

This is the single source of truth for every pixel, character, and terminal line in figspec.  
It must feel like the most premium, focused developer productivity tool of 2025 — zero fluff, maximum signal.

## 1. Typography
**Primary font**: Geist Sans (imported via `@vercel/geist/font/sans`)  
Fallback stack: `ui-sans-serif, system-ui, -apple-system, sans-serif`

**Weights used**  
- 400 → body  
- 500 → medium (labels, captions)  
- 600 → semibold (buttons, headings)  
- 700 → bold (titles only)

**Type scale** (pixel-perfect, no in-betweens)
| Token   | Size  | Line height | Usage                     |
|---------|-------|-------------|---------------------------|
| xs      | 11px  | 16px        | hints, metadata           |
| sm      | 12px  | 18px        | input labels, captions    |
| base    | 14px  | 20px        | body text, default        |
| lg      | 16px  | 24px        | buttons, section headings |
| xl      | 20px  | 28px        | card titles, H2           |
| 2xl     | 24px  | 32px        | page titles, H1           |
| 3xl     | 30px  | 36px        | hero / landing headline   |

## 2. Color palette (dark-only)
| Token               | Hex       | Purpose                                  |
|---------------------|-----------|------------------------------------------|
| background          | #0D0D0D   | Canvas / page background                 |
| surface             | #1A1A1A   | Cards, panels, sidebars                  |
| surface-hover       | #262626   | Hover states, selected rows              |
| border              | #333333   | All borders, dividers                    |
| text                | #FFFFFF   | Primary body text                        |
| text-muted          | #A3A3A3   | Secondary text, timestamps               |
| text-subtle         | #737373   | Hints, placeholders, disabled            |
| accent              | #00FF99   | Brand color, success, links, focus rings|
| accent-hover        | #00CC77   | Hover / active accent states             |
| error               | #FF3333   | Errors, destructive actions              |
| success-bg          | #00FF99   | CLI success messages (black text on top) |

No light mode. No gradients. No shadows.

## 3. Spacing scale (4-based only)
4 → 8 → 12 → 16 → 20 → 24 → 32 → 48 → 64  
Container max-width: 840px centered.

## 4. Border radius
| Token   | Value | Usage                         |
|---------|-------|-------------------------------|
| none    | 0px   | Sharp edges                   |
| sm      | 2px   | Pills, tags                   |
| md      | 6px   | Buttons, inputs, badges       |
| lg      | 8px   | Cards, panels, modals         |

Never exceed 8px.

## 5. Core components
| Component   | Style rules                                                                 |
|-------------|-----------------------------------------------------------------------------|
| Buttons     | `bg-accent text-black font-semibold rounded-md px-4 py-2 hover:bg-accent-hover` |
| Inputs      | `bg-transparent border border-border rounded-md px-3 py-2 focus:ring-2 ring-accent` |
| Cards       | `bg-surface border border-border rounded-lg p-6`                           |
| Code blocks | `font-mono bg-surface border-l-4 border-accent text-sm`                    |
| Tables      | Zebra stripes `#1A1A1A` / `#262626`, hover `#262626`                        |
| Sidebar     | `bg-background border-r border-border`                                     |

## 6. CLI output style (chalk)
```ts
const $ = {
  brand:     chalk.hex('#00FF99').bold,
  command:   chalk.white.bg('#1A1A1A').bold,
  path:      chalk.gray,
  success:   chalk.black.bg('#00FF99').bold,
  error:     chalk.white.bg('#FF3333').bold,
  key:       chalk.cyan,
  value:     chalk.white,
  dim:       chalk.gray,
};
```

All success messages must be **black text on #00FF99**.

## 7. Tailwind preset (copy-paste ready)

```js
// tailwind.config.figspec.cjs
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-hover': '#262626',
        border: '#333333',
        text: '#FFFFFF',
        'text-muted': '#A3A3A3',
        'text-subtle': '#737373',
        accent: { DEFAULT: '#00FF99', hover: '#00CC77' },
        error: '#FF3333',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '6px',
        lg: '8px',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

## 8. The Golden Rule

> Every screen, terminal line, and README heading must feel like it was built by the same team that ships the fastest, most focused developer tools on the planet.

If it feels even slightly off — change it immediately.

This file is law.