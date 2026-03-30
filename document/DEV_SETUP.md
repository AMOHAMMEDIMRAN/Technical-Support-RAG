# Technical Support RAG - Development Setup

This project runs three services:

- **Frontend** (kelo_ui): React + Vite on port **7878**
- **Backend**: Node.js + Express on port **5000**
- **Pipeline**: Python + FastAPI on port **8000**

## 🚀 Quick Start

### Easiest Way: Use the Startup Script

```cmd
start.bat
```

This will:
- Check if all directories exist
- Start all three services in separate windows
- Auto-detect and use Python virtual environment if available
- Display service URLs

### Alternative: Using npm

1. Install dependencies:
```bash
npm install
```

2. Run all services:
```bash
npm run dev
```

This runs all services concurrently with color-coded output in one terminal.

### Manual Start (For Debugging)

Start each service individually in separate terminals:

```bash
# Terminal 1 - Frontend
cd kelo_ui
bun dev

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Pipeline (with venv)
cd pipeline
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 Service URLs

- **Frontend:** http://localhost:7878
- **Backend:** http://localhost:5000  
- **Backend API Health:** http://localhost:5000/api/health
- **Pipeline:** http://localhost:8000
- **Pipeline API Docs:** http://localhost:8000/docs

## 📦 Install All Dependencies

To install dependencies for all services:

```bash
npm run install:all
```

Or individually:

```bash
# Frontend
cd kelo_ui
bun install

# Backend
cd backend
npm install

# Pipeline (recommended: use virtual environment)
cd pipeline
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

## 🗂️ Project Structure

```
Technical-Support-RAG/
├── backend/          # Node.js/Express API (port 5000)
│   ├── src/          # Source code
│   ├── .env          # Environment variables
│   └── package.json  # Dependencies
├── kelo_ui/          # React/Vite frontend (port 7878)
│   ├── src/          # Source code
│   ├── .env          # Environment variables
│   └── package.json  # Dependencies
├── pipeline/         # Python/FastAPI RAG engine (port 8000)
│   ├── main.py       # FastAPI application
│   ├── data/         # Data and ChromaDB storage
│   ├── requirements.txt
│   └── venv/         # Virtual environment (created by you)
├── firewall/         # Firewall configuration
│   └── config.json   # Firewall rules
├── start.bat         # 🔥 Main startup script
├── package.json      # Root npm scripts
├── README.md         # Main documentation
└── DEV_SETUP.md      # This file
```

## 🔧 Troubleshooting

### Pipeline Not Running

1. **Check if uvicorn is installed:**
```bash
cd pipeline
pip install uvicorn[standard]
```

2. **Check Python version:**
```bash
python --version  # Should be 3.10+
```

3. **Use virtual environment:**
```bash
cd pipeline
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. **Check if port 8000 is in use:**
```bash
netstat -ano | findstr :8000
```

### Backend Not Running

1. **Check Node.js:**
```bash
node --version  # Should be 18+
npm --version
```

2. **Install dependencies:**
```bash
cd backend
npm install
```

3. **Check MongoDB:**
Make sure MongoDB is running on `localhost:27017`

4. **Check .env file:**
Verify `backend/.env` exists and has correct values

### Frontend Not Running

1. **Check if Bun is installed:**
```bash
bun --version
```

2. **Install Bun (if needed):**
Windows: Download from https://bun.sh/
Linux/Mac:
```bash
curl -fsSL https://bun.sh/install | bash
```

3. **Use npm as alternative:**
```bash
cd kelo_ui
npm install
npm run dev
```

### Port Already in Use

If you get port conflict errors:

**Frontend:** Edit `kelo_ui/vite.config.ts` - change `port: 7878`

**Backend:** Edit `backend/.env` - change `PORT=5000`

**Pipeline:** Use different port:
```bash
uvicorn main:app --reload --port 8001
```

## 🔐 First Time Setup

### 1. Environment Files

Make sure you have `.env` files in both backend and kelo_ui:

```bash
# Backend
cd backend
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac

# Frontend
cd kelo_ui
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac
```

### 2. Start MongoDB

Make sure MongoDB is running before starting the backend:

```bash
mongod  # or start MongoDB service
```

### 3. Run Startup Script

```cmd
start.bat
```

### 4. Access the Application

Open your browser to http://localhost:7878

Default login:
- Email: `admin123@gmail.com`
- Password: `admin123`

(Change these after first login!)

## 📝 Development Tips

- Each service runs in its own window for easy monitoring
- Close individual service windows to stop them
- Check console output for errors
- Backend logs show API requests
- Pipeline logs show RAG queries and model loading
- Frontend has hot reload enabled

## 🧹 Cleanup

The following files should be deleted (they are redundant or no longer needed):
- ❌ `start-all.bat` (old version)
- ❌ `start-all-advanced.bat` (renamed to start.bat)
- ❌ `start-all.ps1` (PowerShell version)
- ❌ `backend\README.md` (generic bun template)
- ❌ `kelo_ui\README.md` (generic vite template)
- ❌ `RESEARCH_PAPER_PROMPT.md` (optional, for research purposes only)
- ❌ `cleanup.bat` (one-time use script)

Use `start.bat` as your main startup script going forward!

## 📚 Additional Resources

See the main [README.md](README.md) for:
- Complete architecture overview
- API documentation
- Deployment guides
- Production considerations
