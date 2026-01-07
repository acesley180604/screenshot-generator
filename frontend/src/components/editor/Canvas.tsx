"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Smartphone, Plus } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { uploadApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LayoutDevicePosition } from "@/types";

// Available layouts for the canvas
const LAYOUTS: Record<string, { devices: LayoutDevicePosition[], name: string }> = {
  "single-center": {
    name: "Single Center",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.85, rotation: 0, zIndex: 1 }]
  },
  "single-left": {
    name: "Single Left",
    devices: [{ position: { x: 0.32, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "single-right": {
    name: "Single Right",
    devices: [{ position: { x: 0.68, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "angled-right": {
    name: "Angled Right",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: 8, zIndex: 1, perspective: true }]
  },
  "angled-left": {
    name: "Angled Left",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: -8, zIndex: 1, perspective: true }]
  },
  "floating-3d": {
    name: "Floating 3D",
    devices: [{ position: { x: 0.5, y: 0.52 }, scale: 0.75, rotation: 5, zIndex: 1, perspective: true, floatingShadow: true }]
  },
  "duo-overlap": {
    name: "Duo Overlap",
    devices: [
      { position: { x: 0.38, y: 0.58 }, scale: 0.7, rotation: -5, zIndex: 1 },
      { position: { x: 0.62, y: 0.52 }, scale: 0.7, rotation: 5, zIndex: 2 }
    ]
  },
  "duo-side-by-side": {
    name: "Duo Side by Side",
    devices: [
      { position: { x: 0.3, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 },
      { position: { x: 0.7, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 }
    ]
  },
  "duo-stacked": {
    name: "Duo Stacked",
    devices: [
      { position: { x: 0.45, y: 0.6 }, scale: 0.65, rotation: -3, zIndex: 1, opacity: 0.7 },
      { position: { x: 0.55, y: 0.5 }, scale: 0.7, rotation: 3, zIndex: 2 }
    ]
  },
  "trio-cascade": {
    name: "Trio Cascade",
    devices: [
      { position: { x: 0.25, y: 0.62 }, scale: 0.5, rotation: -8, zIndex: 1 },
      { position: { x: 0.5, y: 0.5 }, scale: 0.55, rotation: 0, zIndex: 2 },
      { position: { x: 0.75, y: 0.62 }, scale: 0.5, rotation: 8, zIndex: 1 }
    ]
  },
  "trio-fan": {
    name: "Trio Fan",
    devices: [
      { position: { x: 0.3, y: 0.58 }, scale: 0.45, rotation: -15, zIndex: 1 },
      { position: { x: 0.5, y: 0.52 }, scale: 0.5, rotation: 0, zIndex: 2 },
      { position: { x: 0.7, y: 0.58 }, scale: 0.45, rotation: 15, zIndex: 1 }
    ]
  },
  "bottom-peek": {
    name: "Bottom Peek",
    devices: [{ position: { x: 0.5, y: 0.85 }, scale: 0.9, rotation: 0, zIndex: 1 }]
  },
  "top-peek": {
    name: "Top Peek",
    devices: [{ position: { x: 0.5, y: 0.25 }, scale: 0.9, rotation: 0, zIndex: 1 }]
  }
};

interface DeviceFrameProps {
  imageUrl?: string;
  position: LayoutDevicePosition;
  deviceColor: string;
  deviceStyle: string;
  shadow: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  onUpload: (file: File, deviceIndex: number) => void;
  deviceIndex: number;
  isSelected?: boolean;
}

function DeviceFrame({
  imageUrl,
  position,
  deviceColor,
  deviceStyle,
  shadow,
  shadowBlur,
  shadowOpacity,
  onUpload,
  deviceIndex,
  isSelected
}: DeviceFrameProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0], deviceIndex);
      }
    },
    [onUpload, deviceIndex]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  // Calculate transform
  const transform = [
    "translate(-50%, -50%)",
    `scale(${position.scale})`,
    `rotate(${position.rotation}deg)`,
  ];

  if (position.perspective) {
    transform.push("perspective(1000px) rotateY(5deg)");
  }

  // Get bezel color based on device color
  const bezelColors: Record<string, string> = {
    "natural-titanium": "#8A8A8F",
    "blue-titanium": "#3C4C5C",
    "white-titanium": "#F5F5F0",
    "black-titanium": "#2E2E30",
    "space-black": "#1F1F1F",
    "silver": "#E3E4E5",
  };

  const bezelColor = bezelColors[deviceColor] || "#1F1F1F";

  // Device dimensions (scaled for preview)
  const deviceWidth = position.noFrame ? 185 : 200;
  const deviceHeight = position.noFrame ? 400 : 433;

  return (
    <div
      className="absolute transition-all duration-300"
      style={{
        left: `${position.position.x * 100}%`,
        top: `${position.position.y * 100}%`,
        transform: transform.join(" "),
        zIndex: position.zIndex,
        opacity: position.opacity ?? 1,
      }}
    >
      {imageUrl ? (
        <div
          className={cn(
            "relative overflow-hidden",
            position.noFrame ? "" : "rounded-3xl",
            isSelected && "ring-2 ring-blue-500"
          )}
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
            borderRadius: position.roundedCorners ? `${position.roundedCorners}px` : undefined,
            backgroundColor: position.noFrame ? "transparent" : bezelColor,
            boxShadow: shadow && !position.noFrame
              ? position.floatingShadow
                ? `0 40px 60px -10px rgba(0,0,0,${shadowOpacity}), 0 20px 40px rgba(0,0,0,${shadowOpacity * 0.5})`
                : `0 ${shadowBlur / 4}px ${shadowBlur / 2}px rgba(0,0,0,${shadowOpacity})`
              : "none",
          }}
        >
          {/* Device bezel (if not full bleed) */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{
                border: deviceStyle === "clay" ? `6px solid ${bezelColor}` : `4px solid ${bezelColor}`,
                opacity: deviceStyle === "clay" ? 0.8 : 1,
              }}
            />
          )}

          {/* Screen content */}
          <div
            className={cn(
              "absolute overflow-hidden bg-white",
              position.noFrame ? "inset-0" : "inset-2 rounded-2xl"
            )}
            style={{
              borderRadius: position.roundedCorners ? `${position.roundedCorners - 4}px` : undefined,
            }}
          >
            <img
              src={imageUrl}
              alt="Screenshot"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dynamic Island (only for framed devices) */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-3xl overflow-hidden bg-gray-200/80 border-2 border-dashed cursor-pointer transition-colors backdrop-blur-sm",
            isDragActive ? "border-blue-500 bg-blue-50/80" : "border-gray-300"
          )}
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
          }}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center mb-2 shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-xs text-center px-2 font-medium">
              {isDragActive ? "Drop here" : `Screen ${deviceIndex + 1}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Canvas() {
  const {
    project,
    selectedScreenshotId,
    currentLocale,
    setScreenshotImage,
    selectText,
    selectedTextId,
  } = useEditorStore();

  const [selectedLayout, setSelectedLayout] = useState<string>("single-center");
  const [deviceImages, setDeviceImages] = useState<Record<number, string>>({});

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  const handleImageUpload = useCallback(
    async (file: File, deviceIndex: number) => {
      if (selectedScreenshotId) {
        try {
          const result = await uploadApi.upload(file);
          // For main device (index 0), use existing store method
          if (deviceIndex === 0) {
            setScreenshotImage(selectedScreenshotId, result.url);
          }
          // Store additional device images locally
          setDeviceImages(prev => ({ ...prev, [deviceIndex]: result.url }));
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    },
    [selectedScreenshotId, setScreenshotImage]
  );

  if (!selectedScreenshot) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a screenshot to edit</p>
        </div>
      </div>
    );
  }

  const { template, device, image, texts } = selectedScreenshot;
  const layout = LAYOUTS[selectedLayout] || LAYOUTS["single-center"];

  // Generate background style
  const backgroundStyle: React.CSSProperties = {};
  if (template.background.type === "solid") {
    backgroundStyle.backgroundColor = template.background.color || "#FFFFFF";
  } else if (template.background.type === "gradient" && template.background.gradient) {
    const { angle, stops } = template.background.gradient;
    const gradientStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
    backgroundStyle.background = `linear-gradient(${angle}deg, ${gradientStops})`;
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex flex-col">
      {/* Layout selector */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-gray-500 mr-2 whitespace-nowrap">Layout:</span>
          {Object.entries(LAYOUTS).map(([id, layoutDef]) => (
            <button
              key={id}
              onClick={() => setSelectedLayout(id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors",
                selectedLayout === id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {layoutDef.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-center min-h-full">
          {/* Screenshot Preview */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: "320px",
              height: "693px",
              ...backgroundStyle,
            }}
          >
            {/* Text elements */}
            {texts.map((text) => {
              const content = text.translations[currentLocale] || text.translations["en"] || "";
              return (
                <div
                  key={text.id}
                  className={cn(
                    "absolute left-0 right-0 px-4 cursor-pointer transition-all",
                    selectedTextId === text.id && "ring-2 ring-blue-500 ring-offset-2 rounded"
                  )}
                  style={{
                    top: `${text.positionY * 100}%`,
                    textAlign: text.style.alignment,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectText(text.id);
                  }}
                >
                  <span
                    style={{
                      fontSize: `${text.style.fontSize / 4}px`,
                      fontWeight: text.style.fontWeight,
                      color: text.style.color,
                      lineHeight: text.style.lineHeight,
                      textShadow: text.style.color === "#FFFFFF" ? "0 1px 2px rgba(0,0,0,0.3)" : undefined,
                    }}
                  >
                    {content}
                  </span>
                </div>
              );
            })}

            {/* Device Frames */}
            {layout.devices.map((devicePosition, index) => (
              <DeviceFrame
                key={index}
                imageUrl={index === 0 ? image?.url : deviceImages[index]}
                position={devicePosition}
                deviceColor={device.color}
                deviceStyle={device.style}
                shadow={device.shadow}
                shadowBlur={device.shadowBlur}
                shadowOpacity={device.shadowOpacity}
                onUpload={handleImageUpload}
                deviceIndex={index}
              />
            ))}

            {/* Click to deselect text */}
            <div
              className="absolute inset-0"
              onClick={() => selectText(null)}
              style={{ zIndex: -1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
