#!/bin/bash

# DevWorkflow Studio - Bootstrap Script
# Complete setup from scratch: install dependencies, build, test, configure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 DevWorkflow Studio - Bootstrap"
echo "=================================="
echo ""
echo "This script will:"
echo "  1. Check prerequisites"
echo "  2. Install dependencies"
echo "  3. Build MCP servers"
echo "  4. Run integration tests"
echo "  5. Configure for Claude Desktop/Code"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Found: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm -v)"

# Check git
if ! command -v git &> /dev/null; then
    echo "⚠️  Git not found. Some features may not work."
else
    echo -e "${GREEN}✓${NC} git $(git --version | cut -d' ' -f3)"
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) (optional)"
else
    echo -e "${YELLOW}⚠${NC}  Docker not found (optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Installing Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm install

echo ""
echo -e "${GREEN}✓${NC} Dependencies installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Building MCP Servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run build

echo ""
echo -e "${GREEN}✓${NC} MCP servers built successfully"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Running Integration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "scripts/test-integration.sh" ]; then
    chmod +x scripts/test-integration.sh
    ./scripts/test-integration.sh
else
    echo "⚠️  Integration test script not found, skipping..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Configuration Options"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "How would you like to use DevWorkflow Studio?"
echo ""
echo "  1) Claude Desktop (install globally)"
echo "  2) Claude Code (project-local config)"
echo "  3) Skip configuration (manual setup later)"
echo ""

read -p "Enter choice (1-3): " -n 1 -r CHOICE
echo
echo ""

case $CHOICE in
    1)
        echo "Installing for Claude Desktop..."
        if [ -f "scripts/install-mcp-servers.sh" ]; then
            chmod +x scripts/install-mcp-servers.sh
            ./scripts/install-mcp-servers.sh
        else
            echo "❌ install-mcp-servers.sh not found"
        fi
        ;;
    2)
        echo "Configuring for Claude Code..."
        echo "✓ Config already exists at .claude/mcp-config.json"
        echo ""
        echo "To use with Claude Code:"
        echo "  1. Open this directory in Claude Code"
        echo "  2. Claude Code will auto-detect the configuration"
        echo "  3. Try: 'Lint the code in src/'"
        ;;
    3)
        echo "Skipping configuration."
        echo ""
        echo "To configure later:"
        echo "  • Claude Desktop: ./scripts/install-mcp-servers.sh"
        echo "  • Claude Code: See CLAUDE_CODE_SETUP.md"
        ;;
    *)
        echo "Invalid choice. Skipping configuration."
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Bootstrap Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 What's installed:"
echo "  • 3 MCP servers (code-quality, git-workflow, doc-generator)"
echo "  • 4 Goose recipes (code-review, setup-feature, pre-commit-check, update-docs)"
echo "  • 2 Example projects (simple-api, webapp)"
echo "  • Complete testing infrastructure"
echo ""
echo "🚀 Quick Start:"
echo ""
echo "  Try the MCP servers:"
echo "    echo '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}' | \\"
echo "      node mcp-servers/code-quality/dist/index.js"
echo ""
echo "  Run examples:"
echo "    cd examples/simple-api && docker compose up"
echo "    cd examples/webapp && docker compose up"
echo ""
echo "  Run tests:"
echo "    npm test"
echo "    npm run test:integration"
echo ""
echo "📖 Documentation:"
echo "  • README.md - Project overview"
echo "  • AGENTS.md - Complete guide for AI agents"
echo "  • CLAUDE_CODE_SETUP.md - Claude Code setup"
echo "  • docs/ - Detailed documentation"
echo ""
echo "🎉 Happy coding with DevWorkflow Studio!"
echo ""
