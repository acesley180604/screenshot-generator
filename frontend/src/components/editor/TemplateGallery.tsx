"use client";

import React, { useState, useMemo } from "react";
import { useEditorStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Palette, Sparkles, Grid3X3, Search, X, Check, Copy,
  Smartphone, Layers, RotateCw, Move, Maximize, Box,
  ChevronRight, Eye, Layout
} from "lucide-react";
import type { BackgroundConfig } from "@/types";

// Device layout configuration
interface DeviceLayout {
  // Primary device
  position: { x: number; y: number }; // 0-1 percentage
  scale: number; // 0.3 - 1.2
  rotation: number; // degrees
  perspective?: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  // Optional second device for dual layouts
  secondDevice?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
    perspective?: {
      rotateX: number;
      rotateY: number;
      rotateZ: number;
    };
  };
  // Text positioning
  textPosition: 'top' | 'bottom' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  textAlign?: 'left' | 'center' | 'right';
  // Special effects
  bleed?: 'none' | 'bottom' | 'top' | 'left' | 'right'; // Device extends beyond edge
  shadow?: 'none' | 'soft' | 'strong' | 'glow';
}

// Layout preset types
type LayoutPresetType =
  | 'centered'           // Device centered
  | 'bottom-center'      // Device at bottom, text top
  | 'bottom-bleed'       // Device cut off at bottom
  | 'top-bleed'          // Device cut off at top
  | 'tilted-left'        // Device tilted left
  | 'tilted-right'       // Device tilted right
  | 'perspective-left'   // 3D perspective left
  | 'perspective-right'  // 3D perspective right
  | 'floating'           // Floating with shadow
  | 'side-by-side'       // Two devices
  | 'overlap-stack'      // Two devices overlapping
  | 'full-screen'        // No device frame
  | 'small-centered'     // Small device in center
  | 'large-hero'         // Large prominent device
  | 'left-edge'          // Device at left edge (crosses to prev screenshot)
  | 'right-edge'         // Device at right edge (crosses to next screenshot)
  | 'left-edge-tilted'   // Device at left edge, tilted
  | 'right-edge-tilted'  // Device at right edge, tilted
  | 'dual-edge'          // Two devices at edges
  | 'corner-left'        // Device in bottom-left corner
  | 'corner-right'       // Device in bottom-right corner
  // App Store multi-device layouts
  | 'artsy-scatter'      // 6 devices scattered (like Artsy)
  | 'artsy-collage'      // 4 devices collage
  | 'dmv-hero'           // Hero device left with 2 smaller
  | 'crypto-trio'        // 3 devices in row
  | 'calendar-quad'      // 4 devices grid
  | 'parenting-five'     // 5 devices spread
  | 'showcase-single'    // Single showcase device
  | 'hero-right'         // Hero device right with 2 smaller
  | 'diagonal-stack'     // 3 devices diagonal
  | 'floating-duo'       // 2 floating devices
  | 'edge-peek'          // Edge peek with center device
  | 'cross-panel';       // Device crossing to next panel

// Layout presets
const LAYOUT_PRESETS: Record<LayoutPresetType, DeviceLayout> = {
  'centered': {
    position: { x: 0.5, y: 0.55 },
    scale: 0.7,
    rotation: 0,
    textPosition: 'top',
    shadow: 'soft',
  },
  'bottom-center': {
    position: { x: 0.5, y: 0.72 },
    scale: 0.75,
    rotation: 0,
    textPosition: 'top',
    shadow: 'soft',
  },
  'bottom-bleed': {
    position: { x: 0.5, y: 0.85 },
    scale: 0.85,
    rotation: 0,
    textPosition: 'top',
    bleed: 'bottom',
    shadow: 'soft',
  },
  'top-bleed': {
    position: { x: 0.5, y: 0.25 },
    scale: 0.85,
    rotation: 0,
    textPosition: 'bottom',
    bleed: 'top',
    shadow: 'soft',
  },
  'tilted-left': {
    position: { x: 0.55, y: 0.58 },
    scale: 0.72,
    rotation: -12,
    textPosition: 'top',
    shadow: 'strong',
  },
  'tilted-right': {
    position: { x: 0.45, y: 0.58 },
    scale: 0.72,
    rotation: 12,
    textPosition: 'top',
    shadow: 'strong',
  },
  'perspective-left': {
    position: { x: 0.55, y: 0.55 },
    scale: 0.7,
    rotation: 0,
    perspective: { rotateX: 5, rotateY: -15, rotateZ: 0 },
    textPosition: 'top',
    shadow: 'strong',
  },
  'perspective-right': {
    position: { x: 0.45, y: 0.55 },
    scale: 0.7,
    rotation: 0,
    perspective: { rotateX: 5, rotateY: 15, rotateZ: 0 },
    textPosition: 'top',
    shadow: 'strong',
  },
  'floating': {
    position: { x: 0.5, y: 0.52 },
    scale: 0.65,
    rotation: 0,
    textPosition: 'top',
    shadow: 'glow',
  },
  'side-by-side': {
    position: { x: 0.32, y: 0.58 },
    scale: 0.52,
    rotation: -5,
    secondDevice: {
      position: { x: 0.68, y: 0.58 },
      scale: 0.52,
      rotation: 5,
    },
    textPosition: 'top',
    shadow: 'soft',
  },
  'overlap-stack': {
    position: { x: 0.42, y: 0.55 },
    scale: 0.6,
    rotation: -8,
    secondDevice: {
      position: { x: 0.58, y: 0.6 },
      scale: 0.6,
      rotation: 8,
    },
    textPosition: 'top',
    shadow: 'strong',
  },
  'full-screen': {
    position: { x: 0.5, y: 0.55 },
    scale: 0.9,
    rotation: 0,
    textPosition: 'top',
    shadow: 'none',
  },
  'small-centered': {
    position: { x: 0.5, y: 0.6 },
    scale: 0.5,
    rotation: 0,
    textPosition: 'top',
    shadow: 'soft',
  },
  'large-hero': {
    position: { x: 0.5, y: 0.62 },
    scale: 0.9,
    rotation: 0,
    textPosition: 'top',
    shadow: 'strong',
  },
  'left-edge': {
    position: { x: 0.15, y: 0.55 },
    scale: 0.75,
    rotation: 0,
    textPosition: 'top-right',
    textAlign: 'right',
    bleed: 'left',
    shadow: 'soft',
  },
  'right-edge': {
    position: { x: 0.85, y: 0.55 },
    scale: 0.75,
    rotation: 0,
    textPosition: 'top-left',
    textAlign: 'left',
    bleed: 'right',
    shadow: 'soft',
  },
  'left-edge-tilted': {
    position: { x: 0.18, y: 0.58 },
    scale: 0.72,
    rotation: 8,
    textPosition: 'top-right',
    textAlign: 'right',
    bleed: 'left',
    shadow: 'strong',
  },
  'right-edge-tilted': {
    position: { x: 0.82, y: 0.58 },
    scale: 0.72,
    rotation: -8,
    textPosition: 'top-left',
    textAlign: 'left',
    bleed: 'right',
    shadow: 'strong',
  },
  'dual-edge': {
    position: { x: 0.12, y: 0.6 },
    scale: 0.55,
    rotation: 5,
    secondDevice: {
      position: { x: 0.88, y: 0.6 },
      scale: 0.55,
      rotation: -5,
    },
    textPosition: 'top',
    bleed: 'left',
    shadow: 'soft',
  },
  'corner-left': {
    position: { x: 0.22, y: 0.72 },
    scale: 0.7,
    rotation: 12,
    textPosition: 'top-right',
    textAlign: 'right',
    bleed: 'left',
    shadow: 'strong',
  },
  'corner-right': {
    position: { x: 0.78, y: 0.72 },
    scale: 0.7,
    rotation: -12,
    textPosition: 'top-left',
    textAlign: 'left',
    bleed: 'right',
    shadow: 'strong',
  },
  // App Store multi-device layouts (uses Canvas LAYOUTS for actual rendering)
  'artsy-scatter': {
    position: { x: 0.35, y: 0.45 },
    scale: 0.38,
    rotation: 5,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'soft',
  },
  'artsy-collage': {
    position: { x: 0.45, y: 0.65 },
    scale: 0.45,
    rotation: 3,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'soft',
  },
  'dmv-hero': {
    position: { x: 0.28, y: 0.55 },
    scale: 0.65,
    rotation: 0,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'strong',
  },
  'crypto-trio': {
    position: { x: 0.5, y: 0.5 },
    scale: 0.55,
    rotation: 0,
    textPosition: 'top',
    textAlign: 'center',
    shadow: 'soft',
  },
  'calendar-quad': {
    position: { x: 0.55, y: 0.3 },
    scale: 0.42,
    rotation: 5,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'soft',
  },
  'parenting-five': {
    position: { x: 0.5, y: 0.25 },
    scale: 0.4,
    rotation: 5,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'soft',
  },
  'showcase-single': {
    position: { x: 0.5, y: 0.58 },
    scale: 0.68,
    rotation: 0,
    textPosition: 'top',
    textAlign: 'center',
    shadow: 'soft',
  },
  'hero-right': {
    position: { x: 0.72, y: 0.55 },
    scale: 0.65,
    rotation: 0,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'strong',
  },
  'diagonal-stack': {
    position: { x: 0.45, y: 0.5 },
    scale: 0.5,
    rotation: -5,
    textPosition: 'bottom-left',
    textAlign: 'left',
    shadow: 'strong',
  },
  'floating-duo': {
    position: { x: 0.35, y: 0.45 },
    scale: 0.52,
    rotation: -8,
    textPosition: 'bottom-right',
    textAlign: 'right',
    shadow: 'glow',
  },
  'edge-peek': {
    position: { x: 0.55, y: 0.55 },
    scale: 0.6,
    rotation: 0,
    textPosition: 'top-left',
    textAlign: 'left',
    bleed: 'left',
    shadow: 'soft',
  },
  'cross-panel': {
    position: { x: 0.92, y: 0.55 },
    scale: 0.65,
    rotation: -5,
    textPosition: 'top-left',
    textAlign: 'left',
    bleed: 'right',
    shadow: 'soft',
  },
};

