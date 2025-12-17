# Simple API Example

A minimal REST API demonstrating DevWorkflow Studio MCP server integration.

## Quick Start

### Local Development
```bash
npm install
cp .env.example .env
npm run dev
```

### Docker Development
```bash
docker compose up
```

Server: `http://localhost:3000`

## Features

- ✅ Express + TypeScript
- ✅ CRUD operations for users
- ✅ Docker multi-stage build
- ✅ MCP server integration
- ✅ Error handling middleware
- ✅ Request logging

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## MCP Integration

This example works with DevWorkflow Studio MCP servers:

- **code-quality**: Lint and format code
- **git-workflow**: Branch and commit automation
- **doc-generator**: Auto-generate documentation

See `AGENTS.md` for detailed usage.

## Documentation

- **AGENTS.md** - Complete project documentation
- **.goosehints** - Context for Goose AI
- **Parent README** - DevWorkflow Studio overview

## License

MIT
