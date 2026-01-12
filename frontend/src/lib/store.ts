import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  Project,
  ScreenshotConfig,
  TemplateConfig,
  DeviceConfig,
  LocalizedText,
  TextStyle,
  BackgroundConfig,
  ExportConfig,
  SocialProofElement,
  NotificationElement,
  BadgeOverlayElement,
} from '@/types';

// Default values - Using modern Inter font
const defaultTextStyle: TextStyle = {
  fontFamily: 'Inter',
  fontSize: 120,
  fontWeight: 700,
  color: '#FFFFFF',
  alignment: 'center',
  lineHeight: 1.2,
  letterSpacing: 0,
};

const defaultDeviceConfig: DeviceConfig = {
  model: 'iphone-6.9',
  color: 'natural-titanium',
  style: 'realistic',
  scale: 0.75,
  positionX: 0.5,
  positionY: 0.55,
  shadow: true,
  shadowBlur: 40,
  shadowOpacity: 0.3,
  rotation: 0,
};

const defaultBackground: BackgroundConfig = {
  type: 'solid',
  color: '#FFFFFF',
};

const defaultTemplate: TemplateConfig = {
  id: 'clean-white',
  name: 'Clean White',
  background: defaultBackground,
  textPosition: 'top',
  deviceLayout: 'center',
};

const createDefaultScreenshot = (order: number): ScreenshotConfig => ({
  id: uuid(),
  order,
  template: { ...defaultTemplate },
  device: { ...defaultDeviceConfig },
  texts: [
    {
      id: uuid(),
      type: 'headline',
      translations: { en: 'Your headline here' },
      style: { ...defaultTextStyle },
      positionY: 0.08,
    },
    {
      id: uuid(),
      type: 'subtitle',
      translations: { en: 'Add a subtitle to explain your feature' },
      style: { ...defaultTextStyle, fontSize: 32, fontWeight: 400, color: '#666666' },
      positionY: 0.14,
    },
  ],
});

// ============================================
// HISTORY SYSTEM (UNDO/REDO)
// ============================================
const MAX_HISTORY_SIZE = 50;

interface HistoryEntry {
  project: Project;
  selectedScreenshotId: string | null;
  selectedTextId: string | null;
  timestamp: number;
  action: string; // Description of what changed
}

// ============================================
// BRAND KIT
// ============================================
export interface BrandKit {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logoUrl?: string;
}

// ============================================
// CANVAS STATE (ZOOM/PAN)
// ============================================
interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

interface EditorState {
  // Project
  project: Project;

  // Selection
  selectedScreenshotId: string | null;
  selectedTextId: string | null;
  currentLocale: string;

  // UI State
  showTemplateGallery: boolean;
  showExportDialog: boolean;
  isGeneratingPreview: boolean;
  previewUrl: string | null;
  showStorePreview: boolean;
  showBrandKitDialog: boolean;
  showPatternGenerator: boolean;

  // Canvas state (zoom/pan)
  canvasState: CanvasState;

  // History (Undo/Redo)
  history: HistoryEntry[];
  historyIndex: number;
  isUndoRedoAction: boolean;

  // Brand Kit
  brandKits: BrandKit[];
  activeBrandKitId: string | null;

  // Export
  exportConfig: ExportConfig;
  exportJobId: string | null;
  exportStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  exportProgress: number;

  // Clipboard (for copy/paste)
  clipboard: {
    type: 'screenshot' | 'text' | 'socialProof' | null;
    data: ScreenshotConfig | LocalizedText | SocialProofElement | null;
  };

  // Actions - History
  undo: () => void;
  redo: () => void;
  pushHistory: (action: string) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Actions - Canvas
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;

  // Actions - Project
  setProjectName: (name: string) => void;
  addLocale: (locale: string) => void;
  removeLocale: (locale: string) => void;
  setDefaultLocale: (locale: string) => void;

  // Actions - Screenshots
  addScreenshot: () => void;
  removeScreenshot: (id: string) => void;
  duplicateScreenshot: (id: string) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  selectScreenshot: (id: string) => void;
  updateScreenshot: (id: string, updates: Partial<ScreenshotConfig>) => void;
  updateScreenshotLayout: (screenshotId: string, layout: string) => void;
  copyScreenshot: (id: string) => void;
  pasteScreenshot: () => void;
  selectNextScreenshot: () => void;
  selectPrevScreenshot: () => void;

