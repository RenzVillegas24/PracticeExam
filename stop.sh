#!/bin/bash

echo "🛑 Customer Portal MVP - Stop Script"
echo "===================================="
echo ""

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        echo "🛑 Stopping $name on port $port (PID: $pid)"
        kill $pid 2>/dev/null || true
        sleep 2
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
            echo "⚠️  Force killing $name..."
            kill -9 $pid 2>/dev/null || true
        fi
        echo "✅ $name stopped"
    else
        echo "ℹ️  $name not running on port $port"
    fi
}

# Stop services
kill_port 3000 "Frontend"
kill_port 5000 "Backend"

# Clean up log files (optional)
if [ "$1" = "--clean" ]; then
    echo ""
    echo "🧹 Cleaning up log files..."
    rm -f backend.log frontend.log
    echo "✅ Log files cleaned"
fi

echo ""
echo "👋 All services stopped!"
echo ""
echo "💡 Tip: Use 'bash run.sh' to start services again"
echo "===================================="