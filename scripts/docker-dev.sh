#!/bin/bash

# DevWorkflow Studio - Docker Development Helper
# Starts development environment with all MCP servers in watch mode

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🐳 Starting DevWorkflow Studio development environment..."
echo ""

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install it first."
    exit 1
fi

# Build and start development container
docker-compose up --build dev

echo ""
echo "✅ Development environment stopped."
