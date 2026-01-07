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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
                "font_size": 120,
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
    },

    # ============ MESH GRADIENT TEMPLATES ============
    "mesh-aurora": {
        "id": "mesh-aurora",
        "name": "Aurora Mesh",
        "category": "mesh",
        "description": "Beautiful aurora-like mesh gradient",
        "preview_url": "/templates/mesh-aurora.png",
        "config": {
            "background": {
                "type": "mesh",
                "color_points": [
                    {"color": "#00D9FF", "x": 0.1, "y": 0.2, "radius": 0.7},
                    {"color": "#00FF94", "x": 0.9, "y": 0.3, "radius": 0.6},
                    {"color": "#7B61FF", "x": 0.3, "y": 0.8, "radius": 0.7},
                    {"color": "#FF61DC", "x": 0.8, "y": 0.9, "radius": 0.5}
                ]
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "mesh-sunset-glow": {
        "id": "mesh-sunset-glow",
        "name": "Sunset Glow",
        "category": "mesh",
        "description": "Warm sunset mesh gradient",
        "preview_url": "/templates/mesh-sunset-glow.png",
        "config": {
            "background": {
                "type": "mesh",
                "color_points": [
                    {"color": "#FF6B35", "x": 0.2, "y": 0.1, "radius": 0.8},
                    {"color": "#FF3864", "x": 0.8, "y": 0.3, "radius": 0.6},
                    {"color": "#FFD166", "x": 0.1, "y": 0.7, "radius": 0.7},
                    {"color": "#9B5DE5", "x": 0.9, "y": 0.9, "radius": 0.6}
                ]
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "mesh-ocean-depth": {
        "id": "mesh-ocean-depth",
        "name": "Ocean Depth",
        "category": "mesh",
        "description": "Deep ocean mesh gradient",
        "preview_url": "/templates/mesh-ocean-depth.png",
        "config": {
            "background": {
                "type": "mesh",
                "color_points": [
                    {"color": "#0077B6", "x": 0.2, "y": 0.2, "radius": 0.7},
                    {"color": "#00B4D8", "x": 0.8, "y": 0.4, "radius": 0.6},
                    {"color": "#023E8A", "x": 0.5, "y": 0.8, "radius": 0.8},
                    {"color": "#48CAE4", "x": 0.9, "y": 0.1, "radius": 0.5}
                ]
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "mesh-candy": {
        "id": "mesh-candy",
        "name": "Cotton Candy",
        "category": "mesh",
        "description": "Soft pastel mesh gradient",
        "preview_url": "/templates/mesh-candy.png",
        "config": {
            "background": {
                "type": "mesh",
                "color_points": [
                    {"color": "#FFB5E8", "x": 0.1, "y": 0.3, "radius": 0.7},
                    {"color": "#B5DEFF", "x": 0.9, "y": 0.2, "radius": 0.6},
                    {"color": "#DCD3FF", "x": 0.3, "y": 0.9, "radius": 0.7},
                    {"color": "#AFF8DB", "x": 0.8, "y": 0.7, "radius": 0.5}
                ]
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#1A1A1A",
                "alignment": "center"
            }
        }
    },
    "mesh-cosmic": {
        "id": "mesh-cosmic",
        "name": "Cosmic Dream",
        "category": "mesh",
        "description": "Deep space mesh gradient",
        "preview_url": "/templates/mesh-cosmic.png",
        "config": {
            "background": {
                "type": "mesh",
                "color_points": [
                    {"color": "#2D00F7", "x": 0.2, "y": 0.1, "radius": 0.8},
                    {"color": "#6A00F4", "x": 0.8, "y": 0.3, "radius": 0.6},
                    {"color": "#8900F2", "x": 0.1, "y": 0.7, "radius": 0.7},
                    {"color": "#BC00DD", "x": 0.9, "y": 0.9, "radius": 0.6},
                    {"color": "#0A0A0F", "x": 0.5, "y": 0.5, "radius": 0.4}
                ],
                "noise": {"enabled": True, "intensity": 0.02, "monochrome": True}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ GLASSMORPHISM TEMPLATES ============
    "glass-purple-haze": {
        "id": "glass-purple-haze",
        "name": "Purple Haze Glass",
        "category": "glass",
        "description": "Glassmorphism with purple tones",
        "preview_url": "/templates/glass-purple-haze.png",
        "config": {
            "background": {
                "type": "glassmorphism",
                "base_gradient": {
                    "type": "linear",
                    "angle": 135,
                    "stops": [
                        {"color": "#667EEA", "position": 0},
                        {"color": "#764BA2", "position": 1}
                    ]
                },
                "blobs": [
                    {"color": "#FF6B6B80", "x": 0.2, "y": 0.3, "size": 0.4},
                    {"color": "#4ECDC480", "x": 0.8, "y": 0.7, "size": 0.35},
                    {"color": "#FFE66D80", "x": 0.5, "y": 0.9, "size": 0.3}
                ],
                "blob_blur": 120
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "glass-ocean-breeze": {
        "id": "glass-ocean-breeze",
        "name": "Ocean Breeze Glass",
        "category": "glass",
        "description": "Cool blue glassmorphism",
        "preview_url": "/templates/glass-ocean-breeze.png",
        "config": {
            "background": {
                "type": "glassmorphism",
                "base_gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#1CB5E0", "position": 0},
                        {"color": "#000851", "position": 1}
                    ]
                },
                "blobs": [
                    {"color": "#00FFF080", "x": 0.15, "y": 0.2, "size": 0.35},
                    {"color": "#00BFFF80", "x": 0.85, "y": 0.4, "size": 0.4},
                    {"color": "#7B68EE80", "x": 0.3, "y": 0.85, "size": 0.3}
                ],
                "blob_blur": 150
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "glass-sunset-dream": {
        "id": "glass-sunset-dream",
        "name": "Sunset Dream Glass",
        "category": "glass",
        "description": "Warm sunset glassmorphism",
        "preview_url": "/templates/glass-sunset-dream.png",
        "config": {
            "background": {
                "type": "glassmorphism",
                "base_gradient": {
                    "type": "linear",
                    "angle": 160,
                    "stops": [
                        {"color": "#FF512F", "position": 0},
                        {"color": "#DD2476", "position": 1}
                    ]
                },
                "blobs": [
                    {"color": "#FFD70080", "x": 0.2, "y": 0.15, "size": 0.4},
                    {"color": "#FF69B480", "x": 0.75, "y": 0.5, "size": 0.35},
                    {"color": "#FFA50080", "x": 0.4, "y": 0.8, "size": 0.3}
                ],
                "blob_blur": 130
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "glass-emerald": {
        "id": "glass-emerald",
        "name": "Emerald Glass",
        "category": "glass",
        "description": "Fresh green glassmorphism",
        "preview_url": "/templates/glass-emerald.png",
        "config": {
            "background": {
                "type": "glassmorphism",
                "base_gradient": {
                    "type": "linear",
                    "angle": 135,
                    "stops": [
                        {"color": "#134E5E", "position": 0},
                        {"color": "#71B280", "position": 1}
                    ]
                },
                "blobs": [
                    {"color": "#00FF8880", "x": 0.1, "y": 0.25, "size": 0.35},
                    {"color": "#20E3B280", "x": 0.9, "y": 0.3, "size": 0.4},
                    {"color": "#98FB9880", "x": 0.5, "y": 0.85, "size": 0.3}
                ],
                "blob_blur": 140
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ ABSTRACT BLOB TEMPLATES ============
    "blobs-neon-night": {
        "id": "blobs-neon-night",
        "name": "Neon Night",
        "category": "blobs",
        "description": "Dark background with neon blobs",
        "preview_url": "/templates/blobs-neon-night.png",
        "config": {
            "background": {
                "type": "blobs",
                "base_color": "#0D0D1A",
                "blobs": [
                    {"color": "#FF006680", "x": 0.15, "y": 0.2, "size": 0.4},
                    {"color": "#00F5FF80", "x": 0.85, "y": 0.35, "size": 0.35},
                    {"color": "#ADFF2F80", "x": 0.25, "y": 0.8, "size": 0.3},
                    {"color": "#FF149380", "x": 0.75, "y": 0.9, "size": 0.25}
                ],
                "blur": 180
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "blobs-pastel-dream": {
        "id": "blobs-pastel-dream",
        "name": "Pastel Dream",
        "category": "blobs",
        "description": "Soft pastel colored blobs",
        "preview_url": "/templates/blobs-pastel-dream.png",
        "config": {
            "background": {
                "type": "blobs",
                "base_color": "#FFF5F5",
                "blobs": [
                    {"color": "#FFB3BA90", "x": 0.2, "y": 0.15, "size": 0.45},
                    {"color": "#BAFFC990", "x": 0.8, "y": 0.25, "size": 0.4},
                    {"color": "#BAE1FF90", "x": 0.15, "y": 0.75, "size": 0.35},
                    {"color": "#FFFFBA90", "x": 0.85, "y": 0.85, "size": 0.3}
                ],
                "blur": 200
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#1A1A1A",
                "alignment": "center"
            }
        }
    },
    "blobs-cyber-punk": {
        "id": "blobs-cyber-punk",
        "name": "Cyber Punk",
        "category": "blobs",
        "description": "Cyberpunk style blobs",
        "preview_url": "/templates/blobs-cyber-punk.png",
        "config": {
            "background": {
                "type": "blobs",
                "base_color": "#0F0F23",
                "blobs": [
                    {"color": "#F706CF90", "x": 0.1, "y": 0.3, "size": 0.5},
                    {"color": "#00FFFF90", "x": 0.9, "y": 0.2, "size": 0.4},
                    {"color": "#FDFF0090", "x": 0.5, "y": 0.85, "size": 0.35}
                ],
                "blur": 160,
                "noise": {"enabled": True, "intensity": 0.03, "monochrome": True}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ MULTI-COLOR GRADIENT TEMPLATES ============
    "gradient-rainbow": {
        "id": "gradient-rainbow",
        "name": "Rainbow Flow",
        "category": "gradient",
        "description": "Smooth rainbow gradient",
        "preview_url": "/templates/gradient-rainbow.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 135,
                    "stops": [
                        {"color": "#FF0080", "position": 0},
                        {"color": "#FF8C00", "position": 0.25},
                        {"color": "#40E0D0", "position": 0.5},
                        {"color": "#8A2BE2", "position": 0.75},
                        {"color": "#FF0080", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-aurora-borealis": {
        "id": "gradient-aurora-borealis",
        "name": "Aurora Borealis",
        "category": "gradient",
        "description": "Northern lights gradient",
        "preview_url": "/templates/gradient-aurora-borealis.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#0B0B2B", "position": 0},
                        {"color": "#1E3A5F", "position": 0.3},
                        {"color": "#20B2AA", "position": 0.5},
                        {"color": "#98FB98", "position": 0.7},
                        {"color": "#0B0B2B", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "gradient-fire": {
        "id": "gradient-fire",
        "name": "Fire Gradient",
        "category": "gradient",
        "description": "Blazing fire gradient",
        "preview_url": "/templates/gradient-fire.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#1A0000", "position": 0},
                        {"color": "#8B0000", "position": 0.3},
                        {"color": "#FF4500", "position": 0.6},
                        {"color": "#FFD700", "position": 0.85},
                        {"color": "#FFFFE0", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ RADIAL GRADIENT TEMPLATES ============
    "radial-spotlight": {
        "id": "radial-spotlight",
        "name": "Spotlight",
        "category": "gradient",
        "description": "Dramatic spotlight radial gradient",
        "preview_url": "/templates/radial-spotlight.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "radial",
                    "center_x": 0.5,
                    "center_y": 0.3,
                    "stops": [
                        {"color": "#FFFFFF", "position": 0},
                        {"color": "#667EEA", "position": 0.4},
                        {"color": "#1A1A2E", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "radial-sunset-horizon": {
        "id": "radial-sunset-horizon",
        "name": "Sunset Horizon",
        "category": "gradient",
        "description": "Sun setting on horizon",
        "preview_url": "/templates/radial-sunset-horizon.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "radial",
                    "center_x": 0.5,
                    "center_y": 0.8,
                    "stops": [
                        {"color": "#FFD700", "position": 0},
                        {"color": "#FF6347", "position": 0.3},
                        {"color": "#8B008B", "position": 0.6},
                        {"color": "#191970", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ CONIC GRADIENT TEMPLATES ============
    "conic-color-wheel": {
        "id": "conic-color-wheel",
        "name": "Color Wheel",
        "category": "gradient",
        "description": "Rainbow color wheel gradient",
        "preview_url": "/templates/conic-color-wheel.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "conic",
                    "center_x": 0.5,
                    "center_y": 0.5,
                    "start_angle": 0,
                    "stops": [
                        {"color": "#FF0000", "position": 0},
                        {"color": "#FF8000", "position": 0.17},
                        {"color": "#FFFF00", "position": 0.33},
                        {"color": "#00FF00", "position": 0.5},
                        {"color": "#0080FF", "position": 0.67},
                        {"color": "#8000FF", "position": 0.83},
                        {"color": "#FF0000", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },

    # ============ NOISE/GRAIN TEXTURE TEMPLATES ============
    "grainy-dark": {
        "id": "grainy-dark",
        "name": "Grainy Dark",
        "category": "texture",
        "description": "Dark background with film grain",
        "preview_url": "/templates/grainy-dark.png",
        "config": {
            "background": {
                "type": "solid",
                "color": "#1A1A1A",
                "noise": {"enabled": True, "intensity": 0.08, "monochrome": True}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "grainy-gradient": {
        "id": "grainy-gradient",
        "name": "Grainy Gradient",
        "category": "texture",
        "description": "Gradient with subtle grain texture",
        "preview_url": "/templates/grainy-gradient.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 135,
                    "stops": [
                        {"color": "#667EEA", "position": 0},
                        {"color": "#764BA2", "position": 1}
                    ]
                },
                "noise": {"enabled": True, "intensity": 0.04, "monochrome": True}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "grainy-warm": {
        "id": "grainy-warm",
        "name": "Warm Film",
        "category": "texture",
        "description": "Warm tones with film grain",
        "preview_url": "/templates/grainy-warm.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#FFF1E6", "position": 0},
                        {"color": "#FFD4B8", "position": 1}
                    ]
                },
                "noise": {"enabled": True, "intensity": 0.05, "monochrome": False}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#1A1A1A",
                "alignment": "center"
            }
        }
    },

    # ============ DARK/COSMIC TEMPLATES ============
    "cosmic-night": {
        "id": "cosmic-night",
        "name": "Cosmic Night",
        "category": "dark",
        "description": "Deep space dark gradient",
        "preview_url": "/templates/cosmic-night.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "radial",
                    "center_x": 0.5,
                    "center_y": 0.5,
                    "stops": [
                        {"color": "#1A1A2E", "position": 0},
                        {"color": "#16213E", "position": 0.5},
                        {"color": "#0F0F1A", "position": 1}
                    ]
                },
                "noise": {"enabled": True, "intensity": 0.02, "monochrome": True}
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "midnight-purple": {
        "id": "midnight-purple",
        "name": "Midnight Purple",
        "category": "dark",
        "description": "Deep purple night gradient",
        "preview_url": "/templates/midnight-purple.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 160,
                    "stops": [
                        {"color": "#0D0221", "position": 0},
                        {"color": "#240046", "position": 0.5},
                        {"color": "#3C096C", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
                "alignment": "center"
            }
        }
    },
    "dark-teal": {
        "id": "dark-teal",
        "name": "Dark Teal",
        "category": "dark",
        "description": "Moody teal gradient",
        "preview_url": "/templates/dark-teal.png",
        "config": {
            "background": {
                "type": "gradient",
                "gradient": {
                    "type": "linear",
                    "angle": 180,
                    "stops": [
                        {"color": "#0D1117", "position": 0},
                        {"color": "#0D2137", "position": 0.5},
                        {"color": "#1A4D5C", "position": 1}
                    ]
                }
            },
            "text_position": "top",
            "device_layout": "center",
            "default_text_style": {
                "font_family": "SF Pro Display",
                "font_size": 120,
                "font_weight": 700,
                "color": "#FFFFFF",
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
    {"id": "mesh", "name": "Mesh Gradient"},
    {"id": "glass", "name": "Glassmorphism"},
    {"id": "blobs", "name": "Abstract Blobs"},
    {"id": "texture", "name": "Textured"},
    {"id": "feature", "name": "Feature Focus"},
    {"id": "lifestyle", "name": "Lifestyle"},
    {"id": "dark", "name": "Dark Mode"},
]

def get_templates_by_category(category: str = "all"):
    """Get templates filtered by category"""
    if category == "all":
        return list(TEMPLATES.values())
    return [t for t in TEMPLATES.values() if t["category"] == category]
