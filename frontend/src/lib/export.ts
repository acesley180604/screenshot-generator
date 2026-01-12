"use client";

import html2canvas from "html2canvas";
import JSZip from "jszip";
import type { ScreenshotConfig, Project } from "@/types";

// Device sizes for App Store export
export const DEVICE_SIZES: Record<string, { width: number; height: number }> = {
  "iphone-6.9": { width: 1320, height: 2868 },
  "iphone-6.7": { width: 1290, height: 2796 },
  "iphone-6.5": { width: 1284, height: 2778 },
  "iphone-6.1": { width: 1179, height: 2556 },
  "iphone-5.5": { width: 1242, height: 2208 },
  "ipad-13": { width: 2064, height: 2752 },
  "ipad-12.9": { width: 2048, height: 2732 },
  "ipad-11": { width: 1668, height: 2388 },
  "watch-ultra": { width: 422, height: 514 },
  "watch-series-9": { width: 410, height: 502 },
  "mac-16": { width: 2880, height: 1800 },
  "mac-14": { width: 2560, height: 1600 },
};

export interface ExportConfig {
  devices: string[];
  locales: string[];
  format: "png" | "jpeg";
  quality: number;
  namingPattern: string;
}

export interface ExportProgress {
  current: number;
  total: number;
  status: string;
}

/**
 * Capture a screenshot element as an image using html2canvas
 */
export async function captureScreenshot(
  element: HTMLElement,
  width: number,
  height: number,
  format: "png" | "jpeg" = "png",
  quality: number = 95
): Promise<Blob> {
  // Store original dimensions
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalTransform = element.style.transform;

  // Set to target export size
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.transform = "none";

  // Wait for styles to apply
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(element, {
      width,
      height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        format === "jpeg" ? "image/jpeg" : "image/png",
        quality / 100
      );
    });
  } finally {
    // Restore original dimensions
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.transform = originalTransform;
  }
}

/**
 * Export all screenshots as a ZIP file (client-side)
 */
export async function exportScreenshotsClientSide(
  screenshotElements: Map<string, HTMLElement>,
  project: Project,
  config: ExportConfig,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  const zip = new JSZip();
  const total = config.devices.length * config.locales.length * project.screenshots.length;
  let current = 0;

  for (const locale of config.locales) {
    for (const deviceId of config.devices) {
      const deviceSize = DEVICE_SIZES[deviceId];
      if (!deviceSize) continue;

      for (let idx = 0; idx < project.screenshots.length; idx++) {
        const screenshot = project.screenshots[idx];
        const element = screenshotElements.get(screenshot.id);

        if (!element) {
          console.warn(`Element not found for screenshot ${screenshot.id}`);
          continue;
        }

        current++;
        onProgress?.({
          current,
          total,
          status: `Exporting ${locale}/${deviceId}/${idx + 1}...`,
        });

        try {
          const blob = await captureScreenshot(
            element,
            deviceSize.width,
            deviceSize.height,
            config.format,
            config.quality
          );

          // Generate filename
          const filename = config.namingPattern
            .replace("{locale}", locale)
            .replace("{device}", deviceId)
            .replace("{index}", String(idx + 1));

          zip.file(`${filename}.${config.format}`, blob);
        } catch (error) {
          console.error(`Failed to capture screenshot ${screenshot.id}:`, error);
        }
      }
    }
  }

  onProgress?.({
    current: total,
    total,
    status: "Creating ZIP file...",
  });

  return zip.generateAsync({ type: "blob" });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
