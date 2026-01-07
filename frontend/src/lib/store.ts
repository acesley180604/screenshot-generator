import { create } from 'zustand';
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
} from '@/types';

// Default values
const defaultTextStyle: TextStyle = {
  fontFamily: 'SF Pro Display',
  fontSize: 64,
  fontWeight: 700,
  color: '#000000',
  alignment: 'center',
  lineHeight: 1.2,
  letterSpacing: 0,
};

const defaultDeviceConfig: DeviceConfig = {
  model: 'iphone-6.9',
  color: 'natural-titanium',
  style: 'realistic',
  scale: 0.85,
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

  // Export
  exportConfig: ExportConfig;
  exportJobId: string | null;
  exportStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  exportProgress: number;

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

  // Actions - Template
  setTemplate: (screenshotId: string, template: TemplateConfig) => void;
  updateBackground: (screenshotId: string, background: BackgroundConfig) => void;

  // Actions - Device
  updateDevice: (screenshotId: string, device: Partial<DeviceConfig>) => void;
  setScreenshotImage: (screenshotId: string, imageUrl: string) => void;

  // Actions - Text
  selectText: (id: string | null) => void;
  addText: (screenshotId: string, type: 'headline' | 'subtitle' | 'badge') => void;
  removeText: (screenshotId: string, textId: string) => void;
  updateText: (screenshotId: string, textId: string, updates: Partial<LocalizedText>) => void;
  updateTextTranslation: (screenshotId: string, textId: string, locale: string, text: string) => void;
  updateTextStyle: (screenshotId: string, textId: string, style: Partial<TextStyle>) => void;

  // Actions - Locale
  setCurrentLocale: (locale: string) => void;

  // Actions - UI
  setShowTemplateGallery: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setPreviewUrl: (url: string | null) => void;
  setIsGeneratingPreview: (generating: boolean) => void;

  // Actions - Export
  updateExportConfig: (config: Partial<ExportConfig>) => void;
  setExportJob: (jobId: string | null, status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed', progress: number) => void;

  // Helpers
  getSelectedScreenshot: () => ScreenshotConfig | undefined;
  getSelectedText: () => LocalizedText | undefined;
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
  isGeneratingPreview: false,
  previewUrl: null,

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

  // Project actions
  setProjectName: (name) => set((state) => ({
    project: { ...state.project, name },
  })),

  addLocale: (locale) => set((state) => ({
    project: {
      ...state.project,
      locales: [...state.project.locales, locale],
    },
  })),

  removeLocale: (locale) => set((state) => ({
    project: {
      ...state.project,
      locales: state.project.locales.filter((l) => l !== locale),
    },
  })),

  setDefaultLocale: (locale) => set((state) => ({
    project: { ...state.project, defaultLocale: locale },
    currentLocale: locale,
  })),

  // Screenshot actions
  addScreenshot: () => set((state) => {
    const newScreenshot = createDefaultScreenshot(state.project.screenshots.length);
    return {
      project: {
        ...state.project,
        screenshots: [...state.project.screenshots, newScreenshot],
      },
      selectedScreenshotId: newScreenshot.id,
    };
  }),

  removeScreenshot: (id) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.filter((s) => s.id !== id),
    },
    selectedScreenshotId: state.selectedScreenshotId === id ? null : state.selectedScreenshotId,
  })),

  duplicateScreenshot: (id) => set((state) => {
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
  }),

  reorderScreenshots: (fromIndex, toIndex) => set((state) => {
    const screenshots = [...state.project.screenshots];
    const [removed] = screenshots.splice(fromIndex, 1);
    screenshots.splice(toIndex, 0, removed);

    return {
      project: {
        ...state.project,
        screenshots: screenshots.map((s, i) => ({ ...s, order: i })),
      },
    };
  }),

  selectScreenshot: (id) => set({ selectedScreenshotId: id, selectedTextId: null }),

  updateScreenshot: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    },
  })),

  // Template actions
  setTemplate: (screenshotId, template) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === screenshotId ? { ...s, template } : s
      ),
    },
  })),

  updateBackground: (screenshotId, background) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === screenshotId
          ? { ...s, template: { ...s.template, background } }
          : s
      ),
    },
  })),

  // Device actions
  updateDevice: (screenshotId, device) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === screenshotId
          ? { ...s, device: { ...s.device, ...device } }
          : s
      ),
    },
  })),

  setScreenshotImage: (screenshotId, imageUrl) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === screenshotId
          ? { ...s, image: { url: imageUrl, fit: 'cover', positionX: 0.5, positionY: 0.5 } }
          : s
      ),
    },
  })),

  // Text actions
  selectText: (id) => set({ selectedTextId: id }),

  addText: (screenshotId, type) => set((state) => {
    const newText: LocalizedText = {
      id: uuid(),
      type,
      translations: { [state.currentLocale]: type === 'headline' ? 'New headline' : 'New text' },
      style: {
        ...defaultTextStyle,
        fontSize: type === 'headline' ? 64 : type === 'subtitle' ? 32 : 24,
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
  }),

  removeText: (screenshotId, textId) => set((state) => ({
    project: {
      ...state.project,
      screenshots: state.project.screenshots.map((s) =>
        s.id === screenshotId
          ? { ...s, texts: s.texts.filter((t) => t.id !== textId) }
          : s
      ),
    },
    selectedTextId: state.selectedTextId === textId ? null : state.selectedTextId,
  })),

  updateText: (screenshotId, textId, updates) => set((state) => ({
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
  })),

  updateTextTranslation: (screenshotId, textId, locale, text) => set((state) => ({
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
  })),

  updateTextStyle: (screenshotId, textId, style) => set((state) => ({
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
  })),

  // Locale actions
  setCurrentLocale: (locale) => set({ currentLocale: locale }),

  // UI actions
  setShowTemplateGallery: (show) => set({ showTemplateGallery: show }),
  setShowExportDialog: (show) => set({ showExportDialog: show }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setIsGeneratingPreview: (generating) => set({ isGeneratingPreview: generating }),

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
}));
