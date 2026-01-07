"""Generation router"""
import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid

from ..services.generator import ScreenshotGenerator
from ..models.schemas import GeneratePreviewRequest, GenerateExportRequest

router = APIRouter(prefix="/generate", tags=["generate"])

# Initialize generator
generator = ScreenshotGenerator()

# In-memory job tracking (in production, use Redis or database)
export_jobs: Dict[str, dict] = {}


@router.post("/preview")
async def generate_preview(request: GeneratePreviewRequest):
    """Generate a preview image for a screenshot configuration"""
    try:
        image_bytes = generator.generate_preview(
            screenshot_config=request.screenshot.model_dump(),
            locale=request.locale,
            width=request.width,
            height=request.height
        )

        return Response(
            content=image_bytes,
            media_type="image/png",
            headers={
                "Content-Disposition": "inline; filename=preview.png"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export")
async def create_export(request: GenerateExportRequest, background_tasks: BackgroundTasks):
    """Start an export job for all screenshots"""
    job_id = str(uuid.uuid4())

    # Initialize job status
    export_jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "download_url": None,
        "error": None
    }

    # Run export in background
    background_tasks.add_task(
        run_export_job,
        job_id,
        request.project.model_dump(),
        request.config.model_dump()
    )

    return {
        "job_id": job_id,
        "status": "pending"
    }


async def run_export_job(job_id: str, project: dict, config: dict):
    """Background task to run export job"""
    try:
        export_jobs[job_id]["status"] = "processing"
        export_jobs[job_id]["progress"] = 10

        # Generate exports
        output_path = generator.generate_exports(project, config)

        export_jobs[job_id]["status"] = "completed"
        export_jobs[job_id]["progress"] = 100
        export_jobs[job_id]["download_url"] = f"/api/generate/download/{job_id}"
        export_jobs[job_id]["output_path"] = output_path

    except Exception as e:
        export_jobs[job_id]["status"] = "failed"
        export_jobs[job_id]["error"] = str(e)


@router.get("/status/{job_id}")
async def get_export_status(job_id: str):
    """Get the status of an export job"""
    job = export_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "download_url": job.get("download_url"),
        "error": job.get("error")
    }


@router.get("/download/{job_id}")
async def download_export(job_id: str):
    """Download the completed export"""
    job = export_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Export not ready")

    output_path = job.get("output_path")
    if not output_path or not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Export file not found")

    return FileResponse(
        output_path,
        media_type="application/zip",
        filename="screenshots.zip"
    )
