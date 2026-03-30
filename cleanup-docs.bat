@echo off
echo ========================================
echo Cleaning Up Documentation Files
echo ========================================
echo.

REM Step 1: Delete old README and rename new one
echo [1/6] Updating README.md...
if exist "README.md" (
    del "README.md"
    echo   - Deleted old README.md
)
if exist "README_NEW.md" (
    ren "README_NEW.md" "README.md"
    echo   - Renamed README_NEW.md to README.md
)

REM Step 2: Delete old script files
echo.
echo [2/6] Removing old script files...
if exist "windows-setup.bat" (
    del "windows-setup.bat"
    echo   - Deleted windows-setup.bat
)
if exist "windows-start.bat" (
    del "windows-start.bat"
    echo   - Deleted windows-start.bat
)
if exist "linux-mac-setup.sh" (
    del "linux-mac-setup.sh"
    echo   - Deleted linux-mac-setup.sh
)
if exist "linux-mac-start.sh" (
    del "linux-mac-start.sh"
    echo   - Deleted linux-mac-start.sh
)

REM Step 3: Delete temporary/old files
echo.
echo [3/6] Removing temporary files...
if exist "cleanup.bat" (
    echo   - Keeping cleanup.bat for reference
)
if exist "start-all.bat" (
    del "start-all.bat"
    echo   - Deleted start-all.bat
)
if exist "start-all-advanced.bat" (
    del "start-all-advanced.bat"
    echo   - Deleted start-all-advanced.bat
)
if exist "start-all.ps1" (
    del "start-all.ps1"
    echo   - Deleted start-all.ps1
)

REM Step 4: Delete research paper file (optional)
echo.
echo [4/6] Checking for optional files...
if exist "RESEARCH_PAPER_PROMPT.md" (
    del "RESEARCH_PAPER_PROMPT.md"
    echo   - Deleted RESEARCH_PAPER_PROMPT.md
)

REM Step 5: Verify new documentation exists
echo.
echo [5/6] Verifying documentation files...
set MISSING=0
if not exist "README.md" (
    echo   ERROR: README.md not found!
    set MISSING=1
)
if not exist "QUICK_START.md" (
    echo   ERROR: QUICK_START.md not found!
    set MISSING=1
)
if not exist "DEV_SETUP.md" (
    echo   ERROR: DEV_SETUP.md not found!
    set MISSING=1
)
if not exist "FILE_STRUCTURE.md" (
    echo   ERROR: FILE_STRUCTURE.md not found!
    set MISSING=1
)
if not exist "DOCUMENTATION_INDEX.md" (
    echo   ERROR: DOCUMENTATION_INDEX.md not found!
    set MISSING=1
)
if not exist "SETUP_COMPLETE.md" (
    echo   ERROR: SETUP_COMPLETE.md not found!
    set MISSING=1
)

if %MISSING%==0 (
    echo   All documentation files present!
)

REM Step 6: Verify scripts exist
echo.
echo [6/6] Verifying setup/start scripts...
if not exist "setup.bat" (
    echo   WARNING: setup.bat not found!
)
if not exist "setup.sh" (
    echo   WARNING: setup.sh not found!
)
if not exist "start.bat" (
    echo   WARNING: start.bat not found!
)
if not exist "start.sh" (
    echo   WARNING: start.sh not found!
)

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo Current documentation files:
echo   - README.md (main documentation)
echo   - QUICK_START.md (quick start guide)
echo   - DEV_SETUP.md (development setup)
echo   - FILE_STRUCTURE.md (file reference)
echo   - DOCUMENTATION_INDEX.md (doc navigation)
echo   - SETUP_COMPLETE.md (post-setup guide)
echo   - CLEANUP_INSTRUCTIONS.md (cleanup guide)
echo.
echo Current script files:
echo   - setup.bat / setup.sh (install dependencies)
echo   - start.bat / start.sh (start all services)
echo.
echo ========================================
echo.
pause
