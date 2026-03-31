@echo off
echo ========================================
echo Technical Support RAG - Paper Generator
echo ========================================
echo.
echo This will generate a 12-15 page journal paper
echo with colored diagrams in DOCX format.
echo.
echo Installing dependencies and generating paper...
echo ========================================
echo.

cd /d "%~dp0"

REM Try to use the pipeline venv first
if exist "pipeline\venv\Scripts\python.exe" (
    echo Using pipeline virtual environment...
    call pipeline\venv\Scripts\python.exe generate_paper.py
) else (
    echo Using system Python...
    python generate_paper.py
)

echo.
echo ========================================
echo.
if exist "Technical_Support_RAG_Paper.docx" (
    echo SUCCESS! Paper generated successfully.
    echo.
    echo Opening the paper...
    start "" "Technical_Support_RAG_Paper.docx"
) else (
    echo ERROR: Paper generation failed.
    echo Please check the error messages above.
)
echo.
pause
