@echo off
echo Fixing Vite Development Server...
echo.

echo Step 1: Clearing cache...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul

echo Step 2: Installing dependencies...
npm install

echo Step 3: Starting dev server...
npm run dev

pause