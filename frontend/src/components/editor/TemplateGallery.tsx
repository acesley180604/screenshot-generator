"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TemplateConfig, BackgroundConfig } from "@/types";

interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  background: BackgroundConfig;
  textColor: string;
}

const TEMPLATES: TemplateDefinition[] = [
  {
    id: "clean-white",
    name: "Clean White",
    category: "minimal",
    background: { type: "solid", color: "#FFFFFF" },
    textColor: "#000000",
  },
  {
    id: "clean-dark",
    name: "Clean Dark",
    category: "minimal",
    background: { type: "solid", color: "#1A1A1A" },
    textColor: "#FFFFFF",
  },
  {
    id: "soft-gray",
    name: "Soft Gray",
    category: "minimal",
    background: { type: "solid", color: "#F5F5F7" },
    textColor: "#1D1D1F",
  },
  {
    id: "gradient-blue",
    name: "Ocean Blue",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 180,
        stops: [
          { color: "#667EEA", position: 0 },
          { color: "#764BA2", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-sunset",
    name: "Sunset",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 135,
        stops: [
          { color: "#FF6B6B", position: 0 },
          { color: "#FFE66D", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-purple",
    name: "Purple Dream",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 160,
        stops: [
          { color: "#8E2DE2", position: 0 },
          { color: "#4A00E0", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-green",
    name: "Fresh Green",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 180,
        stops: [
          { color: "#11998E", position: 0 },
          { color: "#38EF7D", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-pink",
    name: "Pink Blush",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 180,
        stops: [
          { color: "#FF758C", position: 0 },
          { color: "#FF7EB3", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-teal",
    name: "Teal Wave",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 180,
        stops: [
          { color: "#4ECDC4", position: 0 },
          { color: "#44A08D", position: 1 },
        ],
      },
    },
    textColor: "#FFFFFF",
  },
  {
    id: "gradient-coral",
    name: "Coral Reef",
    category: "gradient",
    background: {
      type: "gradient",
      gradient: {
        type: "linear",
        angle: 135,
        stops: [
          { color: "#FF9A9E", position: 0 },
          { color: "#FECFEF", position: 1 },
        ],
      },
    },
    textColor: "#333333",
  },
  {
    id: "warm-cream",
    name: "Warm Cream",
    category: "lifestyle",
    background: { type: "solid", color: "#FDF6E9" },
    textColor: "#2D2D2D",
  },
  {
    id: "navy-bold",
    name: "Navy Bold",
    category: "feature",
    background: { type: "solid", color: "#0D1B2A" },
    textColor: "#FFFFFF",
  },
];

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "minimal", name: "Minimal" },
  { id: "gradient", name: "Gradient" },
  { id: "feature", name: "Feature" },
  { id: "lifestyle", name: "Lifestyle" },
];

export function TemplateGallery() {
  const {
    showTemplateGallery,
    setShowTemplateGallery,
    selectedScreenshotId,
    setTemplate,
    updateTextStyle,
    project,
  } = useEditorStore();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates =
    selectedCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const applyTemplate = (template: TemplateDefinition) => {
    if (!selectedScreenshotId) return;

    const templateConfig: TemplateConfig = {
      id: template.id,
      name: template.name,
      background: template.background,
      textPosition: "top",
      deviceLayout: "center",
    };

    setTemplate(selectedScreenshotId, templateConfig);

    // Update text colors to match template
    const screenshot = project.screenshots.find(
      (s) => s.id === selectedScreenshotId
    );
    if (screenshot) {
      screenshot.texts.forEach((text) => {
        updateTextStyle(selectedScreenshotId, text.id, {
          color: template.textColor,
        });
      });
    }

    setShowTemplateGallery(false);
  };

  const getBackgroundStyle = (bg: BackgroundConfig): React.CSSProperties => {
    if (bg.type === "solid") {
      return { backgroundColor: bg.color || "#FFFFFF" };
    }
    if (bg.type === "gradient" && bg.gradient) {
      const stops = bg.gradient.stops
        .map((s) => `${s.color} ${s.position * 100}%`)
        .join(", ");
      return {
        background: `linear-gradient(${bg.gradient.angle}deg, ${stops})`,
      };
    }
    return { backgroundColor: "#FFFFFF" };
  };

  return (
    <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose Template</DialogTitle>
        </DialogHeader>

        {/* Category tabs */}
        <div className="flex gap-2 border-b pb-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="flex-1 overflow-y-auto pt-4">
          <div className="grid grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
                style={getBackgroundStyle(template.background)}
                onClick={() => applyTemplate(template)}
              >
                {/* Preview content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  <div
                    className="text-xs font-bold mb-1"
                    style={{ color: template.textColor }}
                  >
                    Headline
                  </div>
                  <div
                    className="w-8 h-14 rounded-lg border-2"
                    style={{ borderColor: template.textColor, opacity: 0.5 }}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {template.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
