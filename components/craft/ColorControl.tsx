'use client';

import { useStore } from '@/lib/store';
import ColorPicker from './ColorPicker';
import ScrubbableValue from './ScrubbableValue';

// Convert rgb(r, g, b) or rgba(r, g, b, a) to hex and opacity
function parseRgba(rgb: string): { hex: string; opacity: number } {
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
  
  const selectedPath = activeComponent?.selectedPath || null;
  const styleOverrides = activeComponent?.styleOverrides || {};
  const setStyleOverride = useStore((state) => state.setStyleOverride);
  const computedStyles = useStore((state) => state.computedStyles);

  if (!selectedPath) {
    return <p className="text-text-muted text-[11px]">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};
  
  // Parse computed styles
  const computedText = computedStyles?.color ? parseRgba(computedStyles.color) : { hex: undefined, opacity: 100 };
  const computedBg = computedStyles?.backgroundColor ? parseRgba(computedStyles.backgroundColor) : { hex: undefined, opacity: 100 };
  
  // Use override if set, otherwise use computed style
  const textColor = current.color ?? computedText.hex;
  const textOpacity = current.colorOpacity ?? computedText.opacity;
  const bgColor = current.backgroundColor ?? computedBg.hex;
  const bgOpacity = current.backgroundOpacity ?? computedBg.opacity;

  return (
    <div className="space-y-1">
      {/* Text Color */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ColorPicker
            label="Text"
            value={textColor}
            onChange={(value) => setStyleOverride(selectedPath, 'color', value)}
          />
        </div>
        <div className="w-16">
          <ScrubbableValue
            label="O"
            value={textOpacity}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => setStyleOverride(selectedPath, 'colorOpacity', value)}
            inline
          />
        </div>
      </div>
      
      {/* Background Color */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ColorPicker
            label="Background"
            value={bgColor}
            onChange={(value) => setStyleOverride(selectedPath, 'backgroundColor', value)}
          />
        </div>
        <div className="w-16">
          <ScrubbableValue
            label="O"
            value={bgOpacity}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => setStyleOverride(selectedPath, 'backgroundOpacity', value)}
            inline
          />
        </div>
      </div>
    </div>
  );
}
