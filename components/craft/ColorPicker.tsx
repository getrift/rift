'use client';

import { useState, useRef } from 'react';
import ColorPickerModal from './ColorPickerModal';

interface ColorPickerProps {
  label: string;
  value: string | undefined;
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

  const hasValue = value !== undefined;

  return (
    <>
      <div className="flex items-center gap-2 h-7">
        <span className="text-text-label text-[11px] truncate">{label}</span>
        <div
          ref={swatchRef}
          className={`w-5 h-5 rounded border border-border-hairline cursor-pointer hover:border-white/30 transition-colors flex-shrink-0 ${!hasValue ? 'bg-gradient-to-br from-gray-600 to-gray-800' : ''}`}
          style={hasValue ? { backgroundColor: value } : undefined}
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
