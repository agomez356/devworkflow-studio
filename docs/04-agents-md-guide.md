# AGENTS.md Guide

## What is AGENTS.md?

AGENTS.md is a standardized markdown format for documenting projects specifically for AI agents. It provides context, instructions, and structure that AI assistants need to work effectively with your codebase.

**Why use it?**: Over 60,000 projects use AGENTS.md to improve AI agent understanding.

---

## Standard Sections

### 1. Project Overview

```markdown
## Project Overview

**Purpose**: Brief description of what the project does
**Tech Stack**: Main technologies used
**Status**: Current development status (✅ Active, 🚧 In Development, etc.)
```

### 2. Development Environment

```markdown
## Development Environment

### Prerequisites
- Node.js 18+
- Docker (optional)

### Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
```

### 3. Architecture

```markdown
## Architecture

- **Design Pattern**: MVC, Microservices, etc.
- **Data Flow**: Request → Controller → Service → Database
- **Key Components**: List main components
```

### 4. Common Commands

```markdown
## Common Commands

### Development
\`\`\`bash
npm run dev    # Start dev server
npm run build  # Build for production
npm test       # Run tests
\`\`\`
```

### 5. Key Files

```markdown
## Key Files

- `src/index.ts`: Application entry point
- `src/config/`: Configuration files
- `.env.example`: Environment variables template
```

### 6. Testing Guidelines

```markdown
## Testing Guidelines

### Unit Tests
- Located in `tests/unit/`
- Run with `npm test`

### Integration Tests
- Located in `tests/integration/`
- Require built servers
```

### 7. Code Style

```markdown
## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
```

---

## DevWorkflow Studio AGENTS.md

Our main AGENTS.md is an exemplary reference with:
- 900+ lines of comprehensive documentation
- All standard sections
- MCP tool examples
- Goose recipe usage
- Learning path progression

View it: [`AGENTS.md`](../AGENTS.md)

---

## Example AGENTS.md Files

### Simple API Example

See: [`examples/simple-api/AGENTS.md`](../examples/simple-api/AGENTS.md)

**Highlights**:
- Express + TypeScript API
- RESTful endpoints documentation
- MCP integration examples
- Docker setup

### WebApp Example

See: [`examples/webapp/AGENTS.md`](../examples/webapp/AGENTS.md)

**Highlights**:
- React + Vite application
- Component documentation
- MCP tool usage
- Development workflow

---

## Best Practices

### 1. Be Concise but Complete
- Provide enough context without overwhelming
- Use bullet points and code blocks
- Include examples

### 2. Keep Updated
- Update when architecture changes
- Use `update-docs` recipe to sync
- Include "Last Updated" timestamp

### 3. Think Like an AI
- Provide file paths explicitly
- Explain non-obvious decisions
- Include common gotchas

### 4. Use Standard Formatting
- Follow markdown conventions
- Use headers hierarchy (##, ###)
- Code blocks with language hints

---

## Tools for AGENTS.md

### MCP Tool: generate_readme

```bash
# Via Claude Code or Goose:
"Generate README and AGENTS.md from current codebase"
```

### Recipe: update-docs

```bash
goose run update-docs
```

---

## Templates

### Minimal AGENTS.md

```markdown
# Project Name

## Overview
What the project does.

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Key Files
- `src/index.ts`: Entry point

## Common Commands
- `npm run dev`: Start dev server
```

### Full AGENTS.md

See `templates/AGENTS.md.template` for complete template.

---

## Resources

- [AGENTS.md Official Site](https://agents.md/)
- [DevWorkflow Studio AGENTS.md](../AGENTS.md) - Our exemplar
- [Example Projects](../examples/) - Real-world examples

---

## Updating AGENTS.md

### Manual Updates
1. Edit AGENTS.md directly
2. Update "Last Updated" date
3. Commit changes

### Automated Updates
```bash
# Via Goose recipe
goose run update-docs

# Via MCP tool (through Claude)
"Update AGENTS.md with current project structure"
```

---

## Common Sections to Include

✅ **Essential**:
- Project Overview
- Quick Start
- Key Files
- Common Commands

✅ **Recommended**:
- Architecture
- Testing
- Code Style
- Troubleshooting

⭐ **Optional**:
- API Documentation
- Deployment
- Contributing
- License

---

For more examples, browse the `examples/` directory.
