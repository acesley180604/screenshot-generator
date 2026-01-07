# Apple App Store Screenshot Generator

A full-stack web application for creating professional App Store screenshots with customizable templates, device frames, localization support, and automatic resizing for all required Apple device sizes.

## Features

- **Template System**: Pre-built templates (minimal, gradient, feature-focused, lifestyle)
- **Device Frames**: iPhone, iPad, Apple Watch, Apple TV, Mac, Vision Pro frames
- **Multiple Styles**: Realistic, clay, flat, or no-frame options
- **Localization**: Support for 30+ languages with RTL support
- **Batch Export**: Generate all required sizes automatically
- **Text Customization**: Headlines, subtitles with full styling options

## App Store Screenshot Sizes

| Device | Display Size | Resolution |
|--------|-------------|------------|
| iPhone (Required) | 6.9" | 1320x2868 |
| iPhone | 6.5" | 1284x2778 |
| iPhone | 6.1" | 1179x2556 |
| iPad (Required) | 13" | 2064x2752 |
| iPad | 12.9" | 2048x2732 |

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components

### Backend
- **Python FastAPI** - High-performance API
- **Pillow** - Image processing
- **Pydantic** - Data validation

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/screenshot-generator.git
cd screenshot-generator
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
screenshot-generator/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Base UI components
│   │   │   └── editor/      # Editor components
│   │   ├── lib/             # Utilities and store
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routers/         # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Pydantic models
│   │   └── data/            # Static data (templates, devices)
│   └── requirements.txt
└── docs/
    └── PRD.md               # Product Requirements Document
```

## API Endpoints

- `GET /api/templates` - List all templates
- `GET /api/devices` - List device specifications
- `GET /api/locales` - List supported locales
- `POST /api/upload` - Upload screenshot images
- `POST /api/generate/preview` - Generate preview image
- `POST /api/generate/export` - Start export job
- `GET /api/generate/download/{id}` - Download exported ZIP

## License

MIT
