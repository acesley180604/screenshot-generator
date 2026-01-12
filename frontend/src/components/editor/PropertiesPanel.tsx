"use client";

import React from "react";
import { Palette, Type, Smartphone, Plus, Trash2, ChevronDown, Award, Link2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { SocialProofPanel } from "./SocialProofPanel";

const DEVICE_MODELS = [
  { id: "iphone-6.9", name: "iPhone 16 Pro Max", size: "6.9\"" },
  { id: "iphone-6.5", name: "iPhone 14 Plus", size: "6.5\"" },
  { id: "iphone-6.1", name: "iPhone 15", size: "6.1\"" },
  { id: "ipad-13", name: "iPad Pro", size: "13\"" },
  { id: "ipad-12.9", name: "iPad Pro", size: "12.9\"" },
];

// iPhone 16 Pro Colors
const DEVICE_COLORS_PRO = [
  { id: "desert-titanium", name: "Desert Titanium", hex: "#C4A77D", frameColor: "#8B7355", category: "pro" },
  { id: "natural-titanium", name: "Natural Titanium", hex: "#A8A9AD", frameColor: "#6E6E73", category: "pro" },
  { id: "white-titanium", name: "White Titanium", hex: "#F5F5F0", frameColor: "#D1D1D1", category: "pro" },
  { id: "black-titanium", name: "Black Titanium", hex: "#3B3B3D", frameColor: "#1D1D1F", category: "pro" },
];

// iPhone 16 Standard Colors
const DEVICE_COLORS_STANDARD = [
  { id: "ultramarine", name: "Ultramarine", hex: "#8585FF", frameColor: "#5454CD", category: "standard" },
  { id: "teal", name: "Teal", hex: "#54B4B4", frameColor: "#3A8080", category: "standard" },
  { id: "pink", name: "Pink", hex: "#F5A5C4", frameColor: "#C48098", category: "standard" },
  { id: "white", name: "White", hex: "#F5F5F7", frameColor: "#E0E0E2", category: "standard" },
  { id: "black", name: "Black", hex: "#2E2E30", frameColor: "#1A1A1C", category: "standard" },
];

// iPhone 15 Colors (for backwards compatibility)
const DEVICE_COLORS_LEGACY = [
  { id: "blue-titanium", name: "Blue Titanium", hex: "#3C4C5C", frameColor: "#2A3642", category: "legacy" },
  { id: "space-black", name: "Space Black", hex: "#1F1F1F", frameColor: "#0D0D0D", category: "legacy" },
  { id: "silver", name: "Silver", hex: "#E3E4E6", frameColor: "#B0B1B3", category: "legacy" },
  { id: "gold", name: "Gold", hex: "#F4E8CE", frameColor: "#C1B59C", category: "legacy" },
  { id: "deep-purple", name: "Deep Purple", hex: "#4B4453", frameColor: "#332D38", category: "legacy" },
];

// Combined for easy access
const ALL_DEVICE_COLORS = [
  ...DEVICE_COLORS_PRO,
  ...DEVICE_COLORS_STANDARD,
  ...DEVICE_COLORS_LEGACY,
];

const DEVICE_STYLES: { id: "realistic" | "clay" | "flat" | "none"; name: string }[] = [
  { id: "realistic", name: "Realistic" },
  { id: "clay", name: "Clay" },
  { id: "flat", name: "Flat" },
  { id: "none", name: "No Frame" },
];

const PRESET_GRADIENTS = [
  { name: "Ocean", stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] },
  { name: "Sunset", stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 1 }] },
  { name: "Purple", stops: [{ color: "#8E2DE2", position: 0 }, { color: "#4A00E0", position: 1 }] },
  { name: "Green", stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] },
  { name: "Pink", stops: [{ color: "#FF758C", position: 0 }, { color: "#FF7EB3", position: 1 }] },
  { name: "Teal", stops: [{ color: "#4ECDC4", position: 0 }, { color: "#44A08D", position: 1 }] },
];

// Multi-color gradient presets
const MULTI_COLOR_GRADIENTS = [
  { name: "Rainbow", stops: [{ color: "#FF0080", position: 0 }, { color: "#FF8C00", position: 0.25 }, { color: "#40E0D0", position: 0.5 }, { color: "#8A2BE2", position: 0.75 }, { color: "#FF0080", position: 1 }] },
  { name: "Aurora", stops: [{ color: "#0B0B2B", position: 0 }, { color: "#1E3A5F", position: 0.3 }, { color: "#20B2AA", position: 0.5 }, { color: "#98FB98", position: 0.7 }, { color: "#0B0B2B", position: 1 }] },
  { name: "Fire", stops: [{ color: "#1A0000", position: 0 }, { color: "#8B0000", position: 0.3 }, { color: "#FF4500", position: 0.6 }, { color: "#FFD700", position: 0.85 }, { color: "#FFFFE0", position: 1 }] },
];

