'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  value: string | undefined;
  onChange: (value: string) => void;
}

const PRESETS = [
  '#ffffff',
  '#f5f5f5',
  '#e5e5e5',
  '#d4d4d4',
  '#a3a3a3',
  '#737373',
  '#525252',
  '#404040',
  '#262626',
  '#171717',
  '#000000',
];

// Color conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max * 100;

  return { h, s, b: brightness };
}

function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1)),
  };
}

function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsb(r, g, b);
}

function hsbToHex(h: number, s: number, b: number): string {
  const { r, g, b: blue } = hsbToRgb(h, s, b);
  return rgbToHex(r, g, blue);
}

export default function ColorPickerModal({
  isOpen,
  onClose,
  anchorRect,
  value,
  onChange,
}: ColorPickerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  // HSB state for picker
  const [hsb, setHsb] = useState(() => {
    if (value) {
      return hexToHsb(value);
    }
    return { h: 0, s: 100, b: 100 };
  });
  
  // Hex input state
  const [hexInput, setHexInput] = useState('');
  
  // Track dragging state
  const [isDraggingSB, setIsDraggingSB] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  
  const sbPickerRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setPortalContainer(document.body);
  }, []);
  
  // Update HSB when value changes externally
  useEffect(() => {
    if (value) {
      const newHsb = hexToHsb(value);
      setHsb(newHsb);
      setHexInput(value.toUpperCase());
    }
  }, [value]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first button
      const firstButton = modalRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);

  // Update SB from mouse position
  const updateSBFromMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sbPickerRef.current) return;
    const rect = sbPickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const s = (x / rect.width) * 100;
    const b = 100 - (y / rect.height) * 100;
    const newHsb = { h: hsb.h, s, b };
    setHsb(newHsb);
    const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
    onChange(hex);
    setHexInput(hex.toUpperCase());
  }, [hsb.h, onChange]);

  // Handle SB picker interaction
  const handleSBMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingSB(true);
    updateSBFromMouse(e);
  }, [updateSBFromMouse]);

  // Update hue from mouse position
  const updateHueFromMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const h = (x / rect.width) * 360;
    const newHsb = { h, s: hsb.s, b: hsb.b };
    setHsb(newHsb);
    const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
    onChange(hex);
    setHexInput(hex.toUpperCase());
  }, [hsb.s, hsb.b, onChange]);

  // Handle hue slider interaction
  const handleHueMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingHue(true);
    updateHueFromMouse(e);
  }, [updateHueFromMouse]);

  // Handle mouse move and up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSB && sbPickerRef.current) {
        const rect = sbPickerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        const s = (x / rect.width) * 100;
        const b = 100 - (y / rect.height) * 100;
        const newHsb = { h: hsb.h, s, b };
        setHsb(newHsb);
        const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
        onChange(hex);
        setHexInput(hex.toUpperCase());
      } else if (isDraggingHue && hueSliderRef.current) {
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const h = (x / rect.width) * 360;
        const newHsb = { h, s: hsb.s, b: hsb.b };
        setHsb(newHsb);
        const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
        onChange(hex);
        setHexInput(hex.toUpperCase());
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSB(false);
      setIsDraggingHue(false);
    };

    if (isDraggingSB || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSB, isDraggingHue, hsb, onChange]);

  // Handle hex input
  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value);
  }, []);

  const handleHexInputBlur = useCallback(() => {
    const cleaned = hexInput.trim();
    const hexRegex = /^#?[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(cleaned)) {
      const hex = cleaned.startsWith('#') ? cleaned : '#' + cleaned;
      const newHsb = hexToHsb(hex);
      setHsb(newHsb);
      onChange(hex);
      setHexInput(hex.toUpperCase());
    } else if (value) {
      setHexInput(value.toUpperCase());
    }
  }, [hexInput, onChange, value]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !anchorRect || !portalContainer) return null;

  // Use a display value - show placeholder if undefined
  const displayValue = value ?? '';
  const hasValue = typeof value === 'string' && value.length > 0;

  // Calculate position: center vertically relative to anchor, to the left of anchor
  const top = anchorRect.top + anchorRect.height / 2;
  const right = window.innerWidth - anchorRect.left + 12; // 12px gap

  // Get current hue color for the SB picker background
  const hueColor = hsbToHex(hsb.h, 100, 100);

  return createPortal(
    <div
      ref={modalRef}
      className="fixed z-50 flex flex-col gap-3 p-3 bg-bg-surface border border-border-subtle rounded-lg shadow-xl"
      style={{
        top: top,
        right: right,
        transform: 'translateY(-50%)',
      }}
    >
      {/* Presets Grid */}
      <div className="grid grid-cols-6 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`w-6 h-6 rounded border border-border-subtle hover:scale-110 transition-transform ${
              value === preset
                ? 'ring-2 ring-white ring-offset-1 ring-offset-bg-surface'
                : ''
            }`}
            style={{ backgroundColor: preset }}
            onClick={() => {
              onChange(preset);
              const newHsb = hexToHsb(preset);
              setHsb(newHsb);
              setHexInput(preset.toUpperCase());
            }}
            aria-label={`Select color ${preset}`}
          />
        ))}
      </div>

      {/* Separator */}
      <div className="h-px bg-border-subtle" />

      {/* Custom HSB Color Picker */}
      <div className="flex flex-col gap-3">
        {/* Saturation/Brightness Picker */}
        <div
          ref={sbPickerRef}
          className="relative w-[200px] h-[200px] rounded cursor-crosshair select-none"
          style={{
            background: `linear-gradient(to bottom, transparent, black),
                         linear-gradient(to right, white, ${hueColor})`,
          }}
          onMouseDown={handleSBMouseDown}
        >
          {/* Indicator */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: `${hsb.s}%`,
              top: `${100 - hsb.b}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Hue Slider */}
        <div
          ref={hueSliderRef}
          className="relative w-full h-3 rounded cursor-pointer select-none"
          style={{
            background:
              'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          }}
          onMouseDown={handleHueMouseDown}
        >
          {/* Indicator */}
          <div
            className="absolute w-3 h-full border-2 border-white rounded pointer-events-none"
            style={{
              left: `${(hsb.h / 360) * 100}%`,
              transform: 'translateX(-50%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Hex Input + Color Swatch */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={hexInput || (hasValue ? displayValue.toUpperCase() : '')}
            onChange={handleHexInputChange}
            onBlur={handleHexInputBlur}
            placeholder="Not set"
            className="flex-1 h-8 px-2 rounded border border-border-subtle bg-bg-panel text-text-primary text-xs focus:outline-none focus:border-white/50"
          />
          <div
            className={`w-8 h-8 rounded border border-border-subtle flex-shrink-0 ${
              !hasValue ? 'bg-gradient-to-br from-gray-600 to-gray-800' : ''
            }`}
            style={hasValue ? { backgroundColor: displayValue } : undefined}
          />
        </div>
      </div>
    </div>,
    portalContainer
  );
}
