'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useDebounce } from '@/lib/useDebounce';
import { compileCode } from '@/lib/compiler';
import { getPolyfillScript, getPolyfillDeclarations } from '@/lib/polyfills';
import { getIconStubScript, getIconDeclarations } from '@/lib/icon-stubs';
import { getMissingStubScript, getMissingDeclarations } from '@/lib/missing-stubs';
import { buildIframeContent } from '@/lib/iframe';

export default function Preview() {
  // Get active component from new store shape
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);

  // Use active component's data (with fallbacks for safety)
  const code = activeComponent?.code || '';
  const debouncedCode = useDebounce(code, 200);
  const runtimeError = activeComponent?.runtimeError || null;
  const selectedPaths = activeComponent?.selectedPaths || null;
  const previewFrameId = activeComponentId ? `preview:${activeComponentId}` : 'preview';

  // Wrap styleOverrides in useMemo to avoid creating new object on every render
  const styleOverrides = useMemo(
    () => activeComponent?.styleOverrides || {},
    [activeComponent?.styleOverrides]
  );

  // Actions
  const setRuntimeError = useStore((state) => state.setRuntimeError);
  const setSelectedPath = useStore((state) => state.setSelectedPath);
  const setComputedStyles = useStore((state) => state.setComputedStyles);
  const deleteSelectedElement = useStore((state) => state.deleteSelectedElement);
  const duplicateSelectedElement = useStore((state) => state.duplicateSelectedElement);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeReady = useRef(false);
  const [compileResult, setCompileResult] = useState<
    Awaited<ReturnType<typeof compileCode>> | null
  >(null);

  // Compile code asynchronously when it changes
  useEffect(() => {
    let cancelled = false;

    setRuntimeError(null);
    iframeReady.current = false;
    setCompileResult(null);

    compileCode(debouncedCode).then((result) => {
      if (!cancelled) {
        setCompileResult(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedCode, setRuntimeError]);

  // Track latest styleOverrides in a ref for the message handler
  const styleOverridesRef = useRef(styleOverrides);
  useEffect(() => {
    styleOverridesRef.current = styleOverrides;
  }, [styleOverrides]);

  // Listen for runtime errors and element selection from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;
      
      console.log('[Parent received message]', data.type, data);
      
      if (data.componentId && data.componentId !== previewFrameId) return;

      if (data.type === 'runtime-error') {
        setRuntimeError(data.error);
      } else if (data.type === 'element-selected') {
        // Single selection (regular click)
        setSelectedPath(data.path);
        setComputedStyles(data.computedStyles || null);
        // Focus the container so keyboard shortcuts work
        containerRef.current?.focus();
      } else if (data.type === 'elements-selected') {
        // Multi-selection (shift+click) - paths array from iframe
        // For now, treat as replacing selection with all paths
        // We'll need to update store to handle this properly
        if (data.paths && data.paths.length > 0) {
          // Set all paths as selected
          const activeId = useStore.getState().activeComponentId;
          if (activeId) {
            useStore.getState().setComponentSelectedPaths(activeId, data.paths);
          }
        }
        setComputedStyles(data.computedStyles || null);
        // Focus the container so keyboard shortcuts work
        containerRef.current?.focus();
      } else if (data.type === 'element-deselected' || data.type === 'elements-deselected') {
        setSelectedPath(null);
        setComputedStyles(null);
      } else if (data.type === 'iframe-ready') {
        iframeReady.current = true;
        // Send current overrides using ref for latest value
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'apply-overrides',
              overrides: styleOverridesRef.current,
              componentId: previewFrameId,
            },
            '*'
          );
        }
      } else if (data.type === 'keydown') {
        // Handle keyboard shortcuts forwarded from iframe
        const { key, shiftKey } = data;
        const hasSelection = useStore.getState().selectedPath !== null;
        console.log('[KEYDOWN from iframe]', { key, shiftKey, hasSelection });
        
        if ((key === 'Backspace' || key === 'Delete') && hasSelection) {
          console.log('[KEYDOWN] Calling deleteSelectedElement');
          deleteSelectedElement();
        } else if (key === 'D' && shiftKey && hasSelection) {
          console.log('[KEYDOWN] Calling duplicateSelectedElement');
          duplicateSelectedElement();
        } else if (key === 'Escape') {
          setSelectedPath(null);
          setComputedStyles(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeComponentId, previewFrameId, setRuntimeError, setSelectedPath, setComputedStyles, deleteSelectedElement, duplicateSelectedElement]);

  // Sync selection from parent to iframe
  useEffect(() => {
    if (
      iframeReady.current &&
      iframeRef.current?.contentWindow &&
      selectedPaths !== null &&
      activeComponentId
    ) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'select-elements', paths: selectedPaths, componentId: previewFrameId },
        '*'
      );
    }
  }, [activeComponentId, previewFrameId, selectedPaths]);

  // Send overrides whenever they change (if iframe ready)
  useEffect(() => {
    if (iframeReady.current && iframeRef.current?.contentWindow && activeComponentId) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'apply-overrides', overrides: styleOverrides, componentId: previewFrameId },
        '*'
      );
    }
  }, [activeComponentId, previewFrameId, styleOverrides]);

  if (!compileResult) {
    return (
      <div className="flex-1 bg-canvas flex items-center justify-center p-4">
        <div className="text-gray-400 font-mono text-sm">Compiling...</div>
      </div>
    );
  }

  if (!compileResult.success) {
    return (
      <div className="flex-1 bg-canvas flex items-center justify-center p-4">
        <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
          {compileResult.error}
        </div>
      </div>
    );
  }

  const { output, imports } = compileResult;

  if (runtimeError) {
    return (
      <div className="flex-1 bg-canvas flex flex-col">
        {/* Warning banner for missing components */}
        {imports && imports.missingComponents && imports.missingComponents.length > 0 && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-600 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <div className="font-medium">Missing local imports:</div>
              <div className="mt-1">{imports.missingComponents.join(', ')}</div>
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
            Runtime Error: {runtimeError}
          </div>
        </div>
      </div>
    );
  }

  // Generate polyfill script based on detected imports
  const polyfillScript = imports?.polyfilled?.length
    ? getPolyfillScript(imports.polyfilled)
    : '';
  const polyfillDeclarations = imports?.polyfilled?.length
    ? getPolyfillDeclarations(imports.polyfilled)
    : '';

  // Generate icon stub script for imported icons
  const iconStubScript = imports?.iconNames?.length ? getIconStubScript(imports.iconNames) : '';
  const iconDeclarations = imports?.iconNames?.length ? getIconDeclarations(imports.iconNames) : '';

  // Generate missing component stubs for local imports
  const missingStubScript = imports?.missingComponents?.length
    ? getMissingStubScript(imports.missingComponents)
    : '';
  const missingDeclarations = imports?.missingComponents?.length
    ? getMissingDeclarations(imports.missingComponents)
    : '';

  const iframeContent = buildIframeContent({
    compiledCode: output,
    polyfillScript,
    polyfillDeclarations,
    iconStubScript,
    iconDeclarations,
    missingStubScript,
    missingDeclarations,
    componentId: previewFrameId,
    mode: 'preview',
  });

  // Handle keyboard shortcuts when preview container has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const hasSelection = selectedPaths !== null && selectedPaths.length > 0;
    console.log('[Preview keydown]', e.key, { hasSelection });
    
    if ((e.key === 'Backspace' || e.key === 'Delete') && hasSelection) {
      e.preventDefault();
      console.log('[Preview] Calling delete');
      deleteSelectedElement();
    } else if (e.key === 'D' && e.shiftKey && hasSelection) {
      e.preventDefault();
      duplicateSelectedElement();
    } else if (e.key === 'Escape') {
      setSelectedPath(null);
      setComputedStyles(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col h-full outline-none" 
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Warning banner for missing components */}
      {imports && imports.missingComponents && imports.missingComponents.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-600 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div className="font-medium">Missing local imports:</div>
            <div className="mt-1">{imports.missingComponents.join(', ')}</div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        srcDoc={iframeContent}
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full border-0 bg-canvas"
        title="Preview"
      />
    </div>
  );
}
