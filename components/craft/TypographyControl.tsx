'use client';

import { useStore } from '@/lib/store';
import Slider from './Slider';

export default function TypographyControl() {
  const selectedPath = useStore((state) => state.selectedPath);
  const styleOverrides = useStore((state) => state.styleOverrides);
  const setStyleOverride = useStore((state) => state.setStyleOverride);

  if (!selectedPath) {
    return <p className="text-text-muted text-sm">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};

  return (
    <Slider
      label="Font Size"
      value={current.fontSize ?? 16}
      min={12}
      max={32}
      onChange={(value) => setStyleOverride(selectedPath, 'fontSize', value)}
    />
  );
}
