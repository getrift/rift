'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useDebounce } from '@/lib/useDebounce';
import { compileCode } from '@/lib/compiler';

export default function Preview() {
  const code = useStore((state) => state.code);
  const debouncedCode = useDebounce(code, 200);
  const runtimeError = useStore((state) => state.runtimeError);
  const setRuntimeError = useStore((state) => state.setRuntimeError);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Clear runtime error when code changes
  useEffect(() => {
    setRuntimeError(null);
  }, [debouncedCode, setRuntimeError]);

  // Listen for runtime errors from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'runtime-error') {
        setRuntimeError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setRuntimeError]);

  const result = useMemo(() => {
    return compileCode(debouncedCode);
  }, [debouncedCode]);

  if (!result.success) {
    return (
      <div className="flex-1 bg-canvas flex items-center justify-center p-4">
        <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
          {result.error}
        </div>
      </div>
    );
  }

  if (runtimeError) {
    return (
      <div className="flex-1 bg-canvas flex items-center justify-center p-4">
        <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
          Runtime Error: {runtimeError}
        </div>
      </div>
    );
  }

  const { output, componentName } = result;

  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <script src='https://cdn.tailwindcss.com'></script>
  <style>html,body{margin:0;height:100%;background:transparent}#root{height:100%;display:flex;align-items:center;justify-content:center}</style>
</head>
<body>
  <div id='root'></div>
  <script type='module'>
    window.onerror = (msg, url, line, col, error) => {
      window.parent.postMessage({ type: 'runtime-error', error: msg }, '*');
      return true;
    };
    window.addEventListener('unhandledrejection', (e) => {
      window.parent.postMessage({ type: 'runtime-error', error: e.reason?.message || 'Promise rejected' }, '*');
    });
    (async () => {
      try {
        const React = await import('https://esm.sh/react@18');
        const {createRoot} = await import('https://esm.sh/react-dom@18/client');
        ${output}
        createRoot(document.getElementById('root')).render(React.createElement(${componentName}));
      } catch (e) {
        window.parent.postMessage({ type: 'runtime-error', error: e.message }, '*');
      }
    })();
  </script>
</body>
</html>`;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={iframeContent}
      sandbox="allow-scripts"
      className="w-full h-full border-0 bg-canvas"
      title="Preview"
    />
  );
}
