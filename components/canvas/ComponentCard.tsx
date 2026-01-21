'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentState, useStore } from '@/lib/store';
import { compileCode } from '@/lib/compiler';
import { useDebounce } from '@/lib/useDebounce';
import { getPolyfillScript, getPolyfillDeclarations } from '@/lib/polyfills';
import { getIconStubScript, getIconDeclarations } from '@/lib/icon-stubs';
import { getMissingStubScript, getMissingDeclarations } from '@/lib/missing-stubs';
import { buildIframeContent } from '@/lib/iframe';

// Minimum and interactive threshold sizes
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 180;
const INTERACTIVE_WIDTH = 400;
const INTERACTIVE_HEIGHT = 300;

interface ComponentCardProps {
  component: ComponentState;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragEnd: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onResetPosition: () => void;
  zoom: number;
}

type CompileResult = Awaited<ReturnType<typeof compileCode>>;

const DRAG_THRESHOLD_PX = 4;

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-4 h-4 border-2 border-gray-300/30 border-t-gray-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      />
      <span className="text-xs text-gray-400">Compiling</span>
    </div>
  );
}

export default function ComponentCard({
  component,
  isActive,
  onSelect,
  onRemove,
  onDragEnd,
  onResize,
  onResetPosition,
  zoom,
}: ComponentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReady = useRef(false);
  const isPointerDown = useRef(false);
  const isDraggingRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef<{ x: number; y: number } | null>(null);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartSize = useRef({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });

  const debouncedCode = useDebounce(component.code, 300);
  
  // For interactive mode: get style overrides to apply
  const styleOverrides = component.styleOverrides;
  const styleOverridesRef = useRef(styleOverrides);
  useEffect(() => {
    styleOverridesRef.current = styleOverrides;
  }, [styleOverrides]);

  // Get current size (with defaults)
  const width = component.size?.width ?? DEFAULT_WIDTH;
  const height = component.size?.height ?? DEFAULT_HEIGHT;
  const isInteractive = width >= INTERACTIVE_WIDTH && height >= INTERACTIVE_HEIGHT;

  // Compile the component code asynchronously
  useEffect(() => {
    let cancelled = false;

    setHasError(false);
    setCompileResult(null);

    compileCode(debouncedCode).then((result) => {
      if (!cancelled) {
        setCompileResult(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedCode]);

  // Get store actions for selection (only used in interactive mode)
  const setSelectedPath = useStore((state) => state.setSelectedPath);
  const setComputedStyles = useStore((state) => state.setComputedStyles);
  const setActiveComponent = useStore((state) => state.setActiveComponent);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.componentId !== component.id) return;

      if (data.type === 'runtime-error') {
        setHasError(true);
      } else if (data.type === 'element-selected' && isInteractive) {
        // Make sure this component is active
        setActiveComponent(component.id);
        // Update selection in store
        setSelectedPath(data.path);
        setComputedStyles(data.computedStyles || null);
      } else if (data.type === 'element-deselected' && isInteractive) {
        setSelectedPath(null);
        setComputedStyles(null);
      } else if (data.type === 'iframe-ready') {
        iframeReady.current = true;
        // Send current overrides if interactive
        if (isInteractive && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'apply-overrides', overrides: styleOverridesRef.current, componentId: component.id },
            '*'
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [component.id, isInteractive, setSelectedPath, setComputedStyles, setActiveComponent]);

  // Send style overrides when they change (for interactive mode)
  useEffect(() => {
    if (isInteractive && iframeReady.current && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'apply-overrides', overrides: styleOverrides, componentId: component.id },
        '*'
      );
    }
  }, [styleOverrides, isInteractive, component.id]);

  // Handle remove
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  // Handle return to grid
  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResetPosition();
  };

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Don't start drag if clicking on remove button or resize handle
    if (
      (e.target as HTMLElement).closest('button[aria-label="Remove component"]') ||
      (e.target as HTMLElement).closest('[data-resize-handle]')
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const card = cardRef.current;
    if (!card) return;

    let resolvedPos: { x: number; y: number } | null = null;

    if (component.position) {
      resolvedPos = { ...component.position };
    } else {
      const content = card.closest('[data-canvas-content]') as HTMLElement | null;
      if (content) {
        const cardRect = card.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const styles = window.getComputedStyle(content);
        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingTop = parseFloat(styles.paddingTop) || 0;

        resolvedPos = {
          x: (cardRect.left - contentRect.left) / zoom - paddingLeft,
          y: (cardRect.top - contentRect.top) / zoom - paddingTop,
        };
      }
    }

    if (!resolvedPos) return;

    initialPos.current = resolvedPos;
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    isPointerDown.current = true;
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragOffsetRef.current = { x: 0, y: 0 };

    card.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current || !initialPos.current) return;

    const dxScreen = e.clientX - dragStartPos.current.x;
    const dyScreen = e.clientY - dragStartPos.current.y;

    if (!isDraggingRef.current) {
      if (Math.abs(dxScreen) < DRAG_THRESHOLD_PX && Math.abs(dyScreen) < DRAG_THRESHOLD_PX) {
        return;
      }
      isDraggingRef.current = true;
      setIsDragging(true);
    }

    const dx = dxScreen / zoom;
    const dy = dyScreen / zoom;
    setDragOffset({ x: dx, y: dy });
    dragOffsetRef.current = { x: dx, y: dy };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;

    isPointerDown.current = false;
    cardRef.current?.releasePointerCapture(e.pointerId);

    if (!isDraggingRef.current || !initialPos.current) {
      setDragOffset({ x: 0, y: 0 });
      initialPos.current = null;
      return;
    }

    const finalPosition = {
      x: initialPos.current.x + dragOffsetRef.current.x,
      y: initialPos.current.y + dragOffsetRef.current.y,
    };

    // Ensure position is not negative
    finalPosition.x = Math.max(0, finalPosition.x);
    finalPosition.y = Math.max(0, finalPosition.y);

    onDragEnd(finalPosition);

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragOffsetRef.current = { x: 0, y: 0 };
    initialPos.current = null;
  };

  // Resize handlers
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    resizeStartSize.current = { width, height };
    resizeStartPos.current = { x: e.clientX, y: e.clientY };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing) return;

    const dx = (e.clientX - resizeStartPos.current.x) / zoom;
    const dy = (e.clientY - resizeStartPos.current.y) / zoom;

    const newWidth = Math.max(MIN_WIDTH, resizeStartSize.current.width + dx);
    const newHeight = Math.max(MIN_HEIGHT, resizeStartSize.current.height + dy);

    onResize({ width: newWidth, height: newHeight });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (!isResizing) return;

    setIsResizing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const polyfillScript =
    compileResult && compileResult.success
      ? getPolyfillScript(compileResult.imports.polyfilled)
      : '';

  const polyfillDeclarations =
    compileResult && compileResult.success
      ? getPolyfillDeclarations(compileResult.imports.polyfilled)
      : '';

  const iconStubScript =
    compileResult && compileResult.success
      ? getIconStubScript(compileResult.imports.iconNames)
      : '';

  const iconDeclarations =
    compileResult && compileResult.success
      ? getIconDeclarations(compileResult.imports.iconNames)
      : '';

  const missingStubScript =
    compileResult && compileResult.success
      ? getMissingStubScript(compileResult.imports.missingComponents)
      : '';

  const missingDeclarations =
    compileResult && compileResult.success
      ? getMissingDeclarations(compileResult.imports.missingComponents)
      : '';

  const iframeContent =
    compileResult && compileResult.success
      ? buildIframeContent({
          compiledCode: compileResult.output,
          polyfillScript,
          polyfillDeclarations,
          iconStubScript,
          iconDeclarations,
          missingStubScript,
          missingDeclarations,
          componentId: component.id,
          mode: isInteractive ? 'preview' : 'card',
        })
      : null;

  // Determine positioning style
  const positionStyle = component.position
    ? {
        position: 'absolute' as const,
        left: component.position.x,
        top: component.position.y,
        transform: isDragging
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
          : undefined,
      }
    : isDragging
    ? {
        position: 'absolute' as const,
        left: initialPos.current ? initialPos.current.x + dragOffset.x : 0,
        top: initialPos.current ? initialPos.current.y + dragOffset.y : 0,
        zIndex: 1000,
      }
    : {};

  // Calculate preview area height (total height - footer)
  const footerHeight = 40;
  const previewHeight = height - footerHeight;

  return (
    <motion.div
      ref={cardRef}
      data-component-card
      onClick={onSelect}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        ...positionStyle,
        width,
        height,
      }}
      initial={false}
      animate={{
        scale: isDragging ? 1.02 : 1,
        boxShadow: isActive
          ? '0 0 0 2px rgba(59, 130, 246, 0.8), 0 0 24px rgba(59, 130, 246, 0.15), 0 10px 40px -10px rgba(0, 0, 0, 0.3)'
          : isDragging || isResizing
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          : '0 4px 12px -2px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)',
      }}
      whileHover={!isDragging && !isResizing ? {
        boxShadow: isActive
          ? '0 0 0 2px rgba(59, 130, 246, 0.8), 0 0 24px rgba(59, 130, 246, 0.15), 0 10px 40px -10px rgba(0, 0, 0, 0.3)'
          : '0 8px 24px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
      } : undefined}
      transition={{
        scale: { type: 'spring', stiffness: 400, damping: 25 },
        boxShadow: { duration: 0.2, ease: 'easeOut' },
      }}
      className={`
        group rounded-lg overflow-hidden relative
        bg-bg-component
        ${isDragging || isResizing ? 'cursor-grabbing z-50' : 'cursor-grab'}
      `}
    >
      {/* Interactive mode indicator */}
      <AnimatePresence>
        {isInteractive && (
          <motion.div 
            className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-medium rounded-full shadow-sm"
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            Interactive
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Area */}
      <div
        className="w-full bg-bg-component flex items-center justify-center overflow-hidden"
        style={{ height: previewHeight }}
      >
        <AnimatePresence mode="wait">
          {!compileResult ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-2"
            >
              <LoadingSpinner />
            </motion.div>
          ) : !compileResult.success ? (
            <motion.div 
              key="compile-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-red-500 p-2 text-center"
            >
              Compile Error
            </motion.div>
          ) : hasError ? (
            <motion.div 
              key="runtime-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-red-500 p-2 text-center"
            >
              Runtime Error
            </motion.div>
          ) : (
            <motion.iframe
              key="preview"
              ref={iframeRef}
              srcDoc={iframeContent || undefined}
              sandbox="allow-scripts"
              className={`w-full h-full border-0 bg-transparent ${
                isInteractive ? '' : 'pointer-events-none'
              }`}
              title={`Preview: ${component.name}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer with name */}
      <div
        className="bg-bg-component-footer border-t border-black/5 px-3 flex items-center justify-between"
        style={{ height: footerHeight }}
      >
        <span className="text-xs text-gray-600 font-medium truncate">
          {component.name}
        </span>

        <div className="flex items-center gap-1">
          {/* Return to grid button (only for positioned components) */}
          {component.position && (
            <motion.button
              onClick={handleResetPosition}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded"
              aria-label="Return to grid"
              title="Return to grid"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <svg
                className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </motion.button>
          )}

          {/* Remove button (appears on hover) */}
          <motion.button
            onClick={handleRemove}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded"
            aria-label="Remove component"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Resize handle (bottom-right corner) */}
      <motion.div
        data-resize-handle
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <svg
          className="w-4 h-4 text-gray-400 absolute bottom-0.5 right-0.5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