// Mesh gradient presets
const MESH_PRESETS = [
  {
    name: "Aurora",
    colorPoints: [
      { color: "#00D9FF", x: 0.1, y: 0.2, radius: 0.7 },
      { color: "#00FF94", x: 0.9, y: 0.3, radius: 0.6 },
      { color: "#7B61FF", x: 0.3, y: 0.8, radius: 0.7 },
      { color: "#FF61DC", x: 0.8, y: 0.9, radius: 0.5 }
    ],
    preview: "linear-gradient(135deg, #00D9FF 0%, #00FF94 30%, #7B61FF 60%, #FF61DC 100%)"
  },
  {
    name: "Sunset",
    colorPoints: [
      { color: "#FF6B35", x: 0.2, y: 0.1, radius: 0.8 },
      { color: "#FF3864", x: 0.8, y: 0.3, radius: 0.6 },
      { color: "#FFD166", x: 0.1, y: 0.7, radius: 0.7 },
      { color: "#9B5DE5", x: 0.9, y: 0.9, radius: 0.6 }
    ],
    preview: "linear-gradient(135deg, #FF6B35 0%, #FF3864 40%, #FFD166 70%, #9B5DE5 100%)"
  },
  {
    name: "Ocean",
    colorPoints: [
      { color: "#0077B6", x: 0.2, y: 0.2, radius: 0.7 },
      { color: "#00B4D8", x: 0.8, y: 0.4, radius: 0.6 },
      { color: "#023E8A", x: 0.5, y: 0.8, radius: 0.8 },
      { color: "#48CAE4", x: 0.9, y: 0.1, radius: 0.5 }
    ],
    preview: "linear-gradient(135deg, #0077B6 0%, #00B4D8 40%, #023E8A 70%, #48CAE4 100%)"
  },
  {
    name: "Candy",
    colorPoints: [
      { color: "#FFB5E8", x: 0.1, y: 0.3, radius: 0.7 },
      { color: "#B5DEFF", x: 0.9, y: 0.2, radius: 0.6 },
      { color: "#DCD3FF", x: 0.3, y: 0.9, radius: 0.7 },
      { color: "#AFF8DB", x: 0.8, y: 0.7, radius: 0.5 }
    ],
    preview: "linear-gradient(135deg, #FFB5E8 0%, #B5DEFF 40%, #DCD3FF 70%, #AFF8DB 100%)"
  },
  {
    name: "Cosmic",
    colorPoints: [
      { color: "#2D00F7", x: 0.2, y: 0.1, radius: 0.8 },
      { color: "#6A00F4", x: 0.8, y: 0.3, radius: 0.6 },
      { color: "#8900F2", x: 0.1, y: 0.7, radius: 0.7 },
      { color: "#BC00DD", x: 0.9, y: 0.9, radius: 0.6 },
      { color: "#0A0A0F", x: 0.5, y: 0.5, radius: 0.4 }
    ],
    preview: "linear-gradient(135deg, #2D00F7 0%, #6A00F4 30%, #8900F2 60%, #BC00DD 100%)"
  },
];

// Glassmorphism presets
const GLASS_PRESETS = [
  {
    name: "Purple Haze",
    config: {
      type: "glassmorphism" as const,
      base_gradient: {
        type: "linear",
        angle: 135,
        stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }]
      },
      blobs: [
        { color: "#FF6B6B80", x: 0.2, y: 0.3, size: 0.4 },
        { color: "#4ECDC480", x: 0.8, y: 0.7, size: 0.35 },
        { color: "#FFE66D80", x: 0.5, y: 0.9, size: 0.3 }
      ],
      blob_blur: 120
    },
    preview: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
  },
  {
    name: "Ocean Breeze",
    config: {
      type: "glassmorphism" as const,
      base_gradient: {
        type: "linear",
        angle: 180,
        stops: [{ color: "#1CB5E0", position: 0 }, { color: "#000851", position: 1 }]
      },
      blobs: [
        { color: "#00FFF080", x: 0.15, y: 0.2, size: 0.35 },
        { color: "#00BFFF80", x: 0.85, y: 0.4, size: 0.4 },
        { color: "#7B68EE80", x: 0.3, y: 0.85, size: 0.3 }
      ],
      blob_blur: 150
    },
    preview: "linear-gradient(180deg, #1CB5E0 0%, #000851 100%)"
  },
  {
    name: "Sunset Dream",
    config: {
      type: "glassmorphism" as const,
      base_gradient: {
        type: "linear",
        angle: 160,
        stops: [{ color: "#FF512F", position: 0 }, { color: "#DD2476", position: 1 }]
      },
      blobs: [
        { color: "#FFD70080", x: 0.2, y: 0.15, size: 0.4 },
        { color: "#FF69B480", x: 0.75, y: 0.5, size: 0.35 },
        { color: "#FFA50080", x: 0.4, y: 0.8, size: 0.3 }
      ],
      blob_blur: 130
    },
    preview: "linear-gradient(160deg, #FF512F 0%, #DD2476 100%)"
  },
  {
    name: "Emerald",
    config: {
      type: "glassmorphism" as const,
      base_gradient: {
        type: "linear",
        angle: 135,
        stops: [{ color: "#134E5E", position: 0 }, { color: "#71B280", position: 1 }]
      },
      blobs: [
        { color: "#00FF8880", x: 0.1, y: 0.25, size: 0.35 },
        { color: "#20E3B280", x: 0.9, y: 0.3, size: 0.4 },
        { color: "#98FB9880", x: 0.5, y: 0.85, size: 0.3 }
      ],
      blob_blur: 140
    },
    preview: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
  },
];

