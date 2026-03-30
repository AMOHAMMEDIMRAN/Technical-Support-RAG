# 🎉 Setup Complete - Final Guide

## ✅ What We've Built

You now have a **production-ready development environment** with:

### 📦 **Single-Command Installation**

- `setup.bat` (Windows) or `setup.sh` (Linux/Mac)
- Automatically installs ALL dependencies for all three services
- Creates Python virtual environment
- Validates installations

### 🚀 **Single-Command Startup**

- `start.bat` (Windows) or `start.sh` (Linux/Mac)
- Starts frontend, backend, and pipeline simultaneously
- Auto-detects Python venv
- Shows clear status and URLs

### 📚 **Complete Documentation**

- `QUICK_START.md` - New user quick start guide
- `DEV_SETUP.md` - Detailed development setup
- `README.md` - Updated with quick start section
- `CLEANUP_INSTRUCTIONS.md` - File cleanup guide

---

## 🎯 For New Users (After Cloning Repo)

### Step 1: Clone Repository

```bash
git clone https://github.com/AMOHAMMEDIMRAN/Technical-Support-RAG.git
cd Technical-Support-RAG
```

### Step 2: Run Setup (Installs Everything)

**Windows:**

```cmd
setup.bat
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

This ONE command will:

- ✅ Install frontend dependencies (kelo_ui)
- ✅ Install backend dependencies (backend)
- ✅ Create Python virtual environment
- ✅ Install pipeline dependencies (pipeline)

**No need to go into each directory manually!**

### Step 3: Configure Environment

```cmd
# Backend
cd backend
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac

# Frontend
cd kelo_ui
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac
```

### Step 4: Start Everything

**Windows:**

```cmd
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

### Step 5: Access Application

Open browser to: **http://localhost:7878**

Login with:

- Email: `admin123@gmail.com`
- Password: `admin123`

---

## 📁 Final File Structure

```
Technical-Support-RAG/
├── backend/              # Backend service
├── firewall/             # Firewall config
├── kelo_ui/              # Frontend service
├── pipeline/             # Pipeline service
│   └── venv/             # Created by setup.bat
├── setup.bat             # 🔥 ONE-COMMAND INSTALL (Windows)
├── setup.sh              # 🔥 ONE-COMMAND INSTALL (Linux/Mac)
├── start.bat             # 🚀 ONE-COMMAND START (Windows)
├── start.sh              # 🚀 ONE-COMMAND START (Linux/Mac)
├── package.json          # NPM scripts (alternative method)
├── README.md             # Main documentation
├── QUICK_START.md        # Quick start guide
├── DEV_SETUP.md          # Detailed dev guide
└── CLEANUP_INSTRUCTIONS.md  # Cleanup guide
```

---

## 💡 Three Ways to Install Dependencies

### Method 1: Using Setup Script (RECOMMENDED ⭐)

```cmd
setup.bat  # Windows
./setup.sh # Linux/Mac
```

**Advantage:** Single command, checks prerequisites, creates venv automatically

### Method 2: Using NPM

```bash
npm run setup
# or: npm run install:all
```

**Advantage:** Works if you have npm installed

### Method 3: Manual (Step by Step)

```bash
# Frontend
cd kelo_ui && bun install && cd ..

# Backend
cd backend && npm install && cd ..

# Pipeline
cd pipeline
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
deactivate
cd ..
```

**Advantage:** Full control, good for debugging

---

## 🎯 Quick Commands Reference

| Task                | Windows         | Linux/Mac       |
| ------------------- | --------------- | --------------- |
| **Install All**     | `setup.bat`     | `./setup.sh`    |
| **Start All**       | `start.bat`     | `./start.sh`    |
| **Install via NPM** | `npm run setup` | `npm run setup` |
| **Run via NPM**     | `npm run dev`   | `npm run dev`   |

---

## 🔍 Service URLs

| Service            | URL                              | Description       |
| ------------------ | -------------------------------- | ----------------- |
| **Frontend**       | http://localhost:7878            | Main application  |
| **Backend**        | http://localhost:5000            | API server        |
| **Backend Health** | http://localhost:5000/api/health | Health check      |
| **Pipeline**       | http://localhost:8000            | RAG service       |
| **Pipeline Docs**  | http://localhost:8000/docs       | API documentation |

---

## 🧪 Verify Installation

After running `setup.bat` or `setup.sh`, verify:

```bash
# Check frontend
cd kelo_ui
bun --version  # or: npm --version

# Check backend
cd backend
node --version

# Check pipeline
cd pipeline
venv\Scripts\python --version  # Windows
# source venv/bin/activate && python --version  # Linux/Mac
```

All should show version numbers without errors.

---

## 🆘 Common Issues

### Setup Script Doesn't Run

**Windows:**

```cmd
# Make sure you're in the project root
cd d:\Workspace\Technical-Support-RAG
setup.bat
```

**Linux/Mac:**

```bash
# Make sure script is executable
chmod +x setup.sh
./setup.sh
```

### MongoDB Not Running

```bash
# Start MongoDB
mongod

# Or check if it's a service
net start MongoDB  # Windows
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # Mac
```

### Port Already in Use

Check and kill processes:

```bash
# Windows
netstat -ano | findstr :7878
netstat -ano | findstr :5000
netstat -ano | findstr :8000

# Linux/Mac
lsof -ti:7878 | xargs kill
lsof -ti:5000 | xargs kill
lsof -ti:8000 | xargs kill
```

---

## 🎉 Success Indicators

You know setup is successful when:

1. ✅ `setup.bat` completes without errors
2. ✅ `start.bat` opens 3 windows (Frontend, Backend, Pipeline)
3. ✅ You can access http://localhost:7878
4. ✅ Login works with default credentials
5. ✅ You can send messages in the chat

---

## 📚 Next Steps

Now that everything is set up:

1. 📖 Read [QUICK_START.md](QUICK_START.md) for detailed usage
2. 🔧 Read [DEV_SETUP.md](DEV_SETUP.md) for development tips
3. 📘 Read [README.md](README.md) for architecture details
4. 🧹 Run cleanup.bat to remove old files (optional)
5. 🚀 Start building!

---

## 🎊 You're All Set!

Your development environment is ready. Just run:

```cmd
start.bat  # Windows
./start.sh # Linux/Mac
```

And start coding! 🚀

---

**Questions?** Check the troubleshooting sections in [QUICK_START.md](QUICK_START.md) and [DEV_SETUP.md](DEV_SETUP.md)
