"""Image processing service for screenshot generation"""
import io
import math
import os
import random
from typing import Optional, Tuple, List
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
from ..data.devices import DEVICE_SPECS


class ImageProcessor:
    """Handles image processing and screenshot generation"""

    def __init__(self, assets_path: str = None):
        self.assets_path = assets_path or os.path.join(
            os.path.dirname(__file__), "..", "assets"
        )
        self.fonts_path = os.path.join(self.assets_path, "fonts")
        self._font_cache = {}

    def create_gradient(
        self,
        width: int,
        height: int,
        stops: List[dict],
        angle: float = 180,
        gradient_type: str = "linear"
    ) -> Image.Image:
        """Create a gradient image"""
        image = Image.new("RGBA", (width, height))
        draw = ImageDraw.Draw(image)

        if len(stops) < 2:
            # Single color, fill with solid
            color = self._parse_color(stops[0]["color"])
            draw.rectangle([0, 0, width, height], fill=color)
            return image

        if gradient_type == "linear":
            return self._create_linear_gradient(width, height, stops, angle)
        else:
            return self._create_radial_gradient(width, height, stops)

    def _create_linear_gradient(
        self, width: int, height: int, stops: List[dict], angle: float
    ) -> Image.Image:
        """Create a linear gradient"""
        image = Image.new("RGBA", (width, height))

        # Convert angle to radians
        rad = math.radians(angle)

        # Calculate gradient direction
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)

        # Parse colors from stops
        colors = [(self._parse_color(s["color"]), s["position"]) for s in stops]

        for y in range(height):
            for x in range(width):
                # Calculate position along gradient (0 to 1)
                # Normalize coordinates to -0.5 to 0.5
                nx = x / width - 0.5
                ny = y / height - 0.5

                # Project onto gradient direction
                t = (nx * sin_a + ny * cos_a + 0.5)
                t = max(0, min(1, t))

                # Interpolate color
                color = self._interpolate_color(colors, t)
                image.putpixel((x, y), color)

        return image

    def _create_radial_gradient(
        self, width: int, height: int, stops: List[dict],
        center_x: float = 0.5, center_y: float = 0.5
    ) -> Image.Image:
        """Create a radial gradient with configurable center"""
        image = Image.new("RGBA", (width, height))

        cx = int(width * center_x)
        cy = int(height * center_y)
        max_dist = math.sqrt(max(cx, width - cx)**2 + max(cy, height - cy)**2)

        colors = [(self._parse_color(s["color"]), s["position"]) for s in stops]

        for y in range(height):
            for x in range(width):
                dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                t = dist / max_dist
                t = max(0, min(1, t))

                color = self._interpolate_color(colors, t)
                image.putpixel((x, y), color)

        return image

    def _create_mesh_gradient(
        self, width: int, height: int, color_points: List[dict]
    ) -> Image.Image:
        """Create a mesh gradient with multiple color points

        color_points: List of {"color": "#RRGGBB", "x": 0.0-1.0, "y": 0.0-1.0, "radius": 0.0-1.0}
        """
        # Use numpy for faster computation
        img_array = np.zeros((height, width, 4), dtype=np.float32)
        weight_sum = np.zeros((height, width), dtype=np.float32)

        for point in color_points:
            color = self._parse_color(point["color"])
            px = int(point.get("x", 0.5) * width)
            py = int(point.get("y", 0.5) * height)
            radius = point.get("radius", 0.5) * max(width, height)

            # Create distance field for this point
            y_coords, x_coords = np.ogrid[:height, :width]
            dist = np.sqrt((x_coords - px)**2 + (y_coords - py)**2)

            # Gaussian falloff
            weight = np.exp(-(dist**2) / (2 * radius**2))

            # Add weighted color
            for i in range(4):
                img_array[:, :, i] += weight * color[i]
            weight_sum += weight

        # Normalize
        weight_sum = np.maximum(weight_sum, 0.0001)  # Avoid division by zero
        for i in range(4):
            img_array[:, :, i] /= weight_sum

        # Clip and convert to uint8
        img_array = np.clip(img_array, 0, 255).astype(np.uint8)

        return Image.fromarray(img_array, mode="RGBA")

    def _create_conic_gradient(
        self, width: int, height: int, stops: List[dict],
        center_x: float = 0.5, center_y: float = 0.5, start_angle: float = 0
    ) -> Image.Image:
        """Create a conic (angular) gradient"""
        image = Image.new("RGBA", (width, height))

        cx = int(width * center_x)
        cy = int(height * center_y)

        colors = [(self._parse_color(s["color"]), s["position"]) for s in stops]

        for y in range(height):
            for x in range(width):
                # Calculate angle from center
                angle = math.atan2(y - cy, x - cx)
                # Normalize to 0-1, accounting for start angle
                t = ((angle + math.pi - math.radians(start_angle)) / (2 * math.pi)) % 1.0

                color = self._interpolate_color(colors, t)
                image.putpixel((x, y), color)

        return image

    def _add_noise_texture(
        self, image: Image.Image, intensity: float = 0.05,
        monochrome: bool = True
    ) -> Image.Image:
        """Add noise/grain texture to an image"""
        img_array = np.array(image, dtype=np.float32)

        if monochrome:
            noise = np.random.randn(image.height, image.width, 1) * 255 * intensity
            noise = np.repeat(noise, 3, axis=2)
            noise = np.concatenate([noise, np.zeros((image.height, image.width, 1))], axis=2)
        else:
            noise = np.random.randn(image.height, image.width, 3) * 255 * intensity
            noise = np.concatenate([noise, np.zeros((image.height, image.width, 1))], axis=2)

        img_array[:, :, :3] = np.clip(img_array[:, :, :3] + noise[:, :, :3], 0, 255)

        return Image.fromarray(img_array.astype(np.uint8), mode="RGBA")

    def _create_abstract_blobs(
        self, width: int, height: int, blobs: List[dict],
        blur_amount: int = 100
    ) -> Image.Image:
        """Create abstract blob background with blur

        blobs: List of {"color": "#RRGGBB", "x": 0.0-1.0, "y": 0.0-1.0, "size": 0.0-1.0}
        """
        image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)

        for blob in blobs:
            color = self._parse_color(blob["color"])
            x = int(blob.get("x", 0.5) * width)
            y = int(blob.get("y", 0.5) * height)
            size = int(blob.get("size", 0.3) * min(width, height))

            # Draw ellipse for blob
            draw.ellipse(
                [x - size, y - size, x + size, y + size],
                fill=color
            )

        # Apply heavy blur
        image = image.filter(ImageFilter.GaussianBlur(blur_amount))

        return image

    def _create_glassmorphism_background(
        self, width: int, height: int, config: dict
    ) -> Image.Image:
        """Create glassmorphism style background

        config: {
            "base_gradient": gradient config,
            "blobs": blob config list,
            "glass_blur": blur amount for glass effect,
            "glass_opacity": 0.0-1.0
        }
        """
        # Create base gradient
        base_config = config.get("base_gradient", {})
        if base_config:
            base = self.create_gradient(
                width, height,
                base_config.get("stops", [{"color": "#667EEA", "position": 0}, {"color": "#764BA2", "position": 1}]),
                base_config.get("angle", 135),
                base_config.get("type", "linear")
            )
        else:
            base = Image.new("RGBA", (width, height), (102, 126, 234, 255))

        # Add blobs if specified
        blobs_config = config.get("blobs", [])
        if blobs_config:
            blobs = self._create_abstract_blobs(
                width, height, blobs_config,
                config.get("blob_blur", 150)
            )
            base = Image.alpha_composite(base, blobs)

        return base

    def _interpolate_color(
        self, colors: List[Tuple[Tuple[int, ...], float]], t: float
    ) -> Tuple[int, ...]:
        """Interpolate between color stops"""
        if t <= colors[0][1]:
            return colors[0][0]
        if t >= colors[-1][1]:
            return colors[-1][0]

        # Find the two stops to interpolate between
        for i in range(len(colors) - 1):
            if colors[i][1] <= t <= colors[i + 1][1]:
                # Calculate interpolation factor
                range_t = colors[i + 1][1] - colors[i][1]
                if range_t == 0:
                    return colors[i][0]
                local_t = (t - colors[i][1]) / range_t

                c1, c2 = colors[i][0], colors[i + 1][0]
                return tuple(
                    int(c1[j] + (c2[j] - c1[j]) * local_t)
                    for j in range(len(c1))
                )

        return colors[-1][0]

    def _parse_color(self, color: str) -> Tuple[int, ...]:
        """Parse color string to RGBA tuple"""
        if color.startswith("#"):
            color = color[1:]
            if len(color) == 6:
                return (
                    int(color[0:2], 16),
                    int(color[2:4], 16),
                    int(color[4:6], 16),
                    255
                )
            elif len(color) == 8:
                return (
                    int(color[0:2], 16),
                    int(color[2:4], 16),
                    int(color[4:6], 16),
                    int(color[6:8], 16)
                )
        # Default white
        return (255, 255, 255, 255)

    def create_background(
        self,
        width: int,
        height: int,
        background_config: dict
    ) -> Image.Image:
        """Create background image based on configuration"""
        bg_type = background_config.get("type", "solid")

        if bg_type == "solid":
            color = self._parse_color(background_config.get("color", "#FFFFFF"))
            background = Image.new("RGBA", (width, height), color)

        elif bg_type == "gradient":
            gradient_config = background_config.get("gradient", {})
            gradient_type = gradient_config.get("type", "linear")

            if gradient_type == "radial":
                background = self._create_radial_gradient(
                    width, height,
                    gradient_config.get("stops", [{"color": "#FFFFFF", "position": 0}]),
                    gradient_config.get("center_x", 0.5),
                    gradient_config.get("center_y", 0.5)
                )
            elif gradient_type == "conic":
                background = self._create_conic_gradient(
                    width, height,
                    gradient_config.get("stops", [{"color": "#FFFFFF", "position": 0}]),
                    gradient_config.get("center_x", 0.5),
                    gradient_config.get("center_y", 0.5),
                    gradient_config.get("start_angle", 0)
                )
            else:
                background = self.create_gradient(
                    width, height,
                    gradient_config.get("stops", [{"color": "#FFFFFF", "position": 0}]),
                    gradient_config.get("angle", 180),
                    gradient_type
                )

        elif bg_type == "mesh":
            # Mesh gradient with multiple color points
            color_points = background_config.get("color_points", [
                {"color": "#667EEA", "x": 0.2, "y": 0.2, "radius": 0.6},
                {"color": "#764BA2", "x": 0.8, "y": 0.8, "radius": 0.6}
            ])
            background = self._create_mesh_gradient(width, height, color_points)

        elif bg_type == "glassmorphism":
            background = self._create_glassmorphism_background(
                width, height, background_config
            )

        elif bg_type == "blobs":
            # Abstract blobs with base color
            base_color = self._parse_color(background_config.get("base_color", "#1a1a2e"))
            background = Image.new("RGBA", (width, height), base_color)
            blobs = self._create_abstract_blobs(
                width, height,
                background_config.get("blobs", []),
                background_config.get("blur", 150)
            )
            background = Image.alpha_composite(background, blobs)

        elif bg_type == "image":
            # Load and resize background image
            image_url = background_config.get("image_url")
            if image_url and os.path.exists(image_url):
                bg_image = Image.open(image_url).convert("RGBA")
                background = bg_image.resize((width, height), Image.Resampling.LANCZOS)
            else:
                background = Image.new("RGBA", (width, height), (255, 255, 255, 255))

        else:
            # Default to white
            background = Image.new("RGBA", (width, height), (255, 255, 255, 255))

        # Apply noise/grain texture if specified
        noise_config = background_config.get("noise")
        if noise_config and noise_config.get("enabled", False):
            background = self._add_noise_texture(
                background,
                noise_config.get("intensity", 0.03),
                noise_config.get("monochrome", True)
            )

        return background

    def create_panoramic_background(
        self,
        width: int,
        height: int,
        background_config: dict,
        screenshot_index: int,
        total_screenshots: int
    ) -> Image.Image:
        """Create a panoramic background that spans multiple screenshots.

        This creates a wide background and crops the appropriate section
        for each screenshot position.
        """
        # Create a wide background that spans all screenshots
        total_width = width * total_screenshots

        # Create the full panoramic background
        panoramic_config = background_config.copy()

        # Adjust gradient angle for panoramic effect
        if panoramic_config.get("type") == "gradient":
            gradient_config = panoramic_config.get("gradient", {})
            # For panoramic, use a horizontal gradient
            gradient_config["angle"] = gradient_config.get("panoramic_angle", 90)
            panoramic_config["gradient"] = gradient_config

        # Create the full width background
        full_background = self.create_background(total_width, height, panoramic_config)

        # Calculate crop area for this screenshot
        left = screenshot_index * width
        right = left + width

        # Crop and return the section for this screenshot
        return full_background.crop((left, 0, right, height))

    def create_device_frame(
        self,
        screen_image: Image.Image,
        device_id: str,
        device_color: str = "natural-titanium",
        style: str = "realistic",
        shadow: bool = True,
        shadow_blur: int = 40,
        shadow_opacity: float = 0.3
    ) -> Image.Image:
        """Create device frame with screenshot inside"""
        spec = DEVICE_SPECS.get(device_id)
        if not spec:
            spec = DEVICE_SPECS.get("iphone-6.9")

        # For now, create a simple rounded rectangle frame
        frame_width = spec["frame_width"]
        frame_height = spec["frame_height"]
        screen_width = spec["screen_width"]
        screen_height = spec["screen_height"]
        offset_x = spec["screen_offset_x"]
        offset_y = spec["screen_offset_y"]
        corner_radius = spec["corner_radius"]

        # Create frame image with transparency
        frame = Image.new("RGBA", (frame_width, frame_height), (0, 0, 0, 0))

        # Resize screen image to fit
        screen_resized = screen_image.resize(
            (screen_width, screen_height),
            Image.Resampling.LANCZOS
        )

        # Create rounded rectangle mask for screen
        screen_mask = Image.new("L", (screen_width, screen_height), 0)
        mask_draw = ImageDraw.Draw(screen_mask)
        mask_draw.rounded_rectangle(
            [0, 0, screen_width - 1, screen_height - 1],
            radius=corner_radius,
            fill=255
        )

        # Apply mask to screen
        screen_with_mask = Image.new("RGBA", (screen_width, screen_height), (0, 0, 0, 0))
        screen_with_mask.paste(screen_resized, (0, 0), screen_mask)

        # Create device bezel (simple dark frame)
        if style == "realistic" or style == "clay":
            bezel_color = self._get_device_bezel_color(device_color, style)
            bezel = Image.new("RGBA", (frame_width, frame_height), (0, 0, 0, 0))
            bezel_draw = ImageDraw.Draw(bezel)
            bezel_draw.rounded_rectangle(
                [0, 0, frame_width - 1, frame_height - 1],
                radius=corner_radius + 10,
                fill=bezel_color
            )
            frame = Image.alpha_composite(frame, bezel)

        # Paste screen onto frame
        frame.paste(screen_with_mask, (offset_x, offset_y), screen_with_mask)

        # Add shadow if enabled
        if shadow and style != "none":
            frame = self._add_shadow(frame, shadow_blur, shadow_opacity)

        return frame

    def _get_device_bezel_color(
        self, device_color: str, style: str
    ) -> Tuple[int, ...]:
        """Get bezel color based on device color and style"""
        color_map = {
            "natural-titanium": (138, 138, 143, 255),
            "blue-titanium": (60, 76, 92, 255),
            "white-titanium": (245, 245, 240, 255),
            "black-titanium": (46, 46, 48, 255),
            "space-black": (31, 31, 31, 255),
            "silver": (227, 228, 229, 255),
            "gold": (245, 231, 208, 255),
            "space-gray": (110, 110, 115, 255),
        }

        base_color = color_map.get(device_color, (31, 31, 31, 255))

        if style == "clay":
            # Lighter, muted version for clay style
            return tuple(min(255, c + 30) for c in base_color[:3]) + (255,)

        return base_color

    def _add_shadow(
        self,
        image: Image.Image,
        blur_radius: int = 40,
        opacity: float = 0.3
    ) -> Image.Image:
        """Add drop shadow to image"""
        # Create shadow layer
        shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))

        # Get alpha channel and offset
        alpha = image.split()[-1]
        shadow_alpha = alpha.point(lambda x: int(x * opacity))

        # Create shadow image
        shadow_img = Image.new("RGBA", image.size, (0, 0, 0, 255))
        shadow_img.putalpha(shadow_alpha)

        # Blur shadow
        shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(blur_radius))

        # Create output with shadow behind
        output = Image.new(
            "RGBA",
            (image.width + blur_radius * 2, image.height + blur_radius * 2),
            (0, 0, 0, 0)
        )

        # Paste shadow with offset
        output.paste(shadow_img, (blur_radius, blur_radius + 10))

        # Paste original image on top
        output.paste(image, (blur_radius, blur_radius), image)

        return output

    def get_font(
        self,
        font_family: str,
        font_size: int,
        font_weight: int = 400
    ) -> ImageFont.FreeTypeFont:
        """Get font with caching"""
        cache_key = f"{font_family}_{font_size}_{font_weight}"
        if cache_key in self._font_cache:
            return self._font_cache[cache_key]

        # Try to load font from assets
        font_path = os.path.join(self.fonts_path, f"{font_family}.ttf")

        try:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, font_size)
            else:
                # Fall back to default font
                font = ImageFont.truetype(
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                    font_size
                )
        except Exception:
            font = ImageFont.load_default()

        self._font_cache[cache_key] = font
        return font

    def draw_text(
        self,
        image: Image.Image,
        text: str,
        position: Tuple[int, int],
        style: dict,
        max_width: Optional[int] = None
    ) -> Image.Image:
        """Draw text on image with styling"""
        draw = ImageDraw.Draw(image)

        font = self.get_font(
            style.get("font_family", "SF Pro Display"),
            style.get("font_size", 48),
            style.get("font_weight", 700)
        )

        color = self._parse_color(style.get("color", "#000000"))
        alignment = style.get("alignment", "center")

        # Handle text background
        bg_config = style.get("background")
        if bg_config and bg_config.get("enabled"):
            self._draw_text_background(draw, text, position, font, bg_config, max_width)

        # Draw text
        if max_width:
            # Word wrap
            lines = self._wrap_text(text, font, max_width)
            y = position[1]
            line_height = style.get("font_size", 48) * style.get("line_height", 1.2)

            for line in lines:
                bbox = font.getbbox(line)
                text_width = bbox[2] - bbox[0]

                if alignment == "center":
                    x = position[0] - text_width // 2
                elif alignment == "right":
                    x = position[0] - text_width
                else:
                    x = position[0]

                draw.text((x, y), line, font=font, fill=color[:3])
                y += int(line_height)
        else:
            draw.text(position, text, font=font, fill=color[:3])

        return image

    def _wrap_text(
        self, text: str, font: ImageFont.FreeTypeFont, max_width: int
    ) -> List[str]:
        """Wrap text to fit within max width"""
        words = text.split()
        lines = []
        current_line = []

        for word in words:
            test_line = " ".join(current_line + [word])
            bbox = font.getbbox(test_line)
            width = bbox[2] - bbox[0]

            if width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                current_line = [word]

        if current_line:
            lines.append(" ".join(current_line))

        return lines

    def _draw_text_background(
        self,
        draw: ImageDraw.Draw,
        text: str,
        position: Tuple[int, int],
        font: ImageFont.FreeTypeFont,
        bg_config: dict,
        max_width: Optional[int]
    ):
        """Draw background behind text"""
        bbox = font.getbbox(text)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        padding = bg_config.get("padding", 8)
        radius = bg_config.get("border_radius", 4)
        opacity = bg_config.get("opacity", 0.8)
        color = self._parse_color(bg_config.get("color", "#000000"))

        # Adjust color with opacity
        color = color[:3] + (int(255 * opacity),)

        x1 = position[0] - padding
        y1 = position[1] - padding
        x2 = position[0] + text_width + padding
        y2 = position[1] + text_height + padding

        draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=color)

    def compose_screenshot(
        self,
        background: Image.Image,
        device_frame: Image.Image,
        texts: List[dict],
        device_config: dict,
        target_width: int,
        target_height: int
    ) -> Image.Image:
        """Compose final screenshot with all elements"""
        # Create output at target size
        output = background.copy()

        # Calculate device position
        # Scale is relative to canvas width (e.g., 0.75 = device takes 75% of canvas width)
        device_scale = device_config.get("scale", 0.75)
        pos_x = device_config.get("position_x", 0.5)
        pos_y = device_config.get("position_y", 0.55)

        # Scale device frame relative to canvas width
        target_device_width = int(target_width * device_scale)
        scale_factor = target_device_width / device_frame.width
        new_width = target_device_width
        new_height = int(device_frame.height * scale_factor)
        device_scaled = device_frame.resize(
            (new_width, new_height),
            Image.Resampling.LANCZOS
        )

        # Calculate position
        x = int(target_width * pos_x - new_width // 2)
        y = int(target_height * pos_y - new_height // 2)

        # Paste device onto background
        output.paste(device_scaled, (x, y), device_scaled)

        # Draw texts
        for text_config in texts:
            text = text_config.get("text", "")
            if not text:
                continue

            style = text_config.get("style", {})
            text_y = text_config.get("position_y", 0.1)

            # Calculate text position
            text_x = target_width // 2
            text_y_px = int(target_height * text_y)

            output = self.draw_text(
                output,
                text,
                (text_x, text_y_px),
                style,
                max_width=int(target_width * 0.85)
            )

        return output

    def export_to_size(
        self,
        image: Image.Image,
        width: int,
        height: int,
        format: str = "png",
        quality: int = 95
    ) -> bytes:
        """Export image to specific size and format"""
        # Resize to target dimensions
        resized = image.resize((width, height), Image.Resampling.LANCZOS)

        # Convert to RGB for JPEG
        if format.lower() == "jpeg":
            resized = resized.convert("RGB")

        # Save to bytes
        buffer = io.BytesIO()
        if format.lower() == "jpeg":
            resized.save(buffer, format="JPEG", quality=quality)
        else:
            resized.save(buffer, format="PNG")

        return buffer.getvalue()
