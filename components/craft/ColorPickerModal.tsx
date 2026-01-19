'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  value: string;
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

export default function ColorPickerModal({
  isOpen,
  onClose,
  anchorRect,
  value,
  onChange,
}: ColorPickerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first button
      const firstButton = modalRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);

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

  if (!mounted || !isOpen || !anchorRect) return null;

  // Calculate position: center vertically relative to anchor, to the left of anchor
  const top = anchorRect.top + anchorRect.height / 2;
  const right = window.innerWidth - anchorRect.left + 12; // 12px gap

  return createPortal(
    <div
      ref={modalRef}
      className="fixed z-50 flex flex-col gap-3 p-3 bg-bg-surface border border-border-subtle rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100"
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
            onClick={() => onChange(preset)}
            aria-label={`Select color ${preset}`}
          />
        ))}
      </div>

      {/* Separator */}
      <div className="h-px bg-border-subtle" />

      {/* Custom Color Input */}
      <div className="flex items-center gap-2">
        <div className="relative w-full h-8 flex-1">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-full h-full rounded border border-border-subtle flex items-center px-2 bg-bg-panel text-text-secondary text-xs">
            {value.toUpperCase()}
          </div>
        </div>
        <div
            className="w-8 h-8 rounded border border-border-subtle"
            style={{ backgroundColor: value }}
        />
      </div>
    </div>,
    document.body
  );
}
