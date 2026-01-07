"use client";

import React, { useEffect } from "react";
import { useEditorStore } from "@/lib/store";
import { Header } from "./Header";
import { LocaleBar } from "./LocaleBar";
import { ScreenshotList } from "./ScreenshotList";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateGallery } from "./TemplateGallery";
import { ExportDialog } from "./ExportDialog";
import { BulkImportDialog } from "./BulkImportDialog";

export function Editor() {
  const { project, selectScreenshot, selectedScreenshotId } = useEditorStore();

  // Auto-select first screenshot on mount
  useEffect(() => {
    if (!selectedScreenshotId && project.screenshots.length > 0) {
      selectScreenshot(project.screenshots[0].id);
    }
  }, [project.screenshots, selectedScreenshotId, selectScreenshot]);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <Header />
      <LocaleBar />
      <div className="flex-1 flex overflow-hidden">
        <ScreenshotList />
        <Canvas />
        <PropertiesPanel />
      </div>
      <TemplateGallery />
      <ExportDialog />
      <BulkImportDialog />
    </div>
  );
}
