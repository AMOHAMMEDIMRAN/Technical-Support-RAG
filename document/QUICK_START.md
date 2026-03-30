# 🚀 Quick Start Guide

Welcome to Technical Support RAG! This guide will get you up and running in minutes.

## Prerequisites

Before you begin, make sure you have these installed:

- ✅ **Node.js** 18+ ([Download](https://nodejs.org/))
- ✅ **Python** 3.10+ ([Download](https://www.python.org/))
- ✅ **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Bun** (Optional but recommended) ([Install](https://bun.sh/))

## 🎯 One-Command Setup

### Windows

```cmd
git clone https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG.git
cd Technical-Support-RAG
setup.bat
```

### Linux/Mac

```bash
git clone https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG.git
cd Technical-Support-RAG
chmod +x setup.sh
./setup.sh
```

That's it! The setup script will:

- ✅ Install all frontend dependencies (kelo_ui)
- ✅ Install all backend dependencies (backend)
- ✅ Create Python virtual environment
- ✅ Install all pipeline dependencies (pipeline)

## ⚙️ Configure Environment

After setup completes, configure your environment:

### 1. Backend Configuration

```cmd
cd backend
copy .env.example .env    # Windows
# or: cp .env.example .env  # Linux/Mac
```

Edit `backend/.env` and update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tech-support-assistant
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123
AI_ENGINE_URL=http://localhost:8000
```

### 2. Frontend Configuration

```cmd
cd kelo_ui
copy .env.example .env    # Windows
# or: cp .env.example .env  # Linux/Mac
```

Edit `kelo_ui/.env` and verify:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAG_API_BASE_URL=http://127.0.0.1:8000
```

## 🚀 Start All Services

### Windows

```cmd
start.bat
```

### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

This will start all three services:

- 🔵 **Frontend:** http://localhost:7878
- 🟣 **Backend:** http://localhost:5000
- 🟢 **Pipeline:** http://localhost:8000

## 🎉 Access the Application

1. Open your browser to: **http://localhost:7878**
2. Login with default credentials:
   - **Email:** `admin123@gmail.com`
   - **Password:** `admin123`
3. **Important:** Change these credentials after first login!

## 📝 Alternative: Step-by-Step Setup

If you prefer manual installation:

### Step 1: Clone Repository

```bash
git clone https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG.git
cd Technical-Support-RAG
```

### Step 2: Install Frontend Dependencies

```bash
cd kelo_ui
bun install  # or: npm install
cd ..
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Install Pipeline Dependencies

```bash
cd pipeline
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac
pip install --upgrade pip
pip install -r requirements.txt
deactivate
cd ..
```

### Step 5: Configure Environment

Follow the [Configure Environment](#️-configure-environment) section above.

### Step 6: Start Services

Run `start.bat` (Windows) or `./start.sh` (Linux/Mac)

## 🛠️ Using NPM Scripts

You can also use npm scripts from the root directory:

```bash
# Install all dependencies
npm run setup

# Or install individually
npm run install:frontend
npm run install:backend
npm run install:pipeline

# Run all services (requires concurrently)
npm install  # Install concurrently first
npm run dev
```

## 🔍 Verify Installation

After setup, verify everything is working:

### Check Frontend

```bash
cd kelo_ui
bun --version  # or: npm --version
```

### Check Backend

```bash
cd backend
node --version
npm --version
```

### Check Pipeline

```bash
cd pipeline
python --version
venv\Scripts\python -m pip list  # Should show installed packages
```

## 🆘 Troubleshooting

### Setup Script Fails

**Issue:** Script stops with errors

**Solution:**

1. Check if all prerequisites are installed
2. Run installations manually (see Step-by-Step Setup)
3. Check console output for specific error messages

### MongoDB Connection Error

**Issue:** Backend can't connect to MongoDB

**Solution:**

1. Make sure MongoDB is running:
   ```bash
   mongod  # Start MongoDB
   ```
2. Check if MongoDB is on port 27017
3. Verify `MONGODB_URI` in `backend/.env`

### Python Virtual Environment Issues

**Issue:** Can't create or activate venv

**Solution:**

```bash
# Windows
python -m pip install --upgrade pip
python -m venv venv --clear

# Linux/Mac
python3 -m pip install --upgrade pip
python3 -m venv venv --clear
```

### Port Already in Use

**Issue:** Port 5000, 7878, or 8000 is occupied

**Solution:**

1. Find and stop the process using the port
2. Or change the port in configuration files

### Bun Not Found

**Issue:** `bun` command not recognized

**Solution:**

1. Install Bun from https://bun.sh/
2. Or use npm instead:
   ```bash
   cd kelo_ui
   npm install
   npm run dev
   ```

## 📚 Next Steps

Now that your environment is set up:

1. 📖 Read the [Main README](README.md) for architecture overview
2. 🔧 Check [DEV_SETUP.md](DEV_SETUP.md) for detailed development guide
3. 🧪 Explore the API at http://localhost:8000/docs
4. 💬 Start chatting at http://localhost:7878

## 🎯 Quick Reference

| Command                  | Description                        |
| ------------------------ | ---------------------------------- |
| `setup.bat` / `setup.sh` | Install all dependencies           |
| `start.bat` / `start.sh` | Start all services                 |
| `npm run setup`          | Install via npm                    |
| `npm run dev`            | Run all services with concurrently |

---

**Need Help?** Check the [Troubleshooting Guide](DEV_SETUP.md#troubleshooting) in DEV_SETUP.md
