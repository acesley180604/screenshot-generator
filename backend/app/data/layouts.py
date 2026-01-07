"""Creative layout templates for App Store screenshots"""

# Layout types define how devices and elements are arranged
LAYOUT_TYPES = {
    # Single device layouts
    "single-center": {
        "id": "single-center",
        "name": "Single Center",
        "description": "Single device centered in frame",
        "category": "single",
        "devices": [
            {"position": {"x": 0.5, "y": 0.55}, "scale": 0.85, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.08, "width": 0.85}
        ]
    },
    "single-left": {
        "id": "single-left",
        "name": "Single Left",
        "description": "Device on left, text on right",
        "category": "single",
        "devices": [
            {"position": {"x": 0.32, "y": 0.55}, "scale": 0.75, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "right", "x": 0.68, "y": 0.35, "width": 0.55, "align": "left"}
        ]
    },
    "single-right": {
        "id": "single-right",
        "name": "Single Right",
        "description": "Device on right, text on left",
        "category": "single",
        "devices": [
            {"position": {"x": 0.68, "y": 0.55}, "scale": 0.75, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "left", "x": 0.32, "y": 0.35, "width": 0.55, "align": "right"}
        ]
    },

    # Angled/3D perspective layouts
    "angled-right": {
        "id": "angled-right",
        "name": "Angled Right",
        "description": "Device tilted to the right with 3D effect",
        "category": "angled",
        "devices": [
            {"position": {"x": 0.5, "y": 0.55}, "scale": 0.8, "rotation": 8, "perspective": True, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.06, "width": 0.85}
        ]
    },
    "angled-left": {
        "id": "angled-left",
        "name": "Angled Left",
        "description": "Device tilted to the left with 3D effect",
        "category": "angled",
        "devices": [
            {"position": {"x": 0.5, "y": 0.55}, "scale": 0.8, "rotation": -8, "perspective": True, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.06, "width": 0.85}
        ]
    },
    "floating-3d": {
        "id": "floating-3d",
        "name": "Floating 3D",
        "description": "Device floating with shadow and depth",
        "category": "angled",
        "devices": [
            {"position": {"x": 0.5, "y": 0.52}, "scale": 0.75, "rotation": 5, "perspective": True, "floatingShadow": True, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.05, "width": 0.85}
        ]
    },

    # Multiple device layouts
    "duo-overlap": {
        "id": "duo-overlap",
        "name": "Duo Overlap",
        "description": "Two devices overlapping",
        "category": "multi",
        "devices": [
            {"position": {"x": 0.38, "y": 0.58}, "scale": 0.7, "rotation": -5, "zIndex": 1},
            {"position": {"x": 0.62, "y": 0.52}, "scale": 0.7, "rotation": 5, "zIndex": 2}
        ],
        "textAreas": [
            {"position": "top", "y": 0.05, "width": 0.9}
        ]
    },
    "duo-side-by-side": {
        "id": "duo-side-by-side",
        "name": "Duo Side by Side",
        "description": "Two devices side by side",
        "category": "multi",
        "devices": [
            {"position": {"x": 0.3, "y": 0.55}, "scale": 0.55, "rotation": 0, "zIndex": 1},
            {"position": {"x": 0.7, "y": 0.55}, "scale": 0.55, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.06, "width": 0.9}
        ]
    },
    "duo-stacked": {
        "id": "duo-stacked",
        "name": "Duo Stacked",
        "description": "Two devices stacked front-to-back",
        "category": "multi",
        "devices": [
            {"position": {"x": 0.45, "y": 0.6}, "scale": 0.65, "rotation": -3, "zIndex": 1, "opacity": 0.7},
            {"position": {"x": 0.55, "y": 0.5}, "scale": 0.7, "rotation": 3, "zIndex": 2}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.85}
        ]
    },
    "trio-cascade": {
        "id": "trio-cascade",
        "name": "Trio Cascade",
        "description": "Three devices in cascade arrangement",
        "category": "multi",
        "devices": [
            {"position": {"x": 0.25, "y": 0.62}, "scale": 0.5, "rotation": -8, "zIndex": 1},
            {"position": {"x": 0.5, "y": 0.5}, "scale": 0.55, "rotation": 0, "zIndex": 2},
            {"position": {"x": 0.75, "y": 0.62}, "scale": 0.5, "rotation": 8, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.9}
        ]
    },
    "trio-fan": {
        "id": "trio-fan",
        "name": "Trio Fan",
        "description": "Three devices fanned out",
        "category": "multi",
        "devices": [
            {"position": {"x": 0.3, "y": 0.58}, "scale": 0.45, "rotation": -15, "zIndex": 1},
            {"position": {"x": 0.5, "y": 0.52}, "scale": 0.5, "rotation": 0, "zIndex": 2},
            {"position": {"x": 0.7, "y": 0.58}, "scale": 0.45, "rotation": 15, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.03, "width": 0.9}
        ]
    },

    # Feature highlight layouts
    "feature-callout-right": {
        "id": "feature-callout-right",
        "name": "Feature Callout Right",
        "description": "Device with callout annotations on right",
        "category": "feature",
        "devices": [
            {"position": {"x": 0.35, "y": 0.5}, "scale": 0.7, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.85}
        ],
        "callouts": [
            {"position": {"x": 0.75, "y": 0.35}, "align": "left"},
            {"position": {"x": 0.75, "y": 0.55}, "align": "left"},
            {"position": {"x": 0.75, "y": 0.75}, "align": "left"}
        ]
    },
    "feature-callout-left": {
        "id": "feature-callout-left",
        "name": "Feature Callout Left",
        "description": "Device with callout annotations on left",
        "category": "feature",
        "devices": [
            {"position": {"x": 0.65, "y": 0.5}, "scale": 0.7, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.85}
        ],
        "callouts": [
            {"position": {"x": 0.25, "y": 0.35}, "align": "right"},
            {"position": {"x": 0.25, "y": 0.55}, "align": "right"},
            {"position": {"x": 0.25, "y": 0.75}, "align": "right"}
        ]
    },
    "zoom-feature": {
        "id": "zoom-feature",
        "name": "Zoom Feature",
        "description": "Device with zoomed-in feature highlight",
        "category": "feature",
        "devices": [
            {"position": {"x": 0.35, "y": 0.55}, "scale": 0.65, "rotation": -3, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.05, "width": 0.85}
        ],
        "featureZoom": {
            "position": {"x": 0.72, "y": 0.55},
            "scale": 1.5,
            "borderRadius": 20,
            "showConnector": True
        }
    },

    # Panoramic/connected layouts
    "panoramic-left": {
        "id": "panoramic-left",
        "name": "Panoramic Left",
        "description": "Left side of panoramic background - device on right",
        "category": "panoramic",
        "devices": [
            {"position": {"x": 0.65, "y": 0.55}, "scale": 0.75, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "left", "x": 0.25, "y": 0.4, "width": 0.4, "align": "left"}
        ],
        "panoramicPosition": "left"
    },
    "panoramic-center": {
        "id": "panoramic-center",
        "name": "Panoramic Center",
        "description": "Center of panoramic background",
        "category": "panoramic",
        "devices": [
            {"position": {"x": 0.5, "y": 0.55}, "scale": 0.75, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.06, "width": 0.85}
        ],
        "panoramicPosition": "center"
    },
    "panoramic-right": {
        "id": "panoramic-right",
        "name": "Panoramic Right",
        "description": "Right side of panoramic background - device on left",
        "category": "panoramic",
        "devices": [
            {"position": {"x": 0.35, "y": 0.55}, "scale": 0.75, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "right", "x": 0.75, "y": 0.4, "width": 0.4, "align": "right"}
        ],
        "panoramicPosition": "right"
    },

    # Full bleed / No frame layouts
    "full-bleed": {
        "id": "full-bleed",
        "name": "Full Bleed",
        "description": "Screenshot fills entire frame without device",
        "category": "fullbleed",
        "devices": [
            {"position": {"x": 0.5, "y": 0.5}, "scale": 1.0, "rotation": 0, "zIndex": 1, "noFrame": True}
        ],
        "textAreas": [
            {"position": "top", "y": 0.08, "width": 0.85}
        ]
    },
    "full-bleed-rounded": {
        "id": "full-bleed-rounded",
        "name": "Full Bleed Rounded",
        "description": "Screenshot with rounded corners, no device",
        "category": "fullbleed",
        "devices": [
            {"position": {"x": 0.5, "y": 0.52}, "scale": 0.92, "rotation": 0, "zIndex": 1, "noFrame": True, "roundedCorners": 40}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.85}
        ]
    },

    # Split/Divided layouts
    "split-vertical": {
        "id": "split-vertical",
        "name": "Split Vertical",
        "description": "Screen split vertically - two different screens",
        "category": "split",
        "devices": [
            {"position": {"x": 0.28, "y": 0.55}, "scale": 0.65, "rotation": 0, "zIndex": 1, "clipLeft": True},
            {"position": {"x": 0.72, "y": 0.55}, "scale": 0.65, "rotation": 0, "zIndex": 1, "clipRight": True}
        ],
        "textAreas": [
            {"position": "top", "y": 0.05, "width": 0.9}
        ],
        "divider": {"position": 0.5, "style": "gradient"}
    },
    "split-diagonal": {
        "id": "split-diagonal",
        "name": "Split Diagonal",
        "description": "Diagonal split showing two screens",
        "category": "split",
        "devices": [
            {"position": {"x": 0.35, "y": 0.45}, "scale": 0.6, "rotation": -5, "zIndex": 1},
            {"position": {"x": 0.65, "y": 0.65}, "scale": 0.6, "rotation": 5, "zIndex": 2}
        ],
        "textAreas": [
            {"position": "top", "y": 0.04, "width": 0.85}
        ]
    },

    # Bottom device layouts
    "bottom-peek": {
        "id": "bottom-peek",
        "name": "Bottom Peek",
        "description": "Device peeks from bottom of frame",
        "category": "creative",
        "devices": [
            {"position": {"x": 0.5, "y": 0.85}, "scale": 0.9, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "top", "y": 0.15, "width": 0.85},
            {"position": "subtitle", "y": 0.28, "width": 0.7}
        ]
    },
    "top-peek": {
        "id": "top-peek",
        "name": "Top Peek",
        "description": "Device peeks from top of frame",
        "category": "creative",
        "devices": [
            {"position": {"x": 0.5, "y": 0.25}, "scale": 0.9, "rotation": 0, "zIndex": 1}
        ],
        "textAreas": [
            {"position": "bottom", "y": 0.85, "width": 0.85}
        ]
    }
}

# Layout categories for filtering
LAYOUT_CATEGORIES = [
    {"id": "all", "name": "All Layouts"},
    {"id": "single", "name": "Single Device"},
    {"id": "angled", "name": "Angled / 3D"},
    {"id": "multi", "name": "Multiple Devices"},
    {"id": "feature", "name": "Feature Highlight"},
    {"id": "panoramic", "name": "Panoramic"},
    {"id": "fullbleed", "name": "Full Bleed"},
    {"id": "split", "name": "Split Screen"},
    {"id": "creative", "name": "Creative"},
]

def get_layouts_by_category(category: str = "all"):
    """Get layouts filtered by category"""
    if category == "all":
        return list(LAYOUT_TYPES.values())
    return [l for l in LAYOUT_TYPES.values() if l.get("category") == category]

def get_layout(layout_id: str):
    """Get a specific layout by ID"""
    return LAYOUT_TYPES.get(layout_id)
