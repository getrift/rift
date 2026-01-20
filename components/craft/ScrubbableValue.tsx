'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCraftOptional } from '@/lib/craft-context';

interface ScrubbableValueProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  sensitivity?: number;
  controlId?: string;
  inline?: boolean; // If true, shows label as prefix inside the value
}

export default function ScrubbableValue({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'px',
  sensitivity = 2,
  controlId,
  inline = false,
}: ScrubbableValueProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [motionBlur, setMotionBlur] = useState(0);
  
  const dragStartX = useRef(0);
  const dragStartValue = useRef(0);
  const lastX = useRef(0);
  const velocityRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  
  const craft = useCraftOptional();

  // Calculate fill percentage for the indicator
  const fillPercentage = ((value - min) / (max - min)) * 100;
  
  // Spring animation for the fill indicator
  const springFill = useSpring(fillPercentage, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  // Transform spring value to width style
  const fillWidth = useTransform(springFill, (v) => `${v}%`);

  // Update fill spring when value changes
  useEffect(() => {
    springFill.set(fillPercentage);
  }, [fillPercentage, springFill]);

  // Spring animation for the displayed value
  const springValue = useSpring(value, {
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  });

  // Update spring when value changes externally
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  // Format the displayed value
  const displayValue = useTransform(springValue, (v) => {
    const rounded = Math.round(v / step) * step;
    if (step < 1) {
      return rounded.toFixed(1);
    }
    return Math.round(rounded).toString();
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isEditing) return;
    // Don't capture if clicking on the input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartValue.current = value;
    lastX.current = e.clientX;
    velocityRef.current = 0;
    
    if (craft && controlId) {
      craft.setActiveControlId(controlId);
    }
    
    rowRef.current?.setPointerCapture(e.pointerId);
  }, [isEditing, value, craft, controlId]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const deltaX = currentX - dragStartX.current;
    
    // Calculate velocity for motion blur
    const instantVelocity = currentX - lastX.current;
    velocityRef.current = instantVelocity;
    lastX.current = currentX;
    
    // Apply motion blur based on velocity
    const blur = Math.min(Math.abs(instantVelocity) * 0.15, 3);
    setMotionBlur(blur);
    
    // Shift key = 10x sensitivity (slower, more precise)
    const effectiveSensitivity = e.shiftKey ? sensitivity * 10 : sensitivity;
    
    let newValue = dragStartValue.current + (deltaX / effectiveSensitivity) * step;
    
    // Clamp with rubber-band effect at boundaries
    if (newValue < min) {
      const overshot = min - newValue;
      newValue = min - overshot * 0.2; // Rubber band
    } else if (newValue > max) {
      const overshot = newValue - max;
      newValue = max + overshot * 0.2; // Rubber band
    }
    
    // Round to step
    newValue = Math.round(newValue / step) * step;
    
    // Clamp final value
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  }, [isDragging, min, max, step, sensitivity, onChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setMotionBlur(0);
    
    if (craft) {
      craft.setActiveControlId(null);
    }
    
    rowRef.current?.releasePointerCapture(e.pointerId);
    
    // Snap to valid value (removes rubber band overshoot)
    const snapped = Math.max(min, Math.min(max, Math.round(value / step) * step));
    if (snapped !== value) {
      onChange(snapped);
    }
  }, [isDragging, craft, min, max, step, value, onChange]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only enter edit mode if it was a click, not end of drag
    if (Math.abs(e.clientX - dragStartX.current) < 3) {
      setIsEditing(true);
      setEditValue(value.toString());
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [value]);

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      const stepped = Math.round(clamped / step) * step;
      onChange(stepped);
    }
  }, [editValue, min, max, step, onChange]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, [handleInputBlur]);

  const inputWidthClass = inline ? 'w-12' : 'w-14';

  return (
    <div 
      ref={rowRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`
        relative overflow-hidden
        flex items-center min-w-0 h-7
        ${inline ? 'gap-1' : 'gap-2'}
        cursor-ew-resize select-none rounded px-1
        transition-colors duration-75
        hover:bg-bg-hover
      `}
    >
      {/* Fill indicator - only visible while dragging */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="h-full bg-white/[0.04] rounded"
              style={{ width: fillWidth }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Label */}
      <span className={`relative z-10 text-text-label font-medium ${inline ? 'text-[10px]' : 'text-[11px]'} truncate ${inline ? '' : 'flex-1'}`}>
        {label}
      </span>
      
      {/* Value */}
      <div className={`relative z-10 ${inline ? '' : 'ml-auto'}`}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={`${inputWidthClass} h-6 px-1.5 text-left font-mono text-[11px] bg-bg-surface border-none rounded text-text-primary focus:outline-none focus:bg-bg-elevated cursor-text`}
            autoFocus
          />
        ) : (
          <motion.span
            onClick={handleClick}
            className={`
              inline-flex items-center
              px-1.5 h-6
              font-mono text-[13px] text-text-primary
              rounded select-none
            `}
            style={{
              filter: motionBlur > 0 ? `blur(${motionBlur}px)` : 'none',
            }}
          >
            <motion.span className="text-text-primary">{displayValue}</motion.span>
            <span className="text-text-muted ml-0.5 text-[10px]">{unit}</span>
          </motion.span>
        )}
      </div>
    </div>
  );
}
