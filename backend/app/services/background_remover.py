"""Background removal service using rembg"""
import io
import time
from typing import Optional, Tuple
from PIL import Image

try:
    from rembg import remove, new_session
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False


class BackgroundRemover:
    """Service for removing backgrounds from images using AI"""

    def __init__(self):
        self._session = None

    @property
    def session(self):
        """Lazy load rembg session for better performance"""
        if self._session is None and REMBG_AVAILABLE:
            # Use u2net model for best quality
            self._session = new_session("u2net")
        return self._session

    def is_available(self) -> bool:
        """Check if background removal is available"""
        return REMBG_AVAILABLE

    def remove_background(
        self,
        image_data: bytes,
        alpha_matting: bool = False,
        alpha_matting_foreground_threshold: int = 240,
        alpha_matting_background_threshold: int = 10,
        alpha_matting_erode_size: int = 10,
    ) -> Tuple[bytes, float]:
        """
        Remove background from an image.

        Args:
            image_data: Raw image bytes (PNG, JPEG, WebP)
            alpha_matting: Enable alpha matting for smoother edges
            alpha_matting_foreground_threshold: Threshold for foreground
            alpha_matting_background_threshold: Threshold for background
            alpha_matting_erode_size: Erosion size for alpha matting

        Returns:
            Tuple of (processed image bytes as PNG, processing time in seconds)
        """
        if not REMBG_AVAILABLE:
            raise RuntimeError("rembg library is not available. Install with: pip install rembg")

        start_time = time.time()

        # Load image
        input_image = Image.open(io.BytesIO(image_data))

        # Convert to RGBA if needed
        if input_image.mode != "RGBA":
            input_image = input_image.convert("RGBA")

        # Remove background
        output_image = remove(
            input_image,
            session=self.session,
            alpha_matting=alpha_matting,
            alpha_matting_foreground_threshold=alpha_matting_foreground_threshold,
            alpha_matting_background_threshold=alpha_matting_background_threshold,
            alpha_matting_erode_size=alpha_matting_erode_size,
        )

        # Save to bytes
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG", optimize=True)
        output_bytes = output_buffer.getvalue()

        processing_time = time.time() - start_time

        return output_bytes, processing_time

    def remove_background_from_file(
        self,
        filepath: str,
        output_filepath: Optional[str] = None,
        **kwargs
    ) -> Tuple[str, float]:
        """
        Remove background from an image file.

        Args:
            filepath: Path to the input image
            output_filepath: Path to save the output (if None, replaces original with _nobg suffix)
            **kwargs: Additional arguments passed to remove_background

        Returns:
            Tuple of (output filepath, processing time in seconds)
        """
        # Read input file
        with open(filepath, "rb") as f:
            image_data = f.read()

        # Process
        output_bytes, processing_time = self.remove_background(image_data, **kwargs)

        # Determine output path
        if output_filepath is None:
            # Add _nobg suffix before extension
            base, ext = filepath.rsplit(".", 1)
            output_filepath = f"{base}_nobg.png"

        # Save output
        with open(output_filepath, "wb") as f:
            f.write(output_bytes)

        return output_filepath, processing_time

    def get_image_dimensions(self, image_data: bytes) -> Tuple[int, int]:
        """Get dimensions of an image from bytes"""
        image = Image.open(io.BytesIO(image_data))
        return image.width, image.height


# Singleton instance
background_remover = BackgroundRemover()
