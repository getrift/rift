'use client';

import { useStore } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';
import ColorPicker from './ColorPicker';
import { parseRgba } from './ColorControl';

// Parse CSS font size like "16px" or "1rem" to number (in px)
function parseFontSize(value: string | undefined): number {
  if (!value) return 16;
  const num = parseFloat(value);
  if (isNaN(num)) return 16;
  if (value.endsWith('rem')) return num * 16;
  return num;
}

// Parse CSS line height - can be unitless "1.5" or with units "24px"
function parseLineHeight(value: string | undefined, fontSize: number): number {
  if (!value || value === 'normal') return 1.5;
  const num = parseFloat(value);
  if (isNaN(num)) return 1.5;
  // If it has px units, convert to ratio
  if (value.endsWith('px')) return num / fontSize;
  return num;
}

interface TypographyControlProps {
  controlId?: string;
}

export default function TypographyControl({ controlId }: TypographyControlProps) {
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  const computedStyles = useStore((state) => state.computedStyles);
  
  const selectedPath = activeComponent?.selectedPaths?.[0] || null;
  const styleOverrides = activeComponent?.styleOverrides || {};
  const setStyleOverride = useStore((state) => state.setStyleOverride);

  if (!selectedPath) return null;

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};
  
  // Use override if set, otherwise use computed value
  const computedFontSize = parseFontSize(computedStyles?.fontSize);
  const fontSize = current.fontSize ?? computedFontSize;
  const lineHeight = current.lineHeight ?? parseLineHeight(computedStyles?.lineHeight, computedFontSize);
  
  // Text color
  const computedText = computedStyles?.color ? parseRgba(computedStyles.color) : { hex: undefined, opacity: 100 };
  const textColor = current.color ?? computedText.hex;
  const textOpacity = current.colorOpacity ?? computedText.opacity;

  return (
    <div className="space-y-0">
      <ScrubbableValue
        label="Font Size"
        value={fontSize}
        min={8}
        max={72}
        onChange={(value) => setStyleOverride(selectedPath, 'fontSize', value)}
        controlId={controlId}
      />
      <ScrubbableValue
        label="Line Height"
        value={lineHeight}
        min={1}
        max={3}
        step={0.1}
        unit=""
        onChange={(value) => setStyleOverride(selectedPath, 'lineHeight', value)}
        controlId={controlId}
      />
      <div className="pt-1">
        <ColorPicker
          label="Color"
          value={textColor}
          opacity={textOpacity}
          onChange={(value) => setStyleOverride(selectedPath, 'color', value)}
          onOpacityChange={(value) => setStyleOverride(selectedPath, 'colorOpacity', value)}
        />
      </div>
    </div>
  );
}
