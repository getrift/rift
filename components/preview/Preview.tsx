'use client';

import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { useDebounce } from '@/lib/useDebounce';
import { compileCode } from '@/lib/compiler';

export default function Preview() {
  const code = useStore((state) => state.code);
  const debouncedCode = useDebounce(code, 200);

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
    import React from 'https://esm.sh/react@18';
    import {createRoot} from 'https://esm.sh/react-dom@18/client';
    ${output}
    createRoot(document.getElementById('root')).render(React.createElement(${componentName}));
  </script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={iframeContent}
      sandbox="allow-scripts"
      className="w-full h-full border-0 bg-canvas"
      title="Preview"
    />
  );
}
