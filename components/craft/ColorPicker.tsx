'use client';

import { useState, useRef } from 'react';
import ColorPickerModal from './ColorPickerModal';

interface ColorPickerProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  opacity?: number;
  onOpacityChange?: (value: number) => void;
}

export default function ColorPicker({ label, value, onChange, opacity, onOpacityChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const swatchRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (swatchRef.current) {
      setAnchorRect(swatchRef.current.getBoundingClientRect());
      setIsOpen(true);
    }
  };

  const hasValue = value !== undefined && value !== '';
  const displayOpacity = opacity !== undefined ? opacity / 100 : 1;
  const hexDisplay = hasValue ? value?.toUpperCase() : '—';

  return (
    <>
      <div 
        className="flex items-center h-7 px-1 rounded hover:bg-bg-hover cursor-pointer"
        onClick={handleOpen}
      >
        {label && <span className="text-text-label text-[11px] font-medium flex-1">{label}</span>}
        <div className={`flex items-center gap-1.5 ${!label ? 'flex-1' : ''}`}>
          <span className="text-text-muted text-[11px] font-mono">{hexDisplay}</span>
          <div
            ref={swatchRef}
            className={`w-5 h-5 rounded border border-border-hairline transition-colors flex-shrink-0 ${!hasValue ? 'bg-gradient-to-br from-gray-600 to-gray-800' : ''}`}
            style={hasValue ? { backgroundColor: value, opacity: displayOpacity } : undefined}
          />
        </div>
      </div>
      <ColorPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRect={anchorRect}
        value={value}
        onChange={onChange}
        opacity={opacity}
        onOpacityChange={onOpacityChange}
      />
    </>
  );
}
