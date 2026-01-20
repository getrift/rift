'use client';

import { useEffect } from 'react';
import { useStore } from './store';

/**
 * Global keyboard shortcuts for Rift
 */
export function useKeyboardShortcuts() {
  const deleteSelectedElement = useStore((state) => state.deleteSelectedElement);
  const duplicateSelectedElement = useStore((state) => state.duplicateSelectedElement);
  const selectedPath = useStore((state) => state.selectedPath);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Delete element: Backspace or Delete key
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedPath) {
        e.preventDefault();
        deleteSelectedElement();
      }

      // Duplicate element: Shift+D
      if (e.key === 'D' && e.shiftKey && !e.metaKey && !e.ctrlKey && selectedPath) {
        e.preventDefault();
        duplicateSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedElement, duplicateSelectedElement, selectedPath]);
}
