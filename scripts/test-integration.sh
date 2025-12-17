#!/bin/bash

# DevWorkflow Studio - Integration Test Suite
# Runs comprehensive integration tests for MCP servers and Goose recipes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🧪 DevWorkflow Studio - Integration Test Suite"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Helper function to run test
run_test() {
    local test_name=$1
    local test_command=$2

    ((TESTS_TOTAL++))

    echo -n "  Testing: $test_name ... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# 1. Build Check
echo "1️⃣  Build Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "MCP servers built" "test -d mcp-servers/code-quality/dist && test -d mcp-servers/git-workflow/dist && test -d mcp-servers/doc-generator/dist"

echo ""

# 2. MCP Server Tests
echo "2️⃣  MCP Server Protocol Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test code-quality server
run_test "code-quality: tools/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}' | timeout 5s node mcp-servers/code-quality/dist/index.js | grep -q '\"result\"'"

run_test "code-quality: resources/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"resources/list\",\"params\":{}}' | timeout 5s node mcp-servers/code-quality/dist/index.js | grep -q 'code://metrics'"

# Test git-workflow server
run_test "git-workflow: tools/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"tools/list\",\"params\":{}}' | timeout 5s node mcp-servers/git-workflow/dist/index.js | grep -q '\"result\"'"

run_test "git-workflow: prompts/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":4,\"method\":\"prompts/list\",\"params\":{}}' | timeout 5s node mcp-servers/git-workflow/dist/index.js | grep -q 'pr-review-template'"

# Test doc-generator server
run_test "doc-generator: tools/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":5,\"method\":\"tools/list\",\"params\":{}}' | timeout 5s node mcp-servers/doc-generator/dist/index.js | grep -q '\"result\"'"

run_test "doc-generator: resources/list" "echo '{\"jsonrpc\":\"2.0\",\"id\":6,\"method\":\"resources/list\",\"params\":{}}' | timeout 5s node mcp-servers/doc-generator/dist/index.js | grep -q 'docs://project-info'"

echo ""

# 3. File Structure Tests
echo "3️⃣  Project Structure Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "AGENTS.md exists" "test -f AGENTS.md"
run_test ".goosehints exists" "test -f .goosehints"
run_test "goose.yaml exists" "test -f goose.yaml"
run_test "Examples directory" "test -d examples && test -d examples/simple-api && test -d examples/webapp"
run_test "Recipes directory" "test -d goose-recipes && test -f goose-recipes/code-review.yaml"
run_test "Tests directory" "test -d tests && test -d tests/unit && test -d tests/integration"

echo ""

# 4. Goose Configuration Tests
echo "4️⃣  Goose Configuration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "goose.yaml valid" "grep -q 'mcp_servers:' goose.yaml"
run_test "All 4 recipes exist" "test -f goose-recipes/code-review.yaml && test -f goose-recipes/setup-feature.yaml && test -f goose-recipes/pre-commit-check.yaml && test -f goose-recipes/update-docs.yaml"

echo ""

# 5. Documentation Tests
echo "5️⃣  Documentation Completeness"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "README.md exists" "test -f README.md"
run_test "CLAUDE_CODE_SETUP.md" "test -f CLAUDE_CODE_SETUP.md"
run_test "MCP_SERVERS_TEST_RESULTS.md" "test -f MCP_SERVERS_TEST_RESULTS.md"
run_test "Example READMEs" "test -f examples/simple-api/README.md && test -f examples/webapp/README.md"
run_test "Example AGENTS.md" "test -f examples/simple-api/AGENTS.md && test -f examples/webapp/AGENTS.md"

echo ""

# 6. Docker Tests
echo "6️⃣  Docker Configuration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "Root Dockerfile" "test -f Dockerfile"
run_test "docker-compose.yml" "test -f docker-compose.yml"
run_test "Example Dockerfiles" "test -f examples/simple-api/Dockerfile && test -f examples/webapp/Dockerfile"
run_test "Docker scripts" "test -f scripts/docker-start.sh && test -f scripts/docker-stop.sh"

echo ""

# 7. TypeScript/Node Tests
echo "7️⃣  Node.js & TypeScript Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "package.json exists" "test -f package.json"
run_test "tsconfig.json exists" "test -f tsconfig.json"
run_test "node_modules installed" "test -d node_modules"
run_test "All servers have package.json" "test -f mcp-servers/code-quality/package.json && test -f mcp-servers/git-workflow/package.json && test -f mcp-servers/doc-generator/package.json"

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  Total Tests:  $TESTS_TOTAL"
echo -e "  ${GREEN}Passed:       $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed:       $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All integration tests passed!${NC}"
    echo ""
    echo "🎉 DevWorkflow Studio is ready to use!"
    exit 0
else
    echo -e "${RED}❌ Some tests failed.${NC}"
    echo ""
    echo "Please check the failed tests above and:"
    echo "  1. Ensure all dependencies are installed: npm install"
    echo "  2. Build the MCP servers: npm run build"
    echo "  3. Check for any error messages"
    exit 1
fi
