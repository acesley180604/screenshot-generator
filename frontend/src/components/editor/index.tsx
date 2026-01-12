"use client";

import React, { useEffect } from "react";
import { useEditorStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Header } from "./Header";
import { LocaleBar } from "./LocaleBar";
import { ScreenshotList } from "./ScreenshotList";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateGallery } from "./TemplateGallery";
import { ExportDialog } from "./ExportDialog";
import { BulkImportDialog } from "./BulkImportDialog";
import { StorePreview } from "./StorePreview";
import { Toolbar } from "./Toolbar";
import { ProjectManager } from "./ProjectManager";

export function Editor() {
  const { project, selectScreenshot, selectedScreenshotId, saveProject } = useEditorStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-select first screenshot on mount
  useEffect(() => {
    if (!selectedScreenshotId && project.screenshots.length > 0) {
      selectScreenshot(project.screenshots[0].id);
    }
  }, [project.screenshots, selectedScreenshotId, selectScreenshot]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProject();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveProject]);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <LocaleBar />
      <div className="flex-1 flex overflow-hidden min-w-0">
        <ScreenshotList />
        <div className="flex-1 flex flex-col relative min-w-0">
          <Toolbar />
          <Canvas />
        </div>
        <PropertiesPanel />
      </div>
      <TemplateGallery />
      <ExportDialog />
      <BulkImportDialog />
      <StorePreview />
      <ProjectManager />
    </div>
  );
}
