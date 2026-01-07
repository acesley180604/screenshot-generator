"use client";

import React from "react";
import { Plus, Copy, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScreenshotConfig, SocialProofElement } from "@/types";

// Generate background style for thumbnail
function getBackgroundStyle(screenshot: ScreenshotConfig): React.CSSProperties {
  const bg = screenshot.template.background;
  const style: React.CSSProperties = {};

  if (bg.type === "solid") {
    style.backgroundColor = bg.color || "#1c1c1e";
  } else if (bg.type === "gradient" && bg.gradient) {
    const { type: gradType, angle, stops, center_x, center_y } = bg.gradient;
    const gradientStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");

    if (gradType === "radial") {
      const cx = (center_x ?? 0.5) * 100;
      const cy = (center_y ?? 0.5) * 100;
      style.background = `radial-gradient(circle at ${cx}% ${cy}%, ${gradientStops})`;
    } else if (gradType === "conic") {
      const cx = (center_x ?? 0.5) * 100;
      const cy = (center_y ?? 0.5) * 100;
      style.background = `conic-gradient(from ${angle || 0}deg at ${cx}% ${cy}%, ${gradientStops})`;
    } else {
      style.background = `linear-gradient(${angle}deg, ${gradientStops})`;
    }
  } else if (bg.type === "mesh" && bg.color_points) {
    const meshGradients = bg.color_points.map((point) => {
      const x = point.x * 100;
      const y = point.y * 100;
      const size = point.radius * 100;
      return `radial-gradient(circle at ${x}% ${y}%, ${point.color} 0%, transparent ${size}%)`;
    });
    style.background = meshGradients.join(", ");
    style.backgroundColor = bg.color_points[0]?.color || "#1c1c1e";
  } else if (bg.type === "glassmorphism" || bg.type === "blobs") {
    const gradients: string[] = [];
    if (bg.blobs) {
      bg.blobs.forEach((blob) => {
        const x = blob.x * 100;
        const y = blob.y * 100;
        const size = blob.size * 80;
        gradients.push(`radial-gradient(circle at ${x}% ${y}%, ${blob.color} 0%, transparent ${size}%)`);
      });
    }
    if (bg.base_gradient && bg.base_gradient.stops) {
      const baseStops = bg.base_gradient.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
      gradients.push(`linear-gradient(${bg.base_gradient.angle || 135}deg, ${baseStops})`);
    }
    style.background = gradients.join(", ");
    style.backgroundColor = bg.base_color || "#0D0D1A";
  }

  return style;
}

// Mini thumbnail preview component that mirrors Canvas rendering
function ThumbnailPreview({ screenshot, locale }: { screenshot: ScreenshotConfig; locale: string }) {
  const { device, image, texts } = screenshot;
  const backgroundStyle = getBackgroundStyle(screenshot);

  // Calculate device position (using stored position)
  const deviceX = device.positionX * 100;
  const deviceY = device.positionY * 100;

  return (
    <div className="w-full h-full relative overflow-hidden" style={backgroundStyle}>
      {/* Text elements */}
      {texts.map((text) => {
        const content = text.translations[locale] || text.translations["en"] || "";
        if (!content) return null;
        return (
          <div
            key={text.id}
            className="absolute left-0 right-0 px-2 text-center"
            style={{
              top: `${text.positionY * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="inline-block text-[6px] font-semibold leading-tight"
              style={{
                color: text.style.color,
                fontWeight: text.style.fontWeight,
              }}
            >
              {content.length > 30 ? content.substring(0, 30) + "..." : content}
            </span>
          </div>
        );
      })}

      {/* Device frame preview */}
      <div
        className="absolute"
        style={{
          left: `${deviceX}%`,
          top: `${deviceY}%`,
          transform: "translate(-50%, -50%)",
          width: "55%",
          aspectRatio: "9/19.5",
        }}
      >
        <div
          className={cn(
            "w-full h-full rounded-[4px] overflow-hidden",
            device.style === "none" ? "" : "bg-[#1c1c1e] border border-[#3a3a3c]"
          )}
          style={{
            boxShadow: device.shadow ? "0 2px 8px rgba(0,0,0,0.3)" : undefined,
          }}
        >
          {image?.url ? (
            <img
              src={image.url}
              alt="Screenshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#2c2c2e]">
              <ImageIcon className="w-3 h-3 text-[#636366]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScreenshotList() {
  const {
    project,
    selectedScreenshotId,
    selectScreenshot,
    addScreenshot,
    removeScreenshot,
    duplicateScreenshot,
    currentLocale,
  } = useEditorStore();

  return (
    <div className="w-64 border-r border-[#2c2c2e] bg-[#0a0a0a] flex flex-col h-full">
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
            {/* Thumbnail preview - real-time rendering */}
            <div
              className={cn(
                "aspect-[9/19.5] rounded-xl overflow-hidden border transition-all duration-200",
                selectedScreenshotId === screenshot.id
                  ? "border-transparent"
                  : "border-[#2c2c2e] group-hover:border-[#3a3a3c]"
              )}
            >
              <div className="w-full h-full relative">
                {/* Real-time thumbnail preview */}
                <ThumbnailPreview screenshot={screenshot} locale={currentLocale} />

                {/* Screenshot number badge */}
                <div className={cn(
                  "absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-200 z-10",
                  selectedScreenshotId === screenshot.id
                    ? "bg-[#0a84ff] text-white"
                    : "bg-[#2c2c2e]/90 text-[#f5f5f7] shadow-sm"
                )}>
                  {index + 1}
                </div>
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
