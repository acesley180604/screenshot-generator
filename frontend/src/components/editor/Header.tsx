"use client";

import React from "react";
import { Layout, Download, Save, Settings } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const {
    project,
    setProjectName,
    setShowTemplateGallery,
    setShowExportDialog,
  } = useEditorStore();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SS</span>
          </div>
          <span className="font-semibold text-gray-900 hidden sm:block">
            Screenshot Studio
          </span>
        </div>

        {/* Project Name */}
        <div className="h-8 w-px bg-gray-200" />
        <Input
          value={project.name}
          onChange={(e) => setProjectName(e.target.value)}
          className="h-8 w-48 text-sm font-medium border-transparent hover:border-gray-300 focus:border-blue-500"
          placeholder="Project name"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Templates Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplateGallery(true)}
        >
          <Layout className="w-4 h-4 mr-1" />
          Templates
        </Button>

        {/* Export Button */}
        <Button
          size="sm"
          onClick={() => setShowExportDialog(true)}
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
    </header>
  );
}
