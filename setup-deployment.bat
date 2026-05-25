@echo off
REM 🚀 Deployment Setup Script for Windows
REM Yeh script setup ke liye required files banata aur check karta hai

echo.
echo 🔧 Pathariya Panchayat - Deployment Setup
echo ==========================================
echo.

REM Check if Node.js installed hai
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Install frontend dependencies
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already exist
)
echo.

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already exist
)
echo.

REM Check VAPID keys
echo 🔐 Checking VAPID keys...
if not exist "backend\vapid-keys.json" (
    echo Generating VAPID keys...
    cd backend
    node -e "const webpush = require('web-push'); const fs = require('fs'); const keys = webpush.generateVAPIDKeys(); fs.writeFileSync('vapid-keys.json', JSON.stringify(keys, null, 2)); console.log('✅ VAPID keys generated!'); console.log('📝 Public Key: ' + keys.publicKey); console.log('📝 Private Key: ' + keys.privateKey); console.log(''); console.log('⚠️  Please save these keys safely!');"
    cd ..
) else (
    echo ✅ VAPID keys already exist
)
echo.

REM Create .env files
echo ⚙️  Checking environment files...
if not exist ".env" (
    copy .env.example .env
    echo ✅ .env file created (frontend)
)

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✅ .env file created (backend)
)
echo.

REM Test build
echo 🏗️  Testing build...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend build successful
) else (
    echo ⚠️  Frontend build had issues - check output above
)
echo.

echo ✅ Setup complete!
echo.
echo 🚀 Next steps:
echo 1. Update .env files with your configuration
echo 2. Run 'npm run dev' to start locally
echo 3. Follow DEPLOYMENT_GUIDE.md for Railway ^& Vercel setup
echo.
pause
