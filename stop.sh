#!/usr/bin/env bash

set -euo pipefail
echo "Stopping services..."

pkill_on_port() {
    port=$1
    if pids=$(lsof -Pi :${port} -sTCP:LISTEN -t 2>/dev/null); then
        echo "Killing processes on port ${port}: ${pids}"
        kill ${pids} 2>/dev/null || true
        sleep 1
        # Force kill if still running
        if lsof -Pi :${port} -sTCP:LISTEN -t >/dev/null; then
            kill -9 ${pids} 2>/dev/null || true
        fi
    else
        echo "No process on port ${port}"
    fi
}

pkill_on_port 3000
pkill_on_port 5000

if [ "${1-}" = "--clean" ]; then
    rm -f backend.log frontend.log || true
    echo "Logs cleaned"
fi

echo "Done"