@echo off
echo Cleaning up codebase...
echo.

REM Rename the working batch file
if exist "start-all-advanced.bat" (
    ren "start-all-advanced.bat" "start.bat"
    echo Renamed: start-all-advanced.bat -^> start.bat
)

REM Remove unwanted script files
if exist "start-all.bat" (
    del "start-all.bat"
    echo Deleted: start-all.bat
)

if exist "start-all.ps1" (
    del "start-all.ps1"
    echo Deleted: start-all.ps1
)

REM Remove redundant README files
if exist "backend\README.md" (
    del "backend\README.md"
    echo Deleted: backend\README.md
)

if exist "kelo_ui\README.md" (
    del "kelo_ui\README.md"
    echo Deleted: kelo_ui\README.md
)

REM Remove research paper prompt (optional - uncomment if you want to remove it)
if exist "RESEARCH_PAPER_PROMPT.md" (
    del "RESEARCH_PAPER_PROMPT.md"
    echo Deleted: RESEARCH_PAPER_PROMPT.md
)

echo.
echo Cleanup complete!
echo.
pause
