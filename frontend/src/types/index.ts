// Screenshot Generator Types

export type BackgroundType = 'solid' | 'gradient' | 'image' | 'pattern';
export type DeviceStyle = 'realistic' | 'clay' | 'flat' | 'none';
export type TextPosition = 'top' | 'bottom' | 'overlay';
export type TextAlignment = 'left' | 'center' | 'right';
export type ExportFormat = 'png' | 'jpeg';

// Gradient configuration
export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number;
  stops: GradientStop[];
}

// Background configuration
export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  gradient?: GradientConfig;
  imageUrl?: string;
  pattern?: string;
}

// Text styling
export interface TextBackground {
  enabled: boolean;
  color: string;
  padding: number;
  borderRadius: number;
  opacity: number;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  alignment: TextAlignment;
  lineHeight: number;
  letterSpacing: number;
  background?: TextBackground;
}

// Localized text
export interface LocalizedText {
  id: string;
  type: 'headline' | 'subtitle' | 'badge';
  translations: Record<string, string>;
  style: TextStyle;
  positionY: number;
}

// Device configuration
export interface DeviceConfig {
  model: string;
  color: string;
  style: DeviceStyle;
  scale: number;
  positionX: number;
  positionY: number;
  shadow: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  rotation: number;
}

// Image configuration
export interface ImageConfig {
  url: string;
  fit: 'contain' | 'cover' | 'fill';
  positionX: number;
  positionY: number;
}

// Template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  background: BackgroundConfig;
  textPosition: TextPosition;
  deviceLayout: 'center' | 'left' | 'right' | 'offset';
}

// Screenshot configuration
export interface ScreenshotConfig {
  id: string;
  order: number;
  template: TemplateConfig;
  device: DeviceConfig;
  image?: ImageConfig;
  texts: LocalizedText[];
}

// Project
export interface Project {
  id: string;
  name: string;
  screenshots: ScreenshotConfig[];
  locales: string[];
  defaultLocale: string;
}

// Export configuration
export interface ExportConfig {
  devices: string[];
  locales: string[];
  format: ExportFormat;
  quality: number;
  namingPattern: string;
}

// Device specification
export interface DeviceSpec {
  id: string;
  name: string;
  displaySize: string;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
  screenOffsetX: number;
  screenOffsetY: number;
  screenWidth: number;
  screenHeight: number;
  cornerRadius: number;
  required: boolean;
  category: string;
}

// Template metadata
export interface TemplateMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
  config: TemplateConfig;
}

// Locale metadata
export interface LocaleMetadata {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

// Upload response
export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
}

// Export job status
export interface ExportJobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

// Device color option
export interface DeviceColorOption {
  id: string;
  name: string;
  hex: string;
}

// Layout device position
export interface LayoutDevicePosition {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  zIndex: number;
  perspective?: boolean;
  floatingShadow?: boolean;
  noFrame?: boolean;
  roundedCorners?: number;
  clipLeft?: boolean;
  clipRight?: boolean;
  opacity?: number;
}

// Layout text area
export interface LayoutTextArea {
  position: 'top' | 'bottom' | 'left' | 'right' | 'subtitle';
  x?: number;
  y: number;
  width: number;
  align?: 'left' | 'center' | 'right';
}

// Layout callout
export interface LayoutCallout {
  position: { x: number; y: number };
  align: 'left' | 'right';
  text?: string;
}

// Feature zoom config
export interface FeatureZoomConfig {
  position: { x: number; y: number };
  scale: number;
  borderRadius: number;
  showConnector: boolean;
}

// Layout configuration
export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  devices: LayoutDevicePosition[];
  textAreas: LayoutTextArea[];
  callouts?: LayoutCallout[];
  featureZoom?: FeatureZoomConfig;
  panoramicPosition?: 'left' | 'center' | 'right';
  divider?: { position: number; style: string };
}

// Multi-device screenshot config
export interface MultiDeviceImage {
  deviceIndex: number;
  url: string;
  fit: 'contain' | 'cover' | 'fill';
}
