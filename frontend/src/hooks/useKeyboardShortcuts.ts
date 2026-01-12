"use client";

import { useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/store";

// Keyboard shortcut definitions
export const SHORTCUTS = {
  // History
  UNDO: { key: "z", meta: true, shift: false },
  REDO: { key: "z", meta: true, shift: true },
  REDO_ALT: { key: "y", meta: true, shift: false },

  // Selection & Navigation
  DELETE: { key: "Backspace", meta: false, shift: false },
  DELETE_ALT: { key: "Delete", meta: false, shift: false },
  ESCAPE: { key: "Escape", meta: false, shift: false },
  SELECT_ALL: { key: "a", meta: true, shift: false },

  // Copy/Paste
  COPY: { key: "c", meta: true, shift: false },
  PASTE: { key: "v", meta: true, shift: false },
  DUPLICATE: { key: "d", meta: true, shift: false },

  // Navigation
  NEXT_SCREENSHOT: { key: "ArrowRight", meta: true, shift: false },
  PREV_SCREENSHOT: { key: "ArrowLeft", meta: true, shift: false },
  NEXT_SCREENSHOT_ALT: { key: "]", meta: true, shift: false },
  PREV_SCREENSHOT_ALT: { key: "[", meta: true, shift: false },

  // Nudge (arrow keys)
  NUDGE_UP: { key: "ArrowUp", meta: false, shift: false },
  NUDGE_DOWN: { key: "ArrowDown", meta: false, shift: false },
  NUDGE_LEFT: { key: "ArrowLeft", meta: false, shift: false },
  NUDGE_RIGHT: { key: "ArrowRight", meta: false, shift: false },
  NUDGE_UP_LARGE: { key: "ArrowUp", meta: false, shift: true },
  NUDGE_DOWN_LARGE: { key: "ArrowDown", meta: false, shift: true },
  NUDGE_LEFT_LARGE: { key: "ArrowLeft", meta: false, shift: true },
  NUDGE_RIGHT_LARGE: { key: "ArrowRight", meta: false, shift: true },

  // Zoom
  ZOOM_IN: { key: "=", meta: true, shift: false },
  ZOOM_IN_ALT: { key: "+", meta: true, shift: false },
  ZOOM_OUT: { key: "-", meta: true, shift: false },
  ZOOM_RESET: { key: "0", meta: true, shift: false },
  FIT_TO_SCREEN: { key: "1", meta: true, shift: false },

  // Quick Actions
  ADD_SCREENSHOT: { key: "n", meta: true, shift: false },
  EXPORT: { key: "e", meta: true, shift: false },
  TEMPLATES: { key: "t", meta: true, shift: false },
  SAVE: { key: "s", meta: true, shift: false },
};

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelected,
    selectedScreenshotId,
    selectedTextId,
    duplicateScreenshot,
    copyScreenshot,
    pasteScreenshot,
    copyText,
    pasteText,
    selectNextScreenshot,
    selectPrevScreenshot,
    nudgeDevice,
    nudgeText,
    zoomIn,
    zoomOut,
    resetCanvas,
    fitToScreen,
    addScreenshot,
    setShowExportDialog,
    setShowTemplateGallery,
    selectText,
    clipboard,
  } = useEditorStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow escape to blur input
        if (e.key === "Escape") {
          target.blur();
          return;
        }
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Undo: Cmd+Z
      if (isMeta && !isShift && e.key === "z") {
        e.preventDefault();
        if (canUndo()) undo();
        return;
      }

      // Redo: Cmd+Shift+Z or Cmd+Y
      if ((isMeta && isShift && e.key === "z") || (isMeta && e.key === "y")) {
        e.preventDefault();
        if (canRedo()) redo();
        return;
      }

      // Delete: Backspace or Delete
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Escape: Deselect
      if (e.key === "Escape") {
        e.preventDefault();
        selectText(null);
        return;
      }

      // Copy: Cmd+C
      if (isMeta && !isShift && e.key === "c") {
        e.preventDefault();
        if (selectedTextId) {
          copyText(selectedTextId);
        } else if (selectedScreenshotId) {
          copyScreenshot(selectedScreenshotId);
        }
        return;
      }

      // Paste: Cmd+V
      if (isMeta && !isShift && e.key === "v") {
        e.preventDefault();
        if (clipboard.type === "text" && selectedScreenshotId) {
          pasteText(selectedScreenshotId);
        } else if (clipboard.type === "screenshot") {
          pasteScreenshot();
        }
        return;
      }

      // Duplicate: Cmd+D
      if (isMeta && !isShift && e.key === "d") {
        e.preventDefault();
        if (selectedScreenshotId) {
          duplicateScreenshot(selectedScreenshotId);
        }
        return;
      }

      // Navigation: Cmd+Arrow or Cmd+[ / ]
      if (isMeta && !isShift && (e.key === "ArrowRight" || e.key === "]")) {
        e.preventDefault();
        selectNextScreenshot();
        return;
      }
      if (isMeta && !isShift && (e.key === "ArrowLeft" || e.key === "[")) {
        e.preventDefault();
        selectPrevScreenshot();
        return;
      }

      // Nudge with arrow keys (no meta)
      if (!isMeta && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const amount = isShift ? 0.05 : 0.01; // Shift = larger nudge

        if (selectedTextId && selectedScreenshotId) {
          // Nudge text (only up/down for Y position)
          if (e.key === "ArrowUp") {
            nudgeText(selectedScreenshotId, selectedTextId, "up", amount);
          } else if (e.key === "ArrowDown") {
            nudgeText(selectedScreenshotId, selectedTextId, "down", amount);
          }
        } else if (selectedScreenshotId) {
          // Nudge device
          const direction = e.key.replace("Arrow", "").toLowerCase() as
            | "up"
            | "down"
            | "left"
            | "right";
          nudgeDevice(selectedScreenshotId, direction, amount);
        }
        return;
      }

      // Zoom: Cmd+= / Cmd+- / Cmd+0
      if (isMeta && !isShift && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (isMeta && !isShift && e.key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (isMeta && !isShift && e.key === "0") {
        e.preventDefault();
        resetCanvas();
        return;
      }
      if (isMeta && !isShift && e.key === "1") {
        e.preventDefault();
        fitToScreen();
        return;
      }

      // Add screenshot: Cmd+N
      if (isMeta && !isShift && e.key === "n") {
        e.preventDefault();
        addScreenshot();
        return;
      }

      // Export: Cmd+E
      if (isMeta && !isShift && e.key === "e") {
        e.preventDefault();
        setShowExportDialog(true);
        return;
      }

      // Templates: Cmd+T
      if (isMeta && !isShift && e.key === "t") {
        e.preventDefault();
        setShowTemplateGallery(true);
        return;
      }

      // Save (prevent default browser save dialog)
      if (isMeta && !isShift && e.key === "s") {
        e.preventDefault();
        // Could trigger auto-save or show notification
        return;
      }
    },
    [
      undo,
      redo,
      canUndo,
      canRedo,
      deleteSelected,
      selectedScreenshotId,
      selectedTextId,
      duplicateScreenshot,
      copyScreenshot,
      pasteScreenshot,
      copyText,
      pasteText,
      selectNextScreenshot,
      selectPrevScreenshot,
      nudgeDevice,
      nudgeText,
      zoomIn,
      zoomOut,
      resetCanvas,
      fitToScreen,
      addScreenshot,
      setShowExportDialog,
      setShowTemplateGallery,
      selectText,
      clipboard,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for showing keyboard shortcut hints
export function useShortcutLabel(action: keyof typeof SHORTCUTS): string {
  const shortcut = SHORTCUTS[action];
  const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  const metaKey = isMac ? "⌘" : "Ctrl";
  const parts: string[] = [];

  if (shortcut.meta) parts.push(metaKey);
  if (shortcut.shift) parts.push(isMac ? "⇧" : "Shift");

  // Format key nicely
  let keyLabel = shortcut.key;
  if (keyLabel === "Backspace") keyLabel = "⌫";
  else if (keyLabel === "Delete") keyLabel = "Del";
  else if (keyLabel === "Escape") keyLabel = "Esc";
  else if (keyLabel === "ArrowUp") keyLabel = "↑";
  else if (keyLabel === "ArrowDown") keyLabel = "↓";
  else if (keyLabel === "ArrowLeft") keyLabel = "←";
  else if (keyLabel === "ArrowRight") keyLabel = "→";
  else keyLabel = keyLabel.toUpperCase();

  parts.push(keyLabel);

  return parts.join(isMac ? "" : "+");
}
