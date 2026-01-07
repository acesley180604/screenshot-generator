"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Smartphone, Plus, ImageIcon, Layers, Move } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { uploadApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LayoutDevicePosition } from "@/types";

// Font family mapping for CSS variables
const FONT_FAMILY_MAP: Record<string, string> = {
  "Inter": "var(--font-inter), system-ui, sans-serif",
  "Poppins": "var(--font-poppins), system-ui, sans-serif",
  "Plus Jakarta Sans": "var(--font-plus-jakarta), system-ui, sans-serif",
  "DM Sans": "var(--font-dm-sans), system-ui, sans-serif",
  "Space Grotesk": "var(--font-space-grotesk), system-ui, sans-serif",
  "Outfit": "var(--font-outfit), system-ui, sans-serif",
  "Manrope": "var(--font-manrope), system-ui, sans-serif",
  "Montserrat": "var(--font-montserrat), system-ui, sans-serif",
  "Raleway": "var(--font-raleway), system-ui, sans-serif",
  "Work Sans": "var(--font-work-sans), system-ui, sans-serif",
  "SF Pro Display": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
};

// Helper to get font family CSS value
function getFontFamily(fontFamily: string): string {
  return FONT_FAMILY_MAP[fontFamily] || FONT_FAMILY_MAP["Inter"];
}

