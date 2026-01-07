"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Palette, Sparkles, Grid3X3, Sun, Zap } from "lucide-react";
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
    id: "clean-dark",
    name: "Clean Dark",
    category: "minimal",
    background: { type: "solid", color: "#1A1A1A" },
    textColor: "#FFFFFF",
  },
  {
    id: "midnight",
    name: "Midnight",
    category: "minimal",
    background: { type: "solid", color: "#0a0a0a" },
    textColor: "#FFFFFF",
  },
  {
    id: "clean-white",
    name: "Clean White",
    category: "minimal",
    background: { type: "solid", color: "#FFFFFF" },
    textColor: "#000000",
  },
  {
    id: "soft-gray",
    name: "Soft Gray",
    category: "minimal",
    background: { type: "solid", color: "#2c2c2e" },
    textColor: "#F5F5F7",
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
    id: "navy-bold",
    name: "Navy Bold",
    category: "feature",
    background: { type: "solid", color: "#0D1B2A" },
    textColor: "#FFFFFF",
  },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "minimal", name: "Minimal", icon: Sun },
  { id: "gradient", name: "Gradient", icon: Palette },
  { id: "feature", name: "Feature", icon: Zap },
  { id: "lifestyle", name: "Lifestyle", icon: Sparkles },
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
      return { backgroundColor: bg.color || "#1c1c1e" };
    }
    if (bg.type === "gradient" && bg.gradient) {
      const stops = bg.gradient.stops
        .map((s) => `${s.color} ${s.position * 100}%`)
        .join(", ");
      return {
        background: `linear-gradient(${bg.gradient.angle}deg, ${stops})`,
      };
    }
    return { backgroundColor: "#1c1c1e" };
  };

  return (
    <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff9f0a] to-[#ff375f] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            Choose Template
          </DialogTitle>
          <DialogDescription>
            Select a background style for your screenshot
          </DialogDescription>
        </DialogHeader>

        {/* Category tabs */}
        <div className="flex gap-2 py-3 border-b border-[#38383a]">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-[#0a84ff] text-white shadow-sm"
                    : "bg-[#2c2c2e] text-[#a1a1a6] hover:bg-[#3a3a3c] hover:text-[#f5f5f7]"
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Templates grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-4 gap-4">
            {filteredTemplates.map((template, index) => (
              <button
                key={template.id}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#3a3a3c] hover:border-[#0a84ff] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fadeInUp"
                style={{
                  ...getBackgroundStyle(template.background),
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => applyTemplate(template)}
              >
                {/* Preview content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <div
                    className="text-[10px] font-bold mb-2 tracking-wide"
                    style={{ color: template.textColor }}
                  >
                    HEADLINE
                  </div>
                  <div
                    className="w-10 h-20 rounded-xl border-2"
                    style={{ borderColor: template.textColor, opacity: 0.4 }}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-semibold tracking-tight">
                    {template.name}
                  </span>
                </div>

                {/* Selection indicator */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0a84ff] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
