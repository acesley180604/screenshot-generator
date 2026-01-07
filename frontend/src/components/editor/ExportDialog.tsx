"use client";

import React, { useState } from "react";
import { Download, Loader2, Check, AlertCircle, Smartphone, Globe, FileImage, Sparkles } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { generateApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DEVICE_OPTIONS = [
  // iPhone - Required sizes
  { id: "iphone-6.9", name: "iPhone 16 Pro Max", size: "1320x2868", required: true, category: "iphone" },
  { id: "iphone-6.7", name: "iPhone 15 Pro Max", size: "1290x2796", required: true, category: "iphone" },
  { id: "iphone-6.5", name: "iPhone 14 Plus", size: "1284x2778", required: false, category: "iphone" },
  { id: "iphone-6.1", name: "iPhone 15", size: "1179x2556", required: false, category: "iphone" },
  { id: "iphone-5.5", name: "iPhone 8 Plus", size: "1242x2208", required: false, category: "iphone" },
  // iPad - Required sizes
  { id: "ipad-13", name: "iPad Pro 13\"", size: "2064x2752", required: true, category: "ipad" },
  { id: "ipad-12.9", name: "iPad Pro 12.9\"", size: "2048x2732", required: false, category: "ipad" },
  { id: "ipad-11", name: "iPad Pro 11\"", size: "1668x2388", required: false, category: "ipad" },
  // Apple Watch
  { id: "watch-ultra", name: "Apple Watch Ultra", size: "422x514", required: false, category: "watch" },
  { id: "watch-series-9", name: "Apple Watch Series 9", size: "410x502", required: false, category: "watch" },
  // Mac
  { id: "mac-16", name: "MacBook Pro 16\"", size: "2880x1800", required: false, category: "mac" },
  { id: "mac-14", name: "MacBook Pro 14\"", size: "2560x1600", required: false, category: "mac" },
];

const REQUIRED_DEVICES = DEVICE_OPTIONS.filter(d => d.required).map(d => d.id);

const LOCALE_OPTIONS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh-hans", name: "Chinese", flag: "🇨🇳" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export function ExportDialog() {
  const {
    showExportDialog,
    setShowExportDialog,
    project,
    exportConfig,
    updateExportConfig,
  } = useEditorStore();

  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleDevice = (deviceId: string) => {
    const newDevices = exportConfig.devices.includes(deviceId)
      ? exportConfig.devices.filter((d) => d !== deviceId)
      : [...exportConfig.devices, deviceId];
    updateExportConfig({ devices: newDevices });
  };

  const toggleLocale = (localeCode: string) => {
    const newLocales = exportConfig.locales.includes(localeCode)
      ? exportConfig.locales.filter((l) => l !== localeCode)
      : [...exportConfig.locales, localeCode];
    updateExportConfig({ locales: newLocales });
  };

  const selectAllDevices = () => {
    updateExportConfig({ devices: DEVICE_OPTIONS.map(d => d.id) });
  };

  const selectRequiredDevices = () => {
    updateExportConfig({ devices: REQUIRED_DEVICES });
  };

  const selectDeviceCategory = (category: string) => {
    const categoryDevices = DEVICE_OPTIONS.filter(d => d.category === category).map(d => d.id);
    const currentDevices = new Set(exportConfig.devices);
    const allSelected = categoryDevices.every(id => currentDevices.has(id));

    if (allSelected) {
      // Deselect all in category
      updateExportConfig({
        devices: exportConfig.devices.filter(id => !categoryDevices.includes(id))
      });
    } else {
      // Select all in category
      updateExportConfig({
        devices: [...new Set([...exportConfig.devices, ...categoryDevices])]
      });
    }
  };

  const selectAllLocales = () => {
    updateExportConfig({ locales: project.locales });
  };

  const calculateTotalImages = () => {
    return (
      exportConfig.devices.length *
      exportConfig.locales.length *
      project.screenshots.length
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const apiProject = {
        id: project.id,
        name: project.name,
        screenshots: project.screenshots.map((s) => ({
          id: s.id,
          order: s.order,
          template: {
            id: s.template.id,
            name: s.template.name,
            background: s.template.background,
            text_position: s.template.textPosition,
            device_layout: s.template.deviceLayout,
          },
          device: {
            model: s.device.model,
            color: s.device.color,
            style: s.device.style,
            scale: s.device.scale,
            position_x: s.device.positionX,
            position_y: s.device.positionY,
            shadow: s.device.shadow,
            shadow_blur: s.device.shadowBlur,
            shadow_opacity: s.device.shadowOpacity,
          },
          image: s.image ? { url: s.image.url, fit: s.image.fit } : null,
          texts: s.texts.map((t) => ({
            id: t.id,
            type: t.type,
            translations: t.translations,
            style: {
              font_family: t.style.fontFamily,
              font_size: t.style.fontSize,
              font_weight: t.style.fontWeight,
              color: t.style.color,
              alignment: t.style.alignment,
            },
            position_y: t.positionY,
          })),
        })),
        locales: project.locales,
        default_locale: project.defaultLocale,
      };

      const apiConfig = {
        devices: exportConfig.devices,
        locales: exportConfig.locales,
        format: exportConfig.format,
        quality: exportConfig.quality,
        naming_pattern: exportConfig.namingPattern,
      };

      const result = await generateApi.export(apiProject, apiConfig);

      const pollStatus = async () => {
        const status = await generateApi.getStatus(result.job_id);
        if (status.status === "completed" && status.download_url) {
          setDownloadUrl(generateApi.download(result.job_id));
          setIsExporting(false);
        } else if (status.status === "failed") {
          setError(status.error || "Export failed");
          setIsExporting(false);
        } else {
          setTimeout(pollStatus, 1000);
        }
      };

      pollStatus();
    } catch (err: any) {
      setError(err.message || "Export failed");
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
      setShowExportDialog(false);
      setDownloadUrl(null);
    }
  };

  return (
    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            Export Screenshots
          </DialogTitle>
          <DialogDescription>
            Generate App Store-ready screenshots for all devices and languages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Device Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#8e8e93]" />
                <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                  Target Devices
                </Label>
              </div>
              {/* Quick Select Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={selectRequiredDevices}
                  className="px-2 py-1 text-[10px] font-medium rounded-md bg-[#ffd60a]/10 text-[#ffd60a] hover:bg-[#ffd60a]/20 transition-colors"
                >
                  Required Only
                </button>
                <button
                  onClick={selectAllDevices}
                  className="px-2 py-1 text-[10px] font-medium rounded-md bg-[#0a84ff]/10 text-[#0a84ff] hover:bg-[#0a84ff]/20 transition-colors"
                >
                  Select All
                </button>
              </div>
            </div>

            {/* Category Quick Select */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {["iphone", "ipad", "watch", "mac"].map((category) => {
                const categoryDevices = DEVICE_OPTIONS.filter(d => d.category === category);
                const selectedCount = categoryDevices.filter(d => exportConfig.devices.includes(d.id)).length;
                const isAllSelected = selectedCount === categoryDevices.length;

                return (
                  <button
                    key={category}
                    onClick={() => selectDeviceCategory(category)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-semibold uppercase rounded-md transition-all duration-200",
                      isAllSelected
                        ? "bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/30"
                        : selectedCount > 0
                          ? "bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/30"
                          : "bg-[#3a3a3c] text-[#8e8e93] border border-transparent hover:text-[#f5f5f7]"
                    )}
                  >
                    {category} {selectedCount > 0 && `(${selectedCount})`}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto rounded-xl border border-[#3a3a3c] p-2 bg-[#2c2c2e]">
              {DEVICE_OPTIONS.map((device) => (
                <label
                  key={device.id}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                    exportConfig.devices.includes(device.id)
                      ? "bg-[#0a84ff]/10 border border-[#0a84ff]/30"
                      : "hover:bg-[#3a3a3c] border border-transparent"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={exportConfig.devices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#f5f5f7]">{device.name}</span>
                      {device.required && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[#ffd60a]/10 text-[#ffd60a] rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8e8e93]">{device.size}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8e8e93]" />
                <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                  Languages
                </Label>
              </div>
              {project.locales.length > 1 && (
                <button
                  onClick={selectAllLocales}
                  className="px-2 py-1 text-[10px] font-medium rounded-md bg-[#0a84ff]/10 text-[#0a84ff] hover:bg-[#0a84ff]/20 transition-colors"
                >
                  Select All ({project.locales.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.locales.map((localeCode) => {
                const locale = LOCALE_OPTIONS.find((l) => l.code === localeCode);
                const isSelected = exportConfig.locales.includes(localeCode);
                return (
                  <button
                    key={localeCode}
                    onClick={() => toggleLocale(localeCode)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200",
                      isSelected
                        ? "bg-[#0a84ff]/10 border-[#0a84ff]/30 text-[#0a84ff]"
                        : "border-[#3a3a3c] text-[#a1a1a6] hover:border-[#636366] hover:text-[#f5f5f7]"
                    )}
                  >
                    {locale && <span className="text-base">{locale.flag}</span>}
                    <span className="text-xs font-semibold uppercase">{localeCode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileImage className="w-4 h-4 text-[#8e8e93]" />
              <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                Format
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex p-1 bg-[#2c2c2e] rounded-lg">
                <button
                  onClick={() => updateExportConfig({ format: "png" })}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200",
                    exportConfig.format === "png"
                      ? "bg-[#3a3a3c] text-[#f5f5f7] shadow-sm"
                      : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                  )}
                >
                  PNG
                </button>
                <button
                  onClick={() => updateExportConfig({ format: "jpeg" })}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200",
                    exportConfig.format === "jpeg"
                      ? "bg-[#3a3a3c] text-[#f5f5f7] shadow-sm"
                      : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                  )}
                >
                  JPEG
                </button>
              </div>
              {exportConfig.format === "jpeg" && (
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#8e8e93]">Quality</span>
                    <span className="font-medium text-[#f5f5f7]">{exportConfig.quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={exportConfig.quality}
                    onChange={(e) => updateExportConfig({ quality: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="rounded-xl bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e] p-4 border border-[#3a3a3c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#a1a1a6]">Total images to generate</p>
                <p className="text-2xl font-bold text-[#f5f5f7]">{calculateTotalImages()}</p>
              </div>
              <div className="text-right text-[11px] text-[#8e8e93]">
                <p>{exportConfig.devices.length} devices</p>
                <p>{exportConfig.locales.length} languages</p>
                <p>{project.screenshots.length} screenshots</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-[#ff453a]/10 border border-[#ff453a]/30 text-[#ff453a] rounded-xl animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {downloadUrl && (
            <div className="flex items-center gap-3 p-4 bg-[#30d158]/10 border border-[#30d158]/30 text-[#30d158] rounded-xl animate-fadeIn">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Export complete! Ready to download.</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowExportDialog(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          {downloadUrl ? (
            <Button variant="premium" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download ZIP
            </Button>
          ) : (
            <Button
              variant="premium"
              onClick={handleExport}
              disabled={isExporting || exportConfig.devices.length === 0 || exportConfig.locales.length === 0}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Export All
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