  // Actions - Template
  setTemplate: (screenshotId: string, template: TemplateConfig) => void;
  updateBackground: (screenshotId: string, background: BackgroundConfig) => void;

  // Actions - Device
  updateDevice: (screenshotId: string, device: Partial<DeviceConfig>) => void;
  updateDeviceAll: (device: Partial<DeviceConfig>) => void;
  setScreenshotImage: (screenshotId: string, imageUrl: string) => void;
  nudgeDevice: (screenshotId: string, direction: 'up' | 'down' | 'left' | 'right', amount?: number) => void;

  // Actions - Text
  selectText: (id: string | null) => void;
  addText: (screenshotId: string, type: 'headline' | 'subtitle' | 'badge') => void;
  removeText: (screenshotId: string, textId: string) => void;
  updateText: (screenshotId: string, textId: string, updates: Partial<LocalizedText>) => void;
  updateTextTranslation: (screenshotId: string, textId: string, locale: string, text: string) => void;
  updateTextStyle: (screenshotId: string, textId: string, style: Partial<TextStyle>) => void;
  nudgeText: (screenshotId: string, textId: string, direction: 'up' | 'down', amount?: number) => void;
  copyText: (textId: string) => void;
  pasteText: (screenshotId: string) => void;

  // Actions - Locale
  setCurrentLocale: (locale: string) => void;

  // Actions - UI
  setShowTemplateGallery: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setPreviewUrl: (url: string | null) => void;
  setIsGeneratingPreview: (generating: boolean) => void;
  setShowStorePreview: (show: boolean) => void;
  setShowBrandKitDialog: (show: boolean) => void;
  setShowPatternGenerator: (show: boolean) => void;

  // Actions - Export
  updateExportConfig: (config: Partial<ExportConfig>) => void;
  setExportJob: (jobId: string | null, status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed', progress: number) => void;

  // Actions - Bulk Import
  showBulkImportDialog: boolean;
  setShowBulkImportDialog: (show: boolean) => void;
  bulkImportScreenshots: (images: { url: string; filename: string; headline: string; subtitle: string }[]) => void;
  applyHeadlineToAll: (headline: string, locale: string) => void;
  applySubtitleToAll: (subtitle: string, locale: string) => void;
  applyTemplateToAll: (template: TemplateConfig) => void;

  // Social Proof actions
  addSocialProof: (screenshotId: string, element: SocialProofElement) => void;
  updateSocialProof: (screenshotId: string, elementId: string, updates: Partial<SocialProofElement>) => void;
  removeSocialProof: (screenshotId: string, elementId: string) => void;
  toggleSocialProof: (screenshotId: string, elementId: string) => void;
  applySocialProofToAll: (element: SocialProofElement) => void;

  // Notification actions
  addNotification: (screenshotId: string, notification: NotificationElement) => void;
  updateNotification: (screenshotId: string, notificationId: string, updates: Partial<NotificationElement>) => void;
  removeNotification: (screenshotId: string, notificationId: string) => void;
  toggleNotification: (screenshotId: string, notificationId: string) => void;

  // Badge Overlay actions
  addBadge: (screenshotId: string, badge: BadgeOverlayElement) => void;
  updateBadge: (screenshotId: string, badgeId: string, updates: Partial<BadgeOverlayElement>) => void;
  removeBadge: (screenshotId: string, badgeId: string) => void;
  toggleBadge: (screenshotId: string, badgeId: string) => void;
  applyBadgeToAll: (badge: BadgeOverlayElement) => void;

  // Brand Kit actions
  addBrandKit: (kit: Omit<BrandKit, 'id'>) => void;
  updateBrandKit: (id: string, updates: Partial<BrandKit>) => void;
  removeBrandKit: (id: string) => void;
  setActiveBrandKit: (id: string | null) => void;
  applyBrandKit: (kitId: string) => void;

  // Project persistence actions
  savedProjects: SavedProject[];
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  createNewProject: () => void;
  renameProject: (name: string) => void;
  showProjectManager: boolean;
  setShowProjectManager: (show: boolean) => void;

  // Helpers
  getSelectedScreenshot: () => ScreenshotConfig | undefined;
  getSelectedText: () => LocalizedText | undefined;
  deleteSelected: () => void;
}

// Saved project metadata
export interface SavedProject {
  id: string;
  name: string;
  lastModified: number;
  thumbnailUrl?: string;
  screenshotCount: number;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  project: {
    id: uuid(),
    name: 'Untitled Project',
    screenshots: [createDefaultScreenshot(0)],
    locales: ['en'],
    defaultLocale: 'en',
  },

