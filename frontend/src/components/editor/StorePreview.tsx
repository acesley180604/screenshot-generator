"use client";

import React, { useState } from "react";
import { X, Smartphone, Monitor, Star, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mini screenshot renderer for preview
function MiniScreenshot({ screenshot, locale }: { screenshot: any; locale: string }) {
  const bg = screenshot.template.background;
  let backgroundStyle: React.CSSProperties = {};

  if (bg.type === "solid") {
    backgroundStyle.backgroundColor = bg.color || "#1c1c1e";
  } else if (bg.type === "gradient" && bg.gradient) {
    const { type, angle, stops } = bg.gradient;
    const gradientStops = stops.map((s: any) => `${s.color} ${s.position * 100}%`).join(", ");
    if (type === "radial") {
      backgroundStyle.background = `radial-gradient(circle, ${gradientStops})`;
    } else {
      backgroundStyle.background = `linear-gradient(${angle}deg, ${gradientStops})`;
    }
  } else if (bg.type === "mesh" && bg.color_points) {
    const meshGradients = bg.color_points.map((point: any) => {
      const x = point.x * 100;
      const y = point.y * 100;
      const size = point.radius * 100;
      return `radial-gradient(circle at ${x}% ${y}%, ${point.color} 0%, transparent ${size}%)`;
    });
    backgroundStyle.background = meshGradients.join(", ");
    backgroundStyle.backgroundColor = bg.color_points[0]?.color || "#1c1c1e";
  }

  const headline = screenshot.texts.find((t: any) => t.type === "headline");
  const headlineText = headline?.translations[locale] || headline?.translations["en"] || "";

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg" style={backgroundStyle}>
      {/* Text */}
      {headlineText && (
        <div
          className="absolute left-2 right-2 text-center"
          style={{ top: `${(headline?.positionY || 0.08) * 100}%` }}
        >
          <span
            className="text-[8px] font-semibold leading-tight"
            style={{ color: headline?.style?.color || "#fff" }}
          >
            {headlineText.length > 25 ? headlineText.substring(0, 25) + "..." : headlineText}
          </span>
        </div>
      )}

      {/* Device */}
      <div
        className="absolute"
        style={{
          left: `${screenshot.device.positionX * 100}%`,
          top: `${screenshot.device.positionY * 100}%`,
          transform: `translate(-50%, -50%) scale(${screenshot.device.scale})`,
          width: "45%",
          aspectRatio: "1242/2688", // App Store screenshot ratio
        }}
      >
        <div
          className="w-full h-full rounded-[16.5%] overflow-hidden"
          style={{
            backgroundColor: screenshot.device.style === "none" ? "transparent" : "#1c1c1e",
            border: screenshot.device.style === "none" ? "none" : "1px solid #3a3a3c",
          }}
        >
          {screenshot.image?.url ? (
            <img
              src={screenshot.image.url}
              alt=""
              className="w-full h-full object-cover"
              style={{
                borderRadius: screenshot.device.style === "none" ? "0" : "14.7%",
                margin: screenshot.device.style === "none" ? "0" : "1.8%",
                width: screenshot.device.style === "none" ? "100%" : "96.4%",
                height: screenshot.device.style === "none" ? "100%" : "96.4%",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#2c2c2e]">
              <Smartphone className="w-3 h-3 text-[#636366]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StorePreview() {
  const { project, currentLocale, showStorePreview, setShowStorePreview } = useEditorStore();
  const [previewType, setPreviewType] = useState<"ios" | "android">("ios");
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!showStorePreview) return null;

  const screenshots = project.screenshots;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1c1c1e] rounded-2xl w-[95vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c2e]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#f5f5f7]">Store Preview</h2>
            <div className="flex items-center gap-1 bg-[#2c2c2e] rounded-lg p-1">
              <button
                onClick={() => setPreviewType("ios")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  previewType === "ios"
                    ? "bg-[#0a84ff] text-white"
                    : "text-[#8e8e93] hover:text-white"
                )}
              >
                App Store
              </button>
              <button
                onClick={() => setPreviewType("android")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  previewType === "android"
                    ? "bg-[#0a84ff] text-white"
                    : "text-[#8e8e93] hover:text-white"
                )}
              >
                Google Play
              </button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowStorePreview(false)}
            className="text-[#8e8e93] hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          {previewType === "ios" ? (
            <IOSStorePreview
              screenshots={screenshots}
              locale={currentLocale}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              projectName={project.name}
            />
          ) : (
            <AndroidStorePreview
              screenshots={screenshots}
              locale={currentLocale}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              projectName={project.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function IOSStorePreview({
  screenshots,
  locale,
  currentIndex,
  setCurrentIndex,
  projectName,
}: {
  screenshots: any[];
  locale: string;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  projectName: string;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* App Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-24 h-24 rounded-[22%] bg-gradient-to-br from-[#0a84ff] to-[#5856d6] flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-12 h-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">{projectName || "Your App Name"}</h1>
          <p className="text-[#8e8e93] text-sm mb-2">Your Company Name</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= 4 ? "text-[#ff9500] fill-[#ff9500]" : "text-[#636366]"
                    )}
                  />
                ))}
              </div>
              <span className="text-[#8e8e93] text-xs ml-1">4.8 (12.5K)</span>
            </div>
            <span className="text-[#8e8e93] text-xs">Free</span>
          </div>
        </div>
        <Button className="bg-[#0a84ff] hover:bg-[#0a84ff]/90 rounded-full px-6">
          GET
        </Button>
      </div>

      {/* Screenshots Carousel */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.id}
              className={cn(
                "flex-shrink-0 w-44 aspect-[9/19.5] rounded-xl overflow-hidden snap-center cursor-pointer transition-all",
                index === currentIndex
                  ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-[#1c1c1e]"
                  : "opacity-80 hover:opacity-100"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <MiniScreenshot screenshot={screenshot} locale={locale} />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {screenshots.length > 4 && (
          <>
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-white hover:bg-[#3a3a3c] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(screenshots.length - 1, currentIndex + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-white hover:bg-[#3a3a3c] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-[#2c2c2e]">
        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
        <p className="text-[#8e8e93] text-sm leading-relaxed">
          Your app description will appear here. Write compelling copy that explains what your app
          does and why users should download it. This preview shows how your screenshots will look
          in the App Store.
        </p>
      </div>

      {/* What's New */}
      <div className="mt-6 pt-6 border-t border-[#2c2c2e]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">What's New</h3>
          <span className="text-[#8e8e93] text-xs">Version 1.0.0</span>
        </div>
        <p className="text-[#8e8e93] text-sm">Bug fixes and performance improvements.</p>
      </div>
    </div>
  );
}

function AndroidStorePreview({
  screenshots,
  locale,
  currentIndex,
  setCurrentIndex,
  projectName,
}: {
  screenshots: any[];
  locale: string;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  projectName: string;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* App Header - Google Play Style */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#34a853] to-[#1e8e3e] flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-medium text-white mb-1">{projectName || "Your App Name"}</h1>
          <p className="text-[#01875f] text-sm mb-2">Your Company Name</p>
          <div className="flex items-center gap-4 text-xs text-[#8e8e93]">
            <span>Contains ads</span>
            <span>•</span>
            <span>In-app purchases</span>
          </div>
        </div>
      </div>

      {/* Install Button */}
      <Button className="w-full bg-[#01875f] hover:bg-[#01875f]/90 rounded-lg py-3 mb-6">
        Install
      </Button>

      {/* Stats Row */}
      <div className="flex items-center justify-around mb-6 py-4 border-y border-[#2c2c2e]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-white font-medium">
            4.8 <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="text-[#8e8e93] text-xs mt-1">12.5K reviews</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">
            <Download className="w-5 h-5 inline" />
          </div>
          <div className="text-[#8e8e93] text-xs mt-1">10M+ downloads</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">E</div>
          <div className="text-[#8e8e93] text-xs mt-1">Everyone</div>
        </div>
      </div>

      {/* Screenshots - Google Play Style (horizontal scroll) */}
      <div className="relative mb-6">
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.id}
              className={cn(
                "flex-shrink-0 w-40 aspect-[9/19.5] rounded-lg overflow-hidden snap-center cursor-pointer transition-all",
                index === currentIndex
                  ? "ring-2 ring-[#01875f] ring-offset-2 ring-offset-[#1c1c1e]"
                  : "opacity-80 hover:opacity-100"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <MiniScreenshot screenshot={screenshot} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-white mb-2">About this app</h3>
        <p className="text-[#8e8e93] text-sm leading-relaxed">
          Your app description will appear here. Write compelling copy that explains what your app
          does and why users should download it. This preview shows how your screenshots will look
          on Google Play Store.
        </p>
      </div>

      {/* Data Safety */}
      <div className="p-4 bg-[#2c2c2e] rounded-xl">
        <h3 className="text-sm font-medium text-white mb-2">Data safety</h3>
        <p className="text-[#8e8e93] text-xs">
          Safety starts with understanding how developers collect and share your data.
        </p>
      </div>
    </div>
  );
}

export default StorePreview;
