/* Locked Rift mark — a 4×4 "memory grid" that blooms from a bright top-right
   corner down to a faint bottom-left, evoking captured context lighting up on
   recall. Single currentColor, scales cleanly to 16px, inverts free. */
const MATRIX = [
  [0.26, 0.5, 0.82, 1],
  [0.18, 0.34, 0.66, 0.9],
  [0.14, 0.22, 0.42, 0.58],
  [0.12, 0.15, 0.22, 0.3],
];

export function RiftMark({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor" aria-hidden className={className}>
      {MATRIX.flatMap((row, r) =>
        row.map((o, c) => (
          <rect key={`${r}-${c}`} x={7 + c * 9} y={7 + r * 9} width={7} height={7} rx={1.5} opacity={o} />
        )),
      )}
    </svg>
  );
}

export function RiftLogo({ markSize = 18, className }: { markSize?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className ?? ""}`}>
      <RiftMark size={markSize} className="text-[#f7f8f8]" />
      <span className="text-[16px] font-semibold tracking-tight text-[#f7f8f8]">rift</span>
    </span>
  );
}
