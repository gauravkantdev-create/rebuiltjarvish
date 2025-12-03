@echo off
echo Starting Fresh Vite Server...
echo.

echo Clearing cache...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul

echo Starting server on port 5173...
npx vite --port 5173 --host localhost --force

pause