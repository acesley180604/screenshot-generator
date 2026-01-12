"use client";

import React from "react";
import { FolderOpen, Plus, Trash2, Clock, X, Save, FileText } from "lucide-react";
import { useEditorStore, SavedProject } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  // Less than a minute
  if (diff < 60000) {
    return "Just now";
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // Otherwise show date
  return date.toLocaleDateString();
}

export function ProjectManager() {
  const {
    showProjectManager,
    setShowProjectManager,
    savedProjects,
    loadProject,
    deleteProject,
    createNewProject,
    saveProject,
    project,
  } = useEditorStore();

  if (!showProjectManager) return null;

  const sortedProjects = [...savedProjects].sort(
    (a, b) => b.lastModified - a.lastModified
  );

  const handleLoadProject = (projectId: string) => {
    // Save current project before switching
    saveProject();
    loadProject(projectId);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c1c1e] rounded-2xl shadow-2xl border border-[#3a3a3c] w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a84ff]/20 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-[#0a84ff]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <p className="text-xs text-[#8e8e93]">
                {savedProjects.length} saved project{savedProjects.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProjectManager(false)}
            className="p-2 rounded-lg hover:bg-[#2c2c2e] transition-colors"
          >
            <X className="w-5 h-5 text-[#8e8e93]" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="px-6 py-3 border-b border-[#3a3a3c] flex items-center gap-3">
          <Button
            onClick={createNewProject}
            className="bg-[#0a84ff] hover:bg-[#0a84ff]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          <Button
            onClick={() => {
              saveProject();
              setShowProjectManager(false);
            }}
            variant="outline"
            className="border-[#3a3a3c] text-[#f5f5f7] hover:bg-[#2c2c2e]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Current
          </Button>
        </div>

        {/* Current Project */}
        <div className="px-6 py-3 bg-[#2c2c2e]/50 border-b border-[#3a3a3c]">
          <p className="text-xs text-[#8e8e93] mb-1">Currently editing:</p>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0a84ff]" />
            <span className="text-sm font-medium text-white">{project.name}</span>
            <span className="text-xs text-[#8e8e93]">
              ({project.screenshots.length} screenshot{project.screenshots.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Projects List */}
        <div className="overflow-y-auto max-h-[400px] p-4">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-[#3a3a3c] mx-auto mb-3" />
              <p className="text-[#8e8e93]">No saved projects yet</p>
              <p className="text-xs text-[#636366] mt-1">
                Your projects will be auto-saved here
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {sortedProjects.map((savedProject) => (
                <div
                  key={savedProject.id}
                  onClick={() => handleLoadProject(savedProject.id)}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all",
                    savedProject.id === project.id
                      ? "bg-[#0a84ff]/10 border border-[#0a84ff]/30"
                      : "bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-transparent"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      savedProject.id === project.id
                        ? "bg-[#0a84ff]/20"
                        : "bg-[#3a3a3c]"
                    )}
                  >
                    <FileText
                      className={cn(
                        "w-6 h-6",
                        savedProject.id === project.id
                          ? "text-[#0a84ff]"
                          : "text-[#8e8e93]"
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">
                        {savedProject.name}
                      </h3>
                      {savedProject.id === project.id && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-[#0a84ff] text-white rounded-full">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#8e8e93]">
                      <span>
                        {savedProject.screenshotCount} screenshot
                        {savedProject.screenshotCount !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(savedProject.lastModified)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {savedProject.id !== project.id && (
                    <button
                      onClick={(e) => handleDeleteProject(e, savedProject.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#3a3a3c] bg-[#1c1c1e]">
          <p className="text-xs text-[#636366] text-center">
            Projects are saved locally in your browser. Auto-saves every 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
