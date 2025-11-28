#!/usr/bin/env bash

set -euo pipefail

echo "Starting services..."

if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "Dependencies not installed. Run: bash setup.sh"
    exit 1
fi

for port in 5000 3000; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo "Port $port is already in use. Stop the service using it and retry."
        exit 1
    fi
done

cleanup() {
    echo "Stopping services..."
    [ -n "${BACKEND_PID-}" ] && kill ${BACKEND_PID} 2>/dev/null || true
    [ -n "${FRONTEND_PID-}" ] && kill ${FRONTEND_PID} 2>/dev/null || true
}
trap cleanup SIGINT SIGTERM EXIT

cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 2

if ! kill -0 ${BACKEND_PID} 2>/dev/null; then
    echo "Backend failed to start. See backend.log"
    exit 1
fi

if ! kill -0 ${FRONTEND_PID} 2>/dev/null; then
    echo "Frontend failed to start. See frontend.log"
    exit 1
fi

echo "Frontend: http://localhost:3000 (PID: ${FRONTEND_PID})"
echo "Backend:  http://localhost:5000 (PID: ${BACKEND_PID})"
echo "Press Ctrl+C to stop"

wait