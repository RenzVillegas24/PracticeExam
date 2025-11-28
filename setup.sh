#!/bin/bash

set -e

echo "🚀 Customer Portal MVP - Setup Script"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ -f ".env" ]; then
    echo "ℹ️  .env already exists, skipping..."
else
    cp .env.example .env
    echo "📝 Created .env file (update with ServiceM8 credentials if needed)"
fi

echo "📥 Installing backend dependencies..."
npm install --quiet

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
cd ../frontend

if [ -f ".env.local" ]; then
    echo "ℹ️  .env.local already exists, skipping..."
else
    cp .env.example .env.local
    echo "📝 Created .env.local file"
fi

echo "📥 Installing frontend dependencies..."
npm install --quiet

echo "✅ Frontend setup complete!"
echo ""

# Print next steps
echo "======================================"
echo "✨ Setup Complete!"
echo ""
echo "📋 To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "🔑 Demo Credentials:"
echo "  Email: test@example.com"
echo "  Phone: 0123456789"
echo ""
echo "📚 For more information, see README.md"
echo "======================================"
