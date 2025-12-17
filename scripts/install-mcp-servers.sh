#!/bin/bash

# DevWorkflow Studio - MCP Servers Installation Script
# Installs MCP servers globally for use with Claude Desktop or Claude Code

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "📦 DevWorkflow Studio - MCP Servers Installation"
echo "=================================================="
echo ""

# Check if servers are built
if [ ! -d "mcp-servers/code-quality/dist" ] || \
   [ ! -d "mcp-servers/git-workflow/dist" ] || \
   [ ! -d "mcp-servers/doc-generator/dist" ]; then
    echo "⚠️  MCP servers not built. Building now..."
    npm run build
    echo ""
fi

echo "🔍 Detecting configuration location..."
echo ""

# Detect OS and set config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CLAUDE_DESKTOP_CONFIG="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CLAUDE_CONFIG_DIR="$HOME/.config/Claude"
    CLAUDE_DESKTOP_CONFIG="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

echo "📍 Configuration will be written to:"
echo "   $CLAUDE_DESKTOP_CONFIG"
echo ""

# Create config directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Generate MCP configuration
echo "🔧 Generating MCP server configuration..."
echo ""

cat > "$CLAUDE_DESKTOP_CONFIG" << EOF
{
  "mcpServers": {
    "code-quality": {
      "command": "node",
      "args": ["$PROJECT_ROOT/mcp-servers/code-quality/dist/index.js"]
    },
    "git-workflow": {
      "command": "node",
      "args": ["$PROJECT_ROOT/mcp-servers/git-workflow/dist/index.js"]
    },
    "doc-generator": {
      "command": "node",
      "args": ["$PROJECT_ROOT/mcp-servers/doc-generator/dist/index.js"]
    }
  }
}
EOF

echo "✅ MCP servers installed successfully!"
echo ""
echo "📋 Installed servers:"
echo "   • code-quality   - Linting, formatting, complexity analysis"
echo "   • git-workflow   - Branch management, commit messages, PR analysis"
echo "   • doc-generator  - README, API docs, CHANGELOG generation"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Restart Claude Desktop (if running)"
echo "2. Open Claude Desktop and verify servers are loaded"
echo "3. Try asking: 'Lint the code in src/'"
echo ""
echo "📖 Documentation:"
echo "   • CLAUDE_CODE_SETUP.md - Claude Code configuration"
echo "   • MCP_SERVERS_TEST_RESULTS.md - Server test results"
echo "   • AGENTS.md - Complete project documentation"
echo ""
echo "✨ Done!"
