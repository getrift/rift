'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
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
  inline?: boolean;
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
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [motionBlur, setMotionBlur] = useState(0);
  
  const dragStartX = useRef(0);
  const dragStartValue = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocityRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const momentumFrame = useRef<number | null>(null);
  
  const craft = useCraftOptional();

  // Calculate fill percentage for the indicator
  const fillPercentage = ((value - min) / (max - min)) * 100;
  
  // Spring animation for the fill indicator
  const springFill = useSpring(fillPercentage, {
    stiffness: 400,
    damping: 30,
    mass: 0.5,
  });

  // Transform spring value to width style
  const fillWidth = useTransform(springFill, (v) => `${Math.max(0, Math.min(100, v))}%`);

  // Update fill spring when value changes
  useEffect(() => {
    springFill.set(fillPercentage);
  }, [fillPercentage, springFill]);

  // Spring animation for the displayed value (for smooth visual interpolation)
  const springValue = useSpring(value, {
    stiffness: 500,
    damping: 35,
    mass: 0.8,
  });

  // Update spring when value changes externally
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  // Sync input value with actual value when not focused
  useEffect(() => {
    if (!isFocused) {
      const formatted = step < 1 ? value.toFixed(1) : Math.round(value).toString();
      setInputValue(formatted);
    }
  }, [value, step, isFocused]);

  // Format the displayed value for the spring animation
  const displayValue = useTransform(springValue, (v) => {
    const rounded = Math.round(v / step) * step;
    if (step < 1) {
      return rounded.toFixed(1);
    }
    return Math.round(rounded).toString();
  });

  // Cancel momentum on unmount
  useEffect(() => {
    return () => {
      if (momentumFrame.current) {
        cancelAnimationFrame(momentumFrame.current);
      }
    };
  }, []);

  // Apply momentum after drag release
  const applyMomentum = useCallback((velocity: number) => {
    const friction = 0.92;
    const minVelocity = 0.5;
    
    const animate = () => {
      if (Math.abs(velocity) < minVelocity) {
        momentumFrame.current = null;
        // Snap to valid value
        const snapped = Math.max(min, Math.min(max, Math.round(value / step) * step));
        if (snapped !== value) {
          onChange(snapped);
        }
        return;
      }
      
      const delta = velocity * 0.1;
      let newValue = value + delta;
      
      // Rubber band at boundaries
      if (newValue < min) {
        newValue = min;
        velocity = 0;
      } else if (newValue > max) {
        newValue = max;
        velocity = 0;
      }
      
      newValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      onChange(clampedValue);
      
      velocity *= friction;
      momentumFrame.current = requestAnimationFrame(animate);
    };
    
    momentumFrame.current = requestAnimationFrame(animate);
  }, [min, max, step, value, onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Don't capture if clicking on the input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    // Cancel any existing momentum
    if (momentumFrame.current) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
    
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartValue.current = value;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocityRef.current = 0;
    
    if (craft && controlId) {
      craft.setActiveControlId(controlId);
    }
    
    rowRef.current?.setPointerCapture(e.pointerId);
  }, [value, craft, controlId]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const currentTime = performance.now();
    const deltaX = currentX - dragStartX.current;
    const deltaTime = currentTime - lastTime.current;
    
    // Calculate velocity for momentum and motion blur
    if (deltaTime > 0) {
      const instantVelocity = (currentX - lastX.current) / deltaTime * 16; // normalize to ~60fps
      // Smooth velocity with exponential moving average
      velocityRef.current = velocityRef.current * 0.7 + instantVelocity * 0.3;
    }
    
    lastX.current = currentX;
    lastTime.current = currentTime;
    
    // Apply motion blur based on velocity (more subtle)
    const blur = Math.min(Math.abs(velocityRef.current) * 0.08, 2);
    setMotionBlur(blur);
    
    // Shift key = 10x sensitivity (slower, more precise)
    const effectiveSensitivity = e.shiftKey ? sensitivity * 10 : sensitivity;
    
    // Acceleration: faster movement = bigger jumps
    const acceleration = 1 + Math.abs(deltaX) * 0.002;
    let newValue = dragStartValue.current + (deltaX / effectiveSensitivity) * step * acceleration;
    
    // Rubber-band effect at boundaries (spring-like)
    if (newValue < min) {
      const overshot = min - newValue;
      newValue = min - overshot * 0.15 * Math.exp(-overshot * 0.05);
    } else if (newValue > max) {
      const overshot = newValue - max;
      newValue = max + overshot * 0.15 * Math.exp(-overshot * 0.05);
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
    
    // Apply momentum if velocity is significant
    const velocity = velocityRef.current;
    if (Math.abs(velocity) > 2) {
      applyMomentum(velocity * 0.5);
    } else {
      // Snap to valid value
      const snapped = Math.max(min, Math.min(max, Math.round(value / step) * step));
      if (snapped !== value) {
        onChange(snapped);
      }
    }
  }, [isDragging, craft, min, max, step, value, onChange, applyMomentum]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    // Select all text on focus
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      const stepped = Math.round(clamped / step) * step;
      onChange(stepped);
    } else {
      // Reset to current value
      const formatted = step < 1 ? value.toFixed(1) : Math.round(value).toString();
      setInputValue(formatted);
    }
  }, [inputValue, min, max, step, onChange, value]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      // Reset and blur
      const formatted = step < 1 ? value.toFixed(1) : Math.round(value).toString();
      setInputValue(formatted);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? 1 : -1;
      const multiplier = e.shiftKey ? 10 : 1;
      const newValue = Math.max(min, Math.min(max, value + direction * step * multiplier));
      const stepped = Math.round(newValue / step) * step;
      onChange(stepped);
    }
  }, [step, value, min, max, onChange]);

  return (
    <div 
      ref={rowRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`
        group relative overflow-hidden
        flex items-center min-w-0 h-7
        ${inline ? 'gap-1' : 'gap-2'}
        select-none rounded-[5px] px-1.5
        transition-all duration-100
        ${isDragging 
          ? 'bg-white/[0.08] cursor-ew-resize' 
          : 'hover:bg-bg-hover cursor-ew-resize'
        }
      `}
    >
      {/* Fill indicator - always visible, brighter when dragging */}
      <motion.div
        className="absolute inset-0 rounded-[5px] pointer-events-none overflow-hidden"
        initial={false}
      >
        <motion.div
          className="h-full bg-white/[0.03] transition-colors duration-150"
          style={{ width: fillWidth }}
          animate={{ 
            backgroundColor: isDragging ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'
          }}
        />
      </motion.div>
      
      {/* Label */}
      {label && (
        <span 
          className={`
            relative z-10 text-text-label font-medium truncate
            ${inline ? 'text-[10px]' : 'text-[11px]'}
            ${inline ? '' : 'flex-1 min-w-0'}
          `}
        >
          {label}
        </span>
      )}
      
      {/* Value input or display */}
      <div className={`relative z-10 flex items-center ${inline ? '' : 'ml-auto'}`}>
        {isFocused ? (
          // Controlled input when focused
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className={`
                w-10 h-5 px-1 text-right
                text-[12px] tabular-nums tracking-tight
                bg-bg-surface border-0 rounded
                text-text-primary
                outline-none ring-1 ring-white/20
              `}
              style={{
                fontVariantNumeric: 'tabular-nums',
              }}
              autoFocus
            />
            <span className="text-text-muted text-[10px] ml-0.5 w-4">{unit}</span>
          </div>
        ) : (
          // Display value when not focused
          <div 
            className="relative flex items-center cursor-text"
            onClick={handleInputFocus}
          >
            <motion.span
              className="w-10 h-5 px-1 flex items-center justify-end text-[12px] text-text-primary tabular-nums tracking-tight rounded hover:bg-bg-hover/50 transition-colors"
              style={{
                filter: motionBlur > 0 ? `blur(${motionBlur}px)` : 'none',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {displayValue}
            </motion.span>
            <span className="text-text-muted text-[10px] ml-0.5 w-4">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}
