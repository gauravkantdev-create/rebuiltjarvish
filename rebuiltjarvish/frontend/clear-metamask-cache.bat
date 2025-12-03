@echo off
echo 🧹 Clearing MetaMask and browser cache...

echo.
echo 📋 Instructions to manually clear browser data:
echo 1. Open Chrome/Edge Developer Tools (F12)
echo 2. Right-click the refresh button
echo 3. Select "Empty Cache and Hard Reload"
echo 4. Or go to Settings ^> Privacy ^> Clear browsing data
echo 5. Select "Cached images and files" and "Cookies and other site data"
echo.

echo 🔄 Clearing Node.js cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ Node cache cleared
) else (
    echo ℹ️ No Node cache found
)

if exist ".vite" (
    rmdir /s /q ".vite"
    echo ✅ Vite cache cleared
) else (
    echo ℹ️ No Vite cache found
)

echo.
echo 🚀 Starting development server with fresh cache...
npm run dev

pause