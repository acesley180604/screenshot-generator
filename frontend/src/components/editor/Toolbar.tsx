"use client";

import React from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Smartphone,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { useShortcutLabel } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ToolbarButton({
  onClick,
  disabled,
  icon: Icon,
  label,
  shortcut,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
        disabled
          ? "text-[#48484a] cursor-not-allowed"
          : "text-[#8e8e93] hover:text-white hover:bg-[#2c2c2e]",
        className
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-[#3a3a3c] mx-1" />;
}

export function Toolbar() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    zoomIn,
    zoomOut,
    resetCanvas,
    fitToScreen,
    canvasState,
    setShowStorePreview,
    selectedScreenshotId,
    duplicateScreenshot,
    deleteSelected,
    selectNextScreenshot,
    selectPrevScreenshot,
    project,
  } = useEditorStore();

  const undoShortcut = useShortcutLabel("UNDO");
  const redoShortcut = useShortcutLabel("REDO");
  const duplicateShortcut = useShortcutLabel("DUPLICATE");
  const deleteShortcut = useShortcutLabel("DELETE");

  const zoomPercentage = Math.round(canvasState.zoom * 100);

  const currentIndex = project.screenshots.findIndex(
    (s) => s.id === selectedScreenshotId
  );
  const hasMultipleScreenshots = project.screenshots.length > 1;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1c1c1e] border-b border-[#2c2c2e]">
      {/* Left: History and Edit */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={undo}
          disabled={!canUndo()}
          icon={Undo2}
          label="Undo"
          shortcut={undoShortcut}
        />
        <ToolbarButton
          onClick={redo}
          disabled={!canRedo()}
          icon={Redo2}
          label="Redo"
          shortcut={redoShortcut}
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() =>
            selectedScreenshotId && duplicateScreenshot(selectedScreenshotId)
          }
          disabled={!selectedScreenshotId}
          icon={Copy}
          label="Duplicate"
          shortcut={duplicateShortcut}
        />
        <ToolbarButton
          onClick={deleteSelected}
          disabled={!selectedScreenshotId || project.screenshots.length <= 1}
          icon={Trash2}
          label="Delete"
          shortcut={deleteShortcut}
          className="hover:text-[#ff453a]"
        />

        {hasMultipleScreenshots && (
          <>
            <ToolbarDivider />
            <ToolbarButton
              onClick={selectPrevScreenshot}
              disabled={currentIndex <= 0}
              icon={ChevronLeft}
              label="Previous Screenshot"
            />
            <span className="text-[#8e8e93] text-xs px-2 min-w-[3rem] text-center">
              {currentIndex + 1} / {project.screenshots.length}
            </span>
            <ToolbarButton
              onClick={selectNextScreenshot}
              disabled={currentIndex >= project.screenshots.length - 1}
              icon={ChevronRight}
              label="Next Screenshot"
            />
          </>
        )}
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center gap-1 bg-[#2c2c2e] rounded-lg px-2 py-1">
        <ToolbarButton
          onClick={zoomOut}
          disabled={canvasState.zoom <= 0.1}
          icon={ZoomOut}
          label="Zoom Out"
        />
        <button
          onClick={resetCanvas}
          className="text-[#8e8e93] hover:text-white text-xs font-medium px-2 py-1 rounded hover:bg-[#3a3a3c] transition-colors min-w-[3.5rem] text-center"
          title="Reset Zoom"
        >
          {zoomPercentage}%
        </button>
        <ToolbarButton
          onClick={zoomIn}
          disabled={canvasState.zoom >= 5}
          icon={ZoomIn}
          label="Zoom In"
        />
        <ToolbarDivider />
        <ToolbarButton
          onClick={fitToScreen}
          icon={Maximize2}
          label="Fit to Screen"
        />
      </div>

      {/* Right: View Options */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStorePreview(true)}
          className="flex items-center gap-2 text-[#8e8e93] hover:text-white"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs font-medium">Store Preview</span>
        </Button>
      </div>
    </div>
  );
}
