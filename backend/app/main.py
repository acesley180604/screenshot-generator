"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .routers import templates, devices, locales, generate, upload, layouts

# Create FastAPI app
app = FastAPI(
    title="Apple Screenshot Generator API",
    description="API for generating App Store screenshots with templates and localization",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(templates.router, prefix="/api")
app.include_router(devices.router, prefix="/api")
app.include_router(locales.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(layouts.router, prefix="/api")

# Static files for assets
assets_path = os.path.join(os.path.dirname(__file__), "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/api")
async def root():
    return {
        "name": "Apple Screenshot Generator API",
        "version": "1.0.0",
        "endpoints": {
            "templates": "/api/templates",
            "layouts": "/api/layouts",
            "devices": "/api/devices",
            "locales": "/api/locales",
            "upload": "/api/upload",
            "generate": "/api/generate",
            "docs": "/api/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
