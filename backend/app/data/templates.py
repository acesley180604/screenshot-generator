"""Pre-built templates for App Store screenshots"""

TEMPLATES = {
    "clean-white": {
        "id": "clean-white",
        "name": "Clean White",
        "category": "minimal",
        "description": "Simple white background with centered device",
        "preview_url": "/templates/clean-white.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#FFFFFF"
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#000000",
                "alignment": "center"
            }
        }
    },
    "clean-dark": {
        "id": "clean-dark",
        "name": "Clean Dark",
        "category": "minimal",
        "description": "Dark background with clean aesthetics",
        "preview_url": "/templates/clean-dark.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#1A1A1A"
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-blue": {
        "id": "gradient-blue",
        "name": "Ocean Blue",
        "category": "gradient",
        "description": "Beautiful blue gradient background",
        "preview_url": "/templates/gradient-blue.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#667EEA", "position": 0},
                        {"color": "#764BA2", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-sunset": {
        "id": "gradient-sunset",
        "name": "Sunset",
        "category": "gradient",
        "description": "Warm sunset gradient colors",
        "preview_url": "/templates/gradient-sunset.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 135,
                    "stops": [
                        {"color": "#FF6B6B", "position": 0},
                        {"color": "#FFE66D", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-purple": {
        "id": "gradient-purple",
        "name": "Purple Dream",
        "category": "gradient",
        "description": "Deep purple gradient",
        "preview_url": "/templates/gradient-purple.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 160,
                    "stops": [
                        {"color": "#8E2DE2", "position": 0},
                        {"color": "#4A00E0", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-green": {
        "id": "gradient-green",
        "name": "Fresh Green",
        "category": "gradient",
        "description": "Fresh green nature gradient",
        "preview_url": "/templates/gradient-green.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#11998E", "position": 0},
                        {"color": "#38EF7D", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-pink": {
        "id": "gradient-pink",
        "name": "Pink Blush",
        "category": "gradient",
        "description": "Soft pink gradient",
        "preview_url": "/templates/gradient-pink.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#FF758C", "position": 0},
                        {"color": "#FF7EB3", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "feature-spotlight": {
        "id": "feature-spotlight",
        "name": "Feature Spotlight",
        "category": "feature",
        "description": "Highlight specific features with callouts",
        "preview_url": "/templates/feature-spotlight.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#F8F9FA"
            },
            "text_position": "top",
            "device_layout": "left",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 56,
                "font_weight": 600,
                "color": "#1A1A1A",
                "alignment": "left"
            }
        }
    },
    "bold-statement": {
        "id": "bold-statement",
        "name": "Bold Statement",
        "category": "feature",
        "description": "Large bold text with device below",
        "preview_url": "/templates/bold-statement.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#000000"
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 80,
                "font_weight": 800,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "lifestyle-light": {
        "id": "lifestyle-light",
        "name": "Lifestyle Light",
        "category": "lifestyle",
        "description": "Light background with lifestyle context",
        "preview_url": "/templates/lifestyle-light.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#FDF6E9"
            },
            "text_position": "bottom",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 56,
                "font_weight": 600,
                "color": "#2D2D2D",
                "alignment": "center"
            }
        }
    },
    "app-icon-hero": {
        "id": "app-icon-hero",
        "name": "App Icon Hero",
        "category": "feature",
        "description": "Showcase your app icon prominently",
        "preview_url": "/templates/app-icon-hero.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "radial",
                    "angle": 0,
                    "stops": [
                        {"color": "#1E3A5F", "position": 0},
                        {"color": "#0D1B2A", "position": 1}
                    ]
                }
            },
            "text_position": "bottom",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 64,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "minimal-shadow": {
        "id": "minimal-shadow",
        "name": "Minimal Shadow",
        "category": "minimal",
        "description": "Clean design with soft shadow",
        "preview_url": "/templates/minimal-shadow.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#F5F5F7"
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 60,
                "font_weight": 600,
                "color": "#1D1D1F",
                "alignment": "center"
            }
        }
    }
}

# Template categories for filtering
TEMPLATE_CATEGORIES = [
    {"id": "all", "name": "All Templates"},
    {"id": "minimal", "name": "Minimal"},
    {"id": "gradient", "name": "Gradient"},
    {"id": "feature", "name": "Feature Focus"},
    {"id": "lifestyle", "name": "Lifestyle"},
    {"id": "dark", "name": "Dark Mode"},
]

def get_templates_by_category(category: str = "all"):
    """Get templates filtered by category"""
    if category == "all":
        return list(TEMPLATES.values())
    return [t for t in TEMPLATES.values() if t["category"] == category]
