/* Locked Rift mark — a 4×4 "memory grid" that blooms from a bright top-right
   corner down to a faint bottom-left, evoking captured context lighting up on
   recall. Single currentColor, scales cleanly to 16px, inverts free. */
const MATRIX = [
  [0.26, 0.5, 0.82, 1],
  [0.18, 0.34, 0.66, 0.9],
  [0.14, 0.22, 0.42, 0.58],
  [0.12, 0.15, 0.22, 0.3],
];

const SMALL_MATRIX = [
  [null, 0.58, 0.88, 1],
  [null, 0.42, 0.72, 0.92],
  [null, null, 0.52, 0.66],
  [null, null, null, 0.46],
];

export function RiftMark({ size = 16, className }: { size?: number; className?: string }) {
  const compact = size < 28;
  const matrix = compact ? SMALL_MATRIX : MATRIX;
  const cell = compact ? 6 : 7;
  const step = compact ? 10.5 : 9;
  const offset = compact ? 6.75 : 7;
  const radius = compact ? 1 : 1.5;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor" aria-hidden className={className}>
      {matrix.flatMap((row, r) =>
        row.map((o, c) =>
          o == null ? null : (
            <rect key={`${r}-${c}`} x={offset + c * step} y={offset + r * step} width={cell} height={cell} rx={radius} opacity={o} />
          ),
        ),
      )}
    </svg>
  );
}

export function RiftLogo({ markSize = 18, className }: { markSize?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className ?? ""}`}>
      <RiftMark size={markSize} className="text-ink" />
      <span className="text-[16px] font-semibold tracking-tight text-ink">rift</span>
    </span>
  );
}
