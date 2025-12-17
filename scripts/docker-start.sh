#!/bin/bash

# DevWorkflow Studio - Docker Start Script
# Starts all MCP servers in production mode

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🚀 Starting DevWorkflow Studio MCP servers..."
echo ""

# Check if services are already running
if docker-compose ps | grep -q "Up"; then
    echo "⚠️  Some services are already running."
    read -p "Do you want to restart them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down
    else
        echo "Cancelled."
        exit 0
    fi
fi

# Start all services
docker-compose up -d code-quality git-workflow doc-generator

echo ""
echo "✅ All services started!"
echo ""
echo "Running services:"
docker-compose ps

echo ""
echo "📋 View logs:"
echo "  docker-compose logs -f code-quality"
echo "  docker-compose logs -f git-workflow"
echo "  docker-compose logs -f doc-generator"
echo ""
echo "🛑 Stop all services:"
echo "  docker-compose down"
