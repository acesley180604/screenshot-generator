"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Smartphone, Plus, ImageIcon, Layers, Move, Maximize2 } from "lucide-react";
import { Rnd } from "react-rnd";
import { useEditorStore } from "@/lib/store";
import { uploadApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LayoutDevicePosition, SocialProofElement, NotificationElement, ScreenshotConfig, BadgeOverlayElement } from "@/types";

// ============================================
// APP STORE SCREENSHOT DIMENSIONS
// ============================================
// iPhone 6.5" (required) - 1242 × 2688 pixels
const SCREENSHOT_WIDTH = 1242;
const SCREENSHOT_HEIGHT = 2688;
const SCREENSHOT_ASPECT_RATIO = `${SCREENSHOT_WIDTH} / ${SCREENSHOT_HEIGHT}`;

// ============================================
// CANVA/FIGMA-STYLE UX CONSTANTS
// ============================================

// Smooth easing functions (Figma-style)
const EASING = {
  gentle: "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design standard
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy spring effect
  smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)", // Smooth ease-in-out
  snappy: "cubic-bezier(0.2, 0, 0, 1)", // Quick and responsive
};

// Transition durations
const DURATION = {
  instant: "0ms",
  fast: "150ms",
  normal: "200ms",
  smooth: "300ms",
  slow: "500ms",
};

// Custom resize handle styles - Figma/Canva inspired
// Figma uses 8x8 white squares with 1px blue border
const resizeHandleStyle: React.CSSProperties = {
  width: "10px",
  height: "10px",
  background: "#ffffff",
  borderRadius: "1px", // Figma uses slightly rounded corners
  border: "1px solid #0a84ff",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15)",
  transition: `all ${DURATION.fast} ${EASING.gentle}`,
  pointerEvents: "auto" as const,
};

const resizeHandleHoverStyle: React.CSSProperties = {
  ...resizeHandleStyle,
  width: "12px",
  height: "12px",
  background: "#0a84ff",
  border: "1px solid #ffffff",
  boxShadow: "0 0 0 2px rgba(10,132,255,0.3), 0 2px 8px rgba(10,132,255,0.4)",
};

const resizeHandleActiveStyle: React.CSSProperties = {
  ...resizeHandleHoverStyle,
  transform: "scale(1.1)",
  boxShadow: "0 0 0 3px rgba(10,132,255,0.4), 0 4px 12px rgba(10,132,255,0.5)",
};

// Corner handle positions - positioned exactly at corners
const resizeHandleClasses: Record<string, React.CSSProperties> = {
  topLeft: { top: -5, left: -5, cursor: "nwse-resize" },
  topRight: { top: -5, right: -5, cursor: "nesw-resize" },
  bottomLeft: { bottom: -5, left: -5, cursor: "nesw-resize" },
  bottomRight: { bottom: -5, right: -5, cursor: "nwse-resize" },
};

// Edge handle styles for width/height only resize (like Figma)
const edgeHandleStyle: React.CSSProperties = {
  background: "transparent",
  position: "absolute",
  zIndex: 49,
};

const edgeHandlePositions: Record<string, React.CSSProperties> = {
  top: { top: -4, left: "15%", right: "15%", height: "8px", cursor: "ns-resize" },
  bottom: { bottom: -4, left: "15%", right: "15%", height: "8px", cursor: "ns-resize" },
  left: { left: -4, top: "15%", bottom: "15%", width: "8px", cursor: "ew-resize" },
  right: { right: -4, top: "15%", bottom: "15%", width: "8px", cursor: "ew-resize" },
};

// Selection styles
const selectionStyle = {
  outline: "2px solid #0a84ff",
  outlineOffset: "2px",
  boxShadow: "0 0 0 1px rgba(10,132,255,0.1), 0 4px 12px rgba(10,132,255,0.15)",
};

// Dragging styles (elevation effect like Canva)
const draggingStyle = {
  boxShadow: "0 12px 28px rgba(0,0,0,0.25), 0 8px 10px rgba(0,0,0,0.15)",
  opacity: 0.95,
  transform: "scale(1.02)",
};

// Snap guide configuration (Figma-style)
const SNAP_THRESHOLD = 8; // pixels - distance to trigger snap
const SNAP_GUIDE_COLOR = "#FF00D4"; // Magenta like Figma

// Snap guide line component
function SnapGuide({ type, position }: { type: 'horizontal' | 'vertical' | 'center-h' | 'center-v'; position: number }) {
  const isCenter = type.includes('center');

  if (type === 'horizontal' || type === 'center-h') {
    return (
      <div
        className="absolute left-0 right-0 pointer-events-none z-[200]"
        style={{
          top: `${position}%`,
          height: '1px',
          background: isCenter
            ? `linear-gradient(90deg, transparent 0%, ${SNAP_GUIDE_COLOR} 20%, ${SNAP_GUIDE_COLOR} 80%, transparent 100%)`
            : SNAP_GUIDE_COLOR,
          boxShadow: `0 0 4px ${SNAP_GUIDE_COLOR}`,
          transition: `opacity ${DURATION.fast} ${EASING.gentle}`,
        }}
      />
    );
  }

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-[200]"
      style={{
        left: `${position}%`,
        width: '1px',
        background: isCenter
          ? `linear-gradient(180deg, transparent 0%, ${SNAP_GUIDE_COLOR} 20%, ${SNAP_GUIDE_COLOR} 80%, transparent 100%)`
          : SNAP_GUIDE_COLOR,
        boxShadow: `0 0 4px ${SNAP_GUIDE_COLOR}`,
        transition: `opacity ${DURATION.fast} ${EASING.gentle}`,
      }}
    />
  );
}

// Snap guides overlay component
interface SnapGuidesProps {
  showCenterH?: boolean;
  showCenterV?: boolean;
  customGuides?: { type: 'horizontal' | 'vertical'; position: number }[];
}

function SnapGuidesOverlay({ showCenterH, showCenterV, customGuides = [] }: SnapGuidesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {showCenterH && <SnapGuide type="center-h" position={50} />}
      {showCenterV && <SnapGuide type="center-v" position={50} />}
      {customGuides.map((guide, i) => (
        <SnapGuide key={i} type={guide.type} position={guide.position} />
      ))}
    </div>
  );
}

// Helper to check if value is near snap point
function isNearSnap(value: number, snapPoint: number, threshold: number = SNAP_THRESHOLD / 100): boolean {
  return Math.abs(value - snapPoint) < threshold;
}

// Get snap position if near a snap point
function getSnapPosition(value: number, snapPoints: number[], threshold: number = SNAP_THRESHOLD / 100): number | null {
  for (const point of snapPoints) {
    if (isNearSnap(value, point, threshold)) {
      return point;
    }
  }
  return null;
}

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

// Helper function to generate SVG pattern for canvas
function getPatternSVG(type: string, color: string, opacity: number): string {
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
  "isometric-left": {
    name: "Iso Left",
    icon: "◿",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: -25, perspectiveX: 5, perspectiveDistance: 800 }]
  },
  "isometric-right": {
    name: "Iso Right",
    icon: "◺",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: 25, perspectiveX: 5, perspectiveDistance: 800 }]
  },
  "dramatic-left": {
    name: "Drama L",
    icon: "◸",
    devices: [{ position: { x: 0.55, y: 0.55 }, scale: 0.7, rotation: -3, zIndex: 1, perspective: true, perspectiveAngle: -35, perspectiveX: 10, perspectiveDistance: 600 }]
  },
  "dramatic-right": {
    name: "Drama R",
    icon: "◹",
    devices: [{ position: { x: 0.45, y: 0.55 }, scale: 0.7, rotation: 3, zIndex: 1, perspective: true, perspectiveAngle: 35, perspectiveX: 10, perspectiveDistance: 600 }]
  },
  "top-down": {
    name: "Top Down",
    icon: "▽",
    devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: 0, perspectiveX: 25, perspectiveDistance: 700 }]
  },
  "showcase-3d": {
    name: "Showcase",
    icon: "◇",
    devices: [{ position: { x: 0.5, y: 0.52 }, scale: 0.72, rotation: -5, zIndex: 1, perspective: true, perspectiveAngle: 15, perspectiveX: 8, perspectiveDistance: 900, floatingShadow: true }]
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
  },
  "left-edge": {
    name: "Left Edge",
    icon: "◧",
    devices: [{ position: { x: 0.15, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "right-edge": {
    name: "Right Edge",
    icon: "◨",
    devices: [{ position: { x: 0.85, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }]
  },
  "left-edge-tilted": {
    name: "Edge Tilt L",
    icon: "◩",
    devices: [{ position: { x: 0.18, y: 0.58 }, scale: 0.72, rotation: 8, zIndex: 1 }]
  },
  "right-edge-tilted": {
    name: "Edge Tilt R",
    icon: "◪",
    devices: [{ position: { x: 0.82, y: 0.58 }, scale: 0.72, rotation: -8, zIndex: 1 }]
  },
  "corner-left": {
    name: "Corner L",
    icon: "◱",
    devices: [{ position: { x: 0.22, y: 0.72 }, scale: 0.7, rotation: 12, zIndex: 1 }]
  },
  "corner-right": {
    name: "Corner R",
    icon: "◲",
    devices: [{ position: { x: 0.78, y: 0.72 }, scale: 0.7, rotation: -12, zIndex: 1 }]
  },
  "dual-edge": {
    name: "Dual Edge",
    icon: "▥",
    devices: [
      { position: { x: 0.12, y: 0.6 }, scale: 0.55, rotation: 5, zIndex: 1 },
      { position: { x: 0.88, y: 0.6 }, scale: 0.55, rotation: -5, zIndex: 1 }
    ]
  },
  // ============================================
  // APP STORE STYLE - Multi-device scattered layouts
  // ============================================
  "artsy-scatter": {
    name: "Scatter",
    icon: "✦",
    devices: [
      { position: { x: 0.15, y: 0.25 }, scale: 0.32, rotation: -15, zIndex: 1 },
      { position: { x: 0.75, y: 0.18 }, scale: 0.28, rotation: 20, zIndex: 2 },
      { position: { x: 0.35, y: 0.45 }, scale: 0.38, rotation: 5, zIndex: 3 },
      { position: { x: 0.82, y: 0.55 }, scale: 0.35, rotation: -10, zIndex: 2 },
      { position: { x: 0.22, y: 0.75 }, scale: 0.33, rotation: 12, zIndex: 1 },
      { position: { x: 0.65, y: 0.78 }, scale: 0.30, rotation: -8, zIndex: 2 }
    ]
  },
  "artsy-collage": {
    name: "Collage",
    icon: "❖",
    devices: [
      { position: { x: 0.25, y: 0.3 }, scale: 0.42, rotation: -12, zIndex: 2 },
      { position: { x: 0.7, y: 0.25 }, scale: 0.38, rotation: 15, zIndex: 1 },
      { position: { x: 0.45, y: 0.65 }, scale: 0.45, rotation: 3, zIndex: 3 },
      { position: { x: 0.85, y: 0.7 }, scale: 0.35, rotation: -18, zIndex: 1 }
    ]
  },
  "dmv-hero": {
    name: "Hero Left",
    icon: "◀",
    devices: [
      { position: { x: 0.28, y: 0.55 }, scale: 0.65, rotation: 0, zIndex: 3 },
      { position: { x: 0.72, y: 0.35 }, scale: 0.35, rotation: 10, zIndex: 1 },
      { position: { x: 0.85, y: 0.65 }, scale: 0.32, rotation: -5, zIndex: 2 }
    ]
  },
  "crypto-trio": {
    name: "Trio Row",
    icon: "≡",
    devices: [
      { position: { x: 0.18, y: 0.55 }, scale: 0.5, rotation: -5, zIndex: 1 },
      { position: { x: 0.5, y: 0.5 }, scale: 0.55, rotation: 0, zIndex: 2 },
      { position: { x: 0.82, y: 0.55 }, scale: 0.5, rotation: 5, zIndex: 1 }
    ]
  },
  "calendar-quad": {
    name: "Quad",
    icon: "▦",
    devices: [
      { position: { x: 0.2, y: 0.35 }, scale: 0.4, rotation: -8, zIndex: 1 },
      { position: { x: 0.55, y: 0.3 }, scale: 0.42, rotation: 5, zIndex: 2 },
      { position: { x: 0.35, y: 0.7 }, scale: 0.38, rotation: 3, zIndex: 2 },
      { position: { x: 0.75, y: 0.65 }, scale: 0.4, rotation: -6, zIndex: 1 }
    ]
  },
  "parenting-five": {
    name: "Five Grid",
    icon: "⬢",
    devices: [
      { position: { x: 0.15, y: 0.3 }, scale: 0.35, rotation: -10, zIndex: 1 },
      { position: { x: 0.5, y: 0.25 }, scale: 0.4, rotation: 5, zIndex: 2 },
      { position: { x: 0.85, y: 0.35 }, scale: 0.35, rotation: 12, zIndex: 1 },
      { position: { x: 0.3, y: 0.7 }, scale: 0.38, rotation: -5, zIndex: 2 },
      { position: { x: 0.7, y: 0.72 }, scale: 0.36, rotation: 8, zIndex: 1 }
    ]
  },
  "showcase-single": {
    name: "Showcase",
    icon: "◉",
    devices: [
      { position: { x: 0.5, y: 0.58 }, scale: 0.68, rotation: 0, zIndex: 1 }
    ]
  },
  "hero-right": {
    name: "Hero Right",
    icon: "▶",
    devices: [
      { position: { x: 0.72, y: 0.55 }, scale: 0.65, rotation: 0, zIndex: 3 },
      { position: { x: 0.28, y: 0.35 }, scale: 0.35, rotation: -10, zIndex: 1 },
      { position: { x: 0.15, y: 0.65 }, scale: 0.32, rotation: 5, zIndex: 2 }
    ]
  },
  "diagonal-stack": {
    name: "Diagonal",
    icon: "⬔",
    devices: [
      { position: { x: 0.25, y: 0.7 }, scale: 0.45, rotation: -12, zIndex: 1 },
      { position: { x: 0.45, y: 0.5 }, scale: 0.5, rotation: -5, zIndex: 2 },
      { position: { x: 0.7, y: 0.35 }, scale: 0.48, rotation: 3, zIndex: 3 }
    ]
  },
  "floating-duo": {
    name: "Float Duo",
    icon: "◈",
    devices: [
      { position: { x: 0.35, y: 0.45 }, scale: 0.52, rotation: -8, zIndex: 1, floatingShadow: true },
      { position: { x: 0.68, y: 0.58 }, scale: 0.55, rotation: 6, zIndex: 2, floatingShadow: true }
    ]
  },
  "edge-peek": {
    name: "Edge Peek",
    icon: "◧",
    devices: [
      { position: { x: 0.08, y: 0.5 }, scale: 0.55, rotation: 8, zIndex: 1 },
      { position: { x: 0.55, y: 0.55 }, scale: 0.6, rotation: 0, zIndex: 2 }
    ]
  },
  "cross-panel": {
    name: "Cross",
    icon: "⊞",
    devices: [
      { position: { x: 0.92, y: 0.55 }, scale: 0.65, rotation: -5, zIndex: 2 }
    ]
  }
};

interface DeviceFrameProps {
  imageUrl?: string;
  imageFit?: 'contain' | 'cover' | 'fill';
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
  onScaleChange?: (scale: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

function DeviceFrame({
  imageUrl,
  imageFit = 'contain', // Default to contain so image fits properly
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
  onScaleChange,
  canvasRef
}: DeviceFrameProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Resize handle component for device frame
  const DeviceResizeHandle = ({ corner }: { corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleResize = (e: React.MouseEvent) => {
      if (!onScaleChange) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startScale = position.scale;

      const handleMouseMove = (moveE: MouseEvent) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;

        // Calculate scale based on corner position
        let delta = 0;
        switch (corner) {
          case 'bottomRight':
            delta = (deltaX + deltaY) / 2;
            break;
          case 'topLeft':
            delta = (-deltaX - deltaY) / 2;
            break;
          case 'topRight':
            delta = (deltaX - deltaY) / 2;
            break;
          case 'bottomLeft':
            delta = (-deltaX + deltaY) / 2;
            break;
        }

        const scaleFactor = delta / 150; // Slower scaling for device
        const newScale = Math.max(0.3, Math.min(1.5, startScale + scaleFactor));
        onScaleChange(newScale);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const positionStyles = resizeHandleClasses[corner];
    return (
      <div
        className={cn(
          "absolute z-50",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{
          ...(isHovered ? resizeHandleHoverStyle : resizeHandleStyle),
          ...positionStyles,
          transition: `all ${DURATION.fast} ${EASING.gentle}`,
        }}
        onMouseDown={handleResize}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  };

  // File input ref for double-click to change photo
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle double-click to change photo
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Handle file selection from hidden input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, deviceIndex);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

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
    const perspDist = position.perspectiveDistance || 1000;
    const rotateY = position.perspectiveAngle ?? 5;
    const rotateX = position.perspectiveX ?? 0;
    transform.push(`perspective(${perspDist}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
  }

  // Get bezel color based on device color (supports preset IDs and custom hex colors)
  const bezelColors: Record<string, { frame: string; bezel: string }> = {
    // iPhone 16 Pro Colors
    "desert-titanium": { frame: "#C4A77D", bezel: "#8B7355" },
    "natural-titanium": { frame: "#A8A9AD", bezel: "#6E6E73" },
    "white-titanium": { frame: "#F5F5F0", bezel: "#D1D1D1" },
    "black-titanium": { frame: "#3B3B3D", bezel: "#1D1D1F" },
    // iPhone 16 Standard Colors
    "ultramarine": { frame: "#8585FF", bezel: "#5454CD" },
    "teal": { frame: "#54B4B4", bezel: "#3A8080" },
    "pink": { frame: "#F5A5C4", bezel: "#C48098" },
    "white": { frame: "#F5F5F7", bezel: "#E0E0E2" },
    "black": { frame: "#2E2E30", bezel: "#1A1A1C" },
    // Legacy Colors
    "blue-titanium": { frame: "#3C4C5C", bezel: "#2A3642" },
    "space-black": { frame: "#1F1F1F", bezel: "#0D0D0D" },
    "silver": { frame: "#E3E4E6", bezel: "#B0B1B3" },
    "gold": { frame: "#F4E8CE", bezel: "#C1B59C" },
    "deep-purple": { frame: "#4B4453", bezel: "#332D38" },
  };

  // Support custom hex colors - if the color starts with #, use it directly
  // and generate a darker bezel color
  const getBezelColors = (color: string) => {
    if (color.startsWith("#")) {
      // Parse hex and darken for bezel
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const darkenFactor = 0.7;
      const darkerR = Math.round(r * darkenFactor);
      const darkerG = Math.round(g * darkenFactor);
      const darkerB = Math.round(b * darkenFactor);
      const bezel = `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
      return { frame: color, bezel };
    }
    return bezelColors[color] || { frame: "#1F1F1F", bezel: "#0D0D0D" };
  };

  const { frame: frameColor, bezel: bezelColor } = getBezelColors(deviceColor);

  // Canvas dimensions (matching the preview container)
  // Using percentage-based sizing for better responsiveness
  const canvasWidth = 340;

  // Device dimensions - scale is relative to canvas width
  // Base device aspect ratio ~1:2.17 (iPhone proportions)
  // Base width is 45% of canvas to ensure it fits with padding
  const baseDeviceWidth = position.noFrame ? canvasWidth * 0.85 : canvasWidth * 0.45;
  const deviceWidth = baseDeviceWidth * position.scale;
  const deviceHeight = deviceWidth * 2.17;

  // Figma/Canva-style device wrapper styling
  const deviceWrapperStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.position.x * 100}%`,
    top: `${position.position.y * 100}%`,
    transform: transform.join(" ") + (isDragging ? " scale(1.02)" : ""),
    zIndex: isDragging ? 100 : position.zIndex,
    opacity: isDragging ? 0.92 : (position.opacity ?? 1),
    // Smooth Figma-style transitions
    transition: isDragging
      ? "none"
      : `transform ${DURATION.slow} ${EASING.gentle}, opacity ${DURATION.fast} ${EASING.gentle}`,
  };

  return (
    <div style={deviceWrapperStyle}>
      {imageUrl ? (
        <div
          className="relative overflow-hidden group"
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
            // iPhone 15 Pro uses superellipse corners - approximately 22% of width
            borderRadius: position.noFrame
              ? (position.roundedCorners ? `${position.roundedCorners}px` : "0")
              : `${deviceWidth * 0.165}px`, // ~53px for standard size, matches iOS superellipse
            backgroundColor: position.noFrame ? "transparent" : frameColor,
            cursor: onPositionChange ? (isDragging ? "grabbing" : "grab") : "default",
            // Smooth Figma-style transitions
            transition: isDragging
              ? "none"
              : `box-shadow ${DURATION.smooth} ${EASING.gentle}`,
            // Realistic layered shadows matching real device photography + selection
            boxShadow: isDragging
              ? "0 24px 48px rgba(0,0,0,0.35), 0 12px 24px rgba(0,0,0,0.25)" // Canva-style elevation
              : shadow && !position.noFrame
                ? position.floatingShadow
                  ? `0 50px 100px -20px rgba(0,0,0,${shadowOpacity * 0.8}), 0 30px 60px -30px rgba(0,0,0,${shadowOpacity})`
                  : [
                      `inset 0 0 0 1px rgba(255,255,255,0.08)`, // Inner edge highlight
                      `0 1px 2px rgba(0,0,0,0.1)`, // Tight shadow
                      `0 4px 8px rgba(0,0,0,0.15)`, // Close shadow
                      `0 ${shadowBlur / 2}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity * 0.35})`, // Medium shadow
                      `0 ${shadowBlur}px ${shadowBlur * 2}px rgba(0,0,0,${shadowOpacity * 0.25})`, // Far shadow
                    ].join(", ")
                : "none",
            // Selection styling
            outline: isSelected ? "2px solid #0a84ff" : "none",
            outlineOffset: isSelected ? "3px" : "0",
          }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {/* Hidden file input for double-click to change photo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drag indicator - Figma style */}
          {onPositionChange && (
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1c1c1e]/90 border border-[#3a3a3c] opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-[#8e8e93] z-50 pointer-events-none"
              style={{ transition: `opacity ${DURATION.fast} ${EASING.gentle}` }}
            >
              <Move className="w-3 h-3" />
              <span>Drag · Double-click to change</span>
            </div>
          )}

          {/* Side buttons - Accurate iPhone 15 Pro positions */}
          {!position.noFrame && deviceStyle === "realistic" && (
            <>
              {/* Action Button (formerly Mute switch) - 14% from top */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "-3px",
                  top: "14%",
                  width: "3px",
                  height: `${deviceHeight * 0.028}px`, // ~20px
                  backgroundColor: bezelColor,
                  borderRadius: "2px 0 0 2px",
                  boxShadow: `inset 1px 0 1px rgba(255,255,255,0.15), -1px 0 3px rgba(0,0,0,0.4)`,
                }}
              />
              {/* Volume Up - 20% from top */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "-3px",
                  top: "20%",
                  width: "3px",
                  height: `${deviceHeight * 0.055}px`, // ~40px
                  backgroundColor: bezelColor,
                  borderRadius: "2px 0 0 2px",
                  boxShadow: `inset 1px 0 1px rgba(255,255,255,0.15), -1px 0 3px rgba(0,0,0,0.4)`,
                }}
              />
              {/* Volume Down - 29% from top */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "-3px",
                  top: "29%",
                  width: "3px",
                  height: `${deviceHeight * 0.055}px`, // ~40px
                  backgroundColor: bezelColor,
                  borderRadius: "2px 0 0 2px",
                  boxShadow: `inset 1px 0 1px rgba(255,255,255,0.15), -1px 0 3px rgba(0,0,0,0.4)`,
                }}
              />
              {/* Power/Side button - Right side, 22% from top */}
              <div
                className="absolute pointer-events-none"
                style={{
                  right: "-3px",
                  top: "22%",
                  width: "3px",
                  height: `${deviceHeight * 0.082}px`, // ~60px
                  backgroundColor: bezelColor,
                  borderRadius: "0 2px 2px 0",
                  boxShadow: `inset -1px 0 1px rgba(255,255,255,0.15), 1px 0 3px rgba(0,0,0,0.4)`,
                }}
              />
            </>
          )}

          {/* Titanium bezel frame - 1.55mm bezel width (scaled) */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                borderRadius: `${deviceWidth * 0.165}px`,
                border: deviceStyle === "clay"
                  ? `${deviceWidth * 0.022}px solid ${bezelColor}` // ~7px
                  : `${deviceWidth * 0.018}px solid ${bezelColor}`, // ~6px - accurate 1.55mm bezel
                background: deviceStyle === "realistic"
                  ? `linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)`
                  : "transparent",
              }}
            />
          )}

          {/* Screen content - inset matches bezel width */}
          <div
            className={cn(
              "absolute overflow-hidden bg-black",
              position.noFrame ? "inset-0" : ""
            )}
            style={position.noFrame ? {} : {
              top: `${deviceWidth * 0.018}px`,
              left: `${deviceWidth * 0.018}px`,
              right: `${deviceWidth * 0.018}px`,
              bottom: `${deviceWidth * 0.018}px`,
              borderRadius: `${deviceWidth * 0.147}px`, // Inner radius = outer - bezel
            }}
          >
            <img
              src={imageUrl}
              alt="Screenshot"
              className="w-full h-full"
              style={{
                objectFit: imageFit,
                // Center the image when using contain
                objectPosition: 'center center',
              }}
            />
          </div>

          {/* Dynamic Island - iPhone 14/15 Pro: 126×37pt (@3x = 378×111px), ~32% of screen width */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black z-20"
              style={{
                top: `${deviceWidth * 0.035}px`, // ~12px from top
                width: `${deviceWidth * 0.32}px`, // 32% of device width (~126pt scaled)
                height: `${deviceWidth * 0.095}px`, // ~37pt scaled
                borderRadius: `${deviceWidth * 0.0475}px`, // Fully rounded (50% of height)
                boxShadow: "0 0 0 1px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.5)",
              }}
            >
              {/* Front camera - right side of Dynamic Island */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  right: `${deviceWidth * 0.025}px`,
                  width: `${deviceWidth * 0.032}px`,
                  height: `${deviceWidth * 0.032}px`,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #2a2a2e 0%, #0a0a0a 50%, #000 100%)",
                  boxShadow: "inset 0 0 1px rgba(255,255,255,0.1), 0 0 2px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          )}

          {/* Home Indicator - standard iOS: 134×5pt, centered at bottom */}
          {!position.noFrame && deviceStyle !== "none" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20"
              style={{
                bottom: `${deviceWidth * 0.022}px`, // ~8px from bottom
                width: `${deviceWidth * 0.38}px`, // ~134pt scaled
                height: `${deviceWidth * 0.015}px`, // ~5pt
                backgroundColor: "rgba(255,255,255,0.25)",
                borderRadius: `${deviceWidth * 0.0075}px`,
              }}
            />
          )}

          {/* Resize handles for device frame - Figma style */}
          {onScaleChange && (
            <>
              <DeviceResizeHandle corner="topLeft" />
              <DeviceResizeHandle corner="topRight" />
              <DeviceResizeHandle corner="bottomLeft" />
              <DeviceResizeHandle corner="bottomRight" />
            </>
          )}

          {/* Scale indicator */}
          {isSelected && onScaleChange && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1c1c1e]/90 border border-[#3a3a3c] text-[9px] text-[#8e8e93] whitespace-nowrap z-50">
              {Math.round(position.scale * 100)}%
            </div>
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
      fontFamily: string;
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
  onPositionChange?: (newY: number) => void;
  onContentChange?: (newContent: string) => void;
}

function DraggableText({
  text,
  content,
  index,
  isSelected,
  canvasRef,
  onSelect,
  onPositionChange,
  onContentChange,
}: DraggableTextProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dragStartRef = useRef<{ y: number; posY: number } | null>(null);

  // Update editValue when content changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(content);
    }
  }, [content, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContentChange) {
      setIsEditing(true);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (onContentChange && editValue !== content) {
      onContentChange(editValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      // Cmd+Enter or Ctrl+Enter to save and exit
      e.preventDefault();
      setIsEditing(false);
      if (onContentChange && editValue !== content) {
        onContentChange(editValue);
      }
    } else if (e.key === "Escape") {
      // Escape to cancel
      setIsEditing(false);
      setEditValue(content);
    }
    // Regular Enter key will add a new line (default textarea behavior)
  };

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
    if (!isDragging || !canvasRef?.current || !onPositionChange) return;

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

  // Figma/Canva-style wrapper styling
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: `${text.positionY * 100}%`,
    textAlign: text.style.alignment as React.CSSProperties["textAlign"],
    padding: "0 20px",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 50 : "auto",
    // Smooth Figma-style transitions
    transition: isDragging
      ? "none"
      : `transform ${DURATION.smooth} ${EASING.gentle}, top ${DURATION.smooth} ${EASING.gentle}, box-shadow ${DURATION.smooth} ${EASING.gentle}`,
    // Selection styling
    borderRadius: "8px",
    ...(isSelected ? {
      background: "rgba(255,255,255,0.05)",
      outline: "2px solid #0a84ff",
      outlineOffset: "4px",
      boxShadow: "0 0 0 1px rgba(10,132,255,0.1)",
    } : {}),
    // Dragging elevation effect (Canva-style)
    ...(isDragging ? {
      transform: "scale(1.02)",
      opacity: 0.92,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    } : {}),
  };

  return (
    <div
      className="group"
      style={wrapperStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={isEditing ? undefined : handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag indicator - Figma style */}
      <div
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ transition: `opacity ${DURATION.fast} ${EASING.gentle}` }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
          <div className="w-1 h-1 rounded-full bg-[#8e8e93]" />
        </div>
      </div>

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          rows={editValue.split('\n').length || 1}
          className="bg-transparent border-none outline-none w-full resize-none overflow-hidden"
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
            textAlign: text.style.alignment as React.CSSProperties["textAlign"],
          }}
        />
      ) : (
        <span
          className="animate-fadeInUp inline-block select-none whitespace-pre-wrap"
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
            animationDelay: `${index * 100}ms`,
          }}
        >
          {content}
        </span>
      )}
    </div>
  );
}

// University logo data for rendering
const UNIVERSITY_LOGOS: Record<string, { name: string; shortName: string }> = {
  harvard: { name: "Harvard", shortName: "H" },
  stanford: { name: "Stanford", shortName: "S" },
  mit: { name: "MIT", shortName: "MIT" },
  yale: { name: "Yale", shortName: "Y" },
  princeton: { name: "Princeton", shortName: "P" },
  columbia: { name: "Columbia", shortName: "C" },
  berkeley: { name: "Berkeley", shortName: "B" },
  oxford: { name: "Oxford", shortName: "Ox" },
  cambridge: { name: "Cambridge", shortName: "Cam" },
  caltech: { name: "Caltech", shortName: "Cal" },
};

// Press logo data with font styling
const PRESS_LOGOS: Record<string, { name: string; fontStyle?: string; fontWeight?: number; fontFamily?: string }> = {
  nytimes: { name: "The New York Times", fontFamily: "Georgia, serif", fontStyle: "italic" },
  forbes: { name: "Forbes", fontFamily: "Georgia, serif", fontWeight: 700 },
  bbc: { name: "BBC", fontWeight: 700 },
  wsj: { name: "The Wall Street Journal", fontFamily: "Georgia, serif" },
  bloomberg: { name: "Bloomberg", fontWeight: 600 },
  techcrunch: { name: "TechCrunch", fontWeight: 700 },
  wired: { name: "WIRED", fontWeight: 700, fontFamily: "sans-serif" },
  verge: { name: "The Verge", fontWeight: 600 },
  vogue: { name: "VOGUE", fontWeight: 400, fontFamily: "Georgia, serif" },
  nbc: { name: "NBC", fontWeight: 700 },
  cnn: { name: "CNN", fontWeight: 700 },
  today: { name: "TODAY", fontWeight: 700 },
  ellen: { name: "ellen", fontWeight: 300, fontFamily: "sans-serif" },
  producthunt: { name: "Product Hunt", fontWeight: 600 },
  mashable: { name: "Mashable", fontWeight: 700 },
  fastcompany: { name: "Fast Company", fontWeight: 600 },
  inc: { name: "Inc.", fontFamily: "Georgia, serif", fontStyle: "italic" },
  entrepreneur: { name: "Entrepreneur", fontWeight: 600 },
};

// Award types with laurel wreath support
const AWARD_PRESETS: Record<string, { name: string; subtitle?: string }> = {
  "apple-design": { name: "Apple Design Award", subtitle: "Social Impact" },
  "webby": { name: "The Webby Awards" },
  "editors-choice": { name: "Editor's Choice" },
  "app-of-day": { name: "App of the Day" },
  "best-of-year": { name: "Best of 2024" },
  "google-play": { name: "Google Play Best" },
};

// Render stars for rating
function RatingStars({ rating, color }: { rating: number; color: string }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill={i < fullStars || (i === fullStars && hasHalf) ? color : "rgba(255,255,255,0.3)"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Laurel Wreath SVG component
function LaurelWreath({ color = "#1a1a1a", size = 24, flip = false }: { color?: string; size?: number; flip?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M12 22c-1.5-2-2.5-4-3-6.5-.3-1.5-.3-3 0-4.5.5-2 1.5-3.5 3-5M12 22c-2-1-4-2.5-5.5-4.5-1-1.5-1.5-3-1.5-4.5 0-2 1-4 2.5-5.5M12 22c-3-.5-5.5-2-7.5-4-1.5-1.5-2.5-3.5-2.5-5.5 0-1.5.5-3 1.5-4.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Draggable & Resizable Social Proof Element Renderer
interface SocialProofRendererProps {
  element: SocialProofElement;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange?: (x: number, y: number) => void;
  onScaleChange?: (scale: number) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

function SocialProofRenderer({
  element,
  canvasRef,
  onPositionChange,
  onScaleChange,
  isSelected,
  onSelect
}: SocialProofRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const initialScaleRef = useRef<number>(element.style.scale);

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onPositionChange || !canvasRef?.current || isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.();

    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: element.positionX,
      posY: element.positionY,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !onPositionChange || !canvasRef?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !canvasRef?.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
      const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

      const newX = Math.max(0.05, Math.min(0.95, dragStartRef.current.posX + deltaX));
      const newY = Math.max(0.05, Math.min(0.95, dragStartRef.current.posY + deltaY));

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

  if (!element.enabled) return null;

  // Resize handle component - handles all four corners with proper direction
  const ResizeHandle = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
    const handleResize = (e: React.MouseEvent) => {
      if (!onScaleChange || !canvasRef?.current) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect?.();
      setIsResizing(true);
      initialScaleRef.current = element.style.scale;

      const startX = e.clientX;
      const startY = e.clientY;
      const startScale = element.style.scale;

      const handleMouseMove = (moveE: MouseEvent) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;

        // Calculate scale based on corner position
        // bottomRight: positive X and Y increase scale
        // topLeft: negative X and Y increase scale
        // topRight: positive X, negative Y
        // bottomLeft: negative X, positive Y
        let delta = 0;
        switch (position) {
          case 'bottomRight':
            delta = (deltaX + deltaY) / 2;
            break;
          case 'topLeft':
            delta = (-deltaX - deltaY) / 2;
            break;
          case 'topRight':
            delta = (deltaX - deltaY) / 2;
            break;
          case 'bottomLeft':
            delta = (-deltaX + deltaY) / 2;
            break;
        }

        const scaleFactor = delta / 100;
        const newScale = Math.max(0.3, Math.min(3, startScale + scaleFactor));
        onScaleChange(newScale);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const positionStyles = resizeHandleClasses[position];
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="absolute opacity-0 group-hover:opacity-100 z-50"
        style={{
          ...(isHovered ? resizeHandleHoverStyle : resizeHandleStyle),
          ...positionStyles,
          transition: `all ${DURATION.fast} ${EASING.gentle}`,
        }}
        onMouseDown={handleResize}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  };

  // Figma/Canva-style base styling with smooth transitions
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.positionX * 100}%`,
    top: `${element.positionY * 100}%`,
    transform: `translate(-50%, -50%) scale(${element.style.scale})${isDragging ? " scale(1.02)" : ""}`,
    opacity: isDragging ? 0.92 : element.style.opacity,
    zIndex: isDragging || isResizing ? 100 : 20,
    cursor: onPositionChange ? (isDragging ? "grabbing" : "grab") : "default",
    // Smooth Figma-style transitions
    transition: isDragging || isResizing
      ? "none"
      : `transform ${DURATION.smooth} ${EASING.gentle}, box-shadow ${DURATION.smooth} ${EASING.gentle}, opacity ${DURATION.fast} ${EASING.gentle}`,
    borderRadius: "16px",
    // Selection styling
    ...(isSelected ? {
      outline: "2px solid #0a84ff",
      outlineOffset: "3px",
      boxShadow: "0 0 0 1px rgba(10,132,255,0.1), 0 4px 12px rgba(10,132,255,0.15)",
    } : {}),
    // Dragging elevation effect (Canva-style)
    ...(isDragging ? {
      boxShadow: "0 16px 32px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
    } : {}),
  };

  // iOS glassmorphism specifications (from Apple Liquid Glass design)
  // Background: rgba(255,255,255,0.2) - 20% opacity white tint
  // Backdrop filter: blur(4px) to blur(20px)
  // Box shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.35)
  // Border radius: 10px (iOS standard)
  // Border: 1px solid rgba(255,255,255,0.2)
  const containerStyle: React.CSSProperties = {
    backgroundColor: element.style.backgroundColor || "rgba(255, 255, 255, 0.2)",
    backdropFilter: element.style.blur ? `blur(${element.style.blur}px) saturate(180%)` : "blur(10px) saturate(180%)",
    WebkitBackdropFilter: element.style.blur ? `blur(${element.style.blur}px) saturate(180%)` : "blur(10px) saturate(180%)",
    borderRadius: "10px",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  };

  // Wrapper with resize handles
  const ElementWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={baseStyle} onMouseDown={handleMouseDown} className="group">
      {children}
      {/* Resize handles - show on hover/selected */}
      {onScaleChange && (
        <>
          <ResizeHandle position="topLeft" />
          <ResizeHandle position="topRight" />
          <ResizeHandle position="bottomLeft" />
          <ResizeHandle position="bottomRight" />
        </>
      )}
      {/* Scale indicator */}
      {isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1c1c1e]/90 border border-[#3a3a3c] text-[9px] text-[#8e8e93] whitespace-nowrap">
          {Math.round(element.style.scale * 100)}%
        </div>
      )}
    </div>
  );

  switch (element.type) {
    case "rating":
      // iOS typography specifications:
      // Primary text: 17pt Regular
      // Secondary text: 15pt Regular, #3C3C43 @ 60% opacity
      // Tertiary text: 12pt Regular
      return (
        <ElementWrapper>
          <div style={containerStyle}>
            {element.showStars && (
              <RatingStars rating={element.rating || 4.8} color={element.style.secondaryColor} />
            )}
            <span style={{
              color: element.style.color,
              fontSize: "15px", // iOS secondary text size
              fontWeight: 600,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              letterSpacing: "-0.24px", // iOS standard letter spacing
            }}>
              {element.rating?.toFixed(1)}
            </span>
            {element.ratingCount && (
              <span style={{
                color: "rgba(60, 60, 67, 0.6)", // iOS #3C3C43 @ 60% opacity
                fontSize: "12px", // iOS tertiary text size
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                letterSpacing: "-0.08px",
              }}>
                ({element.ratingCount})
              </span>
            )}
          </div>
        </ElementWrapper>
      );

    case "downloads":
      return (
        <ElementWrapper>
          <div style={containerStyle}>
            <svg style={{ width: "14px", height: "14px" }} fill={element.style.secondaryColor} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span style={{
              color: element.style.color,
              fontSize: "15px", // iOS secondary text size
              fontWeight: 600,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              letterSpacing: "-0.24px",
            }}>
              {element.downloadCount || "10M+"} downloads
            </span>
          </div>
        </ElementWrapper>
      );

    case "award":
      // Headspace-style award badge with laurel wreaths
      return (
        <ElementWrapper>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: element.style.backgroundColor || "transparent",
            borderRadius: "8px",
          }}>
            {/* Left laurel */}
            <LaurelWreath color={element.style.color} size={20} />

            {/* Award content */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              {/* Apple logo or award icon */}
              {element.awardType === "editors-choice" || element.awardType === "app-of-the-day" ? (
                <svg style={{ width: "12px", height: "12px", fill: element.style.color }} viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              ) : null}
              <span style={{
                color: element.style.color,
                fontSize: "9px",
                fontWeight: 600,
                textAlign: "center",
                lineHeight: 1.2,
              }}>
                {element.awardText || "Apple Design Award"}
              </span>
              {element.awardType === "apple-design" && (
                <span style={{ color: element.style.secondaryColor, fontSize: "8px", fontWeight: 500 }}>
                  Social Impact
                </span>
              )}
            </div>

            {/* Right laurel */}
            <LaurelWreath color={element.style.color} size={20} flip />
          </div>
        </ElementWrapper>
      );

    case "university":
      return (
        <ElementWrapper>
          <div style={{ ...containerStyle, flexDirection: "column", gap: "4px", padding: "8px 14px" }}>
            {element.logosLabel && (
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {element.logosLabel}
              </span>
            )}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {(element.logos || []).slice(0, 5).map((logoId) => {
                const uni = UNIVERSITY_LOGOS[logoId];
                if (!uni) return null;
                return (
                  <div
                    key={logoId}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: element.style.color,
                    }}
                  >
                    {uni.shortName}
                  </div>
                );
              })}
            </div>
          </div>
        </ElementWrapper>
      );

    case "testimonial":
      // iOS-style testimonial card with accurate specifications
      // Card border-radius: 20px (App Store standard)
      // Shadow: 0 8px 32px rgba(31, 38, 135, 0.15)
      // Typography: SF Pro, 17pt primary, 15pt secondary, 12pt tertiary
      const testimonialStyle = element.testimonialStyle || "card";
      const testimonialRating = element.testimonialRating ?? 5;
      const avatarConfig = element.testimonialAvatar || {
        id: "default",
        initials: element.testimonialAuthor?.split(" ").map(n => n[0]).join("").slice(0, 2) || "JD",
        color: "#6366f1"
      };

      if (testimonialStyle === "bubble") {
        // Speech bubble style with iOS glassmorphism
        return (
          <ElementWrapper>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}>
              {/* Speech bubble with glassmorphism */}
              <div style={{
                backgroundColor: element.style.backgroundColor || "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px) saturate(180%)",
                WebkitBackdropFilter: "blur(10px) saturate(180%)",
                borderRadius: "20px", // iOS card radius
                padding: "14px 18px",
                maxWidth: "200px",
                position: "relative",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}>
                <p style={{
                  color: element.style.color || "#1a1a2e",
                  fontSize: "15px", // iOS secondary text
                  fontWeight: 500,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  lineHeight: 1.4,
                  textAlign: "center",
                  margin: 0,
                  letterSpacing: "-0.24px",
                }}>
                  "{element.testimonialText || "This app changed my life!"}"
                </p>
                {/* Bubble tail */}
                <div style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: `10px solid ${element.style.backgroundColor || "rgba(255, 255, 255, 0.85)"}`,
                }} />
              </div>
              {/* Avatar and name */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: avatarConfig.color || "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}>
                  {avatarConfig.imageUrl ? (
                    <img src={avatarConfig.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    }}>{avatarConfig.initials}</span>
                  )}
                </div>
                <span style={{
                  color: element.style.color || "#fff",
                  fontSize: "12px", // iOS tertiary text
                  fontWeight: 600,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  letterSpacing: "-0.08px",
                }}>
                  {element.testimonialAuthor || "Happy User"}
                </span>
              </div>
            </div>
          </ElementWrapper>
        );
      }

      // Card style (default) - iOS App Store review card style
      return (
        <ElementWrapper>
          <div style={{
            backgroundColor: element.style.backgroundColor || "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px) saturate(180%)",
            WebkitBackdropFilter: "blur(10px) saturate(180%)",
            borderRadius: "20px", // iOS standard card radius
            padding: "16px",
            maxWidth: "220px",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            {/* Header with avatar and name */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}>
              {/* Avatar - iOS style with 22.2% corner radius for squircle effect */}
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: avatarConfig.color || "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
                {avatarConfig.imageUrl ? (
                  <img src={avatarConfig.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  }}>{avatarConfig.initials}</span>
                )}
              </div>
              {/* Name and stars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{
                  color: element.style.color || "#1a1a2e",
                  fontSize: "15px", // iOS secondary text
                  fontWeight: 600,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  letterSpacing: "-0.24px",
                }}>
                  {element.testimonialAuthor || "Happy User"}
                </span>
                {/* Star rating - iOS style */}
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill={star <= testimonialRating ? element.style.secondaryColor || "#FF9500" : "#e0e0e0"}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            {/* Quote - iOS body text */}
            <p style={{
              color: element.style.color || "#1a1a2e",
              fontSize: "15px", // iOS secondary text
              fontWeight: 400,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              lineHeight: 1.47, // iOS standard line height
              margin: 0,
              letterSpacing: "-0.24px",
              opacity: 0.85,
            }}>
              "{element.testimonialText || "This app changed my life!"}"
            </p>
          </div>
        </ElementWrapper>
      );

    case "press":
      // Headspace-style vertical press logos
      return (
        <ElementWrapper>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            backgroundColor: element.style.backgroundColor || "transparent",
            borderRadius: "12px",
          }}>
            {(element.pressLogos || []).map((logoId) => {
              const logo = PRESS_LOGOS[logoId];
              if (!logo) return null;
              return (
                <span
                  key={logoId}
                  style={{
                    color: element.style.color,
                    fontSize: "14px",
                    fontWeight: logo.fontWeight || 400,
                    fontStyle: logo.fontStyle || "normal",
                    fontFamily: logo.fontFamily || "inherit",
                    opacity: 0.85,
                    letterSpacing: logo.name === "VOGUE" ? "3px" : logo.name === "WIRED" ? "2px" : "normal",
                  }}
                >
                  {logo.name}
                </span>
              );
            })}
          </div>
        </ElementWrapper>
      );

    case "trusted-by":
      // iOS-style social proof with overlapping avatar stack (facepile)
      // Using iOS glassmorphism and typography specifications
      const defaultAvatars: { initials: string; color: string; imageUrl?: string }[] = [
        { initials: "JD", color: "#FF6B6B" },
        { initials: "AS", color: "#4ECDC4" },
        { initials: "MK", color: "#45B7D1" },
        { initials: "RL", color: "#96CEB4" },
        { initials: "TC", color: "#FFEAA7" },
      ];
      const avatarsToShow = element.avatars?.length ? element.avatars : defaultAvatars.map((a, i) => ({
        id: `default-${i}`,
        initials: a.initials,
        color: a.color,
        imageUrl: a.imageUrl,
      }));
      const avatarSize = 32; // Slightly larger for better visibility
      const avatarOverlap = 10;
      const borderWidth = 2;
      const borderColor = element.style.borderColor || "#ffffff";
      const overflowCount = element.avatarOverflow ?? 99;

      return (
        <ElementWrapper>
          <div style={{
            ...containerStyle,
            flexDirection: "column",
            gap: "10px",
            padding: "16px 20px",
            backgroundColor: element.style.backgroundColor || "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px) saturate(180%)",
            WebkitBackdropFilter: "blur(10px) saturate(180%)",
            borderRadius: "20px", // iOS card radius
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            {/* Avatar Stack (Facepile) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: `${avatarOverlap}px`,
              }}>
                {avatarsToShow.slice(0, 5).map((avatar, index) => (
                  <div
                    key={avatar.id}
                    style={{
                      width: `${avatarSize}px`,
                      height: `${avatarSize}px`,
                      borderRadius: "50%",
                      border: `${borderWidth}px solid ${borderColor}`,
                      marginLeft: index === 0 ? 0 : `-${avatarOverlap}px`,
                      zIndex: 10 - index,
                      overflow: "hidden",
                      backgroundColor: avatar.color || "#6366f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    {avatar.imageUrl ? (
                      <img
                        src={avatar.imageUrl}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#ffffff",
                        textTransform: "uppercase",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                      }}>
                        {avatar.initials || "?"}
                      </span>
                    )}
                  </div>
                ))}
                {/* Overflow count badge */}
                {overflowCount > 0 && (
                  <div
                    style={{
                      width: `${avatarSize}px`,
                      height: `${avatarSize}px`,
                      borderRadius: "50%",
                      border: `${borderWidth}px solid ${borderColor}`,
                      marginLeft: `-${avatarOverlap}px`,
                      zIndex: 5,
                      backgroundColor: "#1a1a2e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#ffffff",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    }}>
                      +{overflowCount > 999 ? "999" : overflowCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Text - iOS typography */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}>
              <span style={{
                color: element.style.color || "#1a1a2e",
                fontSize: "15px", // iOS secondary text
                fontWeight: 700,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                letterSpacing: "-0.24px",
              }}>
                {element.downloadCount || "2M+"} users
              </span>
              <span style={{
                color: "rgba(60, 60, 67, 0.6)", // iOS secondary label color
                fontSize: "12px", // iOS tertiary text
                fontWeight: 500,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                letterSpacing: "-0.08px",
              }}>
                Trust this app
              </span>
            </div>
          </div>
        </ElementWrapper>
      );

    case "feature-cards":
      // iOS-style feature cards grid with glassmorphism
      // Card radius: 16px (iOS card standard)
      // Shadow: 0 8px 32px rgba(31, 38, 135, 0.15)
      const cards = element.featureCards || [];
      const columns = cards.length <= 4 ? 2 : cards.length <= 6 ? 2 : 3;
      return (
        <ElementWrapper>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "10px",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}>
            {cards.map((card) => (
              <div
                key={card.id}
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "16px", // iOS card radius
                  backgroundColor: card.color,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Decorative background pattern */}
                {card.iconType === "dots" && (
                  <div style={{ position: "absolute", top: "8px", right: "8px", opacity: 0.4 }}>
                    <div style={{ display: "flex", gap: "3px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "white" }} />
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "white" }} />
                    </div>
                  </div>
                )}
                {card.iconType === "stars" && (
                  <div style={{ position: "absolute", top: "8px", right: "8px", opacity: 0.5 }}>
                    <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                      <path d="M12 2L9.5 9.5H2l6 4.5-2.5 7.5L12 17l6.5 4.5-2.5-7.5 6-4.5h-7.5L12 2z"/>
                    </svg>
                  </div>
                )}
                {card.iconType === "circles" && (
                  <div style={{ position: "absolute", bottom: "-10px", left: "-10px", opacity: 0.3 }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid white" }} />
                  </div>
                )}
                {card.iconType === "waves" && (
                  <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", opacity: 0.3 }}>
                    <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0 20 Q25 5 50 15 T100 10 V20 Z" fill="white"/>
                    </svg>
                  </div>
                )}

                {/* Label - iOS typography */}
                <span style={{
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 600,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  textAlign: "center",
                  zIndex: 1,
                  textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  letterSpacing: "-0.08px",
                }}>
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        </ElementWrapper>
      );

    default:
      return null;
  }
}

// ============================================
// BADGE OVERLAY RENDERER
// ============================================

// Badge text presets
const BADGE_PRESETS: Record<string, { text: string; subtext?: string }> = {
  'new': { text: 'NEW!' },
  'sale': { text: 'SALE', subtext: '50% OFF' },
  'featured': { text: '#1 APP' },
  'editors-choice': { text: "Editor's Choice" },
  'trending': { text: 'TRENDING' },
  'best-seller': { text: 'BEST SELLER' },
  'free': { text: 'FREE' },
  'premium': { text: 'PREMIUM' },
  'custom': { text: 'CUSTOM' },
};

interface BadgeOverlayRendererProps {
  badge: BadgeOverlayElement;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange?: (x: number, y: number) => void;
  onScaleChange?: (scale: number) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

function BadgeOverlayRenderer({
  badge,
  canvasRef,
  onPositionChange,
  onScaleChange,
  isSelected,
  onSelect
}: BadgeOverlayRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const initialScaleRef = useRef<number>(badge.style.scale);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onPositionChange || !canvasRef?.current || isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.();

    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: badge.positionX,
      posY: badge.positionY,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !onPositionChange || !canvasRef?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !canvasRef?.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
      const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

      const newX = Math.max(0.02, Math.min(0.98, dragStartRef.current.posX + deltaX));
      const newY = Math.max(0.02, Math.min(0.98, dragStartRef.current.posY + deltaY));

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

  if (!badge.enabled) return null;

  const preset = BADGE_PRESETS[badge.type];
  const displayText = badge.text || preset.text;
  const displaySubtext = badge.subtext || preset.subtext;

  // Resize handle component
  const ResizeHandle = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
    const handleResize = (e: React.MouseEvent) => {
      if (!onScaleChange || !canvasRef?.current) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect?.();
      setIsResizing(true);
      initialScaleRef.current = badge.style.scale;

      const startX = e.clientX;
      const startY = e.clientY;
      const startScale = badge.style.scale;

      const handleMouseMove = (moveE: MouseEvent) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;

        let delta = 0;
        switch (position) {
          case 'bottomRight': delta = (deltaX + deltaY) / 2; break;
          case 'topLeft': delta = (-deltaX - deltaY) / 2; break;
          case 'topRight': delta = (deltaX - deltaY) / 2; break;
          case 'bottomLeft': delta = (-deltaX + deltaY) / 2; break;
        }

        const scaleFactor = delta / 100;
        const newScale = Math.max(0.3, Math.min(3, startScale + scaleFactor));
        onScaleChange(newScale);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const positionStyles = resizeHandleClasses[position];
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="absolute opacity-0 group-hover:opacity-100 z-50"
        style={{
          ...(isHovered ? resizeHandleHoverStyle : resizeHandleStyle),
          ...positionStyles,
          transition: `all ${DURATION.fast} ${EASING.gentle}`,
        }}
        onMouseDown={handleResize}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  };

  // Base wrapper styles
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    left: `${badge.positionX * 100}%`,
    top: `${badge.positionY * 100}%`,
    transform: `translate(-50%, -50%) scale(${badge.style.scale}) rotate(${badge.style.rotation}deg)${isDragging ? " scale(1.02)" : ""}`,
    opacity: isDragging ? 0.92 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transition: isDragging ? "none" : `all ${DURATION.normal} ${EASING.gentle}`,
    zIndex: isDragging ? 100 : 30,
    outline: isSelected ? "2px solid #0a84ff" : "none",
    outlineOffset: "4px",
  };

  // Render different badge styles
  const renderBadge = () => {
    const { variant, backgroundColor, textColor, borderColor, shadow, pulse } = badge.style;

    const baseTextStyle: React.CSSProperties = {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
      fontWeight: 700,
      color: textColor,
      textTransform: variant === 'burst' ? 'uppercase' : 'none',
      letterSpacing: variant === 'burst' ? '0.5px' : '-0.2px',
    };

    switch (variant) {
      case 'pill':
        return (
          <div style={{
            background: backgroundColor,
            borderRadius: "24px",
            padding: "8px 20px",
            boxShadow: shadow ? "0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)" : "none",
            border: borderColor ? `2px solid ${borderColor}` : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}>
            <span style={{ ...baseTextStyle, fontSize: "14px" }}>{displayText}</span>
            {displaySubtext && (
              <span style={{ ...baseTextStyle, fontSize: "10px", opacity: 0.9 }}>{displaySubtext}</span>
            )}
          </div>
        );

      case 'ribbon':
        return (
          <div style={{
            position: "relative",
            background: backgroundColor,
            padding: "8px 24px",
            boxShadow: shadow ? "0 4px 12px rgba(0,0,0,0.25)" : "none",
            clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%)",
          }}>
            <span style={{ ...baseTextStyle, fontSize: "13px" }}>{displayText}</span>
          </div>
        );

      case 'corner':
        return (
          <div style={{
            width: "100px",
            height: "100px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "18px",
              right: "-32px",
              width: "120px",
              background: backgroundColor,
              padding: "6px 0",
              transform: "rotate(45deg)",
              transformOrigin: "center",
              textAlign: "center",
              boxShadow: shadow ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
            }}>
              <span style={{ ...baseTextStyle, fontSize: "11px" }}>{displayText}</span>
            </div>
          </div>
        );

      case 'burst':
        // Starburst/explosion badge
        return (
          <div style={{
            position: "relative",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Starburst background */}
            <svg viewBox="0 0 100 100" style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              filter: shadow ? "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" : "none",
            }}>
              <polygon
                points="50,0 61,35 97,35 68,57 79,91 50,70 21,91 32,57 3,35 39,35"
                fill={backgroundColor}
                stroke={borderColor || "none"}
                strokeWidth={borderColor ? "2" : "0"}
              />
            </svg>
            <div style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              lineHeight: 1.1,
            }}>
              <span style={{ ...baseTextStyle, fontSize: "12px", display: "block" }}>{displayText}</span>
              {displaySubtext && (
                <span style={{ ...baseTextStyle, fontSize: "9px", display: "block", marginTop: "2px" }}>{displaySubtext}</span>
              )}
            </div>
          </div>
        );

      case 'tag':
        return (
          <div style={{
            display: "flex",
            alignItems: "center",
            background: backgroundColor,
            borderRadius: "4px 20px 20px 4px",
            padding: "6px 16px 6px 12px",
            boxShadow: shadow ? "0 3px 10px rgba(0,0,0,0.2)" : "none",
            border: borderColor ? `1px solid ${borderColor}` : "none",
          }}>
            {/* Tag hole */}
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              marginRight: "8px",
              border: "1px solid rgba(0,0,0,0.1)",
            }} />
            <span style={{ ...baseTextStyle, fontSize: "12px" }}>{displayText}</span>
          </div>
        );

      default:
        return (
          <div style={{
            background: backgroundColor,
            borderRadius: "8px",
            padding: "8px 16px",
            boxShadow: shadow ? "0 4px 12px rgba(0,0,0,0.25)" : "none",
          }}>
            <span style={{ ...baseTextStyle, fontSize: "14px" }}>{displayText}</span>
          </div>
        );
    }
  };

  return (
    <div
      className="group"
      style={wrapperStyle}
      onMouseDown={handleMouseDown}
    >
      {renderBadge()}

      {/* Resize handles */}
      {isSelected && (
        <>
          <ResizeHandle position="topLeft" />
          <ResizeHandle position="topRight" />
          <ResizeHandle position="bottomLeft" />
          <ResizeHandle position="bottomRight" />
        </>
      )}
    </div>
  );
}

// iOS Notification Renderer - Realistic iOS notifications
interface NotificationRendererProps {
  notification: NotificationElement;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange?: (x: number, y: number) => void;
  onScaleChange?: (scale: number) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

function NotificationRenderer({
  notification,
  canvasRef,
  onPositionChange,
  onScaleChange,
  isSelected,
  onSelect
}: NotificationRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onPositionChange || !canvasRef?.current || isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.();

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: notification.positionX,
      posY: notification.positionY,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !onPositionChange || !canvasRef?.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !canvasRef?.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
      const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

      const newX = Math.max(0.05, Math.min(0.95, dragStartRef.current.posX + deltaX));
      const newY = Math.max(0.05, Math.min(0.95, dragStartRef.current.posY + deltaY));

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

  if (!notification.enabled) return null;

  const isDark = notification.style.dark;

  // Resize handle for notifications - handles all four corners with proper direction
  const ResizeHandle = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleResize = (e: React.MouseEvent) => {
      if (!onScaleChange) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect?.();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startScale = notification.style.scale;

      const handleMouseMove = (moveE: MouseEvent) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;

        // Calculate scale based on corner position
        let delta = 0;
        switch (position) {
          case 'bottomRight':
            delta = (deltaX + deltaY) / 2;
            break;
          case 'topLeft':
            delta = (-deltaX - deltaY) / 2;
            break;
          case 'topRight':
            delta = (deltaX - deltaY) / 2;
            break;
          case 'bottomLeft':
            delta = (-deltaX + deltaY) / 2;
            break;
        }

        const scaleFactor = delta / 100;
        const newScale = Math.max(0.3, Math.min(3, startScale + scaleFactor));
        onScaleChange(newScale);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const positionStyles = resizeHandleClasses[position];
    return (
      <div
        className="absolute opacity-0 group-hover:opacity-100 z-50"
        style={{
          ...(isHovered ? resizeHandleHoverStyle : resizeHandleStyle),
          ...positionStyles,
          transition: `all ${DURATION.fast} ${EASING.gentle}`,
        }}
        onMouseDown={handleResize}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  };

  // iOS notification uses SF Pro font - these are the exact iOS specifications:
  // - App icon: 38×38 pt (notification size from Apple HIG)
  // - App name: 13pt SF Pro Text Semibold
  // - Title: 15pt SF Pro Text Semibold
  // - Message: 15pt SF Pro Text Regular
  // - Time: 13pt SF Pro Text Regular, secondary color
  // - Corner radius: 13pt (iOS standard for notifications)
  // - Padding: 12pt
  // - Blur: UIBlurEffect.Style.systemMaterial (~20px)

  // Figma/Canva-style base styling with smooth transitions
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    left: `${notification.positionX * 100}%`,
    top: `${notification.positionY * 100}%`,
    transform: `translate(-50%, -50%) scale(${notification.style.scale})${isDragging ? " scale(1.02)" : ""}`,
    opacity: isDragging ? 0.92 : notification.style.opacity,
    zIndex: isDragging || isResizing ? 100 : 25,
    cursor: onPositionChange ? (isDragging ? "grabbing" : "grab") : "default",
    // Smooth Figma-style transitions
    transition: isDragging || isResizing
      ? "none"
      : `transform ${DURATION.smooth} ${EASING.gentle}, box-shadow ${DURATION.smooth} ${EASING.gentle}, opacity ${DURATION.fast} ${EASING.gentle}`,
    borderRadius: "13px",
    // Selection styling
    ...(isSelected ? {
      outline: "2px solid #0a84ff",
      outlineOffset: "4px",
      boxShadow: "0 0 0 1px rgba(10,132,255,0.1), 0 4px 12px rgba(10,132,255,0.15)",
    } : {}),
    // Dragging elevation effect (Canva-style)
    ...(isDragging ? {
      boxShadow: "0 16px 32px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
    } : {}),
  };

  return (
    <div
      className="group"
      style={wrapperStyle}
      onMouseDown={handleMouseDown}
    >
      {/* iOS Notification Banner - Accurate iOS 17 specifications */}
      <div
        style={{
          width: "340px", // Standard notification width on iPhone
          backgroundColor: isDark
            ? "rgba(28, 28, 30, 0.82)" // iOS dark material
            : "rgba(255, 255, 255, 0.82)", // iOS light material
          backdropFilter: `blur(${notification.style.blur || 25}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${notification.style.blur || 25}px) saturate(180%)`,
          borderRadius: "13px", // iOS notification corner radius
          padding: "12px", // 12pt padding
          boxShadow: isDark
            ? "0 0 0 0.5px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.35)"
            : "0 0 0 0.5px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          {/* App Icon - 38×38 pt with iOS superellipse corners (22% radius) */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8.4px", // 38 × 0.222 = 8.4 (iOS icon corner formula)
              backgroundColor: "#007AFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
            }}
          >
            {notification.appIcon || "📱"}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header row - App name and time */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1px" }}>
              <span
                style={{
                  fontSize: "13px", // iOS app name size
                  fontWeight: 600, // Semibold
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(60,60,67,0.6)", // iOS secondary label
                  letterSpacing: "-0.08px",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                {notification.appName || "App Name"}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(60,60,67,0.4)", // iOS tertiary label
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                {notification.time || "now"}
              </span>
            </div>

            {/* Title - 15pt Semibold */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: "2px",
                letterSpacing: "-0.24px",
                lineHeight: 1.27, // 19pt line height / 15pt
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
            >
              {notification.title || "Notification Title"}
            </div>

            {/* Message - 15pt Regular */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: 400,
                color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
                lineHeight: 1.27,
                letterSpacing: "-0.24px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
            >
              {notification.message || "This is the notification message that appears below the title."}
            </div>
          </div>
        </div>
      </div>

      {/* Resize handles */}
      {onScaleChange && (
        <>
          <ResizeHandle position="topLeft" />
          <ResizeHandle position="topRight" />
          <ResizeHandle position="bottomLeft" />
          <ResizeHandle position="bottomRight" />
        </>
      )}

      {/* Scale indicator */}
      {isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1c1c1e]/90 border border-[#3a3a3c] text-[9px] text-[#8e8e93] whitespace-nowrap">
          {Math.round(notification.style.scale * 100)}%
        </div>
      )}
    </div>
  );
}

export function Canvas() {
  const {
    project,
    selectedScreenshotId,
    selectScreenshot,
    currentLocale,
    setScreenshotImage,
    selectText,
    selectedTextId,
    updateDevice,
    updateDeviceAll,
    updateText,
    updateTextTranslation,
    updateSocialProof,
    updateNotification,
    updateBadge,
    updateScreenshotLayout,
    canvasState,
    setZoom,
    setPan,
  } = useEditorStore();

  // Sync device settings to all screenshots by default
  const [syncDeviceToAll, setSyncDeviceToAll] = useState(true);

  const [selectedSocialProofId, setSelectedSocialProofId] = useState<string | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const [deviceImages, setDeviceImages] = useState<Record<number, string>>({});
  const [customDevicePosition, setCustomDevicePosition] = useState({ x: 0.5, y: 0.55 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  // Handle wheel zoom (Cmd/Ctrl + scroll)
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only zoom when Cmd/Ctrl is held
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, canvasState.zoom * delta));
      setZoom(newZoom);
    }
  }, [canvasState.zoom, setZoom]);

  // Handle space key for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture space when user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.code === "Space" && !e.repeat && !isTyping) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle pan start (space + drag or middle mouse)
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (isSpacePressed || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: canvasState.panX,
        panY: canvasState.panY,
      };
    }
  }, [isSpacePressed, canvasState.panX, canvasState.panY]);

  // Handle pan move
  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panStartRef.current) return;
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      setPan(panStartRef.current.panX + deltaX, panStartRef.current.panY + deltaY);
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      panStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, setPan]);

  // Attach wheel event to canvas container
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Snap guides state (Figma-style)
  const [snapGuides, setSnapGuides] = useState<{
    showCenterH: boolean;
    showCenterV: boolean;
    customGuides: { type: 'horizontal' | 'vertical'; position: number }[];
  }>({ showCenterH: false, showCenterV: false, customGuides: [] });

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

  // Handle device position change with snap guides
  // Position is always per-screenshot (not synced)
  const handleDevicePositionChange = useCallback(
    (x: number, y: number) => {
      if (selectedScreenshotId) {
        // Check for snap to center
        const snapX = getSnapPosition(x, [0.5]);
        const snapY = getSnapPosition(y, [0.5]);

        // Apply snap if near center
        const finalX = snapX !== null ? snapX : x;
        const finalY = snapY !== null ? snapY : y;

        // Show/hide snap guides
        setSnapGuides({
          showCenterV: snapX !== null || isNearSnap(x, 0.5),
          showCenterH: snapY !== null || isNearSnap(y, 0.5),
          customGuides: [],
        });

        setCustomDevicePosition({ x: finalX, y: finalY });
        // Position is independent per screenshot - never sync to all
        updateDevice(selectedScreenshotId, { positionX: finalX, positionY: finalY });
        // Switch to custom layout when dragging (per-screenshot)
        const currentScreenshot = project.screenshots.find(s => s.id === selectedScreenshotId);
        if (currentScreenshot?.layout !== "custom") {
          updateScreenshotLayout(selectedScreenshotId, "custom");
        }
      }
    },
    [selectedScreenshotId, updateDevice, updateScreenshotLayout, project.screenshots]
  );

  // Handle device scale change (for resize handles)
  const handleDeviceScaleChange = useCallback(
    (scale: number) => {
      if (selectedScreenshotId) {
        // Sync to all screenshots if toggle is on
        if (syncDeviceToAll) {
          updateDeviceAll({ scale });
        } else {
          updateDevice(selectedScreenshotId, { scale });
        }
        // Switch to custom layout when resizing (per-screenshot)
        const currentScreenshot = project.screenshots.find(s => s.id === selectedScreenshotId);
        if (currentScreenshot?.layout !== "custom") {
          updateScreenshotLayout(selectedScreenshotId, "custom");
        }
      }
    },
    [selectedScreenshotId, updateDevice, updateDeviceAll, syncDeviceToAll, updateScreenshotLayout, project.screenshots]
  );

  // Clear snap guides when drag ends
  const clearSnapGuides = useCallback(() => {
    setSnapGuides({ showCenterH: false, showCenterV: false, customGuides: [] });
  }, []);

  // Global mouseup listener to clear snap guides
  useEffect(() => {
    const handleMouseUp = () => {
      // Delay slightly to allow final position update
      setTimeout(clearSnapGuides, 50);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [clearSnapGuides]);

  // Handle text position change
  const handleTextPositionChange = useCallback(
    (textId: string, newY: number) => {
      if (selectedScreenshotId) {
        updateText(selectedScreenshotId, textId, { positionY: newY });
      }
    },
    [selectedScreenshotId, updateText]
  );

  // Handle social proof position change with snap guides
  const handleSocialProofPositionChange = useCallback(
    (elementId: string, x: number, y: number) => {
      if (selectedScreenshotId) {
        // Check for snap to center
        const snapX = getSnapPosition(x, [0.5]);
        const snapY = getSnapPosition(y, [0.5]);

        // Apply snap if near center
        const finalX = snapX !== null ? snapX : x;
        const finalY = snapY !== null ? snapY : y;

        // Show/hide snap guides
        setSnapGuides({
          showCenterV: snapX !== null || isNearSnap(x, 0.5),
          showCenterH: snapY !== null || isNearSnap(y, 0.5),
          customGuides: [],
        });

        updateSocialProof(selectedScreenshotId, elementId, { positionX: finalX, positionY: finalY });
      }
    },
    [selectedScreenshotId, updateSocialProof]
  );

  // Handle social proof scale change
  const handleSocialProofScaleChange = useCallback(
    (elementId: string, scale: number) => {
      if (selectedScreenshotId) {
        updateSocialProof(selectedScreenshotId, elementId, { style: { ...selectedScreenshot?.socialProof?.find(sp => sp.id === elementId)?.style, scale } } as any);
      }
    },
    [selectedScreenshotId, updateSocialProof, selectedScreenshot]
  );

  // Handle notification position change with snap guides
  const handleNotificationPositionChange = useCallback(
    (notificationId: string, x: number, y: number) => {
      if (selectedScreenshotId) {
        // Check for snap to center
        const snapX = getSnapPosition(x, [0.5]);
        const snapY = getSnapPosition(y, [0.5]);

        // Apply snap if near center
        const finalX = snapX !== null ? snapX : x;
        const finalY = snapY !== null ? snapY : y;

        // Show/hide snap guides
        setSnapGuides({
          showCenterV: snapX !== null || isNearSnap(x, 0.5),
          showCenterH: snapY !== null || isNearSnap(y, 0.5),
          customGuides: [],
        });

        updateNotification(selectedScreenshotId, notificationId, { positionX: finalX, positionY: finalY });
      }
    },
    [selectedScreenshotId, updateNotification]
  );

  // Handle notification scale change
  const handleNotificationScaleChange = useCallback(
    (notificationId: string, scale: number) => {
      if (selectedScreenshotId) {
        const notification = selectedScreenshot?.notifications?.find(n => n.id === notificationId);
        if (notification) {
          updateNotification(selectedScreenshotId, notificationId, { style: { ...notification.style, scale } });
        }
      }
    },
    [selectedScreenshotId, updateNotification, selectedScreenshot]
  );

  // Handle badge position change with snap guides
  const handleBadgePositionChange = useCallback(
    (badgeId: string, x: number, y: number) => {
      if (selectedScreenshotId) {
        // Check for snap to center
        const snapX = getSnapPosition(x, [0.5]);
        const snapY = getSnapPosition(y, [0.5]);

        // Apply snap if near center
        const finalX = snapX !== null ? snapX : x;
        const finalY = snapY !== null ? snapY : y;

        // Show/hide snap guides
        setSnapGuides({
          showCenterV: snapX !== null || isNearSnap(x, 0.5),
          showCenterH: snapY !== null || isNearSnap(y, 0.5),
          customGuides: [],
        });

        updateBadge(selectedScreenshotId, badgeId, { positionX: finalX, positionY: finalY });
      }
    },
    [selectedScreenshotId, updateBadge]
  );

  // Handle badge scale change
  const handleBadgeScaleChange = useCallback(
    (badgeId: string, scale: number) => {
      if (selectedScreenshotId) {
        const badge = selectedScreenshot?.badges?.find(b => b.id === badgeId);
        if (badge) {
          updateBadge(selectedScreenshotId, badgeId, { style: { ...badge.style, scale } });
        }
      }
    },
    [selectedScreenshotId, updateBadge, selectedScreenshot]
  );

  const handleImageUpload = useCallback(
    async (file: File, deviceIndex: number) => {
      if (selectedScreenshotId) {
        try {
          const result = await uploadApi.upload(file);
          // For main device (index 0), use existing store method
          if (deviceIndex === 0) {
            // Pass both url and path - path is needed for export
            setScreenshotImage(selectedScreenshotId, result.url, result.path);
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

  const { template, device, image, texts, socialProof, notifications, layout: screenshotLayout } = selectedScreenshot;
  // Use screenshot's layout or fall back to "custom" if not set
  const currentLayoutId = screenshotLayout || "custom";
  const layout = LAYOUTS[currentLayoutId] || LAYOUTS["single-center"];

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
  } else if (bg.type === "pattern" && bg.patternConfig) {
    // Pattern background using SVG data URIs
    const { type: patternType, color, backgroundColor, size, opacity } = bg.patternConfig;
    backgroundStyle.backgroundColor = backgroundColor;
    backgroundStyle.backgroundImage = getPatternSVG(patternType, color, opacity);
    backgroundStyle.backgroundSize = `${size}px ${size}px`;
    backgroundStyle.backgroundRepeat = 'repeat';
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
                  // Store layout on the current screenshot only
                  if (selectedScreenshotId) {
                    updateScreenshotLayout(selectedScreenshotId, id);
                    // When selecting a preset, update the device position
                    if (id !== "custom" && layoutDef.devices[0]) {
                      const presetPos = layoutDef.devices[0].position;
                      const presetScale = layoutDef.devices[0].scale;
                      const presetRotation = layoutDef.devices[0].rotation;
                      setCustomDevicePosition(presetPos);
                      // Layout applies only to current screenshot - no syncing
                      const updates = {
                        positionX: presetPos.x,
                        positionY: presetPos.y,
                        ...(presetScale !== undefined && { scale: presetScale }),
                        ...(presetRotation !== undefined && { rotation: presetRotation }),
                      };
                      updateDevice(selectedScreenshotId, updates);
                    }
                  }
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200",
                  currentLayoutId === id
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

      {/* Canvas area - horizontal scrollable for all screenshots */}
      <div
        ref={canvasContainerRef}
        className={cn(
          "flex-1 p-4 md:p-6 overflow-auto relative",
          isSpacePressed ? "cursor-grab" : "",
          isPanning ? "cursor-grabbing" : ""
        )}
        onMouseDown={handlePanStart}
      >
        <div
          className="flex items-center gap-6 min-h-full px-4 transition-transform duration-100"
          style={{
            minWidth: "max-content",
            transform: `scale(${canvasState.zoom}) translate(${canvasState.panX / canvasState.zoom}px, ${canvasState.panY / canvasState.zoom}px)`,
            transformOrigin: "center center",
          }}
        >
          {project.screenshots.map((screenshot, screenshotIndex) => {
            const isSelected = screenshot.id === selectedScreenshotId;
            const screenshotBg = getScreenshotBackgroundStyle(screenshot);

            return (
              <div
                key={screenshot.id}
                className={cn(
                  "relative flex-shrink-0 cursor-pointer transition-all duration-200",
                  isSelected ? "scale-100" : "scale-95 opacity-80 hover:opacity-100 hover:scale-[0.97]"
                )}
                style={{ width: "280px" }}
                onClick={() => selectScreenshot(screenshot.id)}
              >
                {/* Screenshot number badge */}
                <div className={cn(
                  "absolute -top-3 left-4 z-20 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg",
                  isSelected
                    ? "bg-[#0a84ff] text-white"
                    : "bg-[#2c2c2e] text-[#a1a1a6]"
                )}>
                  {screenshotIndex + 1}
                </div>

                {/* Ambient shadow */}
                <div
                  className="absolute inset-0 rounded-[24px] blur-2xl opacity-15 scale-95"
                  style={screenshotBg}
                />

                {/* Screenshot frame */}
                <div
                  ref={isSelected ? canvasRef : undefined}
                  data-screenshot-id={screenshot.id}
                  data-screenshot-index={screenshotIndex}
                  className={cn(
                    "relative bg-[#1c1c1e] rounded-[20px] overflow-hidden w-full screenshot-export-frame",
                    isSelected && "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-[#0a0a0a]"
                  )}
                  style={{
                    aspectRatio: SCREENSHOT_ASPECT_RATIO,
                    boxShadow: isSelected
                      ? "0 20px 60px -15px rgba(0,0,0,0.5), 0 8px 25px -8px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)"
                      : "0 10px 40px -10px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.03)",
                    ...screenshotBg,
                  }}
                >
                  {/* Text elements - render from this screenshot's texts */}
                  {screenshot.texts.map((text, textIndex) => {
                    const content = text.translations[currentLocale] || text.translations["en"] || "";
                    return (
                      <DraggableText
                        key={text.id}
                        text={text}
                        content={content}
                        index={textIndex}
                        isSelected={isSelected && selectedTextId === text.id}
                        canvasRef={isSelected ? canvasRef : { current: null }}
                        onSelect={() => {
                          selectScreenshot(screenshot.id);
                          selectText(text.id);
                        }}
                        onPositionChange={isSelected ? (newY) => handleTextPositionChange(text.id, newY) : undefined}
                        onContentChange={(newContent) => updateTextTranslation(screenshot.id, text.id, currentLocale, newContent)}
                      />
                    );
                  })}

                  {/* Device Frames - render ALL devices from layout */}
                  {(() => {
                    // Get this screenshot's layout
                    const screenshotLayoutId = screenshot.layout || "custom";
                    const screenshotLayoutDef = LAYOUTS[screenshotLayoutId] || LAYOUTS["single-center"];

                    return screenshotLayoutDef.devices.map((devicePosition, deviceIdx) => {
                    const screenshotDevice = screenshot.device;
                    const screenshotImage = screenshot.image;

                    // For custom layout or first device, use the store's position/scale
                    // For multi-device layouts, use the preset positions exactly
                    const position = (screenshotLayoutId === "custom" && deviceIdx === 0)
                      ? {
                          ...devicePosition,
                          position: { x: screenshotDevice.positionX, y: screenshotDevice.positionY },
                          scale: screenshotDevice.scale,
                          rotation: screenshotDevice.rotation,
                        }
                      : devicePosition;

                    return (
                      <DeviceFrame
                        key={deviceIdx}
                        imageUrl={screenshotImage?.url}
                        imageFit={screenshotImage?.fit || 'contain'}
                        position={position}
                        deviceColor={screenshotDevice.color}
                        deviceStyle={screenshotDevice.style}
                        shadow={screenshotDevice.shadow}
                        shadowBlur={screenshotDevice.shadowBlur}
                        shadowOpacity={screenshotDevice.shadowOpacity}
                        onUpload={isSelected ? handleImageUpload : () => {}}
                        deviceIndex={deviceIdx}
                        isSelected={isSelected}
                        onPositionChange={isSelected ? handleDevicePositionChange : undefined}
                        onScaleChange={isSelected ? handleDeviceScaleChange : undefined}
                        canvasRef={isSelected ? canvasRef : { current: null }}
                      />
                    );
                  });
                  })()}

                  {/* Social Proof Elements - render from this screenshot */}
                  {screenshot.socialProof?.map((element) => (
                    <SocialProofRenderer
                      key={element.id}
                      element={element}
                      canvasRef={isSelected ? canvasRef : { current: null }}
                      isSelected={isSelected && selectedSocialProofId === element.id}
                      onSelect={() => {
                        selectScreenshot(screenshot.id);
                        setSelectedSocialProofId(element.id);
                        setSelectedNotificationId(null);
                        setSelectedBadgeId(null);
                        selectText(null);
                      }}
                      onPositionChange={isSelected ? (x, y) => handleSocialProofPositionChange(element.id, x, y) : undefined}
                      onScaleChange={isSelected ? (scale) => handleSocialProofScaleChange(element.id, scale) : undefined}
                    />
                  ))}

                  {/* iOS Notifications - render from this screenshot */}
                  {screenshot.notifications?.map((notification) => (
                    <NotificationRenderer
                      key={notification.id}
                      notification={notification}
                      canvasRef={isSelected ? canvasRef : { current: null }}
                      isSelected={isSelected && selectedNotificationId === notification.id}
                      onSelect={() => {
                        selectScreenshot(screenshot.id);
                        setSelectedNotificationId(notification.id);
                        setSelectedSocialProofId(null);
                        setSelectedBadgeId(null);
                        selectText(null);
                      }}
                      onPositionChange={isSelected ? (x, y) => handleNotificationPositionChange(notification.id, x, y) : undefined}
                      onScaleChange={isSelected ? (scale) => handleNotificationScaleChange(notification.id, scale) : undefined}
                    />
                  ))}

                  {/* Badge Overlays - render from this screenshot */}
                  {screenshot.badges?.map((badge) => (
                    <BadgeOverlayRenderer
                      key={badge.id}
                      badge={badge}
                      canvasRef={isSelected ? canvasRef : { current: null }}
                      isSelected={isSelected && selectedBadgeId === badge.id}
                      onSelect={() => {
                        selectScreenshot(screenshot.id);
                        setSelectedBadgeId(badge.id);
                        setSelectedSocialProofId(null);
                        setSelectedNotificationId(null);
                        selectText(null);
                      }}
                      onPositionChange={isSelected ? (x, y) => handleBadgePositionChange(badge.id, x, y) : undefined}
                      onScaleChange={isSelected ? (scale) => handleBadgeScaleChange(badge.id, scale) : undefined}
                    />
                  ))}

                  {/* Snap guides overlay - Figma style */}
                  {isSelected && (snapGuides.showCenterH || snapGuides.showCenterV || snapGuides.customGuides.length > 0) && (
                    <SnapGuidesOverlay
                      showCenterH={snapGuides.showCenterH}
                      showCenterV={snapGuides.showCenterV}
                      customGuides={snapGuides.customGuides}
                    />
                  )}

              {/* Click to deselect text, social proof, notifications, and badges */}
              <div
                className="absolute inset-0"
                onClick={(e) => {
                  e.stopPropagation();
                  selectText(null);
                  setSelectedSocialProofId(null);
                  setSelectedNotificationId(null);
                  setSelectedBadgeId(null);
                }}
                style={{ zIndex: -1 }}
              />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function to get background style for a screenshot
function getScreenshotBackgroundStyle(screenshot: ScreenshotConfig): React.CSSProperties {
  const bg = screenshot.template.background;
  const style: React.CSSProperties = {};

  if (bg.type === "solid") {
    style.backgroundColor = bg.color || "#1c1c1e";
  } else if (bg.type === "gradient" && bg.gradient) {
    const { type: gradType, angle, stops, center_x, center_y } = bg.gradient;
    const gradientStops = stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");

    if (gradType === "radial") {
      const cx = (center_x ?? 0.5) * 100;
      const cy = (center_y ?? 0.5) * 100;
      style.background = `radial-gradient(circle at ${cx}% ${cy}%, ${gradientStops})`;
    } else if (gradType === "conic") {
      const cx = (center_x ?? 0.5) * 100;
      const cy = (center_y ?? 0.5) * 100;
      style.background = `conic-gradient(from ${angle || 0}deg at ${cx}% ${cy}%, ${gradientStops})`;
    } else {
      style.background = `linear-gradient(${angle}deg, ${gradientStops})`;
    }
  } else if (bg.type === "mesh" && bg.color_points) {
    const meshGradients = bg.color_points.map((point) => {
      const x = point.x * 100;
      const y = point.y * 100;
      const size = point.radius * 100;
      return `radial-gradient(circle at ${x}% ${y}%, ${point.color} 0%, transparent ${size}%)`;
    });
    style.background = meshGradients.join(", ");
    style.backgroundColor = bg.color_points[0]?.color || "#1c1c1e";
  } else if (bg.type === "glassmorphism" || bg.type === "blobs") {
    const gradients: string[] = [];
    if (bg.blobs) {
      bg.blobs.forEach((blob) => {
        const x = blob.x * 100;
        const y = blob.y * 100;
        const size = blob.size * 80;
        gradients.push(`radial-gradient(circle at ${x}% ${y}%, ${blob.color} 0%, transparent ${size}%)`);
      });
    }
    if (bg.base_gradient && bg.base_gradient.stops) {
      const baseStops = bg.base_gradient.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
      gradients.push(`linear-gradient(${bg.base_gradient.angle || 135}deg, ${baseStops})`);
    }
    style.background = gradients.join(", ");
    style.backgroundColor = bg.base_color || "#0D0D1A";
  } else if (bg.type === "pattern" && bg.patternConfig) {
    const { type: patternType, color, backgroundColor, size, opacity } = bg.patternConfig;
    style.backgroundColor = backgroundColor;
    style.backgroundImage = getPatternSVG(patternType, color, opacity);
    style.backgroundSize = `${size}px ${size}px`;
    style.backgroundRepeat = 'repeat';
  }

  return style;
}
