#!/bin/bash

# DevWorkflow Studio - Docker Stop Script
# Stops all running MCP servers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🛑 Stopping DevWorkflow Studio services..."
echo ""

docker-compose down

echo ""
echo "✅ All services stopped."
