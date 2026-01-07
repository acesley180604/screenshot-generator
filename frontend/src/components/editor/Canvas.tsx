"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Smartphone } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { uploadApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Canvas() {
  const {
    project,
    selectedScreenshotId,
    currentLocale,
    setScreenshotImage,
    selectText,
    selectedTextId,
  } = useEditorStore();

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && selectedScreenshotId) {
        try {
          const result = await uploadApi.upload(acceptedFiles[0]);
          setScreenshotImage(selectedScreenshotId, result.url);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    },
    [selectedScreenshotId, setScreenshotImage]
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
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      <div className="flex items-center justify-center min-h-full">
        {/* Screenshot Preview */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "320px",
            height: "693px", // iPhone 15 Pro Max aspect ratio (9:19.5)
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
                  selectedTextId === text.id && "ring-2 ring-blue-500 ring-offset-2"
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
                    fontSize: `${text.style.fontSize / 4}px`, // Scale down for preview
                    fontWeight: text.style.fontWeight,
                    color: text.style.color,
                    lineHeight: text.style.lineHeight,
                  }}
                >
                  {content}
                </span>
              </div>
            );
          })}

          {/* Device Frame with Screenshot */}
          <div
            className="absolute"
            style={{
              left: `${device.positionX * 100}%`,
              top: `${device.positionY * 100}%`,
              transform: `translate(-50%, -50%) scale(${device.scale})`,
            }}
          >
            {image?.url ? (
              <div
                className="relative rounded-3xl overflow-hidden bg-black"
                style={{
                  width: "200px",
                  height: "433px",
                  boxShadow: device.shadow
                    ? `0 ${device.shadowBlur / 4}px ${device.shadowBlur / 2}px rgba(0,0,0,${device.shadowOpacity})`
                    : "none",
                }}
              >
                {/* Device bezel */}
                <div className="absolute inset-0 border-4 border-gray-800 rounded-3xl pointer-events-none z-10" />
                {/* Screen content */}
                <div className="absolute inset-2 rounded-2xl overflow-hidden bg-white">
                  <img
                    src={image.url}
                    alt="Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  "relative rounded-3xl overflow-hidden bg-gray-200 border-2 border-dashed cursor-pointer transition-colors",
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                )}
                style={{
                  width: "200px",
                  height: "433px",
                }}
              >
                <input {...getInputProps()} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-xs text-center px-2">
                    {isDragActive ? "Drop image here" : "Drop or click to upload screenshot"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Click to deselect text */}
          <div
            className="absolute inset-0"
            onClick={() => selectText(null)}
            style={{ zIndex: -1 }}
          />
        </div>
      </div>
    </div>
  );
}