  selectedScreenshotId: null,
  selectedTextId: null,
  currentLocale: 'en',

  showTemplateGallery: false,
  showExportDialog: false,
  showBulkImportDialog: false,
  showStorePreview: false,
  showBrandKitDialog: false,
  showPatternGenerator: false,
  isGeneratingPreview: false,
  previewUrl: null,

  // Canvas state
  canvasState: {
    zoom: 1,
    panX: 0,
    panY: 0,
  },

  // History
  history: [],
  historyIndex: -1,
  isUndoRedoAction: false,

  // Brand Kits
  brandKits: [],
  activeBrandKitId: null,

  // Clipboard
  clipboard: {
    type: null,
    data: null,
  },

  exportConfig: {
    devices: ['iphone-6.9', 'iphone-6.5', 'ipad-13'],
    locales: ['en'],
    format: 'png',
    quality: 95,
    namingPattern: '{locale}/{device}/{index}',
  },
  exportJobId: null,
  exportStatus: 'idle',
  exportProgress: 0,

  // Saved Projects
  savedProjects: [],
  showProjectManager: false,

  // ============================================
  // HISTORY ACTIONS (UNDO/REDO)
  // ============================================
  pushHistory: (action) => {
    const state = get();
    if (state.isUndoRedoAction) return;

    const entry: HistoryEntry = {
      project: JSON.parse(JSON.stringify(state.project)),
      selectedScreenshotId: state.selectedScreenshotId,
      selectedTextId: state.selectedTextId,
      timestamp: Date.now(),
      action,
    };

    // Remove any future history if we're not at the end
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

    // Keep history size manageable
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex < 0) return;

    const entry = state.history[state.historyIndex];
    if (!entry) return;

    set({
      isUndoRedoAction: true,
      project: JSON.parse(JSON.stringify(entry.project)),
      selectedScreenshotId: entry.selectedScreenshotId,
      selectedTextId: entry.selectedTextId,
      historyIndex: state.historyIndex - 1,
    });

    // Reset flag after state update
    setTimeout(() => set({ isUndoRedoAction: false }), 0);
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const entry = state.history[state.historyIndex + 1];
    if (!entry) return;

    set({
      isUndoRedoAction: true,
      project: JSON.parse(JSON.stringify(entry.project)),
      selectedScreenshotId: entry.selectedScreenshotId,
      selectedTextId: entry.selectedTextId,
      historyIndex: state.historyIndex + 1,
    });

    // Reset flag after state update
    setTimeout(() => set({ isUndoRedoAction: false }), 0);
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex >= 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  // ============================================
  // CANVAS ACTIONS (ZOOM/PAN)
  // ============================================
  setZoom: (zoom) => set((state) => ({
    canvasState: { ...state.canvasState, zoom: Math.max(0.1, Math.min(5, zoom)) },
  })),

  setPan: (x, y) => set((state) => ({
    canvasState: { ...state.canvasState, panX: x, panY: y },
  })),

  resetCanvas: () => set({
    canvasState: { zoom: 1, panX: 0, panY: 0 },
  }),

  zoomIn: () => set((state) => ({
    canvasState: { ...state.canvasState, zoom: Math.min(5, state.canvasState.zoom * 1.2) },
  })),

  zoomOut: () => set((state) => ({
    canvasState: { ...state.canvasState, zoom: Math.max(0.1, state.canvasState.zoom / 1.2) },
  })),

  fitToScreen: () => set({
    canvasState: { zoom: 1, panX: 0, panY: 0 },
  }),

  // Project actions
  setProjectName: (name) => {
    get().pushHistory('Change project name');
    set((state) => ({
      project: { ...state.project, name },
    }));
  },

  addLocale: (locale) => {
    get().pushHistory('Add locale');
    set((state) => ({
      project: {
        ...state.project,
        locales: [...state.project.locales, locale],
      },
    }));
  },

  removeLocale: (locale) => {
    get().pushHistory('Remove locale');
    set((state) => ({
      project: {
        ...state.project,
        locales: state.project.locales.filter((l) => l !== locale),
      },
    }));
  },

  setDefaultLocale: (locale) => {
    get().pushHistory('Set default locale');
    set((state) => ({
      project: { ...state.project, defaultLocale: locale },
      currentLocale: locale,
    }));
  },

