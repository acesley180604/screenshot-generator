"""Upload router"""
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from ..services.generator import ScreenshotGenerator
from ..services.background_remover import background_remover
from ..models.schemas import BackgroundRemovalRequest, BackgroundRemovalResponse

router = APIRouter(prefix="/upload", tags=["upload"])

# Initialize generator
generator = ScreenshotGenerator()

# Allowed file types
ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("")
async def upload_image(file: UploadFile = File(...)):
    """Upload a screenshot image"""
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"
        )

    # Save file
    try:
        result = generator.save_uploaded_image(content, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{file_id}")
async def get_uploaded_image(file_id: str):
    """Get an uploaded image by ID"""
    upload_dir = generator.upload_dir

    # Find file with this ID
    for filename in os.listdir(upload_dir):
        if filename.startswith(file_id):
            filepath = os.path.join(upload_dir, filename)
            return FileResponse(filepath)

    raise HTTPException(status_code=404, detail="Image not found")


@router.delete("/{file_id}")
async def delete_uploaded_image(file_id: str):
    """Delete an uploaded image"""
    success = generator.delete_uploaded_image(file_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"status": "deleted"}


@router.post("/remove-background", response_model=BackgroundRemovalResponse)
async def remove_background(request: BackgroundRemovalRequest):
    """Remove background from an uploaded image"""
    # Check if rembg is available
    if not background_remover.is_available():
        raise HTTPException(
            status_code=503,
            detail="Background removal service is not available. Please install rembg."
        )

    upload_dir = generator.upload_dir

    # Find the original file
    original_filepath = None
    original_url = None
    for filename in os.listdir(upload_dir):
        if filename.startswith(request.file_id):
            original_filepath = os.path.join(upload_dir, filename)
            original_url = f"/api/upload/{request.file_id}"
            break

    if not original_filepath:
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        # Read the original image
        with open(original_filepath, "rb") as f:
            image_data = f.read()

        # Remove background
        processed_data, processing_time = background_remover.remove_background(
            image_data,
            alpha_matting=request.alpha_matting
        )

        # Generate new file ID for the processed image
        new_file_id = str(uuid.uuid4())[:8]
        new_filename = f"{new_file_id}_nobg.png"
        new_filepath = os.path.join(upload_dir, new_filename)

        # Save processed image
        with open(new_filepath, "wb") as f:
            f.write(processed_data)

        # Get dimensions
        width, height = background_remover.get_image_dimensions(processed_data)

        return BackgroundRemovalResponse(
            id=new_file_id,
            url=f"/api/upload/{new_file_id}",
            original_url=original_url,
            width=width,
            height=height,
            processing_time=round(processing_time, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")


@router.get("/remove-background/status")
async def get_background_removal_status():
    """Check if background removal service is available"""
    return {
        "available": background_remover.is_available(),
        "message": "Background removal is available" if background_remover.is_available() else "rembg library not installed"
    }