// Abstract blob presets
const BLOB_PRESETS = [
  {
    name: "Neon Night",
    config: {
      type: "blobs" as const,
      base_color: "#0D0D1A",
      blobs: [
        { color: "#FF006680", x: 0.15, y: 0.2, size: 0.4 },
        { color: "#00F5FF80", x: 0.85, y: 0.35, size: 0.35 },
        { color: "#ADFF2F80", x: 0.25, y: 0.8, size: 0.3 },
        { color: "#FF149380", x: 0.75, y: 0.9, size: 0.25 }
      ],
      blur: 180
    },
    preview: "radial-gradient(circle at 20% 30%, #FF006680 0%, transparent 50%), radial-gradient(circle at 80% 40%, #00F5FF80 0%, transparent 50%), #0D0D1A"
  },
  {
    name: "Pastel Dream",
    config: {
      type: "blobs" as const,
      base_color: "#FFF5F5",
      blobs: [
        { color: "#FFB3BA90", x: 0.2, y: 0.15, size: 0.45 },
        { color: "#BAFFC990", x: 0.8, y: 0.25, size: 0.4 },
        { color: "#BAE1FF90", x: 0.15, y: 0.75, size: 0.35 },
        { color: "#FFFFBA90", x: 0.85, y: 0.85, size: 0.3 }
      ],
      blur: 200
    },
    preview: "radial-gradient(circle at 20% 20%, #FFB3BA90 0%, transparent 50%), radial-gradient(circle at 80% 30%, #BAFFC990 0%, transparent 50%), #FFF5F5"
  },
  {
    name: "Cyber Punk",
    config: {
      type: "blobs" as const,
      base_color: "#0F0F23",
      blobs: [
        { color: "#F706CF90", x: 0.1, y: 0.3, size: 0.5 },
        { color: "#00FFFF90", x: 0.9, y: 0.2, size: 0.4 },
        { color: "#FDFF0090", x: 0.5, y: 0.85, size: 0.35 }
      ],
      blur: 160
    },
    preview: "radial-gradient(circle at 15% 35%, #F706CF90 0%, transparent 50%), radial-gradient(circle at 85% 25%, #00FFFF90 0%, transparent 50%), #0F0F23"
  },
];

const BACKGROUND_TYPES = [
  { id: "solid", name: "Solid" },
  { id: "gradient", name: "Gradient" },
  { id: "mesh", name: "Mesh" },
  { id: "glassmorphism", name: "Glass" },
  { id: "blobs", name: "Blobs" },
  { id: "pattern", name: "Pattern" },
];

// Pattern presets for backgrounds
const PATTERN_PRESETS = [
  {
    name: "Dots",
    type: "dots" as const,
    color: "#ffffff",
    backgroundColor: "#1a1a2e",
    size: 20,
    opacity: 0.15,
  },
  {
    name: "Grid",
    type: "grid" as const,
    color: "#ffffff",
    backgroundColor: "#0D0D1A",
    size: 30,
    opacity: 0.1,
  },
  {
    name: "Lines",
    type: "lines" as const,
    color: "#00D4FF",
    backgroundColor: "#0D0D1A",
    size: 40,
    opacity: 0.1,
  },
  {
    name: "Diagonal",
    type: "diagonal-lines" as const,
    color: "#FF6B6B",
    backgroundColor: "#1a1a2e",
    size: 20,
    opacity: 0.15,
  },
  {
    name: "Cross",
    type: "cross" as const,
    color: "#ffffff",
    backgroundColor: "#16213e",
    size: 25,
    opacity: 0.12,
  },
  {
    name: "Waves",
    type: "waves" as const,
    color: "#00FF88",
    backgroundColor: "#0D0D1A",
    size: 60,
    opacity: 0.15,
  },
  {
    name: "Circles",
    type: "circles" as const,
    color: "#8E2DE2",
    backgroundColor: "#0F0F23",
    size: 50,
    opacity: 0.12,
  },
  {
    name: "Diamonds",
    type: "diamonds" as const,
    color: "#FFD700",
    backgroundColor: "#1a1a2e",
    size: 30,
    opacity: 0.1,
  },
  {
    name: "Triangles",
    type: "triangles" as const,
    color: "#FF00FF",
    backgroundColor: "#0A0A0F",
    size: 40,
    opacity: 0.12,
  },
  {
    name: "Hexagons",
    type: "hexagons" as const,
    color: "#00FFFF",
    backgroundColor: "#0D0D1A",
    size: 50,
    opacity: 0.1,
  },
  {
    name: "Checker",
    type: "checkerboard" as const,
    color: "#2c2c2e",
    backgroundColor: "#1c1c1e",
    size: 30,
    opacity: 0.5,
  },
  {
    name: "Zigzag",
    type: "zigzag" as const,
    color: "#FF6B6B",
    backgroundColor: "#0D0D1A",
    size: 30,
    opacity: 0.15,
  },
];

