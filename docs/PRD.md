# Product Requirements Document (PRD)
# Apple App Store Screenshot Generator

## Executive Summary

A web-based tool that enables app developers and marketers to generate professional App Store screenshots with customizable templates, device frames, localization support, and automatic resizing for all required Apple device sizes.

---

## Problem Statement

Creating App Store screenshots is a time-consuming and technically challenging process:
- Designers must create multiple versions for different device sizes (iPhone 6.9", 6.5", iPad 13", etc.)
- Localization requires recreating screenshots for each language
- Maintaining brand consistency across all screenshots is difficult
- Most existing tools are either expensive (Figma plugins) or limited in features

## Solution

A full-stack web application with:
- **Frontend**: Next.js 14+ with React, TypeScript, and Tailwind CSS
- **Backend**: Python FastAPI for image processing and generation
- **Features**: Template system, device frames, text customization, localization, batch export

---

## Target Users

1. **Indie App Developers** - Need quick, professional screenshots without design skills
2. **App Marketing Teams** - Require batch generation for multiple locales
3. **Design Agencies** - Need consistent templates for client apps

---

## App Store Screenshot Specifications

### Mandatory Requirements (2025)
| Device | Display Size | Resolution (Portrait) | Resolution (Landscape) |
|--------|-------------|----------------------|------------------------|
| **iPhone (Required)** | 6.9" | 1320×2868 / 1290×2796 / 1260×2736 | 2868×1320 / 2796×1290 / 2736×1260 |
| **iPhone** | 6.5" | 1284×2778 / 1242×2688 | 2778×1284 / 2688×1242 |
| **iPhone** | 6.1" | 1179×2556 / 1170×2532 | 2556×1179 / 2532×1170 |
| **iPhone** | 5.5" | 1242×2208 | 2208×1242 |
| **iPad (Required)** | 13" | 2064×2752 / 2048×2732 | 2752×2064 / 2732×2048 |
| **iPad** | 12.9" | 2048×2732 | 2732×2048 |
| **iPad** | 11" | 1668×2388 / 1640×2360 | 2388×1668 / 2360×1640 |
| **Apple Watch** | - | 422×514, 410×502, 396×484 | - |
| **Apple TV** | - | 1920×1080 / 3840×2160 | - |
| **Mac** | - | 2880×1800 / 2560×1600 | - |
| **Vision Pro** | - | 3840×2160 | - |

### Technical Requirements
- Format: PNG (24-bit, no transparency) or JPEG
- Resolution: 72 DPI
- Max file size: 8 MB per screenshot
- Max screenshots: 10 per locale

---

## Feature Requirements

### Phase 1: Core Features (MVP)

#### F1: Template System
- **F1.1**: Pre-built templates (minimal, gradient, lifestyle, feature-focused)
- **F1.2**: Template categories (productivity, social, games, utilities, health)
- **F1.3**: Background options: solid colors, gradients, images, patterns
- **F1.4**: Device frame styles: realistic, clay mockup, flat, no frame

**Template Styles (Based on Research):**
1. **Clean Minimal** - White/light background, simple text, device centered
2. **Gradient Bold** - Vibrant gradient backgrounds, large headlines
3. **Feature Highlight** - Annotations, callouts, feature spotlights
4. **Lifestyle Context** - Background imagery showing use context
5. **Dark Mode** - Dark backgrounds for night-mode apps
6. **Story Flow** - Connected narrative across multiple screenshots

#### F2: Image Upload & Processing
- **F2.1**: Drag-and-drop screenshot upload
- **F2.2**: Support for PNG, JPEG, WebP input formats
- **F2.3**: Automatic aspect ratio detection
- **F2.4**: Smart cropping/fitting to device frame
- **F2.5**: Bulk upload for multiple screenshots

#### F3: Text Customization
- **F3.1**: Headline text (3-5 words recommended)
- **F3.2**: Subtitle/description text
- **F3.3**: Font selection (system fonts + Google Fonts)
- **F3.4**: Text size, color, weight, alignment
- **F3.5**: Text background/highlight effects
- **F3.6**: Text position (top, bottom, overlay)

**Copywriting Guidelines (Built-in Tips):**
- Formula: Verb + Benefit + Result
- Examples: "Track habits. Build routines." / "Edit photos. Share instantly."
- Keep headlines to 3-5 words
- First 3 screenshots are most important (only 9% of users scroll)

#### F4: Device Frame Editor
- **F4.1**: iPhone models (15 Pro Max, 15, 14, SE, etc.)
- **F4.2**: iPad models (Pro 13", Air, mini)
- **F4.3**: Frame colors (Space Black, Silver, Gold, Blue, etc.)
- **F4.4**: Frame scale and position adjustment
- **F4.5**: Shadow and reflection effects

#### F5: Export System
- **F5.1**: Export to all required App Store sizes automatically
- **F5.2**: Batch export for multiple screenshots
- **F5.3**: Download as ZIP with organized folder structure
- **F5.4**: Preview at different sizes before export
- **F5.5**: File naming convention support

### Phase 2: Localization

#### F6: Multi-Language Support
- **F6.1**: Project-level locale management
- **F6.2**: Text translation per screenshot per locale
- **F6.3**: RTL language support (Arabic, Hebrew)
- **F6.4**: Font fallbacks for CJK characters
- **F6.5**: Locale-specific background/color schemes
- **F6.6**: Batch export per locale

**Supported Locales (App Store):**
English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese (Simplified/Traditional), Arabic, Dutch, Russian, Turkish, Thai, Vietnamese, Indonesian, Hindi, Polish, Swedish, Norwegian, Danish, Finnish, Greek, Czech, Romanian, Hungarian, Ukrainian, Hebrew

#### F7: Translation Integration
- **F7.1**: Manual text entry per locale
- **F7.2**: Import/export locale strings (JSON, CSV)
- **F7.3**: Optional: AI-powered translation suggestions
- **F7.4**: Translation memory for consistent terminology

### Phase 3: Advanced Features

#### F8: Project Management
- **F8.1**: Save projects for later editing
- **F8.2**: Project versioning
- **F8.3**: Duplicate projects
- **F8.4**: Export/import project files

#### F9: Collaboration (Future)
- **F9.1**: Team workspaces
- **F9.2**: Share projects via link
- **F9.3**: Comments and feedback

#### F10: Advanced Design
- **F10.1**: Custom device frame upload
- **F10.2**: Animation/video preview generation
- **F10.3**: A/B test variant generation
- **F10.4**: Badge overlays ("New!", "Sale", etc.)

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (Next.js 14 + React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Editor    │  │   Preview   │  │   Export Manager        │ │
│  │  Canvas     │  │   Panel     │  │   + Download            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Template   │  │    Text     │  │   Localization          │ │
│  │  Selector   │  │   Editor    │  │   Manager               │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API / WebSocket
┌────────────────────────────┴────────────────────────────────────┐
│                         BACKEND                                  │
│                    (Python FastAPI)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Image     │  │   Template  │  │   Export                │ │
│  │  Processor  │  │   Engine    │  │   Generator             │ │
│  │  (Pillow)   │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Font      │  │   Device    │  │   Localization          │ │
│  │   Manager   │  │   Frames    │  │   Service               │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                        STORAGE                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Assets    │  │   Projects  │  │   Generated             │ │
│  │  (Templates,│  │   (JSON)    │  │   Screenshots           │ │
│  │   Frames)   │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 (App Router) | SSR, routing, API routes |
| UI Library | React 18 | Component-based UI |
| Styling | Tailwind CSS + shadcn/ui | Rapid styling, accessible components |
| State | Zustand | Lightweight state management |
| Canvas | Fabric.js or Konva.js | Interactive canvas editing |
| Uploads | react-dropzone | Drag-and-drop file uploads |
| i18n | next-intl | Frontend localization |
| HTTP | Axios / fetch | API communication |

### Backend Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | FastAPI | High-performance API |
| Image Processing | Pillow (PIL) | Image manipulation |
| Advanced Graphics | Cairo / Pycairo | Vector graphics, text rendering |
| Font Handling | fonttools | Font management |
| File Storage | Local / S3 | Asset and project storage |
| Task Queue | Celery + Redis (optional) | Background processing |
| Validation | Pydantic | Request/response validation |

### API Endpoints

```
POST   /api/projects              - Create new project
GET    /api/projects/:id          - Get project details
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project

GET    /api/templates             - List all templates
GET    /api/templates/:id         - Get template details

POST   /api/upload                - Upload screenshot image
DELETE /api/upload/:id            - Delete uploaded image

POST   /api/generate/preview      - Generate preview image
POST   /api/generate/export       - Generate final exports (all sizes)
GET    /api/generate/status/:id   - Check export job status
GET    /api/generate/download/:id - Download exported ZIP

GET    /api/devices               - List device frames
GET    /api/fonts                 - List available fonts

GET    /api/locales               - List supported locales
POST   /api/translate             - Translate text (optional AI)
```

### Data Models

```typescript
// Project
interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  screenshots: Screenshot[];
  locales: string[];
  defaultLocale: string;
}

// Screenshot
interface Screenshot {
  id: string;
  order: number;
  template: TemplateConfig;
  device: DeviceConfig;
  image: ImageConfig;
  texts: LocalizedText[];
}

// Template Configuration
interface TemplateConfig {
  id: string;
  background: {
    type: 'solid' | 'gradient' | 'image' | 'pattern';
    value: string | GradientConfig | ImageConfig;
  };
  layout: 'device-center' | 'device-left' | 'device-right' | 'full-bleed';
  textPosition: 'top' | 'bottom' | 'overlay';
}

// Device Configuration
interface DeviceConfig {
  model: string;  // 'iphone-15-pro-max', 'ipad-pro-13', etc.
  color: string;  // 'space-black', 'silver', etc.
  style: 'realistic' | 'clay' | 'flat' | 'none';
  scale: number;
  position: { x: number; y: number };
  shadow: boolean;
  rotation: number;
}

// Image Configuration
interface ImageConfig {
  url: string;
  fit: 'contain' | 'cover' | 'fill';
  position: { x: number; y: number };
}

// Localized Text
interface LocalizedText {
  id: string;
  type: 'headline' | 'subtitle' | 'badge';
  translations: Record<string, string>;  // locale -> text
  style: TextStyle;
}

// Text Style
interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  background?: {
    enabled: boolean;
    color: string;
    padding: number;
    borderRadius: number;
  };
}

// Export Configuration
interface ExportConfig {
  devices: string[];       // Which device sizes to export
  locales: string[];       // Which locales to export
  format: 'png' | 'jpeg';
  quality: number;         // 1-100 for JPEG
  naming: string;          // Naming pattern: '{locale}/{device}/{index}'
}
```

---

## UI/UX Design

### Main Editor Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  Logo    Project Name ▼    [Templates] [Devices] [Export]    [Save]   │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌────────────────────────────────┐ ┌────────────────┐ │
│ │              │ │                                │ │                │ │
│ │  Screenshot  │ │                                │ │   Properties   │ │
│ │    List      │ │       Canvas / Preview         │ │     Panel      │ │
│ │              │ │                                │ │                │ │
│ │  [1] ░░░░░   │ │    ┌─────────────────────┐    │ │  Template      │ │
│ │  [2] ░░░░░   │ │    │                     │    │ │  ────────────  │ │
│ │  [3] ░░░░░   │ │    │   "Track habits.    │    │ │  Background:   │ │
│ │  [4] ░░░░░   │ │    │    Build routines." │    │ │   [Gradient ▼] │ │
│ │  [5] ░░░░░   │ │    │                     │    │ │                │ │
│ │              │ │    │  ┌───────────────┐  │    │ │  Device        │ │
│ │  [+ Add]     │ │    │  │    iPhone     │  │    │ │  ────────────  │ │
│ │              │ │    │  │    Screen     │  │    │ │  Model:        │ │
│ │              │ │    │  │               │  │    │ │   [iPhone 15▼] │ │
│ │              │ │    │  └───────────────┘  │    │ │  Color:        │ │
│ │              │ │    │                     │    │ │   [Black ▼]    │ │
│ │              │ │    └─────────────────────┘    │ │                │ │
│ │              │ │                                │ │  Text          │ │
│ │              │ │                                │ │  ────────────  │ │
│ │              │ │                                │ │  Headline:     │ │
│ └──────────────┘ └────────────────────────────────┘ │  [___________] │ │
│                                                     │                │ │
│ ┌─────────────────────────────────────────────────┐ │  Locale: [EN▼] │ │
│ │  [EN] [ES] [FR] [DE] [JA] [KO] [ZH] [+]         │ └────────────────┘ │
│ └─────────────────────────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Template Gallery Modal

```
┌────────────────────────────────────────────────────────────────────────┐
│  Choose Template                                           [×]         │
├────────────────────────────────────────────────────────────────────────┤
│  [All] [Minimal] [Gradient] [Feature] [Dark] [Lifestyle]               │
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│  Clean White    Blue Gradient  Feature Box   Dark Mode                 │
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│  Sunset        Pink Glow      Lifestyle      Annotation                │
└────────────────────────────────────────────────────────────────────────┘
```

### Export Dialog

```
┌────────────────────────────────────────────────────────────────────────┐
│  Export Screenshots                                        [×]         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Devices                                                               │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ [✓] iPhone 6.9" (1320×2868) - Required                         │   │
│  │ [✓] iPhone 6.5" (1284×2778)                                    │   │
│  │ [ ] iPhone 6.1" (1179×2556)                                    │   │
│  │ [✓] iPad 13" (2064×2752) - Required                            │   │
│  │ [ ] iPad 12.9" (2048×2732)                                     │   │
│  │ [ ] Apple Watch (422×514)                                      │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  Locales                                                               │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ [✓] English (en)                                               │   │
│  │ [✓] Spanish (es)                                               │   │
│  │ [✓] Japanese (ja)                                              │   │
│  │ [ ] German (de)                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  Format: [PNG ▼]    Quality: [━━━━━━━━○━] 90%                         │
│                                                                        │
│  Output: 6 devices × 3 locales × 5 screenshots = 90 images            │
│                                                                        │
│                              [Cancel]  [Export & Download]             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Development Roadmap

### Phase 1: MVP (Core Features)
- Project setup (Next.js + FastAPI)
- Basic editor with canvas
- 6 built-in templates
- iPhone device frames (3 models)
- Text headline/subtitle
- Export to iPhone 6.9" and 6.5"
- Single locale support

### Phase 2: Full Device Support
- All iPhone sizes
- iPad device frames and sizes
- Apple Watch support
- Multiple device frame styles
- Background customization
- Advanced text styling

### Phase 3: Localization
- Multi-locale project support
- Locale switcher in editor
- Import/export translations
- RTL language support
- Locale-specific exports

### Phase 4: Advanced Features
- Project save/load
- More templates
- Custom backgrounds
- Badge overlays
- Mac and Apple TV support

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to first export | < 5 minutes |
| Screenshots per session | 5-10 average |
| Export success rate | > 99% |
| Supported locales per project | 10+ |

---

## Competitive Analysis

| Feature | Our Tool | AppMockUp | Figma Templates |
|---------|----------|-----------|-----------------|
| Free tier | Yes | Yes | Yes |
| No account required | Yes | Yes | No (Figma account) |
| Auto-resize all sizes | Yes | Limited | No (manual) |
| Localization built-in | Yes | No | No |
| Device frames | Yes | Yes | Varies |
| Web-based | Yes | Yes | Yes |
| Batch export | Yes | Limited | No |

---

## References

- [Apple Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)
- [SplitMetrics ASO Guide](https://splitmetrics.com/blog/app-store-screenshots-aso-guide/)
- [MobileAction Screenshot Guide](https://www.mobileaction.co/guide/app-screenshot-sizes-and-guidelines-for-the-app-store/)
- [AppMockUp](https://app-mockup.com/)
- [Figma App Store Templates](https://www.figma.com/community/file/1198162612398400646/app-store-screenshot-template)
- [Moburst Screenshot Best Practices](https://www.moburst.com/blog/app-screenshots/)
- [ASO Screenshot Guide](https://www.storemaven.com/academy/aso-screenshot-guide/)
