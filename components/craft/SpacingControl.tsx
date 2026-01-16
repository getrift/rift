'use client';

import { useStore } from '@/lib/store';
import Slider from './Slider';

export default function SpacingControl() {
  const selectedPath = useStore((state) => state.selectedPath);
  const styleOverrides = useStore((state) => state.styleOverrides);
  const setStyleOverride = useStore((state) => state.setStyleOverride);

  if (!selectedPath) {
    return <p className="text-text-muted text-sm">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};

  return (
    <div className="space-y-4">
      <Slider
        label="Padding"
        value={current.padding ?? 0}
        min={0}
        max={64}
        onChange={(value) => setStyleOverride(selectedPath, 'padding', value)}
      />
      <Slider
        label="Gap"
        value={current.gap ?? 0}
        min={0}
        max={48}
        onChange={(value) => setStyleOverride(selectedPath, 'gap', value)}
      />
    </div>
  );
}
