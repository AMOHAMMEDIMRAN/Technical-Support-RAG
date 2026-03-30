# 🧹 Cleanup Instructions

## Files to Delete

The following files are redundant, outdated, or were templates that should be removed:

### ❌ Duplicate/Old Startup Scripts

```
start-all.bat              # Old version (replaced by start.bat)
start-all-advanced.bat     # Renamed to start.bat
start-all.ps1             # PowerShell version (not needed)
```

### ❌ Generic Template READMEs

```
backend\README.md          # Generic bun template
kelo_ui\README.md          # Generic Vite template
```

### ❌ Optional Files (Delete if not needed)

```
RESEARCH_PAPER_PROMPT.md   # Only needed if generating research papers
cleanup.bat                # One-time cleanup script
CLEANUP_INSTRUCTIONS.md    # This file (after you've read it)
```

## How to Delete (Windows)

### Option 1: Manual Deletion

1. Navigate to `d:\Workspace\Technical-Support-RAG`
2. Delete the files listed above manually

### Option 2: Using Command Prompt

```cmd
cd d:\Workspace\Technical-Support-RAG

REM Delete old startup scripts
del start-all.bat
del start-all-advanced.bat
del start-all.ps1

REM Delete template READMEs
del backend\README.md
del kelo_ui\README.md

REM Delete optional files
del RESEARCH_PAPER_PROMPT.md
del cleanup.bat
del CLEANUP_INSTRUCTIONS.md
```

### Option 3: Run cleanup.bat

```cmd
cleanup.bat
```

Then delete `cleanup.bat` and this file afterward.

## ✅ Files to Keep

### Essential Files

```
✓ start.bat               # Main startup script (KEEP THIS!)
✓ README.md              # Main documentation
✓ DEV_SETUP.md           # Development guide
✓ package.json           # Root npm configuration
✓ .gitignore             # Git ignore rules
```

### Project Directories

```
✓ backend/               # Backend API service
✓ kelo_ui/               # Frontend UI service
✓ pipeline/              # RAG pipeline service
✓ firewall/              # Firewall configuration
```

## After Cleanup

Your clean directory structure will be:

```
Technical-Support-RAG/
├── .git/                 # Git repository
├── backend/              # Backend service
├── firewall/             # Firewall config
├── kelo_ui/              # Frontend service
├── pipeline/             # Pipeline service
├── .gitignore
├── DEV_SETUP.md
├── package.json
├── README.md
└── start.bat            # ⭐ Use this to start everything!
```

## Quick Reference

**To start all services:**

```cmd
start.bat
```

**Service URLs after starting:**

- Frontend: http://localhost:7878
- Backend: http://localhost:5000
- Pipeline: http://localhost:8000

---

**Note:** After cleanup, commit your changes to git:

```bash
git add .
git commit -m "Clean up redundant files and consolidate startup script"
git push
```
