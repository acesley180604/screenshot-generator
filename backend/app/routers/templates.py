"""Templates router"""
from fastapi import APIRouter, Query
from typing import Optional, List

from ..data.templates import TEMPLATES, TEMPLATE_CATEGORIES, get_templates_by_category

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("")
async def list_templates(category: Optional[str] = Query(None, description="Filter by category")):
    """Get all available templates"""
    if category:
        templates = get_templates_by_category(category)
    else:
        templates = list(TEMPLATES.values())

    return {
        "templates": templates,
        "total": len(templates)
    }


@router.get("/categories")
async def list_categories():
    """Get all template categories"""
    return {"categories": TEMPLATE_CATEGORIES}


@router.get("/{template_id}")
async def get_template(template_id: str):
    """Get a specific template by ID"""
    template = TEMPLATES.get(template_id)
    if not template:
        return {"error": "Template not found"}, 404
    return template
