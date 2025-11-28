#!/bin/bash

set -e

echo "🚀 Customer Portal MVP - Start Script"
echo "====================================="
echo ""

# Check if setup has been run
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependencies not installed. Please run setup.sh first:"
    echo "   bash setup.sh"
    exit 1
fi

# Check if ports are available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 5000 is already in use. Please stop the backend first."
    exit 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 is already in use. Please stop the frontend first."
    exit 1
fi

echo "✅ Ports 5000 and 3000 are available"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo "✅ Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo "✅ Frontend stopped"
    fi
    echo "👋 Services stopped. Goodbye!"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "🔧 Starting Backend..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: backend.log"
echo ""

echo "🔧 Starting Frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: frontend.log"
echo ""

echo "⏳ Waiting for services to start..."
sleep 5

# Check if services are running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for details."
    cleanup
fi

if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start. Check frontend.log for details."
    cleanup
fi

echo "======================================"
echo "🎉 Services Started Successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo ""
echo "🔑 Demo Login:"
echo "   Email: test@example.com"
echo "   Phone: 0123456789"
echo ""
echo "📊 Service Status:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo "======================================"

# Wait for services
wait