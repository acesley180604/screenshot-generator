"use client";

import type { ScreenshotConfig, LayoutDevicePosition } from "@/types";

// ============================================
// LAYOUTS - Exact copy from Canvas.tsx
// ============================================
const LAYOUTS: Record<string, { devices: LayoutDevicePosition[] }> = {
  "custom": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "single-center": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "single-left": { devices: [{ position: { x: 0.32, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "single-right": { devices: [{ position: { x: 0.68, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "angled-right": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: 8, zIndex: 1, perspective: true }] },
  "angled-left": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: -8, zIndex: 1, perspective: true }] },
  "floating-3d": { devices: [{ position: { x: 0.5, y: 0.52 }, scale: 0.75, rotation: 5, zIndex: 1, perspective: true, floatingShadow: true }] },
  "isometric-left": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: -25, perspectiveX: 5, perspectiveDistance: 800 }] },
  "isometric-right": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: 25, perspectiveX: 5, perspectiveDistance: 800 }] },
  "dramatic-left": { devices: [{ position: { x: 0.55, y: 0.55 }, scale: 0.7, rotation: -3, zIndex: 1, perspective: true, perspectiveAngle: -35, perspectiveX: 10, perspectiveDistance: 600 }] },
  "dramatic-right": { devices: [{ position: { x: 0.45, y: 0.55 }, scale: 0.7, rotation: 3, zIndex: 1, perspective: true, perspectiveAngle: 35, perspectiveX: 10, perspectiveDistance: 600 }] },
  "top-down": { devices: [{ position: { x: 0.5, y: 0.55 }, scale: 0.8, rotation: 0, zIndex: 1, perspective: true, perspectiveAngle: 0, perspectiveX: 25, perspectiveDistance: 700 }] },
  "showcase-3d": { devices: [{ position: { x: 0.5, y: 0.52 }, scale: 0.72, rotation: -5, zIndex: 1, perspective: true, perspectiveAngle: 15, perspectiveX: 8, perspectiveDistance: 900, floatingShadow: true }] },
  "duo-overlap": { devices: [{ position: { x: 0.38, y: 0.58 }, scale: 0.7, rotation: -5, zIndex: 1 }, { position: { x: 0.62, y: 0.52 }, scale: 0.7, rotation: 5, zIndex: 2 }] },
  "duo-side-by-side": { devices: [{ position: { x: 0.3, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 }, { position: { x: 0.7, y: 0.55 }, scale: 0.55, rotation: 0, zIndex: 1 }] },
  "duo-stacked": { devices: [{ position: { x: 0.45, y: 0.6 }, scale: 0.65, rotation: -3, zIndex: 1, opacity: 0.7 }, { position: { x: 0.55, y: 0.5 }, scale: 0.7, rotation: 3, zIndex: 2 }] },
  "trio-cascade": { devices: [{ position: { x: 0.25, y: 0.62 }, scale: 0.5, rotation: -8, zIndex: 1 }, { position: { x: 0.5, y: 0.5 }, scale: 0.55, rotation: 0, zIndex: 2 }, { position: { x: 0.75, y: 0.62 }, scale: 0.5, rotation: 8, zIndex: 1 }] },
  "trio-fan": { devices: [{ position: { x: 0.3, y: 0.58 }, scale: 0.45, rotation: -15, zIndex: 1 }, { position: { x: 0.5, y: 0.52 }, scale: 0.5, rotation: 0, zIndex: 2 }, { position: { x: 0.7, y: 0.58 }, scale: 0.45, rotation: 15, zIndex: 1 }] },
  "bottom-peek": { devices: [{ position: { x: 0.5, y: 0.85 }, scale: 0.9, rotation: 0, zIndex: 1 }] },
  "top-peek": { devices: [{ position: { x: 0.5, y: 0.25 }, scale: 0.9, rotation: 0, zIndex: 1 }] },
  "left-edge": { devices: [{ position: { x: 0.15, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "right-edge": { devices: [{ position: { x: 0.85, y: 0.55 }, scale: 0.75, rotation: 0, zIndex: 1 }] },
  "left-edge-tilted": { devices: [{ position: { x: 0.18, y: 0.58 }, scale: 0.72, rotation: 8, zIndex: 1 }] },
  "right-edge-tilted": { devices: [{ position: { x: 0.82, y: 0.58 }, scale: 0.72, rotation: -8, zIndex: 1 }] },
  "corner-left": { devices: [{ position: { x: 0.22, y: 0.72 }, scale: 0.7, rotation: 12, zIndex: 1 }] },
  "corner-right": { devices: [{ position: { x: 0.78, y: 0.72 }, scale: 0.7, rotation: -12, zIndex: 1 }] },
  "dual-edge": { devices: [{ position: { x: 0.12, y: 0.6 }, scale: 0.55, rotation: 5, zIndex: 1 }, { position: { x: 0.88, y: 0.6 }, scale: 0.55, rotation: -5, zIndex: 1 }] },
  "artsy-scatter": { devices: [{ position: { x: 0.15, y: 0.25 }, scale: 0.32, rotation: -15, zIndex: 1 }, { position: { x: 0.75, y: 0.18 }, scale: 0.28, rotation: 20, zIndex: 2 }, { position: { x: 0.35, y: 0.45 }, scale: 0.38, rotation: 5, zIndex: 3 }, { position: { x: 0.82, y: 0.55 }, scale: 0.35, rotation: -10, zIndex: 2 }, { position: { x: 0.22, y: 0.75 }, scale: 0.33, rotation: 12, zIndex: 1 }, { position: { x: 0.65, y: 0.78 }, scale: 0.30, rotation: -8, zIndex: 2 }] },
  "artsy-collage": { devices: [{ position: { x: 0.25, y: 0.3 }, scale: 0.42, rotation: -12, zIndex: 2 }, { position: { x: 0.7, y: 0.25 }, scale: 0.38, rotation: 15, zIndex: 1 }, { position: { x: 0.45, y: 0.65 }, scale: 0.45, rotation: 3, zIndex: 3 }, { position: { x: 0.85, y: 0.7 }, scale: 0.35, rotation: -18, zIndex: 1 }] },
  "dmv-hero": { devices: [{ position: { x: 0.28, y: 0.55 }, scale: 0.65, rotation: 0, zIndex: 3 }, { position: { x: 0.72, y: 0.35 }, scale: 0.35, rotation: 10, zIndex: 1 }, { position: { x: 0.85, y: 0.65 }, scale: 0.32, rotation: -5, zIndex: 2 }] },
  "crypto-trio": { devices: [{ position: { x: 0.18, y: 0.55 }, scale: 0.5, rotation: -5, zIndex: 1 }, { position: { x: 0.5, y: 0.5 }, scale: 0.55, rotation: 0, zIndex: 2 }, { position: { x: 0.82, y: 0.55 }, scale: 0.5, rotation: 5, zIndex: 1 }] },
  "calendar-quad": { devices: [{ position: { x: 0.2, y: 0.35 }, scale: 0.4, rotation: -8, zIndex: 1 }, { position: { x: 0.55, y: 0.3 }, scale: 0.42, rotation: 5, zIndex: 2 }, { position: { x: 0.35, y: 0.7 }, scale: 0.38, rotation: 3, zIndex: 2 }, { position: { x: 0.75, y: 0.65 }, scale: 0.4, rotation: -6, zIndex: 1 }] },
  "parenting-five": { devices: [{ position: { x: 0.15, y: 0.3 }, scale: 0.35, rotation: -10, zIndex: 1 }, { position: { x: 0.5, y: 0.25 }, scale: 0.4, rotation: 5, zIndex: 2 }, { position: { x: 0.85, y: 0.35 }, scale: 0.35, rotation: 12, zIndex: 1 }, { position: { x: 0.3, y: 0.7 }, scale: 0.38, rotation: -5, zIndex: 2 }, { position: { x: 0.7, y: 0.72 }, scale: 0.36, rotation: 8, zIndex: 1 }] },
  "showcase-single": { devices: [{ position: { x: 0.5, y: 0.58 }, scale: 0.68, rotation: 0, zIndex: 1 }] },
  "hero-right": { devices: [{ position: { x: 0.72, y: 0.55 }, scale: 0.65, rotation: 0, zIndex: 3 }, { position: { x: 0.28, y: 0.35 }, scale: 0.35, rotation: -10, zIndex: 1 }, { position: { x: 0.15, y: 0.65 }, scale: 0.32, rotation: 5, zIndex: 2 }] },
  "diagonal-stack": { devices: [{ position: { x: 0.25, y: 0.7 }, scale: 0.45, rotation: -12, zIndex: 1 }, { position: { x: 0.45, y: 0.5 }, scale: 0.5, rotation: -5, zIndex: 2 }, { position: { x: 0.7, y: 0.35 }, scale: 0.48, rotation: 3, zIndex: 3 }] },
  "floating-duo": { devices: [{ position: { x: 0.35, y: 0.45 }, scale: 0.52, rotation: -8, zIndex: 1, floatingShadow: true }, { position: { x: 0.68, y: 0.58 }, scale: 0.55, rotation: 6, zIndex: 2, floatingShadow: true }] },
  "edge-peek": { devices: [{ position: { x: 0.08, y: 0.5 }, scale: 0.55, rotation: 8, zIndex: 1 }, { position: { x: 0.55, y: 0.55 }, scale: 0.6, rotation: 0, zIndex: 2 }] },
  "cross-panel": { devices: [{ position: { x: 0.92, y: 0.55 }, scale: 0.65, rotation: -5, zIndex: 2 }] },
};

// ============================================
// BEZEL COLORS - Exact copy from Canvas.tsx
// ============================================
const BEZEL_COLORS: Record<string, { frame: string; bezel: string }> = {
  "desert-titanium": { frame: "#C4A77D", bezel: "#8B7355" },
  "natural-titanium": { frame: "#A8A9AD", bezel: "#6E6E73" },
  "white-titanium": { frame: "#F5F5F0", bezel: "#D1D1D1" },
  "black-titanium": { frame: "#3B3B3D", bezel: "#1D1D1F" },
  "ultramarine": { frame: "#8585FF", bezel: "#5454CD" },
  "teal": { frame: "#54B4B4", bezel: "#3A8080" },
  "pink": { frame: "#F5A0C0", bezel: "#D47A9A" },
  "white": { frame: "#F5F5F0", bezel: "#E0E0E0" },
  "black": { frame: "#1D1D1F", bezel: "#0D0D0D" },
};

function getBezelColors(color: string): { frame: string; bezel: string } {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const darkerR = Math.max(0, Math.floor(r * 0.7));
    const darkerG = Math.max(0, Math.floor(g * 0.7));
    const darkerB = Math.max(0, Math.floor(b * 0.7));
    const bezel = `#${darkerR.toString(16).padStart(2, "0")}${darkerG.toString(16).padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;
    return { frame: color, bezel };
  }
  return BEZEL_COLORS[color] || { frame: "#1F1F1F", bezel: "#0D0D0D" };
}

// ============================================
// IMAGE LOADING
// ============================================
async function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Try without crossOrigin
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = () => resolve(null);
      img2.src = url;
    };
    img.src = url;
  });
}

// ============================================
// DRAWING HELPERS
// ============================================
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ============================================
// PATTERN SVG - Exact copy from Canvas.tsx
// ============================================
function getPatternSVG(type: string, color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgba = `rgba(${r},${g},${b},${opacity})`;

  switch (type) {
    case 'dots': return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='${encodeURIComponent(rgba)}'/%3E%3C/svg%3E")`;
    case 'grid': return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0H0v30' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'lines': return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='40' y2='20' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'diagonal-lines': return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L20 0M-5 5L5 -5M15 25L25 15' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'cross': return `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0v25M0 12.5h25' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'waves': return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30c15-10 30 10 60 0' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='2'/%3E%3C/svg%3E")`;
    case 'circles': return `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='15' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'diamonds': return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,0 30,15 15,30 0,15' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'triangles': return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='20,5 35,35 5,35' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'hexagons': return `url("data:image/svg+xml,%3Csvg width='50' height='44' viewBox='0 0 50 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='25,0 50,11 50,33 25,44 0,33 0,11' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'checkerboard': return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='15' height='15' fill='${encodeURIComponent(rgba)}'/%3E%3Crect x='15' y='15' width='15' height='15' fill='${encodeURIComponent(rgba)}'/%3E%3C/svg%3E")`;
    case 'zigzag': return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15L15 0L30 15L15 30Z' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1'/%3E%3C/svg%3E")`;
    default: return 'none';
  }
}

// Load pattern as image for canvas
async function loadPatternImage(type: string, color: string, opacity: number, size: number): Promise<HTMLImageElement | null> {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgba = `rgba(${r},${g},${b},${opacity})`;

  let svgContent = '';
  switch (type) {
    case 'dots': svgContent = `<svg width='${size}' height='${size}' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><circle cx='10' cy='10' r='2' fill='${rgba}'/></svg>`; break;
    case 'grid': svgContent = `<svg width='${size}' height='${size}' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'><path d='M30 0H0v30' fill='none' stroke='${rgba}' stroke-width='1'/></svg>`; break;
    case 'triangles': svgContent = `<svg width='${size}' height='${size}' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'><polygon points='20,5 35,35 5,35' fill='none' stroke='${rgba}' stroke-width='1'/></svg>`; break;
    case 'diagonal-lines': svgContent = `<svg width='${size}' height='${size}' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path d='M0 20L20 0M-5 5L5 -5M15 25L25 15' stroke='${rgba}' stroke-width='1'/></svg>`; break;
    default: return null;
  }

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);
  return img;
}

// ============================================
// BACKGROUND DRAWING
// ============================================
async function drawBackground(ctx: CanvasRenderingContext2D, bg: ScreenshotConfig["template"]["background"], width: number, height: number) {
  console.log("[Export] Drawing background:", bg.type, bg);

  if (bg.type === "solid") {
    ctx.fillStyle = bg.color || "#1c1c1e";
    ctx.fillRect(0, 0, width, height);
    console.log("[Export] Drew solid background:", bg.color);
  } else if (bg.type === "gradient" && bg.gradient) {
    const { type: gradType, angle = 180, stops, center_x = 0.5, center_y = 0.5 } = bg.gradient;
    let gradient: CanvasGradient;

    if (gradType === "radial") {
      const cx = center_x * width;
      const cy = center_y * height;
      const radius = Math.max(width, height) * 0.8;
      gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    } else if (gradType === "conic") {
      // Canvas doesn't support conic, approximate with radial
      const cx = center_x * width;
      const cy = center_y * height;
      gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
    } else {
      const angleRad = ((angle - 90) * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(angleRad) * width;
      const y1 = height / 2 - Math.sin(angleRad) * height;
      const x2 = width / 2 + Math.cos(angleRad) * width;
      const y2 = height / 2 + Math.sin(angleRad) * height;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    stops.forEach(s => gradient.addColorStop(s.position, s.color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

  } else if (bg.type === "mesh" && bg.color_points) {
    ctx.fillStyle = bg.color_points[0]?.color || "#1c1c1e";
    ctx.fillRect(0, 0, width, height);

    bg.color_points.forEach(point => {
      const cx = point.x * width;
      const cy = point.y * height;
      const radius = point.radius * Math.max(width, height);
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, point.color);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

  } else if ((bg.type === "glassmorphism" || bg.type === "blobs") && bg.blobs) {
    // Draw base
    if (bg.base_gradient?.stops) {
      const angle = bg.base_gradient.angle || 135;
      const angleRad = ((angle - 90) * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(angleRad) * width;
      const y1 = height / 2 - Math.sin(angleRad) * height;
      const x2 = width / 2 + Math.cos(angleRad) * width;
      const y2 = height / 2 + Math.sin(angleRad) * height;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      bg.base_gradient.stops.forEach(s => gradient.addColorStop(s.position, s.color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = bg.base_color || "#0D0D1A";
      ctx.fillRect(0, 0, width, height);
    }

    // Draw blobs
    bg.blobs.forEach(blob => {
      const cx = blob.x * width;
      const cy = blob.y * height;
      const size = blob.size * Math.max(width, height) * 0.4;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

  } else if (bg.type === "pattern" && bg.patternConfig) {
    const { type: patternType, color, backgroundColor, size, opacity } = bg.patternConfig;
    console.log("[Export] Pattern background:", patternType, backgroundColor);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Load and tile pattern
    const patternImg = await loadPatternImage(patternType, color, opacity, size * (width / CANVAS_PREVIEW_WIDTH));
    if (patternImg) {
      const pattern = ctx.createPattern(patternImg, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
  } else {
    console.log("[Export] Fallback background, bg.type:", bg.type);
    ctx.fillStyle = "#1c1c1e";
    ctx.fillRect(0, 0, width, height);
  }
}

// ============================================
// CONSTANTS - Must match Canvas.tsx
// ============================================
const CANVAS_PREVIEW_WIDTH = 340; // Canvas.tsx preview width

// ============================================
// TEXT DRAWING
// ============================================
function drawTexts(ctx: CanvasRenderingContext2D, texts: ScreenshotConfig["texts"], locale: string, width: number, height: number) {
  texts.forEach(text => {
    const content = text.translations[locale] || text.translations["en"] || "";
    if (!content) return;

    // Scale font size: Canvas.tsx uses (fontSize / 3.5) on 340px canvas
    // For export: (fontSize / 3.5) * (exportWidth / 340) = fontSize * exportWidth / 1190
    const fontSize = (text.style.fontSize / 3.5) * (width / CANVAS_PREVIEW_WIDTH);
    const fontWeight = text.style.fontWeight;
    const fontFamily = text.style.fontFamily || "-apple-system, BlinkMacSystemFont, sans-serif";

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = text.style.color;
    ctx.textAlign = text.style.alignment as CanvasTextAlign || "center";
    ctx.textBaseline = "top";

    const x = text.style.alignment === "left" ? width * 0.075 : text.style.alignment === "right" ? width * 0.925 : width / 2;
    const y = text.positionY * height;

    // Word wrap
    const maxWidth = width * 0.85;
    const words = content.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * (text.style.lineHeight || 1.2);
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  });
}

// ============================================
// DEVICE FRAME DRAWING
// ============================================
async function drawDeviceFrame(
  ctx: CanvasRenderingContext2D,
  position: LayoutDevicePosition,
  device: ScreenshotConfig["device"],
  image: ScreenshotConfig["image"],
  width: number,
  height: number,
  isCustomLayout: boolean
) {
  const { frame: frameColor, bezel: bezelColor } = getBezelColors(device.color);
  const showFrame = device.style !== "none";

  // Position (use device values for custom layout, otherwise use position from layout)
  const posX = isCustomLayout ? device.positionX : position.position.x;
  const posY = isCustomLayout ? device.positionY : position.position.y;
  const scale = isCustomLayout ? device.scale : position.scale;
  const rotation = isCustomLayout ? device.rotation : position.rotation;

  // Device dimensions (matching Canvas.tsx: 45% of width, 2.17 aspect ratio)
  const baseWidth = position.noFrame ? width * 0.85 : width * 0.45;
  const deviceWidth = baseWidth * scale;
  const deviceHeight = deviceWidth * 2.17;

  // Position
  const centerX = posX * width;
  const centerY = posY * height;

  // Corner radii (matching Canvas.tsx)
  const cornerRadius = position.noFrame ? (position.roundedCorners || 0) : deviceWidth * 0.165;
  const bezelWidth = deviceWidth * 0.018;
  const screenRadius = deviceWidth * 0.147;

  ctx.save();

  // Apply transformations
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.globalAlpha = position.opacity ?? 1;

  // Device shadow - scale based on export size vs preview size
  const scaleFactor = width / CANVAS_PREVIEW_WIDTH;
  if (device.shadow && showFrame) {
    ctx.shadowColor = `rgba(0,0,0,${device.shadowOpacity * 0.35})`;
    ctx.shadowBlur = device.shadowBlur * scaleFactor;
    ctx.shadowOffsetY = device.shadowBlur * scaleFactor * 0.5;
  }

  // Draw frame background
  if (showFrame) {
    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, -deviceWidth / 2, -deviceHeight / 2, deviceWidth, deviceHeight, cornerRadius);
    ctx.fill();
  }

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw bezel border
  if (showFrame) {
    ctx.strokeStyle = bezelColor;
    ctx.lineWidth = bezelWidth;
    drawRoundedRect(ctx, -deviceWidth / 2, -deviceHeight / 2, deviceWidth, deviceHeight, cornerRadius);
    ctx.stroke();
  }

  // Screen area
  const screenX = showFrame ? -deviceWidth / 2 + bezelWidth : -deviceWidth / 2;
  const screenY = showFrame ? -deviceHeight / 2 + bezelWidth : -deviceHeight / 2;
  const screenW = showFrame ? deviceWidth - bezelWidth * 2 : deviceWidth;
  const screenH = showFrame ? deviceHeight - bezelWidth * 2 : deviceHeight;

  // Clip to screen
  ctx.save();
  drawRoundedRect(ctx, screenX, screenY, screenW, screenH, showFrame ? screenRadius : 0);
  ctx.clip();

  // Screen background
  ctx.fillStyle = "#000";
  ctx.fillRect(screenX, screenY, screenW, screenH);

  // Draw image
  console.log("[Export] Drawing image inside device, url:", image?.url);
  if (image?.url) {
    const img = await loadImage(image.url);
    console.log("[Export] Image loaded:", img ? `${img.width}x${img.height}` : "FAILED TO LOAD");
    if (img) {
      const fit = image.fit || "cover";
      const imgAspect = img.width / img.height;
      const screenAspect = screenW / screenH;

      let drawX = screenX, drawY = screenY, drawW = screenW, drawH = screenH;

      if (fit === "contain") {
        if (imgAspect > screenAspect) {
          drawH = screenW / imgAspect;
          drawY = screenY + (screenH - drawH) / 2;
        } else {
          drawW = screenH * imgAspect;
          drawX = screenX + (screenW - drawW) / 2;
        }
      } else if (fit === "cover") {
        if (imgAspect > screenAspect) {
          drawW = screenH * imgAspect;
          drawX = screenX + (screenW - drawW) / 2;
        } else {
          drawH = screenW / imgAspect;
          drawY = screenY + (screenH - drawH) / 2;
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
  }

  ctx.restore();

  // Dynamic Island
  if (showFrame) {
    const diW = deviceWidth * 0.32;
    const diH = deviceWidth * 0.095;
    const diY = -deviceHeight / 2 + deviceWidth * 0.035;

    ctx.fillStyle = "#000";
    drawRoundedRect(ctx, -diW / 2, diY, diW, diH, diH / 2);
    ctx.fill();
  }

  // Home Indicator
  if (showFrame) {
    const hiW = deviceWidth * 0.38;
    const hiH = deviceWidth * 0.015;
    const hiY = deviceHeight / 2 - deviceWidth * 0.05;

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    drawRoundedRect(ctx, -hiW / 2, hiY, hiW, hiH, hiH / 2);
    ctx.fill();
  }

  ctx.restore();
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================
export async function exportScreenshotAsBlob(
  screenshot: ScreenshotConfig,
  locale: string,
  width: number,
  height: number,
  format: "png" | "jpeg" = "png",
  quality: number = 95
): Promise<Blob> {
  console.log("[Export] Starting export for screenshot:", screenshot.id);
  console.log("[Export] Layout:", screenshot.layout);
  console.log("[Export] Device:", screenshot.device);
  console.log("[Export] Image:", screenshot.image);
  console.log("[Export] Background type:", screenshot.template.background.type);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get canvas context");

  // 1. Draw background
  await drawBackground(ctx, screenshot.template.background, width, height);

  // 2. Draw text elements
  drawTexts(ctx, screenshot.texts, locale, width, height);

  // 3. Draw device frames
  const layoutId = screenshot.layout || "custom";
  const layout = LAYOUTS[layoutId] || LAYOUTS["single-center"];
  const isCustomLayout = layoutId === "custom";
  console.log("[Export] Using layout:", layoutId, "isCustom:", isCustomLayout);

  // Sort by zIndex
  const sortedDevices = [...layout.devices].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

  for (const devicePosition of sortedDevices) {
    await drawDeviceFrame(ctx, devicePosition, screenshot.device, screenshot.image, width, height, isCustomLayout);
  }

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error("Failed to create blob")),
      format === "jpeg" ? "image/jpeg" : "image/png",
      quality / 100
    );
  });
}

// ============================================
// FIND SCREENSHOT ELEMENTS (for compatibility)
// ============================================
export function findScreenshotElements(): Map<string, HTMLElement> {
  const elements = new Map<string, HTMLElement>();
  document.querySelectorAll("[data-screenshot-id]").forEach(frame => {
    const id = frame.getAttribute("data-screenshot-id");
    if (id) elements.set(id, frame as HTMLElement);
  });
  return elements;
}
