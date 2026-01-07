"""Layouts router"""
from fastapi import APIRouter, Query
from typing import Optional

from ..data.layouts import LAYOUT_TYPES, LAYOUT_CATEGORIES, get_layouts_by_category, get_layout

router = APIRouter(prefix="/layouts", tags=["layouts"])


@router.get("")
async def list_layouts(category: Optional[str] = Query(None, description="Filter by category")):
    """Get all available layouts"""
    if category:
        layouts = get_layouts_by_category(category)
    else:
        layouts = list(LAYOUT_TYPES.values())

    return {
        "layouts": layouts,
        "total": len(layouts)
    }


@router.get("/categories")
async def list_categories():
    """Get all layout categories"""
    return {"categories": LAYOUT_CATEGORIES}


@router.get("/{layout_id}")
async def get_layout_by_id(layout_id: str):
    """Get a specific layout by ID"""
    layout = get_layout(layout_id)
    if not layout:
        return {"error": "Layout not found"}, 404
    return layout
