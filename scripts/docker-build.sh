#!/bin/bash

# DevWorkflow Studio - Docker Build Script
# Builds all MCP server images

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🔨 Building DevWorkflow Studio Docker images..."
echo ""

# Build all services
docker compose build --parallel

echo ""
echo "✅ All images built successfully!"
echo ""
echo "Available images:"
docker images | grep devworkflow
