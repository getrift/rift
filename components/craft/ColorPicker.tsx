'use client';

import { useState, useRef } from 'react';
import ColorPickerModal from './ColorPickerModal';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const swatchRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (swatchRef.current) {
      setAnchorRect(swatchRef.current.getBoundingClientRect());
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">{label}</span>
        <div
          ref={swatchRef}
          className="w-4 h-4 rounded border border-border-muted cursor-pointer hover:border-white/50 transition-colors"
          style={{ backgroundColor: value }}
          onClick={handleOpen}
        />
      </div>
      <ColorPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRect={anchorRect}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
