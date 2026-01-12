"use client";

import React from "react";
import { Layout, Download, Sparkles, Upload, FolderOpen, Save } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const {
    project,
    setProjectName,
    setShowTemplateGallery,
    setShowExportDialog,
    setShowBulkImportDialog,
    setShowProjectManager,
    saveProject,
    renameProject,
  } = useEditorStore();

  return (
    <header className="h-16 border-b border-[#2c2c2e] bg-[#1c1c1e]/80 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-50">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0a84ff] via-[#bf5af2] to-[#ff375f] rounded-xl flex items-center justify-center shadow-lg shadow-[#0a84ff]/20 group-hover:shadow-xl group-hover:shadow-[#0a84ff]/30 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-[#0a84ff] via-[#bf5af2] to-[#ff375f] rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[15px] font-semibold text-[#f5f5f7] tracking-tight">
              Screenshot Studio
            </h1>
            <p className="text-[11px] text-[#8e8e93] -mt-0.5">
              App Store Assets
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#3a3a3c]" />

        {/* Project Name */}
        <div className="relative group">
          <Input
            value={project.name}
            onChange={(e) => renameProject(e.target.value)}
            className="h-9 w-56 text-sm font-medium bg-transparent border-transparent hover:bg-[#2c2c2e] focus:bg-[#1c1c1e] focus:border-[#0a84ff] focus:shadow-[0_0_0_4px_rgba(10,132,255,0.15)] rounded-lg px-3 transition-all duration-200"
            placeholder="Project name"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Projects Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowProjectManager(true)}
          className="gap-2 font-medium text-[#8e8e93] hover:text-white"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Projects</span>
        </Button>

        {/* Save Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => saveProject()}
          className="gap-2 font-medium text-[#8e8e93] hover:text-white"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </Button>
        {/* Bulk Import Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowBulkImportDialog(true)}
          className="gap-2 font-medium"
        >
          <Upload className="w-4 h-4" />
          <span>Bulk Import</span>
        </Button>

        {/* Templates Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplateGallery(true)}
          className="gap-2 font-medium"
        >
          <Layout className="w-4 h-4" />
          <span>Templates</span>
        </Button>

        {/* Export Button */}
        <Button
          variant="premium"
          size="sm"
          onClick={() => setShowExportDialog(true)}
          className="gap-2 font-medium"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>
    </header>
  );
}
