#!/bin/bash

# ========================================
# Technical Support RAG - Startup Script
# ========================================

echo "========================================"
echo "Technical Support RAG - Startup Script"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if all directories exist
if [ ! -d "kelo_ui" ]; then
    echo -e "${RED}ERROR: kelo_ui directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

if [ ! -d "backend" ]; then
    echo -e "${RED}ERROR: backend directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

if [ ! -d "pipeline" ]; then
    echo -e "${RED}ERROR: pipeline directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Start Frontend
echo -e "${BLUE}[1/3] Starting Frontend on port 7878...${NC}"
cd kelo_ui
if command -v bun &> /dev/null; then
    bun dev &
else
    npm run dev &
fi
FRONTEND_PID=$!
cd ..
sleep 2

# Start Backend
echo -e "${MAGENTA}[2/3] Starting Backend on port 5000...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 2

# Start Pipeline
echo -e "${GREEN}[3/3] Starting Pipeline on port 8000...${NC}"
cd pipeline
if [ -d "venv" ]; then
    source venv/bin/activate
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    PIPELINE_PID=$!
    deactivate
else
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    PIPELINE_PID=$!
fi
cd ..

echo ""
echo "========================================"
echo "All services started successfully!"
echo "========================================"
echo ""
echo "Service URLs:"
echo -e "  ${BLUE}Frontend:${NC}  http://localhost:7878"
echo -e "  ${MAGENTA}Backend:${NC}   http://localhost:5000"
echo -e "  ${GREEN}Pipeline:${NC}  http://localhost:8000"
echo ""
echo "API Documentation:"
echo -e "  ${GREEN}Pipeline:${NC}  http://localhost:8000/docs"
echo ""
echo "Process IDs:"
echo "  Frontend: $FRONTEND_PID"
echo "  Backend:  $BACKEND_PID"
echo "  Pipeline: $PIPELINE_PID"
echo ""
echo "To stop all services, run:"
echo "  kill $FRONTEND_PID $BACKEND_PID $PIPELINE_PID"
echo ""
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for any process to exit
wait

# Cleanup on exit
trap "kill $FRONTEND_PID $BACKEND_PID $PIPELINE_PID 2>/dev/null" EXIT
