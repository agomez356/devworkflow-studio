# AGENTS.md

Guidance for AI coding agents working with **DevWorkflow Studio**.

## Project Overview

**DevWorkflow Studio** is an educational demo project that integrates **MCP** (Model Context Protocol), **Goose**, and **AGENTS.md** for learning agentic AI development through practical development workflow automation.

**Tech Stack**: TypeScript/Node.js 18+, MCP SDK, Goose, Docker
**Purpose**: Educational demo & learning resource
**Status**: Active Development
**Repository**: https://github.com/agomez356/devworkflow-studio

---

## Development Environment

### Prerequisites

```bash
# Required
node >= 18.0.0
npm >= 9.0.0

# Recommended
docker >= 24.0.0
docker-compose >= 2.0.0
goose >= 0.9.0  # Optional for recipe testing
```

### Setup

```bash
# Clone repository
git clone https://github.com/agomez356/devworkflow-studio.git
cd devworkflow-studio

# Install dependencies
npm install

# Build all MCP servers
npm run build

# Run tests
npm test
```

### Docker Setup (Recommended)

```bash
# Build all images
./scripts/docker-build.sh

# Start all services
./scripts/docker-start.sh

# Development mode with hot reload
./scripts/docker-dev.sh

# View logs
./scripts/docker-logs.sh [service_name]

# Stop services
./scripts/docker-stop.sh
```

### MCP Server Configuration

