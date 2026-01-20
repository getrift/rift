'use client';

import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import ComponentCard from './ComponentCard';

const clampZoom = (zoom: number) => Math.max(0.1, Math.min(2.0, zoom));

export default function Canvas() {
  const components = useStore((state) => state.components);
  const activeComponentId = useStore((state) => state.activeComponentId);
  const viewport = useStore((state) => state.viewport);
  const addComponent = useStore((state) => state.addComponent);
  const removeComponent = useStore((state) => state.removeComponent);
  const setActiveComponent = useStore((state) => state.setActiveComponent);
  const setComponentPosition = useStore((state) => state.setComponentPosition);
  const setComponentSize = useStore((state) => state.setComponentSize);
  const setZoom = useStore((state) => state.setZoom);
  const setPan = useStore((state) => state.setPan);
  const setViewport = useStore((state) => state.setViewport);
  const resetViewport = useStore((state) => state.resetViewport);
  const setSelectedPath = useStore((state) => state.setSelectedPath);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleAddComponent = () => {
    addComponent();
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length > 1) {
      removeComponent(id);
    }
  };

  // Separate components into positioned and auto-layout
  const positionedComponents = components.filter((c) => c.position !== undefined);
  const autoLayoutComponents = components.filter((c) => c.position === undefined);

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom or Ctrl+wheel
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom change
      const delta = -e.deltaY * 0.01;
      const nextZoom = clampZoom(viewport.zoom * (1 + delta));

      // Calculate new pan to zoom toward cursor
      const zoomChange = nextZoom - viewport.zoom;
      const newPanX = viewport.panX - (mouseX - viewport.panX) * (zoomChange / viewport.zoom);
      const newPanY = viewport.panY - (mouseY - viewport.panY) * (zoomChange / viewport.zoom);

      setViewport({ zoom: nextZoom, panX: newPanX, panY: newPanY });
    } else {
      // Regular scroll = pan
      setPan(viewport.panX - e.deltaX, viewport.panY - e.deltaY);
    }
  };

  // Handle space + drag for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpacePressed || e.button === 1) {
      // Space key or middle mouse
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: viewport.panX,
        panY: viewport.panY,
      };
      canvasRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan(panStartRef.current.panX + dx, panStartRef.current.panY + dy);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      canvasRef.current?.releasePointerCapture(e.pointerId);
    }
  };

  // Deselect element when clicking on canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only deselect if clicking directly on canvas background areas
    // Not on component cards, buttons, or other interactive elements
    const isCanvasBackground = 
      target === canvasRef.current ||
      target.hasAttribute('data-canvas-content') ||
      target.classList.contains('absolute') && target.parentElement === canvasRef.current;
    
    // Also check we're not clicking on a component card or interactive element
    const isInteractiveElement = target.closest('[data-component-card]') || 
                                  target.closest('button') ||
                                  target.closest('iframe');
    
    if (isCanvasBackground && !isInteractiveElement) {
      setSelectedPath(null);
    }
  };

  // Keyboard handlers for space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !e.repeat &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(viewport.zoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoom(viewport.zoom - 0.1);
  };

  const handleResetZoom = () => {
    resetViewport();
  };

  const handleFitAll = () => {
    if (components.length === 0) return;

    // Calculate bounding box of all positioned components
    const positionedComps = components.filter((c) => c.position);
    if (positionedComps.length === 0) {
      resetViewport();
      return;
    }

    const CARD_WIDTH = 240;
    const CARD_HEIGHT = 180;
    const PADDING = 50;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    positionedComps.forEach((comp) => {
      if (comp.position) {
        minX = Math.min(minX, comp.position.x);
        minY = Math.min(minY, comp.position.y);
        maxX = Math.max(maxX, comp.position.x + CARD_WIDTH);
        maxY = Math.max(maxY, comp.position.y + CARD_HEIGHT);
      }
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Calculate zoom to fit
    const zoomX = (canvasWidth - PADDING * 2) / contentWidth;
    const zoomY = (canvasHeight - PADDING * 2) / contentHeight;
    const newZoom = Math.min(zoomX, zoomY, 1.0); // Don't zoom in more than 1.0

    // Center the content
    const newPanX = (canvasWidth - contentWidth * newZoom) / 2 - minX * newZoom;
    const newPanY = (canvasHeight - contentHeight * newZoom) / 2 - minY * newZoom;

    setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
  };

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full overflow-hidden relative bg-bg-canvas ${
        isSpacePressed || isPanning ? 'cursor-grab' : ''
      } ${isPanning ? 'cursor-grabbing' : ''}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleCanvasClick}
    >
      {/* Canvas content with viewport transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        <div className="relative min-h-screen p-6" data-canvas-content>
          {/* Auto-layout section */}
          <div className="flex flex-wrap gap-4 mb-6">
            {autoLayoutComponents.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                isActive={component.id === activeComponentId}
                onSelect={() => setActiveComponent(component.id)}
                onRemove={() => handleRemoveComponent(component.id)}
                onDragEnd={(position) => setComponentPosition(component.id, position)}
                onResize={(size) => setComponentSize(component.id, size)}
                onResetPosition={() => setComponentPosition(component.id, undefined)}
                zoom={viewport.zoom}
              />
            ))}

            {/* Add Component Button */}
            <button
              onClick={handleAddComponent}
              className="
                w-[240px] h-[180px] rounded-lg
                border-2 border-dashed border-border-muted
                hover:border-border-subtle hover:bg-bg-hover/30
                transition-all duration-200
                flex flex-col items-center justify-center gap-2
                text-text-muted hover:text-text-secondary
              "
              aria-label="Add new component"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm font-medium">Add Component</span>
            </button>
          </div>

          {/* Positioned components */}
          {positionedComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              isActive={component.id === activeComponentId}
              onSelect={() => setActiveComponent(component.id)}
              onRemove={() => handleRemoveComponent(component.id)}
              onDragEnd={(position) => setComponentPosition(component.id, position)}
              onResize={(size) => setComponentSize(component.id, size)}
              onResetPosition={() => setComponentPosition(component.id, undefined)}
              zoom={viewport.zoom}
            />
          ))}

          {/* Empty state */}
          {components.length === 0 && (
            <div className="flex items-center justify-center h-full text-text-muted">
              <div className="text-center">
                <p className="text-lg mb-2">No components yet</p>
                <p className="text-sm">Click the + button to add your first component</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom controls UI */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <div className="bg-bg-panel border border-border-subtle rounded-lg shadow-lg p-2 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <div className="text-xs text-center text-text-muted py-1">
            {Math.round(viewport.zoom * 100)}%
          </div>

          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div className="border-t border-border-subtle my-1" />

          <button
            onClick={handleFitAll}
            className="p-2 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Fit all"
            title="Fit all components"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Reset zoom"
            title="Reset zoom (100%)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hint text */}
      {isSpacePressed && !isPanning && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-bg-panel border border-border-subtle rounded-lg shadow-lg px-4 py-2 text-sm text-text-secondary pointer-events-none">
          Drag to pan canvas
        </div>
      )}
    </div>
  );
}
