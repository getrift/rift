'use client';

import { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import { useStore } from '@/lib/store';
import { exportWithOverrides } from '@/lib/exportCode';

export default function LeftPanel() {
  const code = useStore((state) => state.code);
  const styleOverrides = useStore((state) => state.styleOverrides);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const exported = exportWithOverrides(code, styleOverrides);
    await navigator.clipboard.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[280px] bg-bg-panel border-r border-border-subtle h-screen flex flex-col">
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-text-secondary">Code</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={handleCopy}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {copied ? 'Copied!' : 'Copy refined code'}
        </button>
      </div>
    </div>
  );
}
