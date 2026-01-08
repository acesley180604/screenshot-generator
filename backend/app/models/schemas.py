"""Pydantic models for the Screenshot Generator API"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from enum import Enum


class BackgroundType(str, Enum):
    SOLID = "solid"
    GRADIENT = "gradient"
    IMAGE = "image"
    PATTERN = "pattern"


class DeviceStyle(str, Enum):
    REALISTIC = "realistic"
    CLAY = "clay"
    FLAT = "flat"
    NONE = "none"


class TextPosition(str, Enum):
    TOP = "top"
    BOTTOM = "bottom"
    OVERLAY = "overlay"


class TextAlignment(str, Enum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"


class ExportFormat(str, Enum):
    PNG = "png"
    JPEG = "jpeg"


# Gradient configuration
class GradientStop(BaseModel):
    color: str
    position: float = Field(ge=0, le=1)


class GradientConfig(BaseModel):
    type: Literal["linear", "radial"] = "linear"
    angle: float = 180
    stops: List[GradientStop]


# Background configuration
class BackgroundConfig(BaseModel):
    type: BackgroundType = BackgroundType.SOLID
    color: Optional[str] = "#FFFFFF"
    gradient: Optional[GradientConfig] = None
    image_url: Optional[str] = None
    pattern: Optional[str] = None


# Text styling
class TextBackground(BaseModel):
    enabled: bool = False
    color: str = "#000000"
    padding: int = 8
    border_radius: int = 4
    opacity: float = 0.8


class TextStyle(BaseModel):
    font_family: str = "SF Pro Display"
    font_size: int = 120
    font_weight: int = 700
    color: str = "#000000"
    alignment: TextAlignment = TextAlignment.CENTER
    line_height: float = 1.2
    letter_spacing: float = 0
    background: Optional[TextBackground] = None


# Localized text
class LocalizedText(BaseModel):
    id: str
    type: Literal["headline", "subtitle", "badge"] = "headline"
    translations: Dict[str, str]  # locale -> text
    style: TextStyle = TextStyle()
    position_y: float = 0.1  # 0-1 relative position


# Device configuration
class DeviceConfig(BaseModel):
    model: str = "iphone-15-pro-max"
    color: str = "natural-titanium"
    style: DeviceStyle = DeviceStyle.REALISTIC
    scale: float = 0.85
    position_x: float = 0.5  # 0-1 relative position
    position_y: float = 0.55
    shadow: bool = True
    shadow_blur: int = 40
    shadow_opacity: float = 0.3
    rotation: float = 0


# Image configuration for uploaded screenshot
class ImageConfig(BaseModel):
    url: str
    fit: Literal["contain", "cover", "fill"] = "cover"
    position_x: float = 0.5
    position_y: float = 0.5


# Template configuration
class TemplateConfig(BaseModel):
    id: str
    name: str
    background: BackgroundConfig
    text_position: TextPosition = TextPosition.TOP
    device_layout: Literal["center", "left", "right", "offset"] = "center"


# Screenshot configuration
class ScreenshotConfig(BaseModel):
    id: str
    order: int = 0
    template: TemplateConfig
    device: DeviceConfig
    image: Optional[ImageConfig] = None
    texts: List[LocalizedText] = []


# Project
class Project(BaseModel):
    id: str
    name: str = "Untitled Project"
    screenshots: List[ScreenshotConfig] = []
    locales: List[str] = ["en"]
    default_locale: str = "en"


# Export configuration
class ExportConfig(BaseModel):
    devices: List[str] = ["iphone-6.9", "iphone-6.5", "ipad-13"]
    locales: List[str] = ["en"]
    format: ExportFormat = ExportFormat.PNG
    quality: int = Field(default=95, ge=1, le=100)
    naming_pattern: str = "{locale}/{device}/{index}"


# API Request/Response models
class UploadResponse(BaseModel):
    id: str
    url: str
    width: int
    height: int


class GeneratePreviewRequest(BaseModel):
    screenshot: ScreenshotConfig
    locale: str = "en"
    width: int = 1290
    height: int = 2796


class GenerateExportRequest(BaseModel):
    project: Project
    config: ExportConfig


class ExportJobStatus(BaseModel):
    job_id: str
    status: Literal["pending", "processing", "completed", "failed"]
    progress: float = 0
    download_url: Optional[str] = None
    error: Optional[str] = None


# Device specifications
class DeviceSpec(BaseModel):
    id: str
    name: str
    display_size: str
    width: int
    height: int
    frame_width: int
    frame_height: int
    screen_offset_x: int
    screen_offset_y: int
    screen_width: int
    screen_height: int
    corner_radius: int
    required: bool = False


# Template metadata
class TemplateMetadata(BaseModel):
    id: str
    name: str
    category: str
    preview_url: str
    config: TemplateConfig


# Font metadata
class FontMetadata(BaseModel):
    id: str
    name: str
    family: str
    weights: List[int]
    category: str


# Locale metadata
class LocaleMetadata(BaseModel):
    code: str
    name: str
    native_name: str
    rtl: bool = False


# Background removal models
class BackgroundRemovalRequest(BaseModel):
    file_id: str
    alpha_matting: bool = False


class BackgroundRemovalResponse(BaseModel):
    id: str
    url: str
    original_url: str
    width: int
    height: int
    processing_time: float
