'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const hexDisplay = hasValue ? value?.toUpperCase() : '---';
  const showOpacity = onOpacityChange !== undefined && opacity !== undefined;

  return (
    <>
      <motion.div 
        className="flex items-center h-7 px-1.5 rounded-[5px] hover:bg-bg-hover cursor-pointer transition-colors duration-100"
        onClick={handleOpen}
        whileTap={{ scale: 0.995 }}
      >
        {/* Label */}
        {label && (
          <span className="text-text-label text-[11px] font-medium flex-1 truncate">
            {label}
          </span>
        )}
        
        {/* Values container */}
        <div className={`flex items-center gap-1.5 ${!label ? 'flex-1 justify-end' : ''}`}>
          {/* Hex value */}
          <span className="text-text-secondary text-[11px] tabular-nums tracking-tight">
            {hexDisplay}
          </span>
          
          {/* Opacity value */}
          {showOpacity && (
            <span className="text-text-muted text-[10px] tabular-nums min-w-[28px] text-right">
              {opacity}%
            </span>
          )}
          
          {/* Color swatch */}
          <motion.div
            ref={swatchRef}
            className={`
              w-5 h-5 rounded border border-white/10 flex-shrink-0 
              transition-transform duration-100
              ${!hasValue ? 'bg-gradient-to-br from-gray-600 to-gray-800' : ''}
            `}
            style={hasValue ? { 
              backgroundColor: value, 
              opacity: displayOpacity,
            } : undefined}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        </div>
      </motion.div>
      
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
