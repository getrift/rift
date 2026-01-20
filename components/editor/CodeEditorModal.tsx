'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CodeEditor from './CodeEditor';

interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeEditorModal({ isOpen, onClose }: CodeEditorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setPortalContainer(document.body);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        // Cmd+Enter (Mac) or Ctrl+Enter (Windows) - Save and close
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !portalContainer) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop - clicking this closes the modal */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={`relative w-[45vw] h-full bg-bg-panel border-r border-border-subtle flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-text-primary font-medium">Code Editor</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor />
        </div>

        {/* Footer hint */}
        <div className="p-3 border-t border-border-subtle bg-bg-surface">
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>
              <kbd className="px-2 py-1 bg-bg-panel border border-border-subtle rounded">Esc</kbd> to
              close
            </span>
            <span>
              <kbd className="px-2 py-1 bg-bg-panel border border-border-subtle rounded">⌘</kbd>
              <kbd className="px-2 py-1 bg-bg-panel border border-border-subtle rounded ml-1">
                Enter
              </kbd>{' '}
              to save & close
            </span>
          </div>
        </div>
      </div>
    </div>,
    portalContainer
  );
}