// Modern font families for app screenshots
const FONT_FAMILIES = [
  { id: "Inter", name: "Inter", category: "modern", cssVar: "var(--font-inter)", preview: "Aa" },
  { id: "Poppins", name: "Poppins", category: "modern", cssVar: "var(--font-poppins)", preview: "Aa" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta", category: "modern", cssVar: "var(--font-plus-jakarta)", preview: "Aa" },
  { id: "DM Sans", name: "DM Sans", category: "modern", cssVar: "var(--font-dm-sans)", preview: "Aa" },
  { id: "Space Grotesk", name: "Space Grotesk", category: "modern", cssVar: "var(--font-space-grotesk)", preview: "Aa" },
  { id: "Outfit", name: "Outfit", category: "modern", cssVar: "var(--font-outfit)", preview: "Aa" },
  { id: "Manrope", name: "Manrope", category: "modern", cssVar: "var(--font-manrope)", preview: "Aa" },
  { id: "Montserrat", name: "Montserrat", category: "classic", cssVar: "var(--font-montserrat)", preview: "Aa" },
  { id: "Raleway", name: "Raleway", category: "classic", cssVar: "var(--font-raleway)", preview: "Aa" },
  { id: "Work Sans", name: "Work Sans", category: "classic", cssVar: "var(--font-work-sans)", preview: "Aa" },
  { id: "SF Pro Display", name: "SF Pro", category: "system", cssVar: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'", preview: "Aa" },
];

// Font weight options
const FONT_WEIGHTS = [
  { value: 300, name: "Light" },
  { value: 400, name: "Regular" },
  { value: 500, name: "Medium" },
  { value: 600, name: "Semibold" },
  { value: 700, name: "Bold" },
  { value: 800, name: "Extra Bold" },
  { value: 900, name: "Black" },
];

// Helper function to generate SVG pattern for preview and canvas
function getPatternPreviewStyle(type: string, color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgba = `rgba(${r},${g},${b},${opacity})`;

  switch (type) {
    case 'dots':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='${encodeURIComponent(rgba)}'/%3E%3C/svg%3E")`;
    case 'grid':
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0H0v30' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'lines':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='40' y2='20' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'diagonal-lines':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L20 0M-5 5L5 -5M15 25L25 15' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'cross':
      return `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0v25M0 12.5h25' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'waves':
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30c15-10 30 10 60 0' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='2'/%3E%3C/svg%3E")`;
    case 'circles':
      return `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='15' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'diamonds':
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,0 30,15 15,30 0,15' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'triangles':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='20,5 35,35 5,35' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'hexagons':
      return `url("data:image/svg+xml,%3Csvg width='50' height='44' viewBox='0 0 50 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='25,0 50,11 50,33 25,44 0,33 0,11' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'checkerboard':
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='15' height='15' fill='${encodeURIComponent(rgba)}'/%3E%3Crect x='15' y='15' width='15' height='15' fill='${encodeURIComponent(rgba)}'/%3E%3C/svg%3E")`;
    case 'zigzag':
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15L15 0L30 15L15 30Z' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    default:
      return 'none';
  }
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ icon, title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-[#2c2c2e] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2c2c2e] transition-colors duration-150"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#2c2c2e] flex items-center justify-center text-[#a1a1a6]">
            {icon}
          </div>
          <span className="text-[13px] font-semibold text-[#f5f5f7]">{title}</span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-[#8e8e93] transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel() {
  const {
    project,
    selectedScreenshotId,
    selectedTextId,
    currentLocale,
    updateBackground,
    updateDevice,
    updateDeviceAll,
    updateTextTranslation,
    updateTextStyle,
    addText,
    removeText,
  } = useEditorStore();

  const [applyDeviceToAll, setApplyDeviceToAll] = React.useState(true);

  // Helper to update device - applies to all if toggle is on
  const handleDeviceUpdate = (updates: Parameters<typeof updateDevice>[1]) => {
    if (applyDeviceToAll) {
      updateDeviceAll(updates);
    } else if (selectedScreenshotId) {
      updateDevice(selectedScreenshotId, updates);
    }
  };

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  const selectedText = selectedScreenshot?.texts.find(
    (t) => t.id === selectedTextId
  );

  if (!selectedScreenshot) {
    return (
      <div className="w-64 min-w-[240px] border-l border-[#2c2c2e] bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#2c2c2e] flex items-center justify-center">
            <Palette className="w-6 h-6 text-[#636366]" />
          </div>
          <p className="text-[#a1a1a6] text-sm font-medium">No selection</p>
          <p className="text-[#636366] text-xs mt-1">Select a screenshot to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 min-w-[240px] flex-shrink-0 border-l border-[#2c2c2e] bg-[#1c1c1e] overflow-y-auto">
      {/* Panel Header */}
      <div className="px-4 py-4 border-b border-[#2c2c2e] sticky top-0 bg-[#1c1c1e]/95 backdrop-blur-xl z-10">
        <h2 className="text-sm font-semibold text-[#f5f5f7]">Properties</h2>
        <p className="text-[11px] text-[#8e8e93] mt-0.5">Customize your screenshot</p>
      </div>

      {/* Background Section */}
      <Section icon={<Palette className="w-3.5 h-3.5" />} title="Background">
        <div className="space-y-3">
          {/* Background Type Toggle */}
          <div className="flex flex-wrap p-1 bg-[#2c2c2e] rounded-lg gap-0.5">
            {BACKGROUND_TYPES.map((bgType) => (
              <button
                key={bgType.id}
                onClick={() => updateBackground(selectedScreenshot.id, { ...selectedScreenshot.template.background, type: bgType.id as any })}
                className={cn(
                  "flex-1 py-1.5 px-2 text-[10px] font-medium rounded-md transition-all duration-200 min-w-[50px]",
                  selectedScreenshot.template.background.type === bgType.id
                    ? "bg-[#3a3a3c] text-[#f5f5f7] shadow-sm"
                    : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                )}
              >
                {bgType.name}
              </button>
            ))}
          </div>

          {/* Solid Color */}
          {selectedScreenshot.template.background.type === "solid" && (
            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Color</Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative">
                  <input
                    type="color"
                    value={selectedScreenshot.template.background.color || "#1c1c1e"}
                    onChange={(e) =>
                      updateBackground(selectedScreenshot.id, {
                        ...selectedScreenshot.template.background,
                        color: e.target.value,
                      })
                    }
                    className="w-10 h-9 rounded-lg cursor-pointer"
                  />
                </div>
                <Input
                  value={selectedScreenshot.template.background.color || "#1c1c1e"}
                  onChange={(e) =>
                    updateBackground(selectedScreenshot.id, {
                      ...selectedScreenshot.template.background,
                      color: e.target.value,
                    })
                  }
                  className="h-9 text-sm flex-1 font-mono"
                />
              </div>
            </div>
          )}

          {/* Gradient */}
          {selectedScreenshot.template.background.type === "gradient" && (
            <div className="space-y-3">
              <div>
                <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Simple Gradients</Label>
                <div className="grid grid-cols-6 gap-1.5 mt-1.5">
                  {PRESET_GRADIENTS.map((gradient, index) => (
                    <button
                      key={index}
                      className="aspect-square rounded-lg border-2 border-transparent hover:border-[#0a84ff] transition-all duration-200 hover:scale-110 active:scale-95"
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
              <div>
                <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Multi-Color</Label>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  {MULTI_COLOR_GRADIENTS.map((gradient, index) => (
                    <button
                      key={index}
                      className="h-10 rounded-lg border-2 border-transparent hover:border-[#0a84ff] transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: `linear-gradient(180deg, ${gradient.stops.map(s => `${s.color} ${s.position * 100}%`).join(", ")})`,
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
            </div>
          )}

          {/* Mesh Gradient */}
          {selectedScreenshot.template.background.type === "mesh" && (
            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Mesh Presets</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {MESH_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 border-transparent hover:border-[#0a84ff] transition-all duration-200 hover:scale-105 active:scale-95 bg-[#2c2c2e]"
                    onClick={() =>
                      updateBackground(selectedScreenshot.id, {
                        type: "mesh",
                        color_points: preset.colorPoints,
                      })
                    }
                  >
                    <div
                      className="w-full aspect-square rounded-md"
                      style={{ background: preset.preview }}
                    />
                    <span className="text-[10px] text-[#a1a1a6]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glassmorphism */}
          {selectedScreenshot.template.background.type === "glassmorphism" && (
            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Glass Presets</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {GLASS_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 border-transparent hover:border-[#0a84ff] transition-all duration-200 hover:scale-105 active:scale-95 bg-[#2c2c2e]"
                    onClick={() =>
                      updateBackground(selectedScreenshot.id, preset.config as any)
                    }
                  >
                    <div
                      className="w-full aspect-video rounded-md relative overflow-hidden"
                      style={{ background: preset.preview }}
                    >
                      <div className="absolute inset-2 rounded bg-white/10 backdrop-blur-sm border border-white/20" />
                    </div>
                    <span className="text-[10px] text-[#a1a1a6]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Abstract Blobs */}
          {selectedScreenshot.template.background.type === "blobs" && (
            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Blob Presets</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {BLOB_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 border-transparent hover:border-[#0a84ff] transition-all duration-200 hover:scale-105 active:scale-95 bg-[#2c2c2e]"
                    onClick={() =>
                      updateBackground(selectedScreenshot.id, preset.config as any)
                    }
                  >
                    <div
                      className="w-full aspect-square rounded-md"
                      style={{ background: preset.preview }}
                    />
                    <span className="text-[10px] text-[#a1a1a6]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Backgrounds */}
          {selectedScreenshot.template.background.type === "pattern" && (
            <div className="space-y-3">
              <div>
                <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Pattern Presets</Label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {PATTERN_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      className={cn(
                        "flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95",
                        selectedScreenshot.template.background.patternConfig?.type === preset.type
                          ? "border-[#0a84ff] bg-[#0a84ff]/10"
                          : "border-transparent bg-[#2c2c2e] hover:border-[#0a84ff]"
                      )}
                      onClick={() =>
                        updateBackground(selectedScreenshot.id, {
                          type: "pattern",
                          patternConfig: {
                            type: preset.type,
                            color: preset.color,
                            backgroundColor: preset.backgroundColor,
                            size: preset.size,
                            opacity: preset.opacity,
                          },
                        })
                      }
                    >
                      <div
                        className="w-full aspect-square rounded-md overflow-hidden"
                        style={{
                          backgroundColor: preset.backgroundColor,
                          backgroundImage: getPatternPreviewStyle(preset.type, preset.color, preset.opacity),
                          backgroundSize: `${preset.size}px ${preset.size}px`,
                        }}
                      />
                      <span className="text-[9px] text-[#a1a1a6]">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern customization */}
              {selectedScreenshot.template.background.patternConfig && (
                <div className="space-y-3 pt-2 border-t border-[#2c2c2e]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Pattern Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedScreenshot.template.background.patternConfig.color}
                          onChange={(e) =>
                            updateBackground(selectedScreenshot.id, {
                              ...selectedScreenshot.template.background,
                              patternConfig: {
                                ...selectedScreenshot.template.background.patternConfig!,
                                color: e.target.value,
                              },
                            })
                          }
                          className="w-8 h-8 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={selectedScreenshot.template.background.patternConfig.color}
                          onChange={(e) =>
                            updateBackground(selectedScreenshot.id, {
                              ...selectedScreenshot.template.background,
                              patternConfig: {
                                ...selectedScreenshot.template.background.patternConfig!,
                                color: e.target.value,
                              },
                            })
                          }
                          className="h-8 text-xs flex-1 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Background</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedScreenshot.template.background.patternConfig.backgroundColor}
                          onChange={(e) =>
                            updateBackground(selectedScreenshot.id, {
                              ...selectedScreenshot.template.background,
                              patternConfig: {
                                ...selectedScreenshot.template.background.patternConfig!,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="w-8 h-8 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={selectedScreenshot.template.background.patternConfig.backgroundColor}
                          onChange={(e) =>
                            updateBackground(selectedScreenshot.id, {
                              ...selectedScreenshot.template.background,
                              patternConfig: {
                                ...selectedScreenshot.template.background.patternConfig!,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="h-8 text-xs flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Pattern Size</Label>
                      <span className="text-[11px] font-medium text-[#f5f5f7]">{selectedScreenshot.template.background.patternConfig.size}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={selectedScreenshot.template.background.patternConfig.size}
                      onChange={(e) =>
                        updateBackground(selectedScreenshot.id, {
                          ...selectedScreenshot.template.background,
                          patternConfig: {
                            ...selectedScreenshot.template.background.patternConfig!,
                            size: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Opacity</Label>
                      <span className="text-[11px] font-medium text-[#f5f5f7]">{Math.round(selectedScreenshot.template.background.patternConfig.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={selectedScreenshot.template.background.patternConfig.opacity}
                      onChange={(e) =>
                        updateBackground(selectedScreenshot.id, {
                          ...selectedScreenshot.template.background,
                          patternConfig: {
                            ...selectedScreenshot.template.background.patternConfig!,
                            opacity: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Noise/Grain Toggle - available for all types */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#2c2c2e] cursor-pointer hover:bg-[#3a3a3c] transition-colors duration-150">
            <input
              type="checkbox"
              checked={(selectedScreenshot.template.background as any).noise?.enabled || false}
              onChange={(e) =>
                updateBackground(selectedScreenshot.id, {
                  ...selectedScreenshot.template.background,
                  noise: {
                    enabled: e.target.checked,
                    intensity: 0.04,
                    monochrome: true,
                  },
                } as any)
              }
            />
            <div>
              <span className="text-[13px] font-medium text-[#f5f5f7]">Add Grain</span>
              <p className="text-[11px] text-[#8e8e93]">Film-like texture</p>
            </div>
          </label>
        </div>
      </Section>

      {/* Device Section */}
      <Section icon={<Smartphone className="w-3.5 h-3.5" />} title="Device">
        <div className="space-y-4">
          {/* Apply to All Toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0a84ff]/10 border border-[#0a84ff]/30 cursor-pointer hover:bg-[#0a84ff]/15 transition-colors duration-150">
            <input
              type="checkbox"
              checked={applyDeviceToAll}
              onChange={(e) => setApplyDeviceToAll(e.target.checked)}
              className="accent-[#0a84ff]"
            />
            <Link2 className={cn(
              "w-4 h-4 transition-colors",
              applyDeviceToAll ? "text-[#0a84ff]" : "text-[#8e8e93]"
            )} />
            <div className="flex-1">
              <span className="text-[13px] font-medium text-[#f5f5f7]">Apply to All</span>
              <p className="text-[11px] text-[#8e8e93]">Sync device settings across screenshots</p>
            </div>
          </label>

          <div>
            <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Model</Label>
            <Select
              value={selectedScreenshot.device.model}
              onValueChange={(value) => handleDeviceUpdate({ model: value })}
            >
              <SelectTrigger className="h-9 text-sm mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_MODELS.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <span className="flex items-center gap-2">
                      {device.name}
                      <span className="text-[#8e8e93]">{device.size}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">iPhone 16 Pro</Label>
              <div className="flex gap-2 mt-1.5">
                {DEVICE_COLORS_PRO.map((color) => (
                  <button
                    key={color.id}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95",
                      selectedScreenshot.device.color === color.id
                        ? "border-[#0a84ff] ring-2 ring-[#0a84ff]/20"
                        : "border-[#3a3a3c] hover:border-[#636366]"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() =>
                      handleDeviceUpdate({ color: color.id })
                    }
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">iPhone 16</Label>
              <div className="flex gap-2 mt-1.5">
                {DEVICE_COLORS_STANDARD.map((color) => (
                  <button
                    key={color.id}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95",
                      selectedScreenshot.device.color === color.id
                        ? "border-[#0a84ff] ring-2 ring-[#0a84ff]/20"
                        : "border-[#3a3a3c] hover:border-[#636366]"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() =>
                      handleDeviceUpdate({ color: color.id })
                    }
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Classic Colors</Label>
              <div className="flex gap-2 mt-1.5">
                {DEVICE_COLORS_LEGACY.map((color) => (
                  <button
                    key={color.id}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95",
                      selectedScreenshot.device.color === color.id
                        ? "border-[#0a84ff] ring-2 ring-[#0a84ff]/20"
                        : "border-[#3a3a3c] hover:border-[#636366]"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() =>
                      handleDeviceUpdate({ color: color.id })
                    }
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Custom Color</Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative">
                  <input
                    type="color"
                    value={
                      selectedScreenshot.device.color.startsWith("#")
                        ? selectedScreenshot.device.color
                        : ALL_DEVICE_COLORS.find(c => c.id === selectedScreenshot.device.color)?.hex || "#1c1c1e"
                    }
                    onChange={(e) =>
                      handleDeviceUpdate({ color: e.target.value })
                    }
                    className="w-10 h-9 rounded-lg cursor-pointer"
                  />
                </div>
                <Input
                  value={
                    selectedScreenshot.device.color.startsWith("#")
                      ? selectedScreenshot.device.color
                      : ALL_DEVICE_COLORS.find(c => c.id === selectedScreenshot.device.color)?.hex || "#1c1c1e"
                  }
                  onChange={(e) =>
                    handleDeviceUpdate({ color: e.target.value })
                  }
                  placeholder="#000000"
                  className="h-9 text-sm flex-1 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Style</Label>
            <div className="flex p-1 bg-[#2c2c2e] rounded-lg mt-1.5">
              {DEVICE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleDeviceUpdate({ style: style.id })}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200",
                    selectedScreenshot.device.style === style.id
                      ? "bg-[#3a3a3c] text-[#f5f5f7] shadow-sm"
                      : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                  )}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Scale</Label>
              <span className="text-[11px] font-medium text-[#f5f5f7]">{Math.round(selectedScreenshot.device.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={selectedScreenshot.device.scale}
              onChange={(e) =>
                handleDeviceUpdate({ scale: parseFloat(e.target.value) })
              }
              className="w-full mt-2"
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#2c2c2e] cursor-pointer hover:bg-[#3a3a3c] transition-colors duration-150">
            <input
              type="checkbox"
              checked={selectedScreenshot.device.shadow}
              onChange={(e) =>
                handleDeviceUpdate({ shadow: e.target.checked })
              }
            />
            <div>
              <span className="text-[13px] font-medium text-[#f5f5f7]">Device Shadow</span>
              <p className="text-[11px] text-[#8e8e93]">Add depth with shadow</p>
            </div>
          </label>
        </div>
      </Section>

      {/* Text Section */}
      <Section icon={<Type className="w-3.5 h-3.5" />} title="Text">
        <div className="space-y-3">
          {/* Add Text Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-dashed"
            onClick={() => addText(selectedScreenshot.id, "headline")}
          >
            <Plus className="w-4 h-4" />
            Add Text Layer
          </Button>

          {/* Text Items */}
          {selectedScreenshot.texts.map((text, index) => (
            <div
              key={text.id}
              className={cn(
                "rounded-xl border transition-all duration-200 overflow-hidden",
                selectedTextId === text.id
                  ? "border-[#0a84ff] bg-[#0a84ff]/10"
                  : "border-[#2c2c2e] bg-[#1c1c1e] hover:border-[#3a3a3c]"
              )}
            >
              {/* Text header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#2c2c2e]">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    selectedTextId === text.id
                      ? "bg-[#0a84ff] text-white"
                      : "bg-[#2c2c2e] text-[#a1a1a6]"
                  )}>
                    {text.type}
                  </span>
                </div>
                <button
                  onClick={() => removeText(selectedScreenshot.id, text.id)}
                  className="p-1.5 rounded-md hover:bg-[#ff453a]/10 transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#ff453a]" />
                </button>
              </div>

              {/* Text input */}
              <div className="p-3">
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
                  className="h-9 text-sm"
                />

                {selectedTextId === text.id && (
                  <div className="mt-3 pt-3 border-t border-[#2c2c2e] space-y-3 animate-fadeIn">
                    {/* Font Family Selection */}
                    <div>
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Font Family</Label>
                      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                        {FONT_FAMILIES.slice(0, 6).map((font) => (
                          <button
                            key={font.id}
                            onClick={() =>
                              updateTextStyle(selectedScreenshot.id, text.id, {
                                fontFamily: font.id,
                              })
                            }
                            className={cn(
                              "py-2 px-2 rounded-lg text-[11px] font-medium transition-all duration-200 text-center",
                              text.style.fontFamily === font.id
                                ? "bg-[#0a84ff] text-white"
                                : "bg-[#2c2c2e] text-[#a1a1a6] hover:bg-[#3a3a3c] hover:text-[#f5f5f7]"
                            )}
                            style={{ fontFamily: font.cssVar }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                      <Select
                        value={text.style.fontFamily}
                        onValueChange={(value) =>
                          updateTextStyle(selectedScreenshot.id, text.id, {
                            fontFamily: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-sm mt-2">
                          <SelectValue placeholder="More fonts..." />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1 text-[10px] text-[#8e8e93] uppercase tracking-wide">Modern</div>
                          {FONT_FAMILIES.filter(f => f.category === "modern").map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              <span style={{ fontFamily: font.cssVar }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1 text-[10px] text-[#8e8e93] uppercase tracking-wide mt-1">Classic</div>
                          {FONT_FAMILIES.filter(f => f.category === "classic").map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              <span style={{ fontFamily: font.cssVar }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1 text-[10px] text-[#8e8e93] uppercase tracking-wide mt-1">System</div>
                          {FONT_FAMILIES.filter(f => f.category === "system").map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              <span style={{ fontFamily: font.cssVar }}>{font.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Size</Label>
                        <Input
                          type="number"
                          value={text.style.fontSize}
                          onChange={(e) =>
                            updateTextStyle(selectedScreenshot.id, text.id, {
                              fontSize: parseInt(e.target.value) || 48,
                            })
                          }
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Weight</Label>
                        <Select
                          value={text.style.fontWeight.toString()}
                          onValueChange={(value) =>
                            updateTextStyle(selectedScreenshot.id, text.id, {
                              fontWeight: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_WEIGHTS.map((weight) => (
                              <SelectItem key={weight.value} value={weight.value.toString()}>
                                {weight.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={text.style.color}
                          onChange={(e) =>
                            updateTextStyle(selectedScreenshot.id, text.id, {
                              color: e.target.value,
                            })
                          }
                          className="w-9 h-8 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={text.style.color}
                          onChange={(e) =>
                            updateTextStyle(selectedScreenshot.id, text.id, {
                              color: e.target.value,
                            })
                          }
                          className="h-8 text-sm flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wide">Position Y</Label>
                        <span className="text-[11px] font-medium text-[#f5f5f7]">{Math.round(text.positionY * 100)}%</span>
                      </div>
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
                        className="w-full mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Social Proof Section */}
      <Section icon={<Award className="w-3.5 h-3.5" />} title="Social Proof" defaultOpen={false}>
        <SocialProofPanel />
      </Section>
    </div>
  );
}
