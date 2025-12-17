# DevWorkflow Studio

> 🚀 Educational project integrating **MCP** (Model Context Protocol) + **Goose** + **AGENTS.md** for learning agentic AI development workflows

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3+-blue)](https://www.typescriptlang.org/)

---

## 📋 What is This?

DevWorkflow Studio is a **comprehensive learning project** that demonstrates how to build a complete development workflow automation system using cutting-edge agentic AI technologies:

- 🔧 **MCP Servers**: 3 custom servers with 9 tools, 2 resources, and 1 prompt
- 🤖 **Goose Recipes**: 4 automated workflows for code review, feature setup, pre-commit checks, and docs
- 📚 **AGENTS.md**: Exemplary documentation for AI agents with 900+ lines
- 🎯 **Real Examples**: 2 full-stack projects (API + WebApp) demonstrating integration
- 🧪 **Testing**: Complete unit and integration test suite

---

## ✨ Features

### 🛠️ MCP Servers (Built from Scratch)

#### **1. Code Quality Server**
- `lint_code` - Run linters (ESLint, Pylint) with auto-fix
- `format_code` - Format code (Prettier, Black)
- `analyze_complexity` - Analyze code complexity metrics
- `code://metrics` - Resource for quality metrics

#### **2. Git Workflow Server**
- `create_branch` - Create branches with naming conventions
- `generate_commit_msg` - Generate semantic commit messages from diff
- `analyze_pr` - Analyze PRs for issues
- `pr-review-template` - Prompt for PR reviews

#### **3. Doc Generator Server**
- `generate_readme` - Auto-generate README from code
- `generate_api_docs` - Create API documentation
- `update_changelog` - Update CHANGELOG from commits
- `docs://project-info` - Resource for project metadata

### 🔄 Goose Recipes (Workflow Automation)

1. **code-review.yaml** - Comprehensive automated code review
2. **setup-feature.yaml** - Scaffold new features with boilerplate
3. **pre-commit-check.yaml** - Quality gates before committing
4. **update-docs.yaml** - Sync documentation with code

### 📦 Example Projects

- **simple-api/** - Express + TypeScript REST API with CRUD operations
- **webapp/** - React + Vite user management interface

Both include:
- Complete AGENTS.md documentation
- .goosehints for Goose context
- Docker multi-stage builds
- MCP integration examples

### 📖 Learning Resources

- **Progressive Tutorials** (7-8 hours total)
- **Complete Documentation** in `docs/`
- **Templates** for your own servers and recipes
- **Testing Examples** for MCP servers

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerized setup)
- Git

### One-Command Setup

```bash
# Clone and bootstrap everything
git clone https://github.com/agomez356/devworkflow-studio.git
cd devworkflow-studio
./scripts/bootstrap.sh
```

This will:
1. Check prerequisites
2. Install dependencies
3. Build MCP servers
4. Run integration tests
5. Configure for Claude Desktop/Code

### Manual Setup

#### Option 1: Native Node.js (Recommended for Development)

```bash
# Install dependencies
npm install

# Build MCP servers
npm run build

# Run tests
npm test

# Install for Claude Desktop
./scripts/install-mcp-servers.sh
```

#### Option 2: Docker (Recommended for Production)

```bash
# Build Docker images
./scripts/docker-build.sh

# Start all services
./scripts/docker-start.sh

# View logs
./scripts/docker-logs.sh code-quality

# Stop services
./scripts/docker-stop.sh
```

---

## 🎓 Learning Path

### Beginner (2 hours)

1. **Understand MCP** (`docs/02-mcp-basics.md`)
   - What is MCP?
   - Servers, tools, resources, prompts
   - Protocol basics

2. **Explore MCP Servers** (`mcp-servers/`)
   - Read `code-quality/src/index.ts`
   - Understand tool implementation
   - Test a server manually

3. **AGENTS.md Basics** (`docs/04-agents-md-guide.md`)
   - Why AGENTS.md?
   - Standard sections
   - Review our AGENTS.md

### Intermediate (3 hours)

4. **Build Custom Tool** (Hands-on)
   - Add new tool to code-quality server
   - Write tests
   - Use with Claude

5. **Goose Recipes** (`docs/03-goose-recipes.md`)
   - Understanding recipes
   - Run `code-review` recipe
   - Modify a recipe

6. **Example Projects** (`examples/`)
   - Explore simple-api
   - Explore webapp
   - See MCP integration

### Advanced (2-3 hours)

7. **Custom Recipe** (Project)
   - Create your own recipe
   - Orchestrate multiple servers
   - Add error handling

8. **Integration Patterns** (`docs/05-integration-patterns.md`)
   - CI/CD integration
   - Pre-commit hooks
   - Documentation automation

9. **Extend the System** (Open-ended)
   - Add new MCP server
   - Create new recipe
   - Contribute back!

---

## 📁 Project Structure

```
devworkflow-studio/
├── mcp-servers/              # MCP Server implementations
│   ├── shared/              # Shared utilities
│   ├── code-quality/        # Linting, formatting, analysis
│   ├── git-workflow/        # Git operations
│   └── doc-generator/       # Documentation generation
├── goose-recipes/            # Goose automation workflows
│   ├── code-review.yaml
│   ├── setup-feature.yaml
│   ├── pre-commit-check.yaml
│   └── update-docs.yaml
├── examples/                 # Example projects
│   ├── simple-api/          # Express API example
│   └── webapp/              # React app example
├── tests/                    # Test suite
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── docs/                     # Documentation
│   ├── 01-getting-started.md
│   ├── 02-mcp-basics.md
│   ├── 03-goose-recipes.md
│   ├── 04-agents-md-guide.md
│   └── 05-integration-patterns.md
├── scripts/                  # Helper scripts
│   ├── bootstrap.sh         # Complete setup
│   ├── install-mcp-servers.sh
│   ├── test-integration.sh
│   └── docker-*.sh          # Docker helpers
├── AGENTS.md                 # Main project documentation
├── .goosehints              # Goose AI context
└── goose.yaml               # Goose configuration
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage
npm run test:coverage

# Integration test script
./scripts/test-integration.sh
```

**Test Coverage**:
- Unit tests for MCP tools
- Integration tests for servers
- Protocol compliance tests
- End-to-end workflow tests

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/01-getting-started.md) | Initial setup and overview |
| [MCP Basics](docs/02-mcp-basics.md) | Understanding MCP architecture |
| [Goose Recipes](docs/03-goose-recipes.md) | Creating and using recipes |
| [AGENTS.md Guide](docs/04-agents-md-guide.md) | Writing AI-friendly docs |
| [Integration Patterns](docs/05-integration-patterns.md) | Real-world patterns |
| [Docker Guide](docs/docker-guide.md) | Docker setup and usage |
| [CLAUDE_CODE_SETUP](CLAUDE_CODE_SETUP.md) | Claude Code configuration |
| [MCP Test Results](MCP_SERVERS_TEST_RESULTS.md) | Server test results |

---

## 🔨 Common Commands

### Development
```bash
npm run build        # Build all MCP servers
npm run dev          # Start in development mode
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run clean        # Clean build artifacts
```

### MCP Servers
```bash
# Test server manually
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  node mcp-servers/code-quality/dist/index.js

# Install for Claude
./scripts/install-mcp-servers.sh
```

### Goose Recipes
```bash
goose run code-review
goose run setup-feature feature_name="auth" feature_type="fullstack"
goose run pre-commit-check auto_fix=true
goose run update-docs
```

### Examples
```bash
# Simple API
cd examples/simple-api
docker compose up

# WebApp
cd examples/webapp
docker compose up
```

---

## 💡 Usage Examples

### With Claude Code

```
User: "Lint all TypeScript files in src/"
→ Uses code-quality server's lint_code tool

User: "Generate a commit message for staged changes"
→ Uses git-workflow server's generate_commit_msg tool

User: "Update the README based on current code"
→ Uses doc-generator server's generate_readme tool
```

### With Goose

```bash
# Automated code review
goose run code-review

# Setup new feature
goose run setup-feature \
  feature_name="notifications" \
  feature_type="backend"

# Pre-commit checks
goose run pre-commit-check auto_fix=true run_tests=true
```

---

## 🎯 Use Cases

1. **Learning Agentic AI** - Understand MCP, Goose, and AGENTS.md
2. **Workflow Automation** - Automate repetitive development tasks
3. **Code Quality** - Enforce standards with automated checks
4. **Documentation** - Keep docs in sync with code
5. **Onboarding** - Help new developers get started quickly

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **MCP SDK**: @modelcontextprotocol/sdk ^0.6.0
- **Testing**: Vitest 1.0+
- **Linting**: ESLint + Prettier
- **Containerization**: Docker + Docker Compose
- **Package Manager**: npm workspaces

---

## 🤝 Contributing

Contributions are welcome! This is an educational project, so contributions that enhance learning are especially appreciated.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📊 Project Stats

- **MCP Servers**: 3
- **MCP Tools**: 9
- **MCP Resources**: 2
- **MCP Prompts**: 1
- **Goose Recipes**: 4
- **Example Projects**: 2
- **Documentation**: 900+ lines (AGENTS.md)
- **Tests**: 14+ (unit + integration)
- **Lines of Code**: ~7,000

---

## 🔗 Resources

- [MCP Documentation](https://modelcontextprotocol.io/) - Model Context Protocol
- [Goose GitHub](https://github.com/block/goose) - Goose by Block
- [AGENTS.md Spec](https://github.com/agentsmd/agents.md) - AGENTS.md standard
- [Agentic AI Foundation](https://aaif.io/) - AAIF resources

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built to learn the agentic AI ecosystem:
- **Model Context Protocol** by Anthropic
- **Goose** by Block
- **AGENTS.md** by Agentic AI Foundation

Special thanks to the open-source community for making these tools available.

---

## 🌟 Star This Repo

If you find this project helpful for learning MCP, Goose, and AGENTS.md, please give it a ⭐!

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/agomez356/devworkflow-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/agomez356/devworkflow-studio/discussions)

---

**Last Updated**: 2025-12-17
**Status**: ✅ Fully Functional (Educational Demo)

---

*DevWorkflow Studio - Learn by building. Build by learning.* 🚀