  // Screenshot actions
  addScreenshot: () => {
    get().pushHistory('Add screenshot');
    set((state) => {
      const newScreenshot = createDefaultScreenshot(state.project.screenshots.length);
      return {
        project: {
          ...state.project,
          screenshots: [...state.project.screenshots, newScreenshot],
        },
        selectedScreenshotId: newScreenshot.id,
      };
    });
  },

  removeScreenshot: (id) => {
    get().pushHistory('Remove screenshot');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.filter((s) => s.id !== id),
      },
      selectedScreenshotId: state.selectedScreenshotId === id ? null : state.selectedScreenshotId,
    }));
  },

  duplicateScreenshot: (id) => {
    get().pushHistory('Duplicate screenshot');
    set((state) => {
      const screenshot = state.project.screenshots.find((s) => s.id === id);
      if (!screenshot) return state;

      const duplicate: ScreenshotConfig = {
        ...JSON.parse(JSON.stringify(screenshot)),
        id: uuid(),
        order: state.project.screenshots.length,
      };

      return {
        project: {
          ...state.project,
          screenshots: [...state.project.screenshots, duplicate],
        },
        selectedScreenshotId: duplicate.id,
      };
    });
  },

  reorderScreenshots: (fromIndex, toIndex) => {
    get().pushHistory('Reorder screenshots');
    set((state) => {
      const screenshots = [...state.project.screenshots];
      const [removed] = screenshots.splice(fromIndex, 1);
      screenshots.splice(toIndex, 0, removed);

      return {
        project: {
          ...state.project,
          screenshots: screenshots.map((s, i) => ({ ...s, order: i })),
        },
      };
    });
  },

  selectScreenshot: (id) => set({ selectedScreenshotId: id, selectedTextId: null }),

  updateScreenshot: (id, updates) => {
    get().pushHistory('Update screenshot');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    }));
  },

  updateScreenshotLayout: (screenshotId, layout) => {
    get().pushHistory('Update layout');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId ? { ...s, layout } : s
        ),
      },
    }));
  },

  copyScreenshot: (id) => {
    const state = get();
    const screenshot = state.project.screenshots.find((s) => s.id === id);
    if (screenshot) {
      set({
        clipboard: {
          type: 'screenshot',
          data: JSON.parse(JSON.stringify(screenshot)),
        },
      });
    }
  },

  pasteScreenshot: () => {
    const state = get();
    if (state.clipboard.type !== 'screenshot' || !state.clipboard.data) return;

    get().pushHistory('Paste screenshot');
    const screenshot = state.clipboard.data as ScreenshotConfig;
    const newScreenshot: ScreenshotConfig = {
      ...JSON.parse(JSON.stringify(screenshot)),
      id: uuid(),
      order: state.project.screenshots.length,
    };

    set((state) => ({
      project: {
        ...state.project,
        screenshots: [...state.project.screenshots, newScreenshot],
      },
      selectedScreenshotId: newScreenshot.id,
    }));
  },

  selectNextScreenshot: () => {
    const state = get();
    const currentIndex = state.project.screenshots.findIndex(
      (s) => s.id === state.selectedScreenshotId
    );
    const nextIndex = Math.min(currentIndex + 1, state.project.screenshots.length - 1);
    const nextScreenshot = state.project.screenshots[nextIndex];
    if (nextScreenshot) {
      set({ selectedScreenshotId: nextScreenshot.id, selectedTextId: null });
    }
  },

  selectPrevScreenshot: () => {
    const state = get();
    const currentIndex = state.project.screenshots.findIndex(
      (s) => s.id === state.selectedScreenshotId
    );
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevScreenshot = state.project.screenshots[prevIndex];
    if (prevScreenshot) {
      set({ selectedScreenshotId: prevScreenshot.id, selectedTextId: null });
    }
  },

  // Template actions
  setTemplate: (screenshotId, template) => {
    get().pushHistory('Change template');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId ? { ...s, template } : s
        ),
      },
    }));
  },

  updateBackground: (screenshotId, background) => {
    get().pushHistory('Update background');
    // Apply background to ALL screenshots for consistency
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          template: { ...s.template, background }
        })),
      },
    }));
  },

  // Device actions
  updateDevice: (screenshotId, device) => {
    get().pushHistory('Update device');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, device: { ...s.device, ...device } }
            : s
        ),
      },
    }));
  },

  updateDeviceAll: (device) => {
    get().pushHistory('Update all devices');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          device: { ...s.device, ...device }
        })),
      },
    }));
  },

  setScreenshotImage: (screenshotId, imageUrl) => {
    get().pushHistory('Set screenshot image');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, image: { url: imageUrl, fit: 'cover', positionX: 0.5, positionY: 0.5 } }
            : s
        ),
      },
    }));
  },

  nudgeDevice: (screenshotId, direction, amount = 0.01) => {
    const state = get();
    const screenshot = state.project.screenshots.find((s) => s.id === screenshotId);
    if (!screenshot) return;

    const updates: Partial<DeviceConfig> = {};
    switch (direction) {
      case 'up':
        updates.positionY = Math.max(0, screenshot.device.positionY - amount);
        break;
      case 'down':
        updates.positionY = Math.min(1, screenshot.device.positionY + amount);
        break;
      case 'left':
        updates.positionX = Math.max(0, screenshot.device.positionX - amount);
        break;
      case 'right':
        updates.positionX = Math.min(1, screenshot.device.positionX + amount);
        break;
    }

    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, device: { ...s.device, ...updates } }
            : s
        ),
      },
    }));
  },

  // Text actions
  selectText: (id) => set({ selectedTextId: id }),

  addText: (screenshotId, type) => {
    get().pushHistory('Add text');
    set((state) => {
      const newText: LocalizedText = {
        id: uuid(),
        type,
        translations: { [state.currentLocale]: type === 'headline' ? 'New headline' : 'New text' },
        style: {
          ...defaultTextStyle,
          fontSize: type === 'headline' ? 120 : type === 'subtitle' ? 32 : 24,
          fontWeight: type === 'headline' ? 700 : 400,
        },
        positionY: type === 'headline' ? 0.08 : type === 'subtitle' ? 0.14 : 0.9,
      };

      return {
        project: {
          ...state.project,
          screenshots: state.project.screenshots.map((s) =>
            s.id === screenshotId
              ? { ...s, texts: [...s.texts, newText] }
              : s
          ),
        },
        selectedTextId: newText.id,
      };
    });
  },

  removeText: (screenshotId, textId) => {
    get().pushHistory('Remove text');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, texts: s.texts.filter((t) => t.id !== textId) }
            : s
        ),
      },
      selectedTextId: state.selectedTextId === textId ? null : state.selectedTextId,
    }));
  },

  updateText: (screenshotId, textId, updates) => {
    get().pushHistory('Update text');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                texts: s.texts.map((t) =>
                  t.id === textId ? { ...t, ...updates } : t
                ),
              }
            : s
        ),
      },
    }));
  },

  updateTextTranslation: (screenshotId, textId, locale, text) => {
    get().pushHistory('Update translation');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                texts: s.texts.map((t) =>
                  t.id === textId
                    ? { ...t, translations: { ...t.translations, [locale]: text } }
                    : t
                ),
              }
            : s
        ),
      },
    }));
  },

  updateTextStyle: (screenshotId, textId, style) => {
    get().pushHistory('Update text style');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                texts: s.texts.map((t) =>
                  t.id === textId
                    ? { ...t, style: { ...t.style, ...style } }
                    : t
                ),
              }
            : s
        ),
      },
    }));
  },

  nudgeText: (screenshotId, textId, direction, amount = 0.01) => {
    const state = get();
    const screenshot = state.project.screenshots.find((s) => s.id === screenshotId);
    if (!screenshot) return;

    const text = screenshot.texts.find((t) => t.id === textId);
    if (!text) return;

    const newY = direction === 'up'
      ? Math.max(0, text.positionY - amount)
      : Math.min(1, text.positionY + amount);

    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                texts: s.texts.map((t) =>
                  t.id === textId ? { ...t, positionY: newY } : t
                ),
              }
            : s
        ),
      },
    }));
  },

  copyText: (textId) => {
    const state = get();
    const screenshot = state.getSelectedScreenshot();
    if (!screenshot) return;

    const text = screenshot.texts.find((t) => t.id === textId);
    if (text) {
      set({
        clipboard: {
          type: 'text',
          data: JSON.parse(JSON.stringify(text)),
        },
      });
    }
  },

  pasteText: (screenshotId) => {
    const state = get();
    if (state.clipboard.type !== 'text' || !state.clipboard.data) return;

    get().pushHistory('Paste text');
    const text = state.clipboard.data as LocalizedText;
    const newText: LocalizedText = {
      ...JSON.parse(JSON.stringify(text)),
      id: uuid(),
      positionY: text.positionY + 0.05, // Offset slightly
    };

    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, texts: [...s.texts, newText] }
            : s
        ),
      },
      selectedTextId: newText.id,
    }));
  },

  // Locale actions
  setCurrentLocale: (locale) => set({ currentLocale: locale }),

  // UI actions
  setShowTemplateGallery: (show) => set({ showTemplateGallery: show }),
  setShowExportDialog: (show) => set({ showExportDialog: show }),
  setShowBulkImportDialog: (show) => set({ showBulkImportDialog: show }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setIsGeneratingPreview: (generating) => set({ isGeneratingPreview: generating }),
  setShowStorePreview: (show) => set({ showStorePreview: show }),
  setShowBrandKitDialog: (show) => set({ showBrandKitDialog: show }),
  setShowPatternGenerator: (show) => set({ showPatternGenerator: show }),

  // Bulk Import actions
  bulkImportScreenshots: (images) => {
    get().pushHistory('Bulk import');
    set((state) => {
      const newScreenshots: ScreenshotConfig[] = images.map((img, index) => ({
        id: uuid(),
        order: index,
        template: { ...defaultTemplate },
        device: { ...defaultDeviceConfig },
        image: { url: img.url, fit: 'cover', positionX: 0.5, positionY: 0.5 },
        texts: [
          {
            id: uuid(),
            type: 'headline' as const,
            translations: { [state.currentLocale]: img.headline },
            style: { ...defaultTextStyle },
            positionY: 0.08,
          },
          ...(img.subtitle ? [{
            id: uuid(),
            type: 'subtitle' as const,
            translations: { [state.currentLocale]: img.subtitle },
            style: { ...defaultTextStyle, fontSize: 32, fontWeight: 400, color: '#666666' },
            positionY: 0.14,
          }] : []),
        ],
      }));

      return {
        project: {
          ...state.project,
          screenshots: newScreenshots,
        },
        selectedScreenshotId: newScreenshots[0]?.id || null,
        showBulkImportDialog: false,
      };
    });
  },

  applyHeadlineToAll: (headline, locale) => {
    get().pushHistory('Apply headline to all');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          texts: s.texts.map((t) =>
            t.type === 'headline'
              ? { ...t, translations: { ...t.translations, [locale]: headline } }
              : t
          ),
        })),
      },
    }));
  },

  applySubtitleToAll: (subtitle, locale) => {
    get().pushHistory('Apply subtitle to all');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          texts: s.texts.map((t) =>
            t.type === 'subtitle'
              ? { ...t, translations: { ...t.translations, [locale]: subtitle } }
              : t
          ),
        })),
      },
    }));
  },

  applyTemplateToAll: (template) => {
    get().pushHistory('Apply template to all');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          template,
        })),
      },
    }));
  },

  // Social Proof actions
  addSocialProof: (screenshotId, element) => {
    get().pushHistory('Add social proof');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, socialProof: [...(s.socialProof || []), element] }
            : s
        ),
      },
    }));
  },

  updateSocialProof: (screenshotId, elementId, updates) => {
    get().pushHistory('Update social proof');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                socialProof: (s.socialProof || []).map((sp) =>
                  sp.id === elementId ? { ...sp, ...updates } : sp
                ),
              }
            : s
        ),
      },
    }));
  },

  removeSocialProof: (screenshotId, elementId) => {
    get().pushHistory('Remove social proof');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, socialProof: (s.socialProof || []).filter((sp) => sp.id !== elementId) }
            : s
        ),
      },
    }));
  },

  toggleSocialProof: (screenshotId, elementId) => {
    get().pushHistory('Toggle social proof');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                socialProof: (s.socialProof || []).map((sp) =>
                  sp.id === elementId ? { ...sp, enabled: !sp.enabled } : sp
                ),
              }
            : s
        ),
      },
    }));
  },

  applySocialProofToAll: (element) => {
    get().pushHistory('Apply social proof to all');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => {
          // Check if this screenshot already has this type of social proof
          const existingIndex = (s.socialProof || []).findIndex(
            (sp) => sp.type === element.type
          );
          const newElement = { ...element, id: uuid() };

          if (existingIndex >= 0) {
            // Update existing element of same type
            return {
              ...s,
              socialProof: (s.socialProof || []).map((sp, idx) =>
                idx === existingIndex ? newElement : sp
              ),
            };
          } else {
            // Add new element
            return {
              ...s,
              socialProof: [...(s.socialProof || []), newElement],
            };
          }
        }),
      },
    }));
  },

  // Notification actions
  addNotification: (screenshotId, notification) => {
    get().pushHistory('Add notification');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, notifications: [...(s.notifications || []), notification] }
            : s
        ),
      },
    }));
  },

  updateNotification: (screenshotId, notificationId, updates) => {
    get().pushHistory('Update notification');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                notifications: (s.notifications || []).map((n) =>
                  n.id === notificationId ? { ...n, ...updates } : n
                ),
              }
            : s
        ),
      },
    }));
  },

  removeNotification: (screenshotId, notificationId) => {
    get().pushHistory('Remove notification');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, notifications: (s.notifications || []).filter((n) => n.id !== notificationId) }
            : s
        ),
      },
    }));
  },

  toggleNotification: (screenshotId, notificationId) => {
    get().pushHistory('Toggle notification');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                notifications: (s.notifications || []).map((n) =>
                  n.id === notificationId ? { ...n, enabled: !n.enabled } : n
                ),
              }
            : s
        ),
      },
    }));
  },

  // Badge Overlay actions
  addBadge: (screenshotId, badge) => {
    get().pushHistory('Add badge');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, badges: [...(s.badges || []), badge] }
            : s
        ),
      },
    }));
  },

  updateBadge: (screenshotId, badgeId, updates) => {
    get().pushHistory('Update badge');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                badges: (s.badges || []).map((b) =>
                  b.id === badgeId ? { ...b, ...updates } : b
                ),
              }
            : s
        ),
      },
    }));
  },

  removeBadge: (screenshotId, badgeId) => {
    get().pushHistory('Remove badge');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? { ...s, badges: (s.badges || []).filter((b) => b.id !== badgeId) }
            : s
        ),
      },
    }));
  },

  toggleBadge: (screenshotId, badgeId) => {
    get().pushHistory('Toggle badge');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) =>
          s.id === screenshotId
            ? {
                ...s,
                badges: (s.badges || []).map((b) =>
                  b.id === badgeId ? { ...b, enabled: !b.enabled } : b
                ),
              }
            : s
        ),
      },
    }));
  },

  applyBadgeToAll: (badge) => {
    get().pushHistory('Apply badge to all');
    set((state) => ({
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => {
          const existingIndex = (s.badges || []).findIndex(
            (b) => b.type === badge.type
          );
          const newBadge = { ...badge, id: uuid() };

          if (existingIndex >= 0) {
            return {
              ...s,
              badges: (s.badges || []).map((b, idx) =>
                idx === existingIndex ? newBadge : b
              ),
            };
          } else {
            return {
              ...s,
              badges: [...(s.badges || []), newBadge],
            };
          }
        }),
      },
    }));
  },

  // Brand Kit actions
  addBrandKit: (kit) => {
    const id = uuid();
    set((state) => ({
      brandKits: [...state.brandKits, { ...kit, id }],
    }));
  },

  updateBrandKit: (id, updates) => set((state) => ({
    brandKits: state.brandKits.map((kit) =>
      kit.id === id ? { ...kit, ...updates } : kit
    ),
  })),

  removeBrandKit: (id) => set((state) => ({
    brandKits: state.brandKits.filter((kit) => kit.id !== id),
    activeBrandKitId: state.activeBrandKitId === id ? null : state.activeBrandKitId,
  })),

  setActiveBrandKit: (id) => set({ activeBrandKitId: id }),

  applyBrandKit: (kitId) => {
    const state = get();
    const kit = state.brandKits.find((k) => k.id === kitId);
    if (!kit) return;

    get().pushHistory('Apply brand kit');
    set((state) => ({
      activeBrandKitId: kitId,
      project: {
        ...state.project,
        screenshots: state.project.screenshots.map((s) => ({
          ...s,
          texts: s.texts.map((t) => ({
            ...t,
            style: {
              ...t.style,
              fontFamily: t.type === 'headline' ? kit.fonts.heading : kit.fonts.body,
              color: kit.colors.text,
            },
          })),
        })),
      },
    }));
  },

  // Export actions
  updateExportConfig: (config) => set((state) => ({
    exportConfig: { ...state.exportConfig, ...config },
  })),

  setExportJob: (jobId, status, progress) => set({
    exportJobId: jobId,
    exportStatus: status,
    exportProgress: progress,
  }),

  // Helpers
  getSelectedScreenshot: () => {
    const state = get();
    return state.project.screenshots.find((s) => s.id === state.selectedScreenshotId);
  },

  getSelectedText: () => {
    const state = get();
    const screenshot = state.getSelectedScreenshot();
    if (!screenshot) return undefined;
    return screenshot.texts.find((t) => t.id === state.selectedTextId);
  },

  deleteSelected: () => {
    const state = get();
    if (state.selectedTextId && state.selectedScreenshotId) {
      get().removeText(state.selectedScreenshotId, state.selectedTextId);
    } else if (state.selectedScreenshotId && state.project.screenshots.length > 1) {
      get().removeScreenshot(state.selectedScreenshotId);
    }
  },

  // ============================================
  // PROJECT PERSISTENCE ACTIONS
  // ============================================
  setShowProjectManager: (show) => set({ showProjectManager: show }),

  saveProject: () => {
    const state = get();
    const projectId = state.project.id;
    const projectData = JSON.stringify(state.project);

    // Save project data to localStorage
    localStorage.setItem(`project_${projectId}`, projectData);

    // Update saved projects list
    const savedProject: SavedProject = {
      id: projectId,
      name: state.project.name,
      lastModified: Date.now(),
      screenshotCount: state.project.screenshots.length,
    };

    const existingProjects = state.savedProjects.filter(p => p.id !== projectId);
    const newSavedProjects = [savedProject, ...existingProjects];

    // Save the projects list
    localStorage.setItem('savedProjectsList', JSON.stringify(newSavedProjects));

    set({ savedProjects: newSavedProjects });
  },

  loadProject: (projectId) => {
    const projectData = localStorage.getItem(`project_${projectId}`);
    if (projectData) {
      const project = JSON.parse(projectData) as Project;
      set({
        project,
        selectedScreenshotId: project.screenshots[0]?.id || null,
        selectedTextId: null,
        history: [],
        historyIndex: -1,
        showProjectManager: false,
      });
    }
  },

  deleteProject: (projectId) => {
    localStorage.removeItem(`project_${projectId}`);

    const state = get();
    const newSavedProjects = state.savedProjects.filter(p => p.id !== projectId);
    localStorage.setItem('savedProjectsList', JSON.stringify(newSavedProjects));

    set({ savedProjects: newSavedProjects });
  },

  createNewProject: () => {
    // Save current project first
    get().saveProject();

    // Create new project
    const newProject: Project = {
      id: uuid(),
      name: 'Untitled Project',
      screenshots: [createDefaultScreenshot(0)],
      locales: ['en'],
      defaultLocale: 'en',
    };

    set({
      project: newProject,
      selectedScreenshotId: newProject.screenshots[0].id,
      selectedTextId: null,
      history: [],
      historyIndex: -1,
      showProjectManager: false,
    });
  },

  renameProject: (name) => {
    set((state) => ({
      project: { ...state.project, name },
    }));
    // Auto-save after rename
    setTimeout(() => get().saveProject(), 100);
  },
}));

// Initialize saved projects from localStorage on app load
if (typeof window !== 'undefined') {
  const savedProjectsList = localStorage.getItem('savedProjectsList');
  if (savedProjectsList) {
    try {
      const projects = JSON.parse(savedProjectsList) as SavedProject[];
      useEditorStore.setState({ savedProjects: projects });
    } catch (e) {
      console.error('Failed to load saved projects list:', e);
    }
  }

  // Auto-load the most recent project if exists
  const savedProjects = useEditorStore.getState().savedProjects;
  if (savedProjects.length > 0) {
    const mostRecent = savedProjects.sort((a, b) => b.lastModified - a.lastModified)[0];
    const projectData = localStorage.getItem(`project_${mostRecent.id}`);
    if (projectData) {
      try {
        const project = JSON.parse(projectData) as Project;
        useEditorStore.setState({
          project,
          selectedScreenshotId: project.screenshots[0]?.id || null,
        });
      } catch (e) {
        console.error('Failed to load most recent project:', e);
      }
    }
  }

  // Auto-save every 30 seconds
  setInterval(() => {
    useEditorStore.getState().saveProject();
  }, 30000);
}
