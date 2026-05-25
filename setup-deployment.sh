#!/bin/bash

# 🚀 Deployment Setup Script
# Yeh script setup ke liye required files banata aur check karta hai

echo "🔧 Pathariya Panchayat - Deployment Setup"
echo "=========================================="

# Check if Node.js installed hai
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first!"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
fi

if [ ! -d "backend/node_modules" ]; then
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
fi

# Generate VAPID keys if not exists
echo ""
echo "🔐 Checking VAPID keys..."

if [ ! -f "backend/vapid-keys.json" ]; then
    echo "Generating VAPID keys..."
    cd backend
    node -e "
    const webpush = require('web-push');
    const fs = require('fs');
    const keys = webpush.generateVAPIDKeys();
    fs.writeFileSync('vapid-keys.json', JSON.stringify(keys, null, 2));
    console.log('✅ VAPID keys generated!');
    console.log('📝 Public Key: ' + keys.publicKey);
    console.log('📝 Private Key: ' + keys.privateKey);
    console.log('');
    console.log('⚠️  Please save these keys in a safe place for production!');
    "
    cd ..
else
    echo "✅ VAPID keys already exist"
fi

# Create .env files if don't exist
echo ""
echo "⚙️  Checking environment files..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ .env file created (frontend)"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ .env file created (backend)"
fi

# Check build
echo ""
echo "🏗️  Testing build..."

if npm run build 2>/dev/null; then
    echo "✅ Frontend build successful"
else
    echo "⚠️  Frontend build had issues - check output above"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Run 'npm run dev' to start locally"
echo "3. Follow DEPLOYMENT_GUIDE.md for Railway & Vercel setup"
echo ""
