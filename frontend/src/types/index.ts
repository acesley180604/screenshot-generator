// Screenshot Generator Types

export type BackgroundType = 'solid' | 'gradient' | 'image' | 'pattern' | 'mesh' | 'glassmorphism' | 'blobs';
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
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  center_x?: number;
  center_y?: number;
  start_angle?: number;
  stops: GradientStop[];
}

// Mesh gradient color point
export interface MeshColorPoint {
  color: string;
  x: number;
  y: number;
  radius: number;
}

// Blob configuration
export interface BlobConfig {
  color: string;
  x: number;
  y: number;
  size: number;
}

// Noise/grain texture configuration
export interface NoiseConfig {
  enabled: boolean;
  intensity: number;
  monochrome: boolean;
}

// Background configuration
export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  gradient?: GradientConfig;
  imageUrl?: string;
  pattern?: string;
  panoramic?: boolean; // Enable panoramic mode for continuous background across screenshots

  // Mesh gradient
  color_points?: MeshColorPoint[];

  // Glassmorphism
  base_gradient?: GradientConfig;
  blobs?: BlobConfig[];
  blob_blur?: number;

  // Blobs background
  base_color?: string;
  blur?: number;

  // Noise/grain texture
  noise?: NoiseConfig;
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

// iOS Notification Types
export type NotificationType = 'banner' | 'lockscreen' | 'stack';

export interface NotificationElement {
  id: string;
  type: NotificationType;
  enabled: boolean;
  positionX: number;
  positionY: number;
  width: number;
  height: number;

  // Content
  appName: string;
  appIcon?: string;       // URL or emoji
  title: string;
  message: string;
  time?: string;          // "now", "2m ago", "9:41 AM"

  // Styling
  style: {
    scale: number;
    opacity: number;
    blur?: number;        // Backdrop blur
    dark?: boolean;       // Dark mode
  };
}

// Social Proof Types
export type SocialProofType =
  | 'rating'           // App Store rating with stars
  | 'downloads'        // Download count badge
  | 'award'            // Award badge (Editor's Choice, App of the Day)
  | 'university'       // University logos row
  | 'testimonial'      // User testimonial quote
  | 'press'            // Press/media mentions
  | 'trusted-by'       // "Trusted by X users"
  | 'feature-cards';   // Feature cards grid (like Headspace)

// Feature card for feature-cards type
export interface FeatureCard {
  id: string;
  label: string;
  color: string;        // Background color
  iconType?: 'dots' | 'stars' | 'circles' | 'waves' | 'gradient';
}

// Avatar for facepile/avatar stack
export interface AvatarConfig {
  id: string;
  imageUrl?: string;        // User photo URL
  initials?: string;        // Fallback initials (e.g., "JD")
  color?: string;           // Background color for initials
}

// Social Proof Element
export interface SocialProofElement {
  id: string;
  type: SocialProofType;
  enabled: boolean;
  positionY: number;
  positionX: number;

  // Rating specific
  rating?: number;           // 4.8
  ratingCount?: string;      // "125K ratings"
  showStars?: boolean;
  ratingStyle?: 'badge' | 'appstore' | 'minimal';  // Visual style

  // Downloads specific
  downloadCount?: string;    // "10M+"
  downloadStyle?: 'banner' | 'badge' | 'minimal';  // Visual style

  // Award specific
  awardType?: 'apple-design' | 'webby' | 'editors-choice' | 'app-of-the-day' | 'best-of-year' | 'custom';
  awardText?: string;

  // University/Brand logos
  logos?: string[];          // Array of logo identifiers
  logosLabel?: string;       // "Used at" or "Trusted by students at"

  // Testimonial
  testimonialText?: string;
  testimonialAuthor?: string;
  testimonialAvatar?: AvatarConfig;  // User photo for testimonial
  testimonialRating?: number;        // Star rating (1-5)
  testimonialStyle?: 'card' | 'quote' | 'bubble';  // Visual style

  // Press mentions
  pressLogos?: string[];     // Media outlet identifiers

  // Trusted-by / Avatar stack
  avatars?: AvatarConfig[];  // User avatars for facepile
  avatarOverflow?: number;   // "+99" overflow count
  avatarStyle?: 'stack' | 'row' | 'grid';  // Layout style

  // Feature cards
  featureCards?: FeatureCard[];

  // Styling
  style: {
    scale: number;
    opacity: number;
    color: string;           // Primary color
    secondaryColor: string;  // Secondary color (stars, accents)
    backgroundColor?: string;
    blur?: number;           // Glassmorphism effect
    borderColor?: string;    // Border color for avatars
  };
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
  socialProof?: SocialProofElement[];
  notifications?: NotificationElement[];
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