Add to Claude Desktop config (`~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "code-quality": {
      "command": "node",
      "args": ["/absolute/path/to/devworkflow-studio/mcp-servers/code-quality/dist/index.js"]
    },
    "git-workflow": {
      "command": "node",
      "args": ["/absolute/path/to/devworkflow-studio/mcp-servers/git-workflow/dist/index.js"]
    },
    "doc-generator": {
      "command": "node",
      "args": ["/absolute/path/to/devworkflow-studio/mcp-servers/doc-generator/dist/index.js"]
    }
  }
}
```

### Goose Configuration

Start Goose with MCP servers:

```bash
# Ensure servers are built
npm run build

# Start Goose session
goose session start --config goose.yaml
```

---

## Architecture

### System Overview

```
┌─────────────────┐
│   AI Agent      │ (Claude Code, Goose, etc.)
│  (You/Client)   │
└────────┬────────┘
         │ MCP Protocol (JSON-RPC via stdio)
         │
         ├──────────────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  Code    │  │   Git    │  │   Doc    │
   │ Quality  │  │ Workflow │  │Generator │
   │  Server  │  │  Server  │  │  Server  │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │              │
        ▼             ▼              ▼
    [Tools]       [Tools]        [Tools]
    [Resources]   [Prompts]      [Resources]
```

### MCP Servers

#### 1. Code Quality Server (`mcp-servers/code-quality/`)

**Purpose**: Code analysis, linting, formatting, complexity metrics

**Tools**:
- `lint_code(path, linter, fix)` - Run ESLint/Pylint on files
- `format_code(path, formatter, write)` - Format with Prettier/Black
- `analyze_complexity(path)` - Calculate cyclomatic complexity

**Resources**:
- `code://metrics` - Current project code quality metrics

**Example**:
```bash
# Lint TypeScript files
lint_code(path="./src", linter="eslint", fix=false)

# Format with Prettier
format_code(path="./src", formatter="prettier", write=true)

# Analyze complexity
analyze_complexity(path="./src/tools/lint.ts")
```

#### 2. Git Workflow Server (`mcp-servers/git-workflow/`)

**Purpose**: Git operations, branch management, PR workflows

**Tools**:
- `create_branch(name, type, from, checkout)` - Create branches with conventions
- `generate_commit_msg(type, scope, includeBreaking)` - Semantic commits
- `analyze_pr(prNumber, baseBranch, checkConventions)` - PR analysis

**Prompts**:
- `pr-review-template` - Structured PR review checklist

**Example**:
```bash
# Create feature branch
create_branch(name="user-auth", type="feature", from="main")

# Generate commit message
generate_commit_msg(type="feat", scope="auth")

# Analyze current PR
analyze_pr(baseBranch="main", checkConventions=true)
```

#### 3. Doc Generator Server (`mcp-servers/doc-generator/`)

**Purpose**: Automated documentation generation and maintenance

**Tools**:
- `generate_readme(projectPath, sections, overwrite)` - Generate README.md
- `generate_api_docs(inputPath, outputPath, format)` - API documentation
- `update_changelog(version, fromTag, unreleased)` - CHANGELOG updates

**Resources**:
- `docs://project-info` - Project metadata and statistics

**Example**:
```bash
# Generate README
generate_readme(projectPath=".", sections=["features", "installation", "usage"])

# Generate API docs
generate_api_docs(inputPath="./src", outputPath="./docs/api", format="markdown")

# Update changelog
update_changelog(version="1.1.0", fromTag="v1.0.0", unreleased=false)
```

### Directory Structure

```
devworkflow-studio/
├── mcp-servers/              # MCP server implementations
│   ├── shared/               # Shared infrastructure
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── error-handling.ts # Error utilities
│   │   └── mcp-base.ts       # Base server class
│   │
│   ├── code-quality/         # Code Quality MCP Server
│   │   ├── src/
│   │   │   ├── index.ts      # Server entry point
│   │   │   └── tools/        # Tool implementations
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── git-workflow/         # Git Workflow MCP Server
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── tools/
│   │   │   └── prompts/
│   │   └── package.json
│   │
│   └── doc-generator/        # Doc Generator MCP Server
│       ├── src/
│       │   ├── index.ts
│       │   ├── tools/
│       │   └── resources/
│       └── package.json
│
├── goose-recipes/            # Goose automation recipes
│   └── code-review.yaml      # Comprehensive code review
│
├── docs/                     # Documentation
├── examples/                 # Example projects
├── templates/                # Starter templates
├── scripts/                  # Helper scripts
└── tests/                    # Tests
```

---

## Common Commands

### Development Workflow

```bash
# Start development
npm run dev                   # Build in watch mode

# Build specific server
npm run build --workspace=@devworkflow/code-quality

# Run tests
npm test                      # All tests
npm test --workspace=@devworkflow/git-workflow  # Specific server

# Lint and format
npm run lint                  # Lint all code
npm run format                # Format all code
```

### Docker Workflow

```bash
# Development
./scripts/docker-dev.sh       # Start dev environment with hot reload

# Production
./scripts/docker-build.sh     # Build optimized images
./scripts/docker-start.sh     # Start all services
./scripts/docker-stop.sh      # Stop all services

# Logs and debugging
./scripts/docker-logs.sh               # All logs
./scripts/docker-logs.sh code-quality  # Specific service logs
docker-compose exec code-quality sh    # Shell into container
```

### Goose Recipes

```bash
# Code review
goose run code-review                          # Default (against main)
goose run code-review --base_branch=develop    # Custom base branch

# Feature setup
goose run setup-feature --feature_name=auth

# Pre-commit checks
goose run pre-commit-check

# Documentation update
goose run update-docs
```

### MCP Server Testing

```bash
# Run servers standalone for testing
node mcp-servers/code-quality/dist/index.js
node mcp-servers/git-workflow/dist/index.js
node mcp-servers/doc-generator/dist/index.js

# Test with sample input (via stdin)
echo '{"tool":"lint_code","arguments":{"path":"./src"}}' | \
  node mcp-servers/code-quality/dist/index.js
```

---

## Key Files and Their Purposes

### Infrastructure Core
- **`package.json`** - Workspace root, manages all MCP servers as workspaces
- **`tsconfig.json`** - Shared TypeScript configuration for all servers
- **`docker-compose.yml`** - Multi-service Docker orchestration
- **`Dockerfile`** - Multi-stage build for optimized images

### MCP Server Infrastructure
- **`mcp-servers/shared/mcp-base.ts`** - Base class all servers extend. Provides common patterns for tool registration, execution, error handling
- **`mcp-servers/shared/error-handling.ts`** - Error utilities (`safeExecute`, `validateRequired`, `successResult`, `errorResult`)
- **`mcp-servers/shared/types.ts`** - TypeScript type definitions for MCP tools, resources, prompts

### MCP Server Entry Points
- **`mcp-servers/code-quality/src/index.ts`** - Code Quality server main file
- **`mcp-servers/git-workflow/src/index.ts`** - Git Workflow server main file
- **`mcp-servers/doc-generator/src/index.ts`** - Doc Generator server main file

### Goose Configuration
- **`.goosehints`** - Project context for Goose (commands, patterns, workflows)
- **`goose.yaml`** - Goose configuration connecting MCP servers, permissions, model settings
- **`goose-recipes/code-review.yaml`** - Comprehensive code review recipe (main example)

### Documentation
- **`AGENTS.md`** - This file - comprehensive agent guidance
- **`README.md`** - Human-focused project overview
- **`docs/docker-guide.md`** - Complete Docker usage guide
- **`mcp-servers/*/README.md`** - Server-specific documentation

---

## Testing Guidelines

### Unit Tests

```bash
# Run all tests
npm test

# Test specific server
npm test --workspace=@devworkflow/code-quality

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### MCP Server Tests

MCP server tests are in `mcp-servers/*/tests/`:

```typescript
// Example test structure
import { describe, it, expect } from 'vitest';
import { executeLintCode } from '../src/tools/lint.js';

describe('lint_code tool', () => {
  it('should lint TypeScript files', async () => {
    const result = await executeLintCode({
      path: './test-fixtures/sample.ts',
      linter: 'eslint',
      fix: false
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse(result.content[0].text)).toHaveProperty('summary');
  });
});
```

### Goose Recipe Testing

```bash
# Validate recipe syntax
goose-test goose-recipes/code-review.yaml

# Dry run (no actual changes)
goose run code-review --dry-run

# With specific parameters
goose run code-review --base_branch=develop --check_docs=false --dry-run
```

### Integration Tests

Integration tests in `tests/integration/`:

```bash
# Run integration tests (requires MCP servers running)
npm run test:integration

# Or via Docker
./scripts/test-integration.sh
```

---

## Pull Request Guidelines

### Before Creating PR

```bash
# 1. Run quality checks
npm run lint
npm test
npm run build

# 2. Run Goose code review
goose run code-review

# 3. Ensure all checks pass
# Expected:
# ✓ All tests pass
# ✓ No linting errors
# ✓ Build successful
# ✓ Goose review shows no critical issues
```

### PR Title Format

Use Conventional Commits format:

```
feat(server): add new MCP tool for X
fix(recipe): correct error handling in code-review
docs(readme): update installation instructions
refactor(shared): improve error handling utilities
```

### PR Description Template

```markdown
## Summary
[Brief description of changes]

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Goose recipe tested (if applicable)

## Checklist
- [ ] Code follows project style
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] AGENTS.md updated (if workflow changes)
- [ ] No breaking changes (or migration guide provided)
```

### PR Review Process

Reviewers should:
1. Run `goose run code-review` to get automated analysis
2. Check that all CI checks pass
3. Verify MCP server tests pass (if servers modified)
4. Test Goose recipes manually (if recipes modified)
5. Review code for security, performance, maintainability

---

## Build and Deployment

### Building MCP Servers

```bash
# Build all servers
npm run build

# Build specific server
npm run build --workspace=@devworkflow/code-quality

# Clean before build
npm run clean && npm run build

# Verify builds
npm run verify
```

### Docker Build

```bash
# Build development image
docker-compose build dev

# Build production images
docker-compose build code-quality git-workflow doc-generator

# Build without cache
docker-compose build --no-cache

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t devworkflow:latest .
```

### Publishing (Optional)

```bash
# Publish to npm (if making public packages)
npm publish --workspace=@devworkflow/code-quality --access public

# Tag Docker images
docker tag devworkflow-code-quality:latest your-registry/code-quality:v1.0.0

# Push to registry
docker push your-registry/code-quality:v1.0.0
```

---

## Code Style and Standards

### TypeScript

- Use **strict mode** enabled
- Prefer **interfaces** over types
- Use **async/await** over raw promises
- Follow **MCP SDK patterns** for server implementation
- Add **JSDoc comments** for public APIs

### MCP Tool Naming

```typescript
// ✅ Good: verb_noun format
lint_code
analyze_complexity
generate_readme

// ❌ Bad: inconsistent naming
codeLinter
checkTheCode
readme-gen
```

### Error Handling

All MCP tools should use shared error handling utilities:

```typescript
import { safeExecute, validateRequired, successResult, errorResult } from '../../shared/error-handling.js';

export async function executeMyTool(args: Record<string, any>) {
  validateRequired(args, ['requiredParam']);

  return await safeExecute(async () => {
    // Tool logic here
    const result = { success: true, data: "..." };
    return successResult(JSON.stringify(result, null, 2));
  }, 'MyTool execution');
}
```

### Goose Recipe Naming

```yaml
# ✅ Good: <verb>-<noun>.yaml
code-review.yaml
setup-feature.yaml
update-docs.yaml

# ❌ Bad: unclear purpose
review.yaml
feature.yaml
docs.yaml
```

---

## Security Considerations

### MCP Server Security

- **Input Validation**: All tool inputs validated against JSON schema
- **Path Sanitization**: File paths sanitized to prevent traversal attacks
- **Command Injection**: No shell commands executed with unsanitized user input
- **Resource Limits**: Tool execution timeouts configured
- **Least Privilege**: Servers run with minimal required permissions

### Goose Permissions

```yaml
# Defined in goose.yaml
permissions:
  filesystem:
    read: ["**/*"]           # Read all for analysis
    write: ["docs/**", "*.md"]  # Write only where needed

  network:
    allowed_domains: ["api.github.com"]  # Whitelist only

  execution:
    allowed_commands: ["git", "npm", "node"]  # Specific commands only
```

### Secrets Management

- ✅ Never commit API keys, tokens, or credentials
- ✅ Use environment variables for sensitive data
- ✅ Provide `.env.example` template
- ✅ Add sensitive files to `.gitignore`
- ❌ Never log sensitive information

---

## Troubleshooting

### MCP Server Won't Start

```bash
# Check if built
ls mcp-servers/code-quality/dist/

# Rebuild
npm run clean && npm run build

# Test standalone
node mcp-servers/code-quality/dist/index.js

# Check for errors
node mcp-servers/code-quality/dist/index.js 2>&1 | tee error.log
```

### Docker Issues

```bash
# Container won't start
docker-compose logs code-quality

# Permission issues
docker-compose run --user $(id -u):$(id -g) code-quality sh

# Network issues
docker-compose down && docker-compose up -d

# Clean everything
docker-compose down -v --rmi all
./scripts/docker-build.sh
```

### Goose Recipe Fails

```bash
# Enable debug logging
goose run code-review --log-level debug

# Validate recipe
goose-test goose-recipes/code-review.yaml

# Check MCP server availability
goose session list-tools

# Dry run
goose run code-review --dry-run
```

### Build Errors

```bash
# Clear node_modules
rm -rf node_modules mcp-servers/*/node_modules
npm install

# Check Node version
node --version  # Should be 18+

# Rebuild from scratch
npm run clean
npm install
npm run build
```

---

## Learning Path

### Beginners (New to MCP/Goose)

1. Read `docs/01-getting-started.md`
2. Install and test the code-quality MCP server
3. Run `goose run code-review` on example project
4. Examine `goose-recipes/code-review.yaml`
5. Modify recipe to add a simple step

**Time**: ~2-3 hours

### Intermediate (Understand Basics)

1. Create new MCP tool in existing server
2. Write new Goose recipe from scratch
3. Add MCP resource to server
4. Integrate external MCP server
5. Write tests for new tool

**Time**: ~4-6 hours

### Advanced (Ready to Build)

1. Build custom MCP server for your domain
2. Create complex multi-step Goose recipes with error handling
3. Implement MCP prompts for specialized tasks
4. Write comprehensive AGENTS.md for your project
5. Integrate with CI/CD pipelines

**Time**: ~8-12 hours

---

## Project-Specific Context

### Why This Architecture

- **Modular MCP Servers**: Each concern separated for maintainability
- **Goose Orchestration**: Recipes combine tools into workflows
- **Shared Infrastructure**: DRY principle with `mcp-servers/shared/`
- **Docker Support**: Consistent environments and easy deployment
- **Comprehensive Documentation**: AGENTS.md as reference standard

### Design Decisions

- **TypeScript**: Strong typing prevents runtime errors in MCP servers
- **npm Workspaces**: Allows independent server versioning
- **stdio Transport**: Standard MCP communication via stdin/stdout
- **Multi-stage Docker**: Small production images, full-featured dev
- **YAML Recipes**: Human-readable, version-controllable workflows

### Future Enhancements

- [ ] Add web UI for recipe management
- [ ] Create VS Code extension with recipes
- [ ] Implement CI/CD integration recipe
- [ ] Add Python/Go MCP server examples
- [ ] Build marketplace for custom recipes

---

## Contributing

### Adding New MCP Server

1. Copy `templates/mcp-server.template/` to `mcp-servers/your-server/`
2. Update `package.json` with server name
3. Implement tools in `src/tools/`
4. Extend `MCPServerBase` in `src/index.ts`
5. Add tests in `tests/`
6. Update root `package.json` workspaces array
7. Document in server's `README.md`
8. Update `AGENTS.md` with server info
9. Update `goose.yaml` with server config

### Adding New Goose Recipe

1. Copy `templates/recipe.template.yaml`
2. Define clear steps with MCP tool calls
3. Add input parameters if needed
4. Test with `goose-test`
5. Add example outputs as comments
6. Document in `docs/03-goose-recipes.md`
7. Update `AGENTS.md` with recipe usage

### Documentation Standards

- Keep AGENTS.md in sync with all changes
- Add examples for new features
- Update troubleshooting section
- Include file paths in references
- Use code blocks with syntax highlighting

---

## Resources

- **MCP Documentation**: https://modelcontextprotocol.io/
- **Goose Repository**: https://github.com/block/goose
- **AGENTS.md Spec**: https://github.com/agentsmd/agents.md
- **Agentic AI Foundation**: https://aaif.io/
- **Project Repository**: https://github.com/agomez356/devworkflow-studio
- **Issues**: https://github.com/agomez356/devworkflow-studio/issues

---

**Last Updated**: 2025-12-17
**Maintainers**: DevWorkflow Studio Team
**License**: MIT
**Status**: Educational Demo Project

---

_This AGENTS.md file follows the AGENTS.md specification and serves as a comprehensive reference for AI coding agents. It is maintained as the primary source of truth for agent-facing documentation._
