'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useDebounce } from '@/lib/useDebounce';
import { compileCode } from '@/lib/compiler';
import { getPolyfillScript } from '@/lib/polyfills';
import { getIconStubScript } from '@/lib/icon-stubs';
import { getMissingStubScript } from '@/lib/missing-stubs';
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
  const selectedPath = activeComponent?.selectedPath || null;
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

  const iframeRef = useRef<HTMLIFrameElement>(null);
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
      if (data.componentId && data.componentId !== previewFrameId) return;

      if (data.type === 'runtime-error') {
        setRuntimeError(data.error);
      } else if (data.type === 'element-selected') {
        setSelectedPath(data.path);
        setComputedStyles(data.computedStyles || null);
      } else if (data.type === 'element-deselected') {
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
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeComponentId, previewFrameId, setRuntimeError, setSelectedPath, setComputedStyles]);

  // Sync selection from parent to iframe
  useEffect(() => {
    if (
      iframeReady.current &&
      iframeRef.current?.contentWindow &&
      selectedPath !== null &&
      activeComponentId
    ) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'select-element', path: selectedPath, componentId: previewFrameId },
        '*'
      );
    }
  }, [activeComponentId, previewFrameId, selectedPath]);

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

  // Generate icon stub script for imported icons
  const iconStubScript = imports?.iconNames?.length ? getIconStubScript(imports.iconNames) : '';

  // Generate missing component stubs for local imports
  const missingStubScript = imports?.missingComponents?.length
    ? getMissingStubScript(imports.missingComponents)
    : '';

  const iframeContent = buildIframeContent({
    compiledCode: output,
    polyfillScript,
    iconStubScript,
    missingStubScript,
    componentId: previewFrameId,
    mode: 'preview',
  });

  return (
    <div className="flex-1 flex flex-col h-full">
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
        sandbox="allow-scripts"
        className="flex-1 w-full border-0 bg-canvas"
        title="Preview"
      />
    </div>
  );
}
