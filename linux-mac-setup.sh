#!/bin/bash

# ========================================
# Technical Support RAG - Setup Script
# Installs all dependencies for all services
# ========================================

echo "========================================"
echo "Technical Support RAG - Setup Script"
echo "========================================"
echo ""
echo "This script will install dependencies for:"
echo "  - Frontend (kelo_ui)"
echo "  - Backend (backend)"
echo "  - Pipeline (pipeline)"
echo ""
echo "Please wait, this may take a few minutes..."
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if directories exist
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

echo ""
echo "========================================"
echo "[1/3] Installing Frontend Dependencies"
echo "========================================"
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}WARNING: Bun is not installed!${NC}"
    echo ""
    echo "Please install Bun from https://bun.sh/"
    echo ""
    echo "Alternative: Using npm instead..."
    cd kelo_ui
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to install frontend dependencies!${NC}"
        exit 1
    fi
    cd ..
else
    cd kelo_ui
    bun install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to install frontend dependencies!${NC}"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}Frontend dependencies installed successfully!${NC}"
fi

echo ""
echo "========================================"
echo "[2/3] Installing Backend Dependencies"
echo "========================================"
echo ""

cd backend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install backend dependencies!${NC}"
    exit 1
fi

cd ..
echo -e "${GREEN}Backend dependencies installed successfully!${NC}"

echo ""
echo "========================================"
echo "[3/3] Installing Pipeline Dependencies"
echo "========================================"
echo ""

cd pipeline

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}ERROR: Python is not installed!${NC}"
    echo "Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

# Check Python version
python3 --version
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to create virtual environment!${NC}"
        exit 1
    fi
    echo -e "${GREEN}Virtual environment created successfully!${NC}"
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to activate virtual environment!${NC}"
    exit 1
fi

pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install pipeline dependencies!${NC}"
    deactivate
    exit 1
fi

deactivate
cd ..
echo -e "${GREEN}Pipeline dependencies installed successfully!${NC}"

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "All dependencies have been installed successfully!"
echo ""
echo "Environment setup:"
echo "  Frontend: bun/npm packages installed"
echo "  Backend:  npm packages installed"
echo "  Pipeline: Python venv created and packages installed"
echo ""
echo "Next steps:"
echo "  1. Configure environment variables:"
echo "     - Copy backend/.env.example to backend/.env"
echo "     - Copy kelo_ui/.env.example to kelo_ui/.env"
echo "  2. Make sure MongoDB is running"
echo "  3. Run: ./start.sh (Linux/Mac) or start.bat (Windows)"
echo ""
echo "========================================"
echo ""
