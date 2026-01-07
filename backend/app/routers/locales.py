"""Locales router"""
from fastapi import APIRouter

from ..data.locales import LOCALES, get_all_locales, get_locale

router = APIRouter(prefix="/locales", tags=["locales"])


@router.get("")
async def list_locales():
    """Get all supported locales"""
    return {
        "locales": get_all_locales(),
        "total": len(LOCALES)
    }


@router.get("/{locale_code}")
async def get_locale_info(locale_code: str):
    """Get a specific locale by code"""
    locale = get_locale(locale_code)
    if not locale:
        return {"error": "Locale not found"}, 404
    return locale
