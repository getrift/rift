import { GRID } from "./invites";

// The invite and thank-you pages add these to the site's styles.
export const INVITE_CSS = `
/* these pages are taller than the 404: keep the plate's top line clear of the sheet's edge */
.sheet { padding-block: clamp(32px, 7vh, 72px); }
.plate .lede { max-width: 46ch; margin: 22px auto 0; text-wrap: pretty; }
/* the grid: 1 square per friend who pays. They light up from the top-right corner, a diagonal at a time */
.cells { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; width: 148px; margin: 0 auto 32px; }
.cells i { aspect-ratio: 1; border: 1px dashed var(--dash); border-radius: 5px; }
.cells i.on { border: 1px solid var(--fg); background: var(--fg); }
.js .cells i.on { animation: lit .7s var(--e) backwards; animation-delay: calc(var(--n) * 80ms + .25s); }
@keyframes lit { from { border-color: var(--dash); background: transparent; scale: .82; } }
.cells + .meta { margin: -18px 0 0; }
.share { display: flex; align-items: center; gap: 12px; max-width: 420px; margin: 32px auto 36px; padding: 5px 5px 5px 20px; border: 1px solid var(--dash); border-radius: 999px; background: var(--panel); }
.share code { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; font: 400 14px/20px var(--mono); color: var(--fg); }
.share .btn { height: 38px; min-width: 0; padding: 0 18px; font-size: 14px; }
.fine { padding: 24px 20px 28px; text-align: center; font-size: 14px; line-height: 22px; color: var(--dim); }
.fine p { max-width: 62ch; margin: 0 auto; text-wrap: pretty; }
.fine a { color: var(--txt); text-decoration: underline dotted var(--dim); text-underline-offset: 3px; }
.fine a:hover { color: var(--fg); }
@media (prefers-reduced-motion: reduce) { .js .cells i.on { animation: none; } }
`;

// The order the squares light in, as positions in the 4 × 4 grid read row by row.
const ORDER = [3, 2, 7, 1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 8, 13, 12];

export function Cells({ lit, label }: { lit: number; label: string }) {
  const rank = new Map(ORDER.map((position, n) => [position, n]));
  return (
    <div className="cells" role="img" aria-label={label}>
      {Array.from({ length: GRID }, (_, position) => {
        const n = rank.get(position) ?? 0;
        return (
          <i
            key={position}
            className={n < lit ? "on" : undefined}
            style={{ "--n": n } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