// Screenshot template with layout
interface ScreenshotTemplate {
  headline: string;
  subheadline?: string;
  background: BackgroundConfig;
  textColor: string;
  layout: LayoutPresetType;
}

// Complete template set
interface TemplateSet {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  premium?: boolean;
  screenshots: ScreenshotTemplate[];
}

// Template sets with varied layouts
const TEMPLATE_SETS: TemplateSet[] = [
  // FITNESS - Dark Energy
  {
    id: "fitness-dark-energy",
    name: "Dark Energy",
    category: "fitness",
    description: "Bold layouts with dynamic device positions for fitness apps",
    tags: ["fitness", "workout", "dark", "dynamic", "bold"],
    screenshots: [
      { headline: "Track Every Rep", subheadline: "Your personal fitness companion", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#1a1a2e", position: 0 }, { color: "#16213e", position: 1 }] } }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "700+ Exercises", subheadline: "With HD video guides", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#0f0f1a", position: 0 }, { color: "#1a1a2e", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-right" },
      { headline: "Custom Workouts", subheadline: "Build your perfect routine", background: { type: "solid", color: "#0D0D1A" }, textColor: "#00FF88", layout: "perspective-left" },
      { headline: "Progress Charts", subheadline: "See your gains over time", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1a1a2e", position: 0 }, { color: "#0D0D1A", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Apple Watch Sync", subheadline: "Track workouts on the go", background: { type: "solid", color: "#16213e" }, textColor: "#00D4FF", layout: "side-by-side" },
      { headline: "Smart Rest Timer", subheadline: "Optimized recovery periods", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0D0D1A", position: 0 }, { color: "#1a1a2e", position: 1 }] } }, textColor: "#FFFFFF", layout: "floating" },
      { headline: "Meal Planning", subheadline: "Nutrition made simple", background: { type: "solid", color: "#0f0f1a" }, textColor: "#FF6B6B", layout: "bottom-center" },
      { headline: "Community Challenges", subheadline: "Compete with friends", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#16213e", position: 0 }, { color: "#1a1a2e", position: 1 }] } }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "Personal Records", subheadline: "Celebrate every milestone", background: { type: "solid", color: "#1a1a2e" }, textColor: "#FFD700", layout: "tilted-left" },
      { headline: "Start Your Journey", subheadline: "Free 7-day trial", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FF8E53", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // FITNESS - Neon Pulse
  {
    id: "fitness-neon-pulse",
    name: "Neon Pulse",
    category: "fitness",
    description: "Vibrant neon with 3D perspective layouts",
    tags: ["fitness", "neon", "vibrant", "3D", "modern"],
    screenshots: [
      { headline: "Train Smarter", subheadline: "AI-powered workouts", background: { type: "blobs", base_color: "#0D0D1A", blobs: [{ color: "#FF00FF", x: 0.2, y: 0.3, size: 0.4 }, { color: "#00FFFF", x: 0.8, y: 0.7, size: 0.35 }], blur: 80 }, textColor: "#FFFFFF", layout: "perspective-right" },
      { headline: "Real-time Form Check", subheadline: "Perfect your technique", background: { type: "blobs", base_color: "#0A0A0F", blobs: [{ color: "#00FF88", x: 0.3, y: 0.2, size: 0.5 }, { color: "#00BFFF", x: 0.7, y: 0.8, size: 0.4 }], blur: 70 }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Burn Tracking", subheadline: "Every calorie counts", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF0080", position: 0 }, { color: "#FF8C00", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Heart Rate Zones", subheadline: "Optimize your intensity", background: { type: "blobs", base_color: "#0D0D1A", blobs: [{ color: "#FF3366", x: 0.5, y: 0.3, size: 0.5 }, { color: "#FF6B6B", x: 0.2, y: 0.8, size: 0.3 }], blur: 90 }, textColor: "#FFFFFF", layout: "tilted-left" },
      { headline: "Sleep Analysis", subheadline: "Recovery is key", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#2D1B69", position: 0 }, { color: "#11998E", position: 1 }] } }, textColor: "#FFFFFF", layout: "floating" },
      { headline: "Workout Library", subheadline: "1000+ guided sessions", background: { type: "blobs", base_color: "#0f0f1a", blobs: [{ color: "#8B5CF6", x: 0.2, y: 0.4, size: 0.4 }, { color: "#EC4899", x: 0.8, y: 0.6, size: 0.35 }], blur: 80 }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Progress Photos", subheadline: "See your transformation", background: { type: "solid", color: "#0D0D1A" }, textColor: "#00FFFF", layout: "overlap-stack" },
      { headline: "Social Sharing", subheadline: "Inspire your friends", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "perspective-left" },
      { headline: "Daily Reminders", subheadline: "Stay consistent", background: { type: "blobs", base_color: "#0A0A0F", blobs: [{ color: "#00FF88", x: 0.3, y: 0.5, size: 0.45 }, { color: "#00BFFF", x: 0.7, y: 0.3, size: 0.4 }], blur: 75 }, textColor: "#FFFFFF", layout: "bottom-center" },
      { headline: "Get Started Free", subheadline: "No credit card required", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#00FF88", position: 0 }, { color: "#00BFFF", position: 1 }] } }, textColor: "#0D0D1A", layout: "centered" },
    ],
  },

  // FINANCE - Trust Blue
  {
    id: "finance-trust-blue",
    name: "Trust Blue",
    category: "finance",
    description: "Professional layouts that inspire confidence",
    tags: ["finance", "banking", "professional", "clean", "trust"],
    screenshots: [
      { headline: "Banking Made Simple", subheadline: "Manage money your way", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0D1B2A", position: 0 }, { color: "#1B263B", position: 1 }] } }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Instant Transfers", subheadline: "Send money in seconds", background: { type: "solid", color: "#1B263B" }, textColor: "#00D4FF", layout: "bottom-center" },
      { headline: "Smart Budgets", subheadline: "AI-powered insights", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#0D1B2A", position: 0 }, { color: "#1B4D3E", position: 1 }] } }, textColor: "#FFFFFF", layout: "perspective-right" },
      { headline: "Bill Reminders", subheadline: "Never miss a payment", background: { type: "solid", color: "#0D1B2A" }, textColor: "#4ECDC4", layout: "tilted-right" },
      { headline: "Investment Tracking", subheadline: "Watch your wealth grow", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1B263B", position: 0 }, { color: "#415A77", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Spending Analytics", subheadline: "Know where your money goes", background: { type: "solid", color: "#1B263B" }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Virtual Cards", subheadline: "Shop securely online", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0D1B2A", position: 0 }, { color: "#1B263B", position: 1 }] } }, textColor: "#00FF88", layout: "floating" },
      { headline: "Savings Goals", subheadline: "Achieve your dreams", background: { type: "solid", color: "#0D1B2A" }, textColor: "#FFD700", layout: "overlap-stack" },
      { headline: "Bank-Level Security", subheadline: "Your money is safe", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#1B263B", position: 0 }, { color: "#0D1B2A", position: 1 }] } }, textColor: "#FFFFFF", layout: "small-centered" },
      { headline: "Open Free Account", subheadline: "No minimum balance", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#00D4FF", position: 0 }, { color: "#0D1B2A", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // SHOPPING - Fresh Pop
  {
    id: "shopping-fresh-pop",
    name: "Fresh Pop",
    category: "shopping",
    description: "Playful layouts with overlapping and tilted devices",
    tags: ["shopping", "ecommerce", "colorful", "playful", "deals"],
    screenshots: [
      { headline: "Shop the Latest", subheadline: "Trending styles delivered", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-right" },
      { headline: "Flash Sales", subheadline: "Up to 70% off", background: { type: "solid", color: "#FF6B6B" }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Style Quiz", subheadline: "Find your perfect look", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF758C", position: 0 }, { color: "#FF7EB3", position: 1 }] } }, textColor: "#FFFFFF", layout: "perspective-left" },
      { headline: "Try Before You Buy", subheadline: "AR virtual try-on", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "Free Shipping", subheadline: "On orders over $50", background: { type: "solid", color: "#4ECDC4" }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Easy Returns", subheadline: "30-day guarantee", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] } }, textColor: "#FFFFFF", layout: "floating" },
      { headline: "Wish Lists", subheadline: "Save your favorites", background: { type: "solid", color: "#FF7EB3" }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Price Alerts", subheadline: "Never miss a deal", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FFE66D", position: 0 }, { color: "#FF6B6B", position: 1 }] } }, textColor: "#333333", layout: "tilted-left" },
      { headline: "Rewards Program", subheadline: "Earn points on every order", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#8E2DE2", position: 0 }, { color: "#4A00E0", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-center" },
      { headline: "Download Now", subheadline: "Get 20% off first order", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FF8E53", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // SHOPPING - Minimal Luxe
  {
    id: "shopping-minimal-luxe",
    name: "Minimal Luxe",
    category: "shopping",
    description: "Clean minimal layouts for luxury brands",
    tags: ["shopping", "luxury", "minimal", "clean", "premium"],
    screenshots: [
      { headline: "Curated Collection", subheadline: "Handpicked for you", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "small-centered" },
      { headline: "New Arrivals", subheadline: "Spring 2025", background: { type: "solid", color: "#F5F5F5" }, textColor: "#1A1A1A", layout: "bottom-center" },
      { headline: "Designer Brands", subheadline: "Authentic guaranteed", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "large-hero" },
      { headline: "Personal Stylist", subheadline: "AI-powered recommendations", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FFFFFF", position: 0 }, { color: "#F0F0F0", position: 1 }] } }, textColor: "#1A1A1A", layout: "floating" },
      { headline: "Same Day Delivery", subheadline: "In select cities", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "centered" },
      { headline: "Gift Wrapping", subheadline: "Premium packaging", background: { type: "solid", color: "#F5F5F5" }, textColor: "#1A1A1A", layout: "tilted-right" },
      { headline: "Size Guide", subheadline: "Find your perfect fit", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "bottom-bleed" },
      { headline: "Member Benefits", subheadline: "Exclusive access", background: { type: "solid", color: "#1A1A1A" }, textColor: "#D4AF37", layout: "perspective-right" },
      { headline: "Sustainability", subheadline: "Eco-conscious fashion", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#E8F5E9", position: 0 }, { color: "#C8E6C9", position: 1 }] } }, textColor: "#2E7D32", layout: "side-by-side" },
      { headline: "Shop Now", subheadline: "Free returns within 60 days", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // SOCIAL - Vibrant Connect
  {
    id: "social-vibrant",
    name: "Vibrant Connect",
    category: "social",
    description: "Dynamic layouts with overlapping screens for social apps",
    tags: ["social", "community", "vibrant", "dynamic"],
    screenshots: [
      { headline: "Connect Instantly", subheadline: "Meet people who get you", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "Stories That Matter", subheadline: "Share your moments", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-left" },
      { headline: "Group Chats", subheadline: "Stay close to friends", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] } }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Video Calls", subheadline: "Crystal clear quality", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#8E2DE2", position: 0 }, { color: "#4A00E0", position: 1 }] } }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Discover Events", subheadline: "Near you & online", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF758C", position: 0 }, { color: "#FF7EB3", position: 1 }] } }, textColor: "#FFFFFF", layout: "perspective-right" },
      { headline: "Interest Groups", subheadline: "Find your tribe", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#4ECDC4", position: 0 }, { color: "#44A08D", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Privacy First", subheadline: "Your data, your control", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "floating" },
      { headline: "Dark Mode", subheadline: "Easy on the eyes", background: { type: "solid", color: "#0D0D1A" }, textColor: "#667EEA", layout: "bottom-center" },
      { headline: "Reactions & Emoji", subheadline: "Express yourself", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FFE66D", position: 0 }, { color: "#FF6B6B", position: 1 }] } }, textColor: "#333333", layout: "tilted-right" },
      { headline: "Join Millions", subheadline: "Download free today", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // PRODUCTIVITY - Focus Clean
  {
    id: "productivity-focus",
    name: "Focus Clean",
    category: "productivity",
    description: "Clean, professional layouts for productivity apps",
    tags: ["productivity", "minimal", "clean", "work", "focus"],
    screenshots: [
      { headline: "Focus on What Matters", subheadline: "Distraction-free productivity", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "large-hero" },
      { headline: "Smart Task Lists", subheadline: "Organize effortlessly", background: { type: "solid", color: "#F8FAFC" }, textColor: "#334155", layout: "bottom-center" },
      { headline: "Calendar Sync", subheadline: "All events in one place", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FFFFFF", position: 0 }, { color: "#F1F5F9", position: 1 }] } }, textColor: "#1A1A1A", layout: "side-by-side" },
      { headline: "Team Collaboration", subheadline: "Work better together", background: { type: "solid", color: "#0EA5E9" }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "Time Tracking", subheadline: "Know where time goes", background: { type: "solid", color: "#F8FAFC" }, textColor: "#334155", layout: "floating" },
      { headline: "Notes & Docs", subheadline: "Everything searchable", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "tilted-right" },
      { headline: "Reminders", subheadline: "Never forget again", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#10B981", position: 0 }, { color: "#059669", position: 1 }] } }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Widgets", subheadline: "Quick access anywhere", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "perspective-left" },
      { headline: "Cross-Platform", subheadline: "iOS, Android, Web", background: { type: "solid", color: "#F8FAFC" }, textColor: "#334155", layout: "small-centered" },
      { headline: "Try Free", subheadline: "14-day premium trial", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0EA5E9", position: 0 }, { color: "#0284C7", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // FOOD - Tasty Warm
  {
    id: "food-tasty",
    name: "Tasty Warm",
    category: "food",
    description: "Appetizing layouts for food delivery apps",
    tags: ["food", "delivery", "warm", "appetizing"],
    screenshots: [
      { headline: "Craving Something?", subheadline: "Delivered in 30 mins", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF6B35", position: 0 }, { color: "#FF8E53", position: 1 }] } }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Local Favorites", subheadline: "500+ restaurants near you", background: { type: "solid", color: "#FF6B35" }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Live Tracking", subheadline: "Know exactly when it arrives", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1A1A1A", position: 0 }, { color: "#2D2D2D", position: 1 }] } }, textColor: "#FF6B35", layout: "floating" },
      { headline: "Group Orders", subheadline: "Split the bill easily", background: { type: "solid", color: "#FFECD2" }, textColor: "#8B4513", layout: "side-by-side" },
      { headline: "Meal Deals", subheadline: "Save up to 40%", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF3E4D", position: 0 }, { color: "#FF6B35", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-left" },
      { headline: "Dietary Filters", subheadline: "Vegan, gluten-free & more", background: { type: "solid", color: "#4CAF50" }, textColor: "#FFFFFF", layout: "perspective-right" },
      { headline: "Reorder Favorites", subheadline: "One tap ordering", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#FF8E53", position: 0 }, { color: "#FFD166", position: 1 }] } }, textColor: "#333333", layout: "bottom-center" },
      { headline: "No Minimum Order", subheadline: "Order any amount", background: { type: "solid", color: "#FF6B35" }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "Contactless Delivery", subheadline: "Safe & secure", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "tilted-right" },
      { headline: "Get $10 Off", subheadline: "First order discount", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF3E4D", position: 0 }, { color: "#FF6B35", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // HEALTH - Calm Zen
  {
    id: "health-calm",
    name: "Calm Zen",
    category: "health",
    description: "Peaceful floating layouts for wellness apps",
    tags: ["health", "meditation", "calm", "zen", "wellness"],
    screenshots: [
      { headline: "Find Your Peace", subheadline: "Guided meditations daily", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#1a1a2e", position: 0 }, { color: "#2D1B69", position: 1 }] } }, textColor: "#E6E6FA", layout: "floating" },
      { headline: "Sleep Better", subheadline: "Soothing sleep sounds", background: { type: "solid", color: "#1a1a2e" }, textColor: "#B19CD9", layout: "small-centered" },
      { headline: "Breathing Exercises", subheadline: "Reduce stress instantly", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#2D1B69", position: 0 }, { color: "#4B0082", position: 1 }] } }, textColor: "#FFFFFF", layout: "large-hero" },
      { headline: "Mood Tracking", subheadline: "Understand your patterns", background: { type: "solid", color: "#2D1B69" }, textColor: "#E6E6FA", layout: "bottom-center" },
      { headline: "Nature Sounds", subheadline: "Escape to serenity", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#134E5E", position: 0 }, { color: "#71B280", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-right" },
      { headline: "Daily Affirmations", subheadline: "Start positive", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#FF758C", position: 0 }, { color: "#FF7EB3", position: 1 }] } }, textColor: "#FFFFFF", layout: "perspective-left" },
      { headline: "Focus Music", subheadline: "Deep work soundtracks", background: { type: "solid", color: "#1a1a2e" }, textColor: "#00BFFF", layout: "bottom-bleed" },
      { headline: "Progress Insights", subheadline: "Track your journey", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1a1a2e", position: 0 }, { color: "#2D1B69", position: 1 }] } }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Offline Mode", subheadline: "Meditate anywhere", background: { type: "solid", color: "#2D1B69" }, textColor: "#B19CD9", layout: "overlap-stack" },
      { headline: "Start Free", subheadline: "7 days of premium", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#B19CD9", position: 0 }, { color: "#8B5CF6", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // MUSIC - Dark Vibes
  {
    id: "music-dark",
    name: "Dark Vibes",
    category: "music",
    description: "Sleek dark layouts for music streaming",
    tags: ["music", "streaming", "dark", "audio"],
    screenshots: [
      { headline: "Your Music, Everywhere", subheadline: "100M+ songs on demand", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0A0A0A", position: 0 }, { color: "#1A1A1A", position: 1 }] } }, textColor: "#1DB954", layout: "large-hero" },
      { headline: "Discover Weekly", subheadline: "Personalized for you", background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF", layout: "bottom-bleed" },
      { headline: "Lyrics Sync", subheadline: "Sing along in real-time", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1A1A1A", position: 0 }, { color: "#2D2D2D", position: 1 }] } }, textColor: "#1DB954", layout: "tilted-left" },
      { headline: "Offline Mode", subheadline: "Download & listen anywhere", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "floating" },
      { headline: "Podcasts Included", subheadline: "All your favorites", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0A0A0A", position: 0 }, { color: "#1A1A1A", position: 1 }] } }, textColor: "#FFFFFF", layout: "overlap-stack" },
      { headline: "High Quality Audio", subheadline: "Lossless streaming", background: { type: "solid", color: "#0A0A0A" }, textColor: "#1DB954", layout: "perspective-right" },
      { headline: "Connect Speakers", subheadline: "Multi-room audio", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#1A1A1A", position: 0 }, { color: "#0A0A0A", position: 1 }] } }, textColor: "#FFFFFF", layout: "side-by-side" },
      { headline: "Share Playlists", subheadline: "Collab with friends", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "bottom-center" },
      { headline: "Concert Alerts", subheadline: "Never miss a show", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 1 }] } }, textColor: "#FFFFFF", layout: "tilted-right" },
      { headline: "Try Premium Free", subheadline: "1 month on us", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#1DB954", position: 0 }, { color: "#1AA34A", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // SHOWCASE - Edge Flow (Cross-panel device layouts like App Store featured apps)
  {
    id: "showcase-edge-flow",
    name: "Edge Flow",
    category: "showcase",
    description: "Cross-panel device layouts where phones extend beyond edges - like featured App Store apps",
    tags: ["showcase", "edge", "cross-panel", "featured", "premium"],
    premium: true,
    screenshots: [
      { headline: "Welcome to the Future", subheadline: "Experience seamless design", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1a1a2e", position: 0 }, { color: "#16213e", position: 1 }] } }, textColor: "#FFFFFF", layout: "right-edge" },
      { headline: "Smart Dashboard", subheadline: "Everything at a glance", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#0f0f1a", position: 0 }, { color: "#1a1a2e", position: 1 }] } }, textColor: "#00D4FF", layout: "left-edge" },
      { headline: "Quick Actions", subheadline: "Get things done faster", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "right-edge-tilted" },
      { headline: "Beautiful Charts", subheadline: "Data visualization made easy", background: { type: "solid", color: "#1B263B" }, textColor: "#4ECDC4", layout: "left-edge-tilted" },
      { headline: "Dual View Mode", subheadline: "Compare side by side", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#0D1B2A", position: 0 }, { color: "#1B4D3E", position: 1 }] } }, textColor: "#FFFFFF", layout: "dual-edge" },
      { headline: "Corner Insights", subheadline: "Key metrics always visible", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FF6B35", position: 0 }, { color: "#FF8E53", position: 1 }] } }, textColor: "#FFFFFF", layout: "corner-right" },
      { headline: "Profile Settings", subheadline: "Customize your experience", background: { type: "solid", color: "#0D0D1A" }, textColor: "#FF758C", layout: "corner-left" },
      { headline: "Seamless Sync", subheadline: "All devices connected", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] } }, textColor: "#FFFFFF", layout: "left-edge" },
      { headline: "Power Features", subheadline: "Unlock your potential", background: { type: "gradient", gradient: { type: "linear", angle: 160, stops: [{ color: "#8E2DE2", position: 0 }, { color: "#4A00E0", position: 1 }] } }, textColor: "#FFFFFF", layout: "right-edge" },
      { headline: "Get Started", subheadline: "Free download today", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#00D4FF", position: 0 }, { color: "#0D1B2A", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // LIFESTYLE - Edge Minimal (Clean cross-panel layouts)
  {
    id: "lifestyle-edge-minimal",
    name: "Edge Minimal",
    category: "lifestyle",
    description: "Clean, minimal cross-panel layouts for lifestyle apps",
    tags: ["lifestyle", "minimal", "edge", "clean", "modern"],
    screenshots: [
      { headline: "Simplify Your Life", subheadline: "Less clutter, more clarity", background: { type: "solid", color: "#FFFFFF" }, textColor: "#1A1A1A", layout: "left-edge" },
      { headline: "Daily Habits", subheadline: "Build routines that stick", background: { type: "solid", color: "#F5F5F5" }, textColor: "#333333", layout: "right-edge" },
      { headline: "Track Progress", subheadline: "See how far you've come", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#FFFFFF", position: 0 }, { color: "#F0F0F0", position: 1 }] } }, textColor: "#1A1A1A", layout: "left-edge-tilted" },
      { headline: "Set Goals", subheadline: "Dream big, achieve more", background: { type: "solid", color: "#1A1A1A" }, textColor: "#FFFFFF", layout: "right-edge-tilted" },
      { headline: "Side by Side", subheadline: "Compare before & after", background: { type: "solid", color: "#F8FAFC" }, textColor: "#334155", layout: "dual-edge" },
      { headline: "Quick Notes", subheadline: "Capture ideas instantly", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#E8F5E9", position: 0 }, { color: "#C8E6C9", position: 1 }] } }, textColor: "#2E7D32", layout: "corner-left" },
      { headline: "Reminders", subheadline: "Never miss a moment", background: { type: "solid", color: "#FFF8E1" }, textColor: "#F57C00", layout: "corner-right" },
      { headline: "Dark Theme", subheadline: "Easy on the eyes", background: { type: "solid", color: "#0D0D1A" }, textColor: "#B0BEC5", layout: "left-edge" },
      { headline: "Widgets Ready", subheadline: "Home screen at a glance", background: { type: "solid", color: "#ECEFF1" }, textColor: "#455A64", layout: "right-edge" },
      { headline: "Start Today", subheadline: "Free to download", background: { type: "gradient", gradient: { type: "linear", angle: 180, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "centered" },
    ],
  },

  // ============================================
  // APP STORE FEATURED STYLE - Multi-device layouts (like Artsy, DMV, Crypto apps)
  // ============================================

  // ARTSY STYLE - Scattered devices with artistic layout
  {
    id: "appstore-artsy",
    name: "Artsy Scatter",
    category: "showcase",
    description: "6 devices scattered artistically - like Artsy app screenshots",
    tags: ["appstore", "artsy", "scatter", "multi-device", "premium", "featured"],
    premium: true,
    screenshots: [
      { headline: "Meet your\nnew art\nadvisor.", subheadline: "", background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF", layout: "artsy-scatter" },
      { headline: "Discover Artsy", subheadline: "—the best tool\nfor art collectors.", background: { type: "solid", color: "#0A0A0A" }, textColor: "#FFFFFF", layout: "artsy-collage" },
      { headline: "Buy artworks\nwith ease", subheadline: "", background: { type: "solid", color: "#E8A4B8" }, textColor: "#1A1A1A", layout: "showcase-single" },
      { headline: "Bid in global\nauctions", subheadline: "", background: { type: "solid", color: "#5BBFBA" }, textColor: "#1A1A1A", layout: "showcase-single" },
      { headline: "Research and\nvalidate prices", subheadline: "", background: { type: "solid", color: "#B4A7D6" }, textColor: "#1A1A1A", layout: "showcase-single" },
    ],
  },

  // DMV STYLE - Hero device with supporting smaller devices
  {
    id: "appstore-dmv",
    name: "DMV Hero",
    category: "showcase",
    description: "Hero device with 2 smaller supporting devices - like DMV Prep app",
    tags: ["appstore", "dmv", "hero", "multi-device", "featured"],
    premium: true,
    screenshots: [
      { headline: "DMV\nprep\napp", subheadline: "95.2%\npass rate", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#1B5E20", position: 0 }, { color: "#2E7D32", position: 1 }] } }, textColor: "#FFFFFF", layout: "dmv-hero" },
      { headline: "Get your DMV\ntest done in\nno time", subheadline: "", background: { type: "solid", color: "#4A7C59" }, textColor: "#FFFFFF", layout: "dmv-hero" },
      { headline: "Car, CDL &\nMotorcycle", subheadline: "", background: { type: "solid", color: "#6B8E6B" }, textColor: "#FFFFFF", layout: "crypto-trio" },
      { headline: "600+\nexam-like\nquestions", subheadline: "", background: { type: "solid", color: "#8FBC8F" }, textColor: "#1A1A1A", layout: "showcase-single" },
    ],
  },

  // CRYPTO STYLE - Three devices in a row
  {
    id: "appstore-crypto",
    name: "Crypto Trio",
    category: "showcase",
    description: "3 devices in a row - like Rainbow Crypto app",
    tags: ["appstore", "crypto", "trio", "multi-device", "featured"],
    premium: true,
    screenshots: [
      { headline: "Experience\nCrypto in\nColor", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF6B6B", position: 0 }, { color: "#4ECDC4", position: 1 }] } }, textColor: "#FFFFFF", layout: "crypto-trio" },
      { headline: "Discover\nnew tokens", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#667EEA", position: 0 }, { color: "#764BA2", position: 1 }] } }, textColor: "#FFFFFF", layout: "crypto-trio" },
      { headline: "Explore\n& Search\nNFTs", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#11998E", position: 0 }, { color: "#38EF7D", position: 1 }] } }, textColor: "#FFFFFF", layout: "floating-duo" },
      { headline: "Swap and\nbridge", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#4ECDC4", position: 0 }, { color: "#44A08D", position: 1 }] } }, textColor: "#FFFFFF", layout: "showcase-single" },
    ],
  },

  // CALENDAR STYLE - Four devices in quad layout
  {
    id: "appstore-calendar",
    name: "Calendar Quad",
    category: "showcase",
    description: "4 devices in grid layout - like Amie Calendar app",
    tags: ["appstore", "calendar", "quad", "multi-device", "productivity"],
    premium: true,
    screenshots: [
      { headline: "Joyfull\nproductivity\nacross all of\nyour devices", subheadline: "", background: { type: "solid", color: "#E8D5B7" }, textColor: "#1A1A1A", layout: "calendar-quad" },
      { headline: "Create\nan event\nin 2 sec", subheadline: "", background: { type: "solid", color: "#F5F5F5" }, textColor: "#1A1A1A", layout: "diagonal-stack" },
      { headline: "Amie cares\nabout your\nwell-being", subheadline: "", background: { type: "solid", color: "#FFF8E1" }, textColor: "#1A1A1A", layout: "floating-duo" },
      { headline: "Widgets\nfor events,\ntodos, BDs\nand much\nmore", subheadline: "", background: { type: "solid", color: "#E3F2FD" }, textColor: "#1A1A1A", layout: "parenting-five" },
    ],
  },

  // PARENTING STYLE - Five devices scattered
  {
    id: "appstore-parenting",
    name: "Parenting Five",
    category: "showcase",
    description: "5 devices spread out - like Parenting app screenshots",
    tags: ["appstore", "parenting", "five", "multi-device", "featured"],
    premium: true,
    screenshots: [
      { headline: "Parenting\nknowledge &\nkey support", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FF8A65", position: 0 }, { color: "#FFB74D", position: 1 }] } }, textColor: "#FFFFFF", layout: "parenting-five" },
      { headline: "Boost your\nparenting IQ", subheadline: "", background: { type: "solid", color: "#FF7043" }, textColor: "#FFFFFF", layout: "calendar-quad" },
      { headline: "Optimal\nresponses\nfor kids\ndevelopment", subheadline: "", background: { type: "solid", color: "#FF8A65" }, textColor: "#FFFFFF", layout: "diagonal-stack" },
      { headline: "Interactive\nsimulator", subheadline: "", background: { type: "gradient", gradient: { type: "linear", angle: 135, stops: [{ color: "#FFB74D", position: 0 }, { color: "#FFA726", position: 1 }] } }, textColor: "#1A1A1A", layout: "showcase-single" },
    ],
  },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "showcase", name: "Showcase", icon: Eye },
  { id: "lifestyle", name: "Lifestyle", icon: ChevronRight },
  { id: "fitness", name: "Fitness", icon: Sparkles },
  { id: "finance", name: "Finance", icon: Box },
  { id: "shopping", name: "Shopping", icon: Layout },
  { id: "social", name: "Social", icon: Layers },
  { id: "productivity", name: "Productivity", icon: Move },
  { id: "food", name: "Food", icon: Maximize },
  { id: "health", name: "Health", icon: RotateCw },
  { id: "music", name: "Music", icon: Smartphone },
];

// Layout icons/previews
const LAYOUT_ICONS: Record<LayoutPresetType, string> = {
  'centered': '⬛',
  'bottom-center': '⬇️',
  'bottom-bleed': '📲',
  'top-bleed': '📱',
  'tilted-left': '↖️',
  'tilted-right': '↗️',
  'perspective-left': '🔲',
  'perspective-right': '🔳',
  'floating': '☁️',
  'side-by-side': '📱📱',
  'overlap-stack': '🗂️',
  'full-screen': '🖼️',
  'small-centered': '🔘',
  'large-hero': '📺',
  'left-edge': '◧',
  'right-edge': '◨',
  'left-edge-tilted': '◧↗',
  'right-edge-tilted': '↖◨',
  'dual-edge': '◧◨',
  'corner-left': '◢',
  'corner-right': '◣',
  // App Store multi-device
  'artsy-scatter': '✦',
  'artsy-collage': '❖',
  'dmv-hero': '◀',
  'crypto-trio': '≡',
  'calendar-quad': '▦',
  'parenting-five': '⬢',
  'showcase-single': '◉',
  'hero-right': '▶',
  'diagonal-stack': '⬔',
  'floating-duo': '◈',
  'edge-peek': '◧',
  'cross-panel': '⊞',
};

export function TemplateGallery() {
  const {
    showTemplateGallery,
    setShowTemplateGallery,
    selectedScreenshotId,
    project,
    pushHistory,
  } = useEditorStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewSet, setPreviewSet] = useState<TemplateSet | null>(null);
  const [applyToAll, setApplyToAll] = useState(true);

  const filteredSets = useMemo(() => {
    let sets = TEMPLATE_SETS;

    if (selectedCategory !== "all") {
      sets = sets.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sets = sets.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((tag) => tag.includes(query))
      );
    }

    return sets;
  }, [selectedCategory, searchQuery]);

  const getBackgroundStyle = (bg: BackgroundConfig): React.CSSProperties => {
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
    }

    return style.backgroundColor || style.background ? style : { backgroundColor: "#1c1c1e" };
  };

  // Get device style based on layout
  const getDeviceStyle = (layout: DeviceLayout, isSecond = false): React.CSSProperties => {
    const device = isSecond && layout.secondDevice ? layout.secondDevice : layout;
    const pos = device.position;
    const transform = [];

    transform.push('translate(-50%, -50%)');
    transform.push(`rotate(${device.rotation}deg)`);

    if (device.perspective) {
      transform.push(`perspective(1000px) rotateX(${device.perspective.rotateX}deg) rotateY(${device.perspective.rotateY}deg)`);
    }

    return {
      left: `${pos.x * 100}%`,
      top: `${pos.y * 100}%`,
      transform: transform.join(' '),
      width: `${device.scale * 45}%`,
    };
  };

  const applyTemplateSet = (set: TemplateSet) => {
    pushHistory('Apply template set');

    const { updateBackground, updateTextStyle, updateText, updateDevice, addScreenshot } = useEditorStore.getState();

    if (applyToAll) {
      set.screenshots.forEach((template, index) => {
        let screenshotId: string;

        if (index < project.screenshots.length) {
          screenshotId = project.screenshots[index].id;
        } else {
          addScreenshot();
          const updatedProject = useEditorStore.getState().project;
          screenshotId = updatedProject.screenshots[updatedProject.screenshots.length - 1].id;
        }

        // Apply background
        updateBackground(screenshotId, template.background);

        // Apply layout to device
        const layoutPreset = LAYOUT_PRESETS[template.layout];
        updateDevice(screenshotId, {
          positionX: layoutPreset.position.x,
          positionY: layoutPreset.position.y,
          scale: layoutPreset.scale,
          rotation: layoutPreset.rotation,
          shadow: layoutPreset.shadow !== 'none',
        });

        // Update text
        const currentProject = useEditorStore.getState().project;
        const screenshot = currentProject.screenshots.find(s => s.id === screenshotId);

        if (screenshot && screenshot.texts.length > 0) {
          const headline = screenshot.texts.find(t => t.type === 'headline');
          if (headline) {
            updateText(screenshotId, headline.id, { translations: { en: template.headline } });
            updateTextStyle(screenshotId, headline.id, { color: template.textColor });

            // Adjust text position based on layout
            const textY = layoutPreset.textPosition === 'bottom' ? 0.85 :
                         layoutPreset.textPosition === 'center' ? 0.5 : 0.12;
            updateText(screenshotId, headline.id, { positionY: textY });
          }

          const subheadline = screenshot.texts.find(t => t.type === 'subheadline');
          if (subheadline && template.subheadline) {
            updateText(screenshotId, subheadline.id, { translations: { en: template.subheadline } });
            updateTextStyle(screenshotId, subheadline.id, { color: template.textColor + 'CC' });
          }
        }
      });
    } else if (selectedScreenshotId) {
      const template = set.screenshots[0];
      const layoutPreset = LAYOUT_PRESETS[template.layout];

      updateBackground(selectedScreenshotId, template.background);
      updateDevice(selectedScreenshotId, {
        positionX: layoutPreset.position.x,
        positionY: layoutPreset.position.y,
        scale: layoutPreset.scale,
        rotation: layoutPreset.rotation,
        shadow: layoutPreset.shadow !== 'none',
      });
    }

    setShowTemplateGallery(false);
    setPreviewSet(null);
  };

  // Preview modal
  if (previewSet) {
    return (
      <Dialog open={showTemplateGallery} onOpenChange={() => { setShowTemplateGallery(false); setPreviewSet(null); }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewSet(null)} className="p-2 rounded-lg bg-[#2c2c2e] hover:bg-[#3a3a3c]">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <div>
                  <DialogTitle>{previewSet.name}</DialogTitle>
                  <DialogDescription>{previewSet.description}</DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setApplyToAll(!applyToAll)}
                  className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium", applyToAll ? "bg-[#0a84ff] text-white" : "bg-[#2c2c2e] text-[#8e8e93]")}
                >
                  {applyToAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Apply All 10
                </button>
                <button
                  onClick={() => applyTemplateSet(previewSet)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#30d158] text-white text-sm font-medium hover:bg-[#28b84c]"
                >
                  <Check className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Screenshot previews with layouts */}
          <div className="flex-1 overflow-x-auto py-4">
            <div className="flex gap-4 px-2" style={{ minWidth: 'max-content' }}>
              {previewSet.screenshots.map((screenshot, index) => {
                const layout = LAYOUT_PRESETS[screenshot.layout];
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-52 aspect-[9/19.5] rounded-2xl overflow-hidden border border-[#3a3a3c] relative"
                    style={getBackgroundStyle(screenshot.background)}
                  >
                    {/* Screenshot number & layout type */}
                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white">
                        {index + 1}/10
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[9px] text-white/70 capitalize">
                        {screenshot.layout.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Text - positioned based on layout */}
                    <div
                      className={cn(
                        "absolute left-0 right-0 px-3 text-center",
                        layout.textPosition === 'top' && "top-10",
                        layout.textPosition === 'bottom' && "bottom-4",
                        layout.textPosition === 'center' && "top-1/2 -translate-y-1/2"
                      )}
                    >
                      <h3 className="text-sm font-bold leading-tight" style={{ color: screenshot.textColor }}>
                        {screenshot.headline}
                      </h3>
                      {screenshot.subheadline && (
                        <p className="text-[9px] mt-0.5 opacity-80" style={{ color: screenshot.textColor }}>
                          {screenshot.subheadline}
                        </p>
                      )}
                    </div>

                    {/* Primary device */}
                    <div
                      className="absolute"
                      style={getDeviceStyle(layout)}
                    >
                      <div
                        className="w-full aspect-[1/2.17] rounded-[16.5%] border-2 bg-black/30"
                        style={{
                          borderColor: screenshot.textColor + '30',
                          boxShadow: layout.shadow === 'strong' ? '0 10px 40px rgba(0,0,0,0.5)' :
                                    layout.shadow === 'glow' ? `0 0 40px ${screenshot.textColor}40` :
                                    layout.shadow === 'soft' ? '0 5px 20px rgba(0,0,0,0.3)' : 'none'
                        }}
                      />
                    </div>

                    {/* Second device for dual layouts */}
                    {layout.secondDevice && (
                      <div
                        className="absolute"
                        style={getDeviceStyle(layout, true)}
                      >
                        <div
                          className="w-full aspect-[1/2.17] rounded-[16.5%] border-2 bg-black/30"
                          style={{
                            borderColor: screenshot.textColor + '30',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#38383a] flex items-center justify-between text-[#636366] text-xs">
            <span className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#2c2c2e] capitalize">{previewSet.category}</span>
              {previewSet.tags.slice(0, 3).map(tag => <span key={tag}>#{tag}</span>)}
            </span>
            <span>Includes varied device layouts: tilted, perspective, overlapping, floating</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff9f0a] to-[#ff375f] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            Template Sets with Layouts
          </DialogTitle>
          <DialogDescription>
            10 screenshots per set with varied device positions: tilted, perspective, overlapping, floating & more
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636366]" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-[#f5f5f7] placeholder-[#636366] text-sm focus:outline-none focus:border-[#0a84ff]"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 py-3 border-b border-[#38383a] overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const count = category.id === "all" ? TEMPLATE_SETS.length : TEMPLATE_SETS.filter(s => s.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                  selectedCategory === category.id ? "bg-[#0a84ff] text-white" : "bg-[#2c2c2e] text-[#a1a1a6] hover:bg-[#3a3a3c]"
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", selectedCategory === category.id ? "bg-white/20" : "bg-[#3a3a3c]")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSets.map((set) => (
              <button
                key={set.id}
                onClick={() => setPreviewSet(set)}
                className="group text-left rounded-2xl overflow-hidden border border-[#3a3a3c] hover:border-[#0a84ff] bg-[#1c1c1e] transition-all hover:shadow-xl"
              >
                {/* Preview of first 5 screenshots with layouts */}
                <div className="flex gap-1 p-3 bg-[#0a0a0a]">
                  {set.screenshots.slice(0, 5).map((screenshot, i) => {
                    const layout = LAYOUT_PRESETS[screenshot.layout];
                    return (
                      <div
                        key={i}
                        className="flex-1 aspect-[9/16] rounded-lg overflow-hidden relative"
                        style={getBackgroundStyle(screenshot.background)}
                      >
                        {/* Mini text */}
                        <div className={cn(
                          "absolute left-0 right-0 px-0.5 text-center",
                          layout.textPosition === 'top' ? "top-1" : "bottom-1"
                        )}>
                          <div className="text-[4px] font-bold" style={{ color: screenshot.textColor }}>
                            {screenshot.headline.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>
                        {/* Mini device with layout */}
                        <div
                          className="absolute"
                          style={{
                            left: `${layout.position.x * 100}%`,
                            top: `${layout.position.y * 100}%`,
                            transform: `translate(-50%, -50%) rotate(${layout.rotation}deg) ${layout.perspective ? `perspective(100px) rotateY(${layout.perspective.rotateY}deg)` : ''}`,
                            width: `${layout.scale * 40}%`,
                          }}
                        >
                          <div
                            className="w-full aspect-[1/2.17] rounded border"
                            style={{ borderColor: screenshot.textColor + '40' }}
                          />
                        </div>
                        {/* Second device if exists */}
                        {layout.secondDevice && (
                          <div
                            className="absolute"
                            style={{
                              left: `${layout.secondDevice.position.x * 100}%`,
                              top: `${layout.secondDevice.position.y * 100}%`,
                              transform: `translate(-50%, -50%) rotate(${layout.secondDevice.rotation}deg)`,
                              width: `${layout.secondDevice.scale * 40}%`,
                            }}
                          >
                            <div
                              className="w-full aspect-[1/2.17] rounded border"
                              style={{ borderColor: screenshot.textColor + '40' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#f5f5f7] group-hover:text-[#0a84ff]">{set.name}</h3>
                    <div className="flex items-center gap-1 text-[#636366] group-hover:text-[#0a84ff]">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-xs">Preview</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8e8e93] mb-2">{set.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {/* Show unique layouts in this set */}
                    {[...new Set(set.screenshots.map(s => s.layout))].slice(0, 4).map(layout => (
                      <span key={layout} className="px-1.5 py-0.5 rounded bg-[#2c2c2e] text-[9px] text-[#8e8e93] capitalize">
                        {layout.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#38383a] flex items-center justify-between text-[#636366] text-xs">
          <span>{filteredSets.length} template sets</span>
          <span>Each includes 10 screenshots with varied device layouts</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
