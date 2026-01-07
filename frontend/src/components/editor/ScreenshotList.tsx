"use client";

import React from "react";
import { Plus, Copy, Trash2, GripVertical } from "lucide-react";
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
    <div className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Screenshots</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {project.screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className={cn(
              "group relative rounded-lg border-2 cursor-pointer transition-all",
              selectedScreenshotId === screenshot.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
            onClick={() => selectScreenshot(screenshot.id)}
          >
            {/* Thumbnail preview */}
            <div className="aspect-[9/19.5] rounded-md overflow-hidden m-1">
              <div
                className="w-full h-full flex items-center justify-center text-xs text-gray-400"
                style={{
                  background: screenshot.template.background.type === 'gradient'
                    ? `linear-gradient(${screenshot.template.background.gradient?.angle || 180}deg, ${screenshot.template.background.gradient?.stops.map(s => s.color).join(', ')})`
                    : screenshot.template.background.color || '#f5f5f5',
                }}
              >
                <span className="bg-white/80 px-2 py-1 rounded text-gray-600 font-medium">
                  {index + 1}
                </span>
              </div>
            </div>

            {/* Actions overlay */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateScreenshot(screenshot.id);
                }}
                className="p-1 rounded bg-white/90 hover:bg-white shadow-sm"
                title="Duplicate"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              {project.screenshots.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeScreenshot(screenshot.id);
                  }}
                  className="p-1 rounded bg-white/90 hover:bg-red-50 shadow-sm"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>

            {/* Drag handle */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addScreenshot}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Screenshot
        </Button>
      </div>
    </div>
  );
}
