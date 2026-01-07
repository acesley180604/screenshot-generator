"use client";

import React from "react";
import { Plus, Copy, Trash2, GripVertical, Image } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScreenshotList() {
  const {
    project,
    selectedScreenshotId,
    selectScreenshot,
    addScreenshot,
    removeScreenshot,
    duplicateScreenshot,
  } = useEditorStore();

  return (
    <div className="w-56 border-r border-[#2c2c2e] bg-[#0a0a0a] flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#2c2c2e]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f5f7]">Screenshots</h3>
            <p className="text-[11px] text-[#8e8e93] mt-0.5">{project.screenshots.length} items</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={addScreenshot}
            className="h-8 w-8 hover:bg-[#0a84ff]/10 hover:text-[#0a84ff]"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Screenshot thumbnails */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {project.screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className={cn(
              "group relative rounded-xl cursor-pointer transition-all duration-200 animate-fadeInUp",
              selectedScreenshotId === screenshot.id
                ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-[#0a0a0a]"
                : "hover:shadow-lg hover:shadow-black/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => selectScreenshot(screenshot.id)}
          >
            {/* Thumbnail preview */}
            <div
              className={cn(
                "aspect-[9/19.5] rounded-xl overflow-hidden border transition-all duration-200",
                selectedScreenshotId === screenshot.id
                  ? "border-transparent"
                  : "border-[#2c2c2e] group-hover:border-[#3a3a3c]"
              )}
            >
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{
                  background: screenshot.template.background.type === 'gradient'
                    ? `linear-gradient(${screenshot.template.background.gradient?.angle || 180}deg, ${screenshot.template.background.gradient?.stops.map(s => s.color).join(', ')})`
                    : screenshot.template.background.color || '#1c1c1e',
                }}
              >
                {/* Screenshot number badge */}
                <div className={cn(
                  "absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-200",
                  selectedScreenshotId === screenshot.id
                    ? "bg-[#0a84ff] text-white"
                    : "bg-[#2c2c2e]/90 text-[#f5f5f7] shadow-sm"
                )}>
                  {index + 1}
                </div>

                {/* Preview icon */}
                {!screenshot.image?.url && (
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Image className="w-5 h-5 text-white/40" />
                  </div>
                )}

                {/* Mini device preview if image exists */}
                {screenshot.image?.url && (
                  <div className="w-12 h-24 rounded-lg bg-[#1c1c1e] overflow-hidden shadow-lg border border-[#3a3a3c]">
                    <img
                      src={screenshot.image.url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateScreenshot(screenshot.id);
                }}
                className="p-1.5 rounded-lg bg-[#2c2c2e]/95 hover:bg-[#3a3a3c] shadow-sm hover:shadow-md transition-all duration-200"
                title="Duplicate"
              >
                <Copy className="w-3 h-3 text-[#a1a1a6]" />
              </button>
              {project.screenshots.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeScreenshot(screenshot.id);
                  }}
                  className="p-1.5 rounded-lg bg-[#2c2c2e]/95 hover:bg-[#ff453a] shadow-sm hover:shadow-md transition-all duration-200 group/delete"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-[#ff453a] group-hover/delete:text-white" />
                </button>
              )}
            </div>

            {/* Drag handle */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab">
              <div className="p-1 rounded bg-[#2c2c2e]/90 shadow-sm">
                <GripVertical className="w-3 h-3 text-[#636366]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add button footer */}
      <div className="p-3 border-t border-[#2c2c2e] bg-[#1c1c1e]/50">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 font-medium bg-[#1c1c1e] hover:bg-[#2c2c2e] border-[#3a3a3c]"
          onClick={addScreenshot}
        >
          <Plus className="w-4 h-4" />
          Add Screenshot
        </Button>
      </div>
    </div>
  );
}
