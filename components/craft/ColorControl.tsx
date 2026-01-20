'use client';

import { useStore } from '@/lib/store';
import ColorPicker from './ColorPicker';

// Convert rgb(r, g, b) or rgba(r, g, b, a) to hex and opacity
export function parseRgba(rgb: string): { hex: string; opacity: number } {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { hex: rgb, opacity: 100 };
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  return { hex, opacity: Math.round(a * 100) };
}

export default function ColorControl() {
  // Read from active component
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  
  const selectedPath = activeComponent?.selectedPaths?.[0] || null;
  const styleOverrides = activeComponent?.styleOverrides || {};
  const setStyleOverride = useStore((state) => state.setStyleOverride);
  const computedStyles = useStore((state) => state.computedStyles);

  if (!selectedPath) {
    return <p className="text-text-muted text-[11px]">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};
  
  // Parse computed styles
  const computedBg = computedStyles?.backgroundColor ? parseRgba(computedStyles.backgroundColor) : { hex: undefined, opacity: 100 };
  
  // Use override if set, otherwise use computed style
  const bgColor = current.backgroundColor ?? computedBg.hex;
  const bgOpacity = current.backgroundOpacity ?? computedBg.opacity;

  return (
    <div className="space-y-1">
      <ColorPicker
        label="Fill"
        value={bgColor}
        opacity={bgOpacity}
        onChange={(value) => setStyleOverride(selectedPath, 'backgroundColor', value)}
        onOpacityChange={(value) => setStyleOverride(selectedPath, 'backgroundOpacity', value)}
      />
    </div>
  );
}
