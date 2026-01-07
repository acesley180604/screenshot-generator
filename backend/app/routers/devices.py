"""Devices router"""
from fastapi import APIRouter, Query
from typing import Optional

from ..data.devices import DEVICE_SPECS, DEVICE_COLORS, get_export_device_options

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("")
async def list_devices(category: Optional[str] = Query(None, description="Filter by category (iphone, ipad, watch, etc.)")):
    """Get all device specifications"""
    if category:
        devices = {k: v for k, v in DEVICE_SPECS.items() if v.get("category") == category}
    else:
        devices = DEVICE_SPECS

    return {
        "devices": list(devices.values()),
        "total": len(devices)
    }


@router.get("/colors")
async def list_device_colors():
    """Get available device colors"""
    return {"colors": DEVICE_COLORS}


@router.get("/export-options")
async def get_export_options():
    """Get device options for export selection"""
    return {"options": get_export_device_options()}


@router.get("/{device_id}")
async def get_device(device_id: str):
    """Get a specific device specification"""
    device = DEVICE_SPECS.get(device_id)
    if not device:
        return {"error": "Device not found"}, 404
    return device
