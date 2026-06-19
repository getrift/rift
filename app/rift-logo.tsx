/* Rift brand mark — the single source of truth for the logo across the site.
 *
 * A 4×4 "memory grid": cells whose fill opacity blooms from a bright top-right
 * corner down to a faint bottom-left, evoking captured context lighting up as
 * it is recalled. Pure `currentColor`, so it inherits text colour and inverts
 * for free on dark/light. Holds legibly down to 16px.
 *
 * Geometry is shared with public/favicon.svg, public/og-image.svg, the CLI
 * banner (src/cli/ui.ts in the product repo) and the menu-bar icon — keep the
 * opacity matrix in sync if you ever retune it. */

/** Fill opacity per cell, row-major from the top-left. Bright corner = top-right. */
const GRID: readonly (readonly number[])[] = [
  [0.26, 0.5, 0.82, 1],
  [0.18, 0.34, 0.66, 0.9],
  [0.14, 0.22, 0.42, 0.58],
  [0.12, 0.15, 0.22, 0.3],
];

type RiftMarkProps = {
  /** Rendered px size (square). Default 16. */
  size?: number;
  className?: string;
  /** Accessible label; pass "" to mark decorative (aria-hidden). */
  title?: string;
};

export function RiftMark({ size = 16, className, title = "Rift" }: RiftMarkProps) {
  const decorative = title === "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      {GRID.flatMap((row, r) =>
        row.map((opacity, c) => (
          <rect
            key={`${r}-${c}`}
            x={7 + c * 9}
            y={7 + r * 9}
            width={7}
            height={7}
            rx={1.5}
            opacity={opacity}
          />
        )),
      )}
    </svg>
  );
}

type RiftLogoProps = {
  /** Mark size in px. The wordmark scales relative to it. */
  size?: number;
  className?: string;
  /** Wordmark colour. Defaults to currentColor (inherits). */
  wordmarkClassName?: string;
};

/** Full lockup: mark + "Rift" wordmark. Gap and type scale track the mark size. */
export function RiftLogo({ size = 28, className, wordmarkClassName }: RiftLogoProps) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.42 }}
    >
      <RiftMark size={size} title="" />
      <span
        className={wordmarkClassName}
        style={{
          fontWeight: 600,
          fontSize: size * 1.05,
          letterSpacing: "-0.045em",
          lineHeight: 1,
        }}
      >
        Rift
      </span>
    </span>
  );
}
