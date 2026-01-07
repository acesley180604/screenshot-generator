"""Upload router"""
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from ..services.generator import ScreenshotGenerator

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
