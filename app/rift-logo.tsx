/* Rift mark ("glass") — a block cut by one slanted rift. The left half is solid
   (what Rift keeps), the right half an outline (seen through, recalled). Filled
   paths only, one currentColor, so it scales to 11px and inverts for free.
   Same geometry as the app's menu-bar icon (second-brain
   operator/swiftbar/assets/rift-mark.svg). */
export function RiftMark({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M5 3h8.2L9.4 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path fillRule="evenodd" d="M15.2 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7.6ZM16.82 5L13.87 19H19V5Z" />
    </svg>
  );
}

/* Wordmark: the mark at cap height beside "Rift" in Geist Medium. */
export function RiftLogo({ markSize = 18, className }: { markSize?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className ?? ""}`}>
      <RiftMark size={markSize} className="text-ink" />
      <span className="text-[18px] font-medium tracking-[-0.035em] text-ink">Rift</span>
    </span>
  );
}
