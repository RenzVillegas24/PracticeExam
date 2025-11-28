#!/usr/bin/env bash

set -euo pipefail

echo "Running setup..."

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is required (18+). Install it and retry."
    exit 1
fi

echo "Node: $(node --version)"

install_deps() {
    dir=$1
    envfile=$2
    echo "Setting up ${dir}"
    cd ${dir}
    if [ ! -f "${envfile}" ] && [ -f .env.example ]; then
        cp .env.example ${envfile}
        echo "Created ${dir}/${envfile}"
    fi
    npm install --silent
    cd - >/dev/null
}

install_deps backend .env
install_deps frontend .env.local

echo "Setup complete. Run:"
echo "  bash run.sh"
echo "Then open: http://localhost:3000"
