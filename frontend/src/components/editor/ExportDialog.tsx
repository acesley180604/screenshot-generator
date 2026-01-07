"use client";

import React, { useState } from "react";
import { Download, Loader2, Check, AlertCircle } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { generateApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEVICE_OPTIONS = [
  { id: "iphone-6.9", name: "iPhone 16 Pro Max", size: "1320x2868", required: true },
  { id: "iphone-6.5", name: "iPhone 14 Plus", size: "1284x2778", required: false },
  { id: "iphone-6.1", name: "iPhone 15", size: "1179x2556", required: false },
  { id: "iphone-5.5", name: "iPhone 8 Plus", size: "1242x2208", required: false },
  { id: "ipad-13", name: "iPad Pro 13\"", size: "2064x2752", required: true },
  { id: "ipad-12.9", name: "iPad Pro 12.9\"", size: "2048x2732", required: false },
  { id: "ipad-11", name: "iPad Pro 11\"", size: "1668x2388", required: false },
];

const LOCALE_OPTIONS = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-hans", name: "Chinese (Simplified)" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];

export function ExportDialog() {
  const {
    showExportDialog,
    setShowExportDialog,
    project,
    exportConfig,
    updateExportConfig,
    exportStatus,
    exportProgress,
    setExportJob,
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
      // Convert project to API format
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
          image: s.image ? {
            url: s.image.url,
            fit: s.image.fit,
          } : null,
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

      // Start export job
      const result = await generateApi.export(apiProject, apiConfig);

      // Poll for status
      const pollStatus = async () => {
        const status = await generateApi.getStatus(result.job_id);

        if (status.status === "completed" && status.download_url) {
          setDownloadUrl(generateApi.download(result.job_id));
          setIsExporting(false);
        } else if (status.status === "failed") {
          setError(status.error || "Export failed");
          setIsExporting(false);
        } else {
          // Continue polling
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Screenshots</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Device Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Target Devices
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
              {DEVICE_OPTIONS.map((device) => (
                <label
                  key={device.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                    exportConfig.devices.includes(device.id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={exportConfig.devices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {device.name}
                      {device.required && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{device.size}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Locale Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Languages
            </Label>
            <div className="flex flex-wrap gap-2">
              {project.locales.map((localeCode) => {
                const locale = LOCALE_OPTIONS.find((l) => l.code === localeCode);
                return (
                  <label
                    key={localeCode}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors",
                      exportConfig.locales.includes(localeCode)
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.locales.includes(localeCode)}
                      onChange={() => toggleLocale(localeCode)}
                      className="hidden"
                    />
                    <span className="uppercase text-xs font-bold">
                      {localeCode}
                    </span>
                    {locale && (
                      <span className="text-xs">{locale.name}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Format */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Format</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value: "png" | "jpeg") =>
                  updateExportConfig({ format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (Recommended)</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {exportConfig.format === "jpeg" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Quality: {exportConfig.quality}%
                </Label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={exportConfig.quality}
                  onChange={(e) =>
                    updateExportConfig({ quality: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">
              Total images to generate:{" "}
              <span className="font-bold text-gray-900">
                {calculateTotalImages()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {exportConfig.devices.length} devices x{" "}
              {exportConfig.locales.length} languages x{" "}
              {project.screenshots.length} screenshots
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success message */}
          {downloadUrl && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <Check className="w-4 h-4" />
              <span className="text-sm">Export complete! Ready to download.</span>
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
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download ZIP
            </Button>
          ) : (
            <Button
              onClick={handleExport}
              disabled={
                isExporting ||
                exportConfig.devices.length === 0 ||
                exportConfig.locales.length === 0
              }
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export & Download
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
