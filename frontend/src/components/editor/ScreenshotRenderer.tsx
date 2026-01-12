"use client";

import React, { forwardRef } from "react";
import type { ScreenshotConfig } from "@/types";
import { cn } from "@/lib/utils";

// Layout definitions (simplified from Canvas.tsx)
const LAYOUTS: Record<string, { devices: { position: { x: number; y: number }; scale?: number; rotation?: number }[] }> = {
  "custom": { devices: [{ position: { x: 0.5, y: 0.55 } }] },
  "single-center": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.7 }] },
  "single-left": { devices: [{ position: { x: 0.35, y: 0.55 }, scale: 0.65 }] },
  "single-right": { devices: [{ position: { x: 0.65, y: 0.55 }, scale: 0.65 }] },
};

interface ScreenshotRendererProps {
  screenshot: ScreenshotConfig;
  locale: string;
  width: number;
  height: number;
}

/**
 * Renders a screenshot at the specified dimensions for export
 */
export const ScreenshotRenderer = forwardRef<HTMLDivElement, ScreenshotRendererProps>(
  ({ screenshot, locale, width, height }, ref) => {
    const { template, device, image, texts, layout: screenshotLayout } = screenshot;
    const bg = template.background;

    // Generate background style
    const backgroundStyle: React.CSSProperties = {};

    if (bg.type === "solid") {
      backgroundStyle.backgroundColor = bg.color || "#1c1c1e";
    } else if (bg.type === "gradient" && bg.gradient) {
      const { type: gradType, angle, stops, center_x, center_y } = bg.gradient;
      const gradientStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");

      if (gradType === "radial") {
        const cx = (center_x ?? 0.5) * 100;
        const cy = (center_y ?? 0.5) * 100;
        backgroundStyle.background = `radial-gradient(circle at ${cx}% ${cy}%, ${gradientStops})`;
      } else if (gradType === "conic") {
        const cx = (center_x ?? 0.5) * 100;
        const cy = (center_y ?? 0.5) * 100;
        backgroundStyle.background = `conic-gradient(from ${angle || 0}deg at ${cx}% ${cy}%, ${gradientStops})`;
      } else {
        backgroundStyle.background = `linear-gradient(${angle}deg, ${gradientStops})`;
      }
    } else if (bg.type === "mesh" && bg.color_points) {
      const meshGradients = bg.color_points.map((point) => {
        const x = point.x * 100;
        const y = point.y * 100;
        const size = point.radius * 100;
        return `radial-gradient(circle at ${x}% ${y}%, ${point.color} 0%, transparent ${size}%)`;
      });
      backgroundStyle.background = meshGradients.join(", ");
      backgroundStyle.backgroundColor = bg.color_points[0]?.color || "#1c1c1e";
    } else if ((bg.type === "glassmorphism" || bg.type === "blobs") && bg.blobs) {
      const gradients: string[] = [];
      bg.blobs.forEach((blob) => {
        const x = blob.x * 100;
        const y = blob.y * 100;
        const size = blob.size * 80;
        gradients.push(`radial-gradient(circle at ${x}% ${y}%, ${blob.color} 0%, transparent ${size}%)`);
      });
      if (bg.base_gradient && bg.base_gradient.stops) {
        const baseStops = bg.base_gradient.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
        gradients.push(`linear-gradient(${bg.base_gradient.angle || 135}deg, ${baseStops})`);
      }
      backgroundStyle.background = gradients.join(", ");
      backgroundStyle.backgroundColor = bg.base_color || "#0D0D1A";
    }

    // Get layout
    const currentLayoutId = screenshotLayout || "custom";
    const layout = LAYOUTS[currentLayoutId] || LAYOUTS["single-center"];

    // Device position
    const devicePosition = layout.devices[0]?.position || { x: 0.5, y: 0.55 };
    const posX = currentLayoutId === "custom" ? device.positionX : devicePosition.x;
    const posY = currentLayoutId === "custom" ? device.positionY : devicePosition.y;
    const scale = currentLayoutId === "custom" ? device.scale : (layout.devices[0]?.scale || 0.7);
    const rotation = currentLayoutId === "custom" ? device.rotation : (layout.devices[0]?.rotation || 0);

    // Calculate device dimensions (App Store screenshot ratio 1242:2688)
    const deviceWidth = width * scale;
    const deviceHeight = deviceWidth * (2688 / 1242);

    return (
      <div
        ref={ref}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          overflow: "hidden",
          ...backgroundStyle,
        }}
      >
        {/* Text elements */}
        {texts.map((text) => {
          const content = text.translations[locale] || text.translations["en"] || "";
          if (!content) return null;

          const fontSize = text.style.fontSize * (width / 280); // Scale based on export width

          return (
            <div
              key={text.id}
              style={{
                position: "absolute",
                left: "50%",
                top: `${text.positionY * 100}%`,
                transform: "translateX(-50%)",
                width: "85%",
                textAlign: (text.style.alignment as React.CSSProperties["textAlign"]) || "center",
              }}
            >
              <span
                style={{
                  color: text.style.color,
                  fontSize: `${fontSize}px`,
                  fontWeight: text.style.fontWeight,
                  fontFamily: text.style.fontFamily || "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: 1.2,
                  whiteSpace: "pre-wrap",
                }}
              >
                {content}
              </span>
            </div>
          );
        })}

        {/* Device frame */}
        <div
          style={{
            position: "absolute",
            left: `${posX * 100}%`,
            top: `${posY * 100}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
          }}
        >
          {/* Device bezel */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: device.style === "none" ? "0" : "16.5%",
              backgroundColor: device.style === "none" ? "transparent" : "#1c1c1e",
              border: device.style === "none" ? "none" : "3px solid #3a3a3c",
              boxShadow: device.shadow ? `0 ${deviceWidth * 0.02}px ${deviceWidth * 0.08}px rgba(0,0,0,${device.shadowOpacity || 0.3})` : undefined,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Screen area */}
            <div
              style={{
                position: "absolute",
                top: device.style === "none" ? 0 : "1.8%",
                left: device.style === "none" ? 0 : "1.8%",
                right: device.style === "none" ? 0 : "1.8%",
                bottom: device.style === "none" ? 0 : "1.8%",
                borderRadius: device.style === "none" ? "0" : "14.7%",
                overflow: "hidden",
                backgroundColor: "#2c2c2e",
              }}
            >
              {image?.url && (
                <img
                  src={image.url}
                  alt="Screenshot"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: image.fit || "cover",
                  }}
                  crossOrigin="anonymous"
                />
              )}
            </div>

            {/* Dynamic Island */}
            {device.style !== "none" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "3.5%",
                  width: "32%",
                  height: "4.4%",
                  borderRadius: "999px",
                  backgroundColor: "#000",
                }}
              />
            )}

            {/* Home indicator */}
            {device.style !== "none" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: "2.2%",
                  width: "38%",
                  height: "1.5%",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

ScreenshotRenderer.displayName = "ScreenshotRenderer";

export default ScreenshotRenderer;
