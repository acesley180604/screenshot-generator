"use client";

import React from "react";
import { Palette, Type, Smartphone, Plus, Trash2 } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEVICE_MODELS = [
  { id: "iphone-6.9", name: "iPhone 16 Pro Max (6.9\")" },
  { id: "iphone-6.5", name: "iPhone 14 Plus (6.5\")" },
  { id: "iphone-6.1", name: "iPhone 15 (6.1\")" },
  { id: "ipad-13", name: "iPad Pro 13\"" },
  { id: "ipad-12.9", name: "iPad Pro 12.9\"" },
];

const DEVICE_COLORS = [
  { id: "natural-titanium", name: "Natural Titanium", hex: "#8A8A8F" },
  { id: "blue-titanium", name: "Blue Titanium", hex: "#3C4C5C" },
  { id: "white-titanium", name: "White Titanium", hex: "#F5F5F0" },
  { id: "black-titanium", name: "Black Titanium", hex: "#2E2E30" },
  { id: "space-black", name: "Space Black", hex: "#1F1F1F" },
];

const DEVICE_STYLES = [
  { id: "realistic", name: "Realistic" },
  { id: "clay", name: "Clay" },
  { id: "flat", name: "Flat" },
  { id: "none", name: "No Frame" },
];

const PRESET_GRADIENTS = [
  { name: "Ocean Blue", stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] },
  { name: "Sunset", stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 1 }] },
  { name: "Purple Dream", stops: [{ color: "#8E2DE2", position: 0 }, { color: "#4A00E0", position: 1 }] },
  { name: "Fresh Green", stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] },
  { name: "Pink Blush", stops: [{ color: "#FF758C", position: 0 }, { color: "#FF7EB3", position: 1 }] },
];

export function PropertiesPanel() {
  const {
    project,
    selectedScreenshotId,
    selectedTextId,
    currentLocale,
    updateBackground,
    updateDevice,
    updateTextTranslation,
    updateTextStyle,
    addText,
    removeText,
  } = useEditorStore();

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  const selectedText = selectedScreenshot?.texts.find(
    (t) => t.id === selectedTextId
  );

  if (!selectedScreenshot) {
    return (
      <div className="w-72 border-l border-gray-200 bg-white p-4">
        <p className="text-gray-500 text-sm">Select a screenshot to edit properties</p>
      </div>
    );
  }

  return (
    <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto">
      {/* Background Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium">Background</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={selectedScreenshot.template.background.type}
              onValueChange={(value: any) =>
                updateBackground(selectedScreenshot.id, {
                  ...selectedScreenshot.template.background,
                  type: value,
                })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedScreenshot.template.background.type === "solid" && (
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedScreenshot.template.background.color || "#FFFFFF"}
                  onChange={(e) =>
                    updateBackground(selectedScreenshot.id, {
                      ...selectedScreenshot.template.background,
                      color: e.target.value,
                    })
                  }
                  className="w-10 h-8 rounded border cursor-pointer"
                />
                <Input
                  value={selectedScreenshot.template.background.color || "#FFFFFF"}
                  onChange={(e) =>
                    updateBackground(selectedScreenshot.id, {
                      ...selectedScreenshot.template.background,
                      color: e.target.value,
                    })
                  }
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
          )}

          {selectedScreenshot.template.background.type === "gradient" && (
            <div>
              <Label className="text-xs">Preset Gradients</Label>
              <div className="grid grid-cols-5 gap-1 mt-1">
                {PRESET_GRADIENTS.map((gradient, index) => (
                  <button
                    key={index}
                    className="w-full aspect-square rounded-md border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    style={{
                      background: `linear-gradient(180deg, ${gradient.stops[0].color}, ${gradient.stops[1].color})`,
                    }}
                    onClick={() =>
                      updateBackground(selectedScreenshot.id, {
                        type: "gradient",
                        gradient: {
                          type: "linear",
                          angle: 180,
                          stops: gradient.stops,
                        },
                      })
                    }
                    title={gradient.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium">Device</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Model</Label>
            <Select
              value={selectedScreenshot.device.model}
              onValueChange={(value) =>
                updateDevice(selectedScreenshot.id, { model: value })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_MODELS.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Color</Label>
            <div className="flex gap-1 mt-1">
              {DEVICE_COLORS.map((color) => (
                <button
                  key={color.id}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedScreenshot.device.color === color.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() =>
                    updateDevice(selectedScreenshot.id, { color: color.id })
                  }
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Style</Label>
            <Select
              value={selectedScreenshot.device.style}
              onValueChange={(value: any) =>
                updateDevice(selectedScreenshot.id, { style: value })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Scale: {Math.round(selectedScreenshot.device.scale * 100)}%</Label>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={selectedScreenshot.device.scale}
              onChange={(e) =>
                updateDevice(selectedScreenshot.id, { scale: parseFloat(e.target.value) })
              }
              className="w-full h-2 mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shadow"
              checked={selectedScreenshot.device.shadow}
              onChange={(e) =>
                updateDevice(selectedScreenshot.id, { shadow: e.target.checked })
              }
              className="rounded"
            />
            <Label htmlFor="shadow" className="text-xs cursor-pointer">
              Enable Shadow
            </Label>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium">Text</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => addText(selectedScreenshot.id, "headline")}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {selectedScreenshot.texts.map((text) => (
            <div
              key={text.id}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                selectedTextId === text.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {text.type}
                </span>
                <button
                  onClick={() => removeText(selectedScreenshot.id, text.id)}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
              <Input
                value={text.translations[currentLocale] || ""}
                onChange={(e) =>
                  updateTextTranslation(
                    selectedScreenshot.id,
                    text.id,
                    currentLocale,
                    e.target.value
                  )
                }
                placeholder={`Enter ${text.type}...`}
                className="h-8 text-sm"
              />

              {selectedTextId === text.id && (
                <div className="mt-3 space-y-2 pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Size</Label>
                      <Input
                        type="number"
                        value={text.style.fontSize}
                        onChange={(e) =>
                          updateTextStyle(selectedScreenshot.id, text.id, {
                            fontSize: parseInt(e.target.value) || 48,
                          })
                        }
                        className="h-7 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Weight</Label>
                      <Select
                        value={text.style.fontWeight.toString()}
                        onValueChange={(value) =>
                          updateTextStyle(selectedScreenshot.id, text.id, {
                            fontWeight: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="h-7 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">Regular</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semibold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                          <SelectItem value="800">Extra Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={text.style.color}
                        onChange={(e) =>
                          updateTextStyle(selectedScreenshot.id, text.id, {
                            color: e.target.value,
                          })
                        }
                        className="w-8 h-7 rounded border cursor-pointer"
                      />
                      <Input
                        value={text.style.color}
                        onChange={(e) =>
                          updateTextStyle(selectedScreenshot.id, text.id, {
                            color: e.target.value,
                          })
                        }
                        className="h-7 text-sm flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Position Y: {Math.round(text.positionY * 100)}%</Label>
                    <input
                      type="range"
                      min="0.02"
                      max="0.95"
                      step="0.01"
                      value={text.positionY}
                      onChange={(e) => {
                        const { updateText } = useEditorStore.getState();
                        updateText(selectedScreenshot.id, text.id, {
                          positionY: parseFloat(e.target.value),
                        });
                      }}
                      className="w-full h-2 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
