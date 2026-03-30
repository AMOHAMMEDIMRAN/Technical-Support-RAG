# Technical Support RAG - Development Setup

This project runs three services:

- **Frontend** (kelo_ui): React + Vite
- **Backend**: Node.js + Express
- **Pipeline**: Python + FastAPI

## Quick Start

### Option 1: Using npm (Recommended)

1. Install dependencies:

```bash
npm install
```

2. Run all services:

```bash
npm run dev
```

This will start all three services concurrently with color-coded output.

### Option 2: Using Batch Script (Windows)

Double-click `start-all.bat` or run:

```cmd
start-all.bat
```

This opens each service in a separate terminal window.

### Option 3: Using PowerShell Script (Windows)

```powershell
.\start-all.ps1
```

This opens each service in a separate terminal window.

### Option 4: Manual Start

Start each service individually in separate terminals:

```bash
# Terminal 1 - Frontend
cd kelo_ui
bun dev

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Pipeline
cd pipeline
uvicorn main:app --reload
```

## Service URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Pipeline: http://localhost:8000

## Install All Dependencies

To install dependencies for all services:

```bash
npm run install:all
```

Or individually:

```bash
# Frontend
cd kelo_ui && bun install

# Backend
cd backend && npm install

# Pipeline
cd pipeline && pip install -r requirements.txt
```
