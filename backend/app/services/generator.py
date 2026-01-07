"""Screenshot generation service"""
import os
import uuid
import zipfile
import io
from typing import List, Dict, Optional
from PIL import Image

from .image_processor import ImageProcessor
from ..data.devices import DEVICE_SPECS
from ..data.templates import TEMPLATES
from ..data.locales import LOCALES


class ScreenshotGenerator:
    """Handles screenshot generation and export"""

    def __init__(self, upload_dir: str = None, output_dir: str = None):
        self.upload_dir = upload_dir or os.path.join(
            os.path.dirname(__file__), "..", "..", "uploads"
        )
        self.output_dir = output_dir or os.path.join(
            os.path.dirname(__file__), "..", "..", "output"
        )
        self.processor = ImageProcessor()

        # Ensure directories exist
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_preview(
        self,
        screenshot_config: dict,
        locale: str = "en",
        width: int = 1290,
        height: int = 2796
    ) -> bytes:
        """Generate a preview image for a screenshot configuration"""
        # Get template config
        template_config = screenshot_config.get("template", {})
        device_config = screenshot_config.get("device", {})
        image_config = screenshot_config.get("image")
        texts = screenshot_config.get("texts", [])

        # Create background
        bg_config = template_config.get("background", {"type": "solid", "color": "#FFFFFF"})
        background = self.processor.create_background(width, height, bg_config)

        # Load screenshot image if provided
        screen_image = None
        if image_config and image_config.get("url"):
            image_path = image_config["url"]
            if os.path.exists(image_path):
                screen_image = Image.open(image_path).convert("RGBA")

        # Create device frame if we have a screen image
        device_frame = None
        if screen_image:
            device_frame = self.processor.create_device_frame(
                screen_image,
                device_config.get("model", "iphone-6.9"),
                device_config.get("color", "natural-titanium"),
                device_config.get("style", "realistic"),
                device_config.get("shadow", True),
                device_config.get("shadow_blur", 40),
                device_config.get("shadow_opacity", 0.3)
            )

        # Prepare texts for the specified locale
        localized_texts = []
        for text_item in texts:
            translations = text_item.get("translations", {})
            text_content = translations.get(locale, translations.get("en", ""))
            if text_content:
                localized_texts.append({
                    "text": text_content,
                    "style": text_item.get("style", {}),
                    "position_y": text_item.get("position_y", 0.1)
                })

        # Compose final image
        if device_frame:
            output = self.processor.compose_screenshot(
                background,
                device_frame,
                localized_texts,
                device_config,
                width,
                height
            )
        else:
            # Just background with text if no device image
            output = background
            for text_config in localized_texts:
                text = text_config.get("text", "")
                if text:
                    style = text_config.get("style", {})
                    text_y = text_config.get("position_y", 0.1)
                    text_x = width // 2
                    text_y_px = int(height * text_y)
                    output = self.processor.draw_text(
                        output,
                        text,
                        (text_x, text_y_px),
                        style,
                        max_width=int(width * 0.85)
                    )

        # Export as PNG bytes
        return self.processor.export_to_size(output, width, height, "png", 95)

    def generate_exports(
        self,
        project: dict,
        export_config: dict
    ) -> str:
        """Generate all exports for a project and return download path"""
        job_id = str(uuid.uuid4())
        output_path = os.path.join(self.output_dir, f"{job_id}.zip")

        devices = export_config.get("devices", ["iphone-6.9"])
        locales = export_config.get("locales", ["en"])
        format_type = export_config.get("format", "png")
        quality = export_config.get("quality", 95)
        naming_pattern = export_config.get("naming_pattern", "{locale}/{device}/{index}")

        screenshots = project.get("screenshots", [])

        # Create ZIP file
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for locale in locales:
                for device_id in devices:
                    device_spec = DEVICE_SPECS.get(device_id)
                    if not device_spec:
                        continue

                    width = device_spec["width"]
                    height = device_spec["height"]

                    for idx, screenshot in enumerate(screenshots):
                        # Generate screenshot for this device/locale
                        image_bytes = self.generate_preview(
                            screenshot,
                            locale=locale,
                            width=width,
                            height=height
                        )

                        # Generate filename
                        filename = naming_pattern.format(
                            locale=locale,
                            device=device_id,
                            index=idx + 1
                        )
                        filename = f"{filename}.{format_type}"

                        # Add to ZIP
                        zf.writestr(filename, image_bytes)

        return output_path

    def save_uploaded_image(self, file_content: bytes, filename: str) -> dict:
        """Save uploaded image and return metadata"""
        # Generate unique filename
        file_id = str(uuid.uuid4())
        ext = os.path.splitext(filename)[1].lower() or ".png"
        save_path = os.path.join(self.upload_dir, f"{file_id}{ext}")

        # Save file
        with open(save_path, "wb") as f:
            f.write(file_content)

        # Get image dimensions
        with Image.open(save_path) as img:
            width, height = img.size

        return {
            "id": file_id,
            "url": save_path,
            "filename": filename,
            "width": width,
            "height": height
        }

    def delete_uploaded_image(self, file_id: str) -> bool:
        """Delete an uploaded image"""
        # Find and delete file with this ID
        for filename in os.listdir(self.upload_dir):
            if filename.startswith(file_id):
                filepath = os.path.join(self.upload_dir, filename)
                os.remove(filepath)
                return True
        return False
