# DevWorkflow Studio

> Educational demo project integrating **MCP** (Model Context Protocol) + **Goose** + **AGENTS.md** for learning agentic AI development while building a real development workflow automation system.

## What is This?

DevWorkflow Studio is a comprehensive learning project that demonstrates how to:
- Build custom **MCP servers** with tools, resources, and prompts
- Create **Goose recipes** for workflow automation
- Write effective **AGENTS.md** documentation for AI agents
- Integrate all three technologies into a cohesive system

## Project Status

🚧 **In Development** - This is an educational demo being built incrementally.

## Features

### 3 Custom MCP Servers
- **Code Quality Server** - Linting, formatting, complexity analysis
- **Git Workflow Server** - Branch management, commit helpers, PR analysis
- **Doc Generator Server** - Automated README, API docs, changelog generation

### 4 Goose Recipes
- **code-review.yaml** - Comprehensive code review workflow
- **setup-feature.yaml** - Feature scaffolding automation
- **pre-commit-check.yaml** - Quality gates before commits
- **update-docs.yaml** - Documentation synchronization

### Example Projects
- Simple REST API with AGENTS.md
- Web application with frontend/backend

### Learning Resources
- Progressive tutorials (7-8 hours total)
- Complete AGENTS.md as reference standard
- Templates for creating your own MCP servers and recipes

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/agomez356/devworkflow-studio.git
cd devworkflow-studio

# Start all MCP servers with Docker
./scripts/docker-build.sh
./scripts/docker-start.sh

# View logs
./scripts/docker-logs.sh

# For development with hot reload
./scripts/docker-dev.sh
```

### Option 2: Native Node.js

```bash
# Clone the repository
git clone https://github.com/agomez356/devworkflow-studio.git
cd devworkflow-studio

# Install dependencies
npm install

# Build all MCP servers
npm run build

# Run tests
npm test
```

## Documentation

- [Getting Started](docs/01-getting-started.md)
- [Docker Guide](docs/docker-guide.md) - **Docker setup and usage**
- [MCP Basics](docs/02-mcp-basics.md)
- [Goose Recipes](docs/03-goose-recipes.md)
- [AGENTS.md Guide](docs/04-agents-md-guide.md)
- [Integration Patterns](docs/05-integration-patterns.md)

## Tech Stack

- **Language**: TypeScript/Node.js 18+
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **Package Manager**: npm workspaces

## Learning Path

1. **Lesson 1**: MCP Basics (30 min) - Understand MCP architecture
2. **Lesson 2**: Build MCP Tool (1 hour) - Add custom tool
3. **Lesson 3**: Goose Recipes (1 hour) - Create automation workflow
4. **Lesson 4**: AGENTS.md (45 min) - Document for AI agents
5. **Lesson 5**: Full Integration (1 hour) - See it all work together

## Project Structure

```
devworkflow-studio/
├── mcp-servers/          # Custom MCP server implementations
│   ├── code-quality/     # Code analysis server
│   ├── git-workflow/     # Git operations server
│   └── doc-generator/    # Documentation generation server
├── goose-recipes/        # Goose automation recipes
├── examples/             # Example projects
├── docs/                 # Learning documentation
├── templates/            # Starter templates
└── tests/                # Integration tests
```

## Contributing

This is an educational project. Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Goose GitHub](https://github.com/block/goose)
- [AGENTS.md Spec](https://github.com/agentsmd/agents.md)
- [Agentic AI Foundation](https://aaif.io/)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Acknowledgments

Built as part of learning the agentic AI ecosystem:
- Model Context Protocol by Anthropic
- Goose by Block
- AGENTS.md by Agentic AI Foundation

---

**Note**: This is an educational demo project. It demonstrates concepts and patterns but should be adapted for production use.
