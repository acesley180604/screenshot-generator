"""Device specifications for App Store screenshots"""

DEVICE_SPECS = {
    # iPhone devices
    "iphone-6.9": {
        "id": "iphone-6.9",
        "name": "iPhone 16 Pro Max",
        "display_size": "6.9\"",
        "width": 1320,
        "height": 2868,
        "frame_width": 1420,
        "frame_height": 2980,
        "screen_offset_x": 50,
        "screen_offset_y": 56,
        "screen_width": 1320,
        "screen_height": 2868,
        "corner_radius": 140,
        "required": True,
        "category": "iphone"
    },
    "iphone-6.9-alt": {
        "id": "iphone-6.9-alt",
        "name": "iPhone 15 Pro Max",
        "display_size": "6.9\"",
        "width": 1290,
        "height": 2796,
        "frame_width": 1390,
        "frame_height": 2908,
        "screen_offset_x": 50,
        "screen_offset_y": 56,
        "screen_width": 1290,
        "screen_height": 2796,
        "corner_radius": 135,
        "required": False,
        "category": "iphone"
    },
    "iphone-6.5": {
        "id": "iphone-6.5",
        "name": "iPhone 14 Plus",
        "display_size": "6.5\"",
        "width": 1284,
        "height": 2778,
        "frame_width": 1384,
        "frame_height": 2890,
        "screen_offset_x": 50,
        "screen_offset_y": 56,
        "screen_width": 1284,
        "screen_height": 2778,
        "corner_radius": 130,
        "required": False,
        "category": "iphone"
    },
    "iphone-6.1": {
        "id": "iphone-6.1",
        "name": "iPhone 15",
        "display_size": "6.1\"",
        "width": 1179,
        "height": 2556,
        "frame_width": 1279,
        "frame_height": 2668,
        "screen_offset_x": 50,
        "screen_offset_y": 56,
        "screen_width": 1179,
        "screen_height": 2556,
        "corner_radius": 120,
        "required": False,
        "category": "iphone"
    },
    "iphone-5.5": {
        "id": "iphone-5.5",
        "name": "iPhone 8 Plus",
        "display_size": "5.5\"",
        "width": 1242,
        "height": 2208,
        "frame_width": 1342,
        "frame_height": 2360,
        "screen_offset_x": 50,
        "screen_offset_y": 76,
        "screen_width": 1242,
        "screen_height": 2208,
        "corner_radius": 0,
        "required": False,
        "category": "iphone"
    },

    # iPad devices
    "ipad-13": {
        "id": "ipad-13",
        "name": "iPad Pro 13\"",
        "display_size": "13\"",
        "width": 2064,
        "height": 2752,
        "frame_width": 2184,
        "frame_height": 2880,
        "screen_offset_x": 60,
        "screen_offset_y": 64,
        "screen_width": 2064,
        "screen_height": 2752,
        "corner_radius": 40,
        "required": True,
        "category": "ipad"
    },
    "ipad-12.9": {
        "id": "ipad-12.9",
        "name": "iPad Pro 12.9\"",
        "display_size": "12.9\"",
        "width": 2048,
        "height": 2732,
        "frame_width": 2168,
        "frame_height": 2860,
        "screen_offset_x": 60,
        "screen_offset_y": 64,
        "screen_width": 2048,
        "screen_height": 2732,
        "corner_radius": 40,
        "required": False,
        "category": "ipad"
    },
    "ipad-11": {
        "id": "ipad-11",
        "name": "iPad Pro 11\"",
        "display_size": "11\"",
        "width": 1668,
        "height": 2388,
        "frame_width": 1788,
        "frame_height": 2516,
        "screen_offset_x": 60,
        "screen_offset_y": 64,
        "screen_width": 1668,
        "screen_height": 2388,
        "corner_radius": 36,
        "required": False,
        "category": "ipad"
    },

    # Apple Watch
    "watch-ultra": {
        "id": "watch-ultra",
        "name": "Apple Watch Ultra",
        "display_size": "49mm",
        "width": 422,
        "height": 514,
        "frame_width": 502,
        "frame_height": 614,
        "screen_offset_x": 40,
        "screen_offset_y": 50,
        "screen_width": 422,
        "screen_height": 514,
        "corner_radius": 80,
        "required": False,
        "category": "watch"
    },
    "watch-series-9": {
        "id": "watch-series-9",
        "name": "Apple Watch Series 9",
        "display_size": "45mm",
        "width": 410,
        "height": 502,
        "frame_width": 490,
        "frame_height": 602,
        "screen_offset_x": 40,
        "screen_offset_y": 50,
        "screen_width": 410,
        "screen_height": 502,
        "corner_radius": 75,
        "required": False,
        "category": "watch"
    },

    # Apple TV
    "apple-tv-4k": {
        "id": "apple-tv-4k",
        "name": "Apple TV 4K",
        "display_size": "TV",
        "width": 3840,
        "height": 2160,
        "frame_width": 3840,
        "frame_height": 2160,
        "screen_offset_x": 0,
        "screen_offset_y": 0,
        "screen_width": 3840,
        "screen_height": 2160,
        "corner_radius": 0,
        "required": False,
        "category": "tv"
    },
    "apple-tv-hd": {
        "id": "apple-tv-hd",
        "name": "Apple TV HD",
        "display_size": "TV",
        "width": 1920,
        "height": 1080,
        "frame_width": 1920,
        "frame_height": 1080,
        "screen_offset_x": 0,
        "screen_offset_y": 0,
        "screen_width": 1920,
        "screen_height": 1080,
        "corner_radius": 0,
        "required": False,
        "category": "tv"
    },

    # Mac
    "mac-16": {
        "id": "mac-16",
        "name": "MacBook Pro 16\"",
        "display_size": "16\"",
        "width": 2880,
        "height": 1800,
        "frame_width": 3000,
        "frame_height": 1980,
        "screen_offset_x": 60,
        "screen_offset_y": 90,
        "screen_width": 2880,
        "screen_height": 1800,
        "corner_radius": 20,
        "required": False,
        "category": "mac"
    },
    "mac-14": {
        "id": "mac-14",
        "name": "MacBook Pro 14\"",
        "display_size": "14\"",
        "width": 2560,
        "height": 1600,
        "frame_width": 2680,
        "frame_height": 1780,
        "screen_offset_x": 60,
        "screen_offset_y": 90,
        "screen_width": 2560,
        "screen_height": 1600,
        "corner_radius": 18,
        "required": False,
        "category": "mac"
    },

    # Vision Pro
    "vision-pro": {
        "id": "vision-pro",
        "name": "Apple Vision Pro",
        "display_size": "visionOS",
        "width": 3840,
        "height": 2160,
        "frame_width": 3840,
        "frame_height": 2160,
        "screen_offset_x": 0,
        "screen_offset_y": 0,
        "screen_width": 3840,
        "screen_height": 2160,
        "corner_radius": 0,
        "required": False,
        "category": "vision"
    }
}

