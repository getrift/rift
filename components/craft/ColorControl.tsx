'use client';

import { useStore } from '@/lib/store';
import ColorPicker from './ColorPicker';

export default function ColorControl() {
  const selectedPath = useStore((state) => state.selectedPath);
  const styleOverrides = useStore((state) => state.styleOverrides);
  const setStyleOverride = useStore((state) => state.setStyleOverride);

  if (!selectedPath) {
    return <p className="text-text-muted text-sm">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};

  return (
    <div className="space-y-4">
      <ColorPicker
        label="Text"
        value={current.color ?? '#ffffff'}
        onChange={(value) => setStyleOverride(selectedPath, 'color', value)}
      />
      <ColorPicker
        label="Background"
        value={current.backgroundColor ?? '#000000'}
        onChange={(value) => setStyleOverride(selectedPath, 'backgroundColor', value)}
      />
    </div>
  );
}