// Available layouts for the canvas
const LAYOUTS: Record<string, { devices: LayoutDevicePosition[], name: string, icon: string }> = {
  "custom": {
    name: "Custom",
    icon: "✦",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "single-center": {
    name: "Center",
    icon: "◯",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "single-left": {
    name: "Left",
    icon: "◐",
    devices: [{ position: { x: 0.32, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "single-right": {
    name: "Right",
    icon: "◑",
    devices: [{ position: { x: 0.68, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "angled-right": {
    name: "Tilt Right",
    icon: "◢",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: 8, zIndex: 1, perspective: true }]
  },
  "angled-left": {
    name: "Tilt Left",
    icon: "◣",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: -8, zIndex: 1, perspective: true }]
  },
  "floating-3d": {
    name: "Float",
    icon: "◈",
    devices: [{ position: { x: 0.5, y: 0.52 }, scale: 0.75, rotation: 5, zIndex: 1, perspective: true, floatingShadow: true }]
  },
  "duo-overlap": {
    name: "Overlap",
    icon: "◫",
    devices: [
      { position: { x: 0.38, y: 0.58 }, scale: 0.7, rotation: -5, zIndex: 1 },
      { position: { x: 0.62, y: 0.52 }, scale: 0.7, rotation: 5, zIndex: 2 }
    ]
  },
  "duo-side-by-side": {
    name: "Side by Side",
    icon: "▣",
    devices: [
      { position: { x: 0.3, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 },
      { position: { x: 0.7, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 }
    ]
  },
  "duo-stacked": {
    name: "Stacked",
    icon: "◰",
    devices: [
      { position: { x: 0.45, y: 0.6 }, scale: 0.65, rotation: -3, zIndex: 1, opacity: 0.7 },
      { position: { x: 0.55, y: 0.5 }, scale: 0.7, rotation: 3, zIndex: 2 }
    ]
  },
  "trio-cascade": {
    name: "Cascade",
    icon: "⧈",
    devices: [
      { position: { x: 0.25, y: 0.62 }, scale: 0.5, rotation: -8, zIndex: 1 },
      { position: { x: 0.5, y: 0.5 }, scale: 0.55, rotation: 0, zIndex: 2 },
      { position: { x: 0.75, y: 0.62 }, scale: 0.5, rotation: 8, zIndex: 1 }
    ]
  },
  "trio-fan": {
    name: "Fan",
    icon: "⬡",
    devices: [
      { position: { x: 0.3, y: 0.58 }, scale: 0.45, rotation: -15, zIndex: 1 },
      { position: { x: 0.5, y: 0.52 }, scale: 0.5, rotation: 0, zIndex: 2 },
      { position: { x: 0.7, y: 0.58 }, scale: 0.45, rotation: 15, zIndex: 1 }
    ]
  },
  "bottom-peek": {
    name: "Peek Up",
    icon: "▽",
    devices: [{ position: { x: 0.5, y: 0.85 }, scale: 0.9, rotation: 0, zIndex: 1 }]
  },
  "top-peek": {
    name: "Peek Down",
    icon: "△",
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
  onPositionChange?: (x: number, y: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
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
  isSelected,
  onPositionChange,
  canvasRef
}: DeviceFrameProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

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
    noClick: isDragging,
    noDrag: true, // Disable dropzone drag, we handle our own
  });

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onPositionChange || !canvasRef?.current) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.position.x,
      posY: position.position.y,
    };
    setIsDragging(true);
  };

  // Handle drag move
  useEffect(() => {
    if (!isDragging || !onPositionChange || !canvasRef?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !canvasRef?.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
      const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

      const newX = Math.max(0, Math.min(1, dragStartRef.current.posX + deltaX));
      const newY = Math.max(0, Math.min(1, dragStartRef.current.posY + deltaY));

      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onPositionChange, canvasRef]);

  // Calculate transform (scale is now applied to dimensions, not CSS)
  const transform = [
    "translate(-50%, -50%)",
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

  // Canvas dimensions (matching the preview container)
  const canvasWidth = 340;

  // Device dimensions - scale is relative to canvas width
  // Base device aspect ratio ~1:2.17 (iPhone proportions)
  const baseDeviceWidth = position.noFrame ? canvasWidth * 0.95 : canvasWidth;
  const deviceWidth = baseDeviceWidth * position.scale;
  const deviceHeight = deviceWidth * 2.17;

  return (
    <div
      className={cn(
        "absolute transition-all ease-out",
        isDragging ? "duration-0 cursor-grabbing" : "duration-500"
      )}
      style={{
        left: `${position.position.x * 100}%`,
        top: `${position.position.y * 100}%`,
        transform: transform.join(" "),
        zIndex: isDragging ? 100 : position.zIndex,
        opacity: position.opacity ?? 1,
      }}
    >
      {imageUrl ? (
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300 group",
            position.noFrame ? "" : "rounded-[28px]",
            isSelected && "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-[#0a0a0a]",
            onPositionChange && "cursor-grab",
            isDragging && "cursor-grabbing"
          )}
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
            borderRadius: position.roundedCorners ? `${position.roundedCorners}px` : undefined,
            backgroundColor: position.noFrame ? "transparent" : bezelColor,
            boxShadow: shadow && !position.noFrame
              ? position.floatingShadow
                ? `0 50px 100px -20px rgba(0,0,0,${shadowOpacity * 0.8}), 0 30px 60px -30px rgba(0,0,0,${shadowOpacity})`
                : `0 ${shadowBlur / 3}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity * 0.6})`
              : "none",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Drag indicator */}
          {onPositionChange && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1c1c1e]/90 border border-[#3a3a3c] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] text-[#8e8e93] z-50 pointer-events-none">
              <Move className="w-3 h-3" />
              <span>Drag to move</span>
            </div>
          )}
          {/* Device bezel (if not full bleed) */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div
              className="absolute inset-0 rounded-[28px] pointer-events-none z-10"
              style={{
                border: deviceStyle === "clay" ? `6px solid ${bezelColor}` : `4px solid ${bezelColor}`,
                opacity: deviceStyle === "clay" ? 0.9 : 1,
              }}
            />
          )}

          {/* Screen content */}
          <div
            className={cn(
              "absolute overflow-hidden bg-black",
              position.noFrame ? "inset-0" : "inset-[6px] rounded-[22px]"
            )}
            style={{
              borderRadius: position.roundedCorners ? `${position.roundedCorners - 6}px` : undefined,
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20 shadow-inner" />
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-300 group",
            isDragActive
              ? "bg-[#0a84ff]/20 border-2 border-[#0a84ff] scale-[1.02]"
              : "bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] border-2 border-dashed border-[#3a3a3c] hover:border-[#0a84ff] hover:bg-[#0a84ff]/10"
          )}
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
          }}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8e8e93]">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300",
              isDragActive
                ? "bg-[#0a84ff] text-white scale-110"
                : "bg-[#2c2c2e] shadow-lg group-hover:shadow-xl group-hover:scale-105"
            )}>
              {isDragActive ? (
                <ImageIcon className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6 text-[#8e8e93] group-hover:text-[#0a84ff]" />
              )}
            </div>
            <p className="text-xs font-medium text-center px-4">
              {isDragActive ? "Drop to upload" : `Add Screenshot ${deviceIndex + 1}`}
            </p>
            <p className="text-[10px] text-[#636366] mt-1">
              PNG, JPG, WebP
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Draggable text component
interface DraggableTextProps {
  text: {
    id: string;
    positionY: number;
    style: {
      fontSize: number;
      fontWeight: number;
      color: string;
      lineHeight: number;
      alignment: string;
    };
  };
  content: string;
  index: number;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onPositionChange: (newY: number) => void;
}

function DraggableText({
  text,
  content,
  index,
  isSelected,
  canvasRef,
  onSelect,
  onPositionChange,
}: DraggableTextProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ y: number; posY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef?.current) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    dragStartRef.current = {
      y: e.clientY,
      posY: text.positionY,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !canvasRef?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !canvasRef?.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;
      const newY = Math.max(0.02, Math.min(0.95, dragStartRef.current.posY + deltaY));

      onPositionChange(newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onPositionChange, canvasRef]);

  return (
    <div
      className={cn(
        "absolute left-0 right-0 px-5 transition-all group",
        isDragging ? "duration-0 cursor-grabbing z-50" : "duration-200 cursor-grab",
        isSelected && "ring-2 ring-[#0a84ff] ring-offset-4 ring-offset-transparent rounded-lg bg-white/5"
      )}
      style={{
        top: `${text.positionY * 100}%`,
        textAlign: text.style.alignment as any,
        animationDelay: `${index * 100}ms`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag indicator */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
        </div>
      </div>

      <span
        className="animate-fadeInUp inline-block select-none"
        style={{
          fontFamily: getFontFamily(text.style.fontFamily),
          fontSize: `${text.style.fontSize / 3.5}px`,
          fontWeight: text.style.fontWeight,
          color: text.style.color,
          lineHeight: text.style.lineHeight,
          textShadow: text.style.color === "#FFFFFF"
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : undefined,
          letterSpacing: "-0.02em",
        }}
      >
        {content}
      </span>
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
    updateDevice,
    updateText,
  } = useEditorStore();

  const [selectedLayout, setSelectedLayout] = useState<string>("custom");
  const [deviceImages, setDeviceImages] = useState<Record<number, string>>({});
  const [customDevicePosition, setCustomDevicePosition] = useState({ x: 0.5, y: 0.55 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  // Sync custom position with device config
  useEffect(() => {
    if (selectedScreenshot) {
      setCustomDevicePosition({
        x: selectedScreenshot.device.positionX,
        y: selectedScreenshot.device.positionY,
      });
    }
  }, [selectedScreenshot?.id]);

  // Handle device position change
  const handleDevicePositionChange = useCallback(
    (x: number, y: number) => {
      if (selectedScreenshotId) {
        setCustomDevicePosition({ x, y });
        updateDevice(selectedScreenshotId, { positionX: x, positionY: y });
        // Switch to custom layout when dragging
        if (selectedLayout !== "custom") {
          setSelectedLayout("custom");
        }
      }
    },
    [selectedScreenshotId, updateDevice, selectedLayout]
  );

  // Handle text position change
  const handleTextPositionChange = useCallback(
    (textId: string, newY: number) => {
      if (selectedScreenshotId) {
        updateText(selectedScreenshotId, textId, { positionY: newY });
      }
    },
    [selectedScreenshotId, updateText]
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1c1c1e]">
        <div className="text-center animate-fadeIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#2c2c2e] shadow-lg flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-[#3a3a3c]" />
          </div>
          <p className="text-[#a1a1a6] font-medium">Select a screenshot to edit</p>
          <p className="text-[#636366] text-sm mt-1">Choose from the sidebar</p>
        </div>
      </div>
    );
  }

  const { template, device, image, texts } = selectedScreenshot;
  const layout = LAYOUTS[selectedLayout] || LAYOUTS["single-center"];

  // Generate background style
  const backgroundStyle: React.CSSProperties = {};
  const bg = template.background;

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
    // Approximate mesh gradient with multiple radial gradients
    const meshGradients = bg.color_points.map((point) => {
      const x = point.x * 100;
      const y = point.y * 100;
      const size = point.radius * 100;
      return `radial-gradient(circle at ${x}% ${y}%, ${point.color} 0%, transparent ${size}%)`;
    });
    backgroundStyle.background = meshGradients.join(", ");
    // Add a base color from the first point
    backgroundStyle.backgroundColor = bg.color_points[0]?.color || "#1c1c1e";
  } else if (bg.type === "glassmorphism") {
    // Create glassmorphism effect with base gradient + blob overlays
    const gradients: string[] = [];

    // Add blobs as radial gradients
    if (bg.blobs) {
      bg.blobs.forEach((blob) => {
        const x = blob.x * 100;
        const y = blob.y * 100;
        const size = blob.size * 100;
        gradients.push(`radial-gradient(circle at ${x}% ${y}%, ${blob.color} 0%, transparent ${size}%)`);
      });
    }

    // Add base gradient
    if (bg.base_gradient && bg.base_gradient.stops) {
      const baseStops = bg.base_gradient.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
      gradients.push(`linear-gradient(${bg.base_gradient.angle || 135}deg, ${baseStops})`);
    }

    backgroundStyle.background = gradients.join(", ");
  } else if (bg.type === "blobs") {
    // Abstract blobs on a base color
    const gradients: string[] = [];

    if (bg.blobs) {
      bg.blobs.forEach((blob) => {
        const x = blob.x * 100;
        const y = blob.y * 100;
        const size = blob.size * 80; // Slightly larger for blur effect
        gradients.push(`radial-gradient(circle at ${x}% ${y}%, ${blob.color} 0%, transparent ${size}%)`);
      });
    }

    backgroundStyle.background = gradients.join(", ");
    backgroundStyle.backgroundColor = bg.base_color || "#0D0D1A";
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-[#0a0a0a] to-[#141414] overflow-auto flex flex-col">
      {/* Layout selector - Premium pill design */}
      <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-[#2c2c2e] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#8e8e93]">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Layout</span>
          </div>
          <div className="h-4 w-px bg-[#3a3a3c]" />
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {Object.entries(LAYOUTS).map(([id, layoutDef]) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedLayout(id);
                  // When selecting a preset, update the device position
                  if (id !== "custom" && selectedScreenshotId && layoutDef.devices[0]) {
                    const presetPos = layoutDef.devices[0].position;
                    setCustomDevicePosition(presetPos);
                    updateDevice(selectedScreenshotId, {
                      positionX: presetPos.x,
                      positionY: presetPos.y,
                    });
                  }
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200",
                  selectedLayout === id
                    ? "bg-[#0a84ff] text-white shadow-sm"
                    : "bg-[#2c2c2e] text-[#a1a1a6] hover:bg-[#3a3a3c] hover:text-[#f5f5f7]"
                )}
              >
                {layoutDef.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex items-center justify-center min-h-full">
          {/* Screenshot Preview - with premium shadow and frame */}
          <div className="relative">
            {/* Ambient shadow */}
            <div
              className="absolute inset-0 rounded-[32px] blur-3xl opacity-20 scale-95"
              style={backgroundStyle}
            />

            {/* Main preview */}
            <div
              ref={canvasRef}
              className="relative bg-[#1c1c1e] rounded-[28px] overflow-hidden animate-fadeInScale"
              style={{
                width: "340px",
                height: "736px",
                boxShadow: "0 25px 80px -20px rgba(0,0,0,0.5), 0 10px 30px -10px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)",
                ...backgroundStyle,
              }}
            >
              {/* Text elements - now draggable */}
              {texts.map((text, index) => {
                const content = text.translations[currentLocale] || text.translations["en"] || "";
                return (
                  <DraggableText
                    key={text.id}
                    text={text}
                    content={content}
                    index={index}
                    isSelected={selectedTextId === text.id}
                    canvasRef={canvasRef}
                    onSelect={() => selectText(text.id)}
                    onPositionChange={(newY) => handleTextPositionChange(text.id, newY)}
                  />
                );
              })}

              {/* Device Frames - use custom position or layout position */}
              {layout.devices.map((devicePosition, index) => {
                // For custom layout or first device, use the stored position
                const position = selectedLayout === "custom" && index === 0
                  ? { ...devicePosition, position: customDevicePosition }
                  : devicePosition;

                return (
                  <DeviceFrame
                    key={index}
                    imageUrl={index === 0 ? image?.url : deviceImages[index]}
                    position={position}
                    deviceColor={device.color}
                    deviceStyle={device.style}
                    shadow={device.shadow}
                    shadowBlur={device.shadowBlur}
                    shadowOpacity={device.shadowOpacity}
                    onUpload={handleImageUpload}
                    deviceIndex={index}
                    onPositionChange={index === 0 ? handleDevicePositionChange : undefined}
                    canvasRef={canvasRef}
                  />
                );
              })}

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
    </div>
  );
}