# Device frame colors
DEVICE_COLORS = {
    "iphone": [
        {"id": "natural-titanium", "name": "Natural Titanium", "hex": "#8A8A8F"},
        {"id": "blue-titanium", "name": "Blue Titanium", "hex": "#3C4C5C"},
        {"id": "white-titanium", "name": "White Titanium", "hex": "#F5F5F0"},
        {"id": "black-titanium", "name": "Black Titanium", "hex": "#2E2E30"},
        {"id": "space-black", "name": "Space Black", "hex": "#1F1F1F"},
        {"id": "silver", "name": "Silver", "hex": "#E3E4E5"},
        {"id": "gold", "name": "Gold", "hex": "#F5E7D0"},
        {"id": "blue", "name": "Blue", "hex": "#A7C1D9"},
        {"id": "pink", "name": "Pink", "hex": "#F9D1CF"},
    ],
    "ipad": [
        {"id": "space-gray", "name": "Space Gray", "hex": "#6E6E73"},
        {"id": "silver", "name": "Silver", "hex": "#E3E4E5"},
        {"id": "space-black", "name": "Space Black", "hex": "#1F1F1F"},
    ],
    "watch": [
        {"id": "midnight", "name": "Midnight", "hex": "#1D1D1F"},
        {"id": "starlight", "name": "Starlight", "hex": "#F9F3EE"},
        {"id": "silver", "name": "Silver", "hex": "#E3E4E5"},
        {"id": "natural-titanium", "name": "Natural Titanium", "hex": "#8A8A8F"},
    ]
}

# Get all devices for export options
def get_export_device_options():
    """Get device options for export selection"""
    options = []
    for device_id, spec in DEVICE_SPECS.items():
        options.append({
            "id": device_id,
            "name": spec["name"],
            "display_size": spec["display_size"],
            "dimensions": f"{spec['width']}x{spec['height']}",
            "required": spec["required"],
            "category": spec["category"]
        })
    return options
