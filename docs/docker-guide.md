# Docker Guide for DevWorkflow Studio

This guide explains how to use Docker to run and develop DevWorkflow Studio MCP servers.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Start All Services (Production Mode)

```bash
# Build and start all MCP servers
./scripts/docker-build.sh
./scripts/docker-start.sh

# View logs
./scripts/docker-logs.sh
```

### Development Mode

```bash
# Start development environment with hot reload
./scripts/docker-dev.sh
```

### Stop Services

```bash
./scripts/docker-stop.sh
```

## Architecture

The Docker setup includes:

- **Multi-stage build** - Optimized images for production
- **Separate services** - Each MCP server runs in its own container
- **Shared volumes** - Access to workspace for code analysis
- **Development mode** - Hot reload for all servers

## Available Services

### code-quality
Runs the Code Quality MCP server for linting, formatting, and complexity analysis.

```bash
# View logs
docker-compose logs -f code-quality

# Restart service
docker-compose restart code-quality
```

### git-workflow
Runs the Git Workflow MCP server for branch management and PR operations.

```bash
# View logs
docker-compose logs -f git-workflow

# Execute command in container
docker-compose exec git-workflow sh
```

### doc-generator
Runs the Documentation Generator MCP server.

```bash
# View logs
docker-compose logs -f doc-generator
```

### dev
Development environment with all servers in watch mode.

```bash
# Start development environment
docker-compose up dev

# Access shell
docker-compose exec dev sh
```

## Docker Compose Commands

### Build

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build code-quality

# Build without cache
docker-compose build --no-cache
```

### Start/Stop

```bash
# Start all services in background
docker-compose up -d

# Start specific service
docker-compose up -d code-quality

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Logs

```bash
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# View specific service logs
docker-compose logs -f code-quality

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands

```bash
# Execute command in service
docker-compose exec code-quality node --version

# Open shell in service
docker-compose exec code-quality sh

# Run one-off command
docker-compose run --rm code-quality npm test
```

## Development Workflow

### 1. Start Development Environment

```bash
./scripts/docker-dev.sh
```

This starts a container with:
- All source code mounted
- TypeScript in watch mode
- Hot reload enabled
- Development ports exposed

### 2. Make Changes

Edit files on your host machine. Changes are automatically detected and the TypeScript compiler rebuilds.

### 3. Test Changes

```bash
# Run tests in development container
docker-compose exec dev npm test

# Test specific server
docker-compose exec dev npm test --workspace=@devworkflow/code-quality
```

### 4. View Logs

```bash
./scripts/docker-logs.sh
```

## Volume Mounts

### Production Services

```yaml
volumes:
  - ./:/workspace:ro  # Read-only workspace access
```

Production services have read-only access to the workspace for security.

### Development Service

```yaml
volumes:
  - ./:/app  # Full read-write access
  - /app/node_modules  # Exclude node_modules
```

Development service has full access and excludes node_modules to use container's dependencies.

## Environment Variables

### Common Variables

```yaml
NODE_ENV: production  # or development
LOG_LEVEL: info       # debug, info, warn, error
```

### Custom Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
LOG_LEVEL=debug
CUSTOM_VAR=value
```

Reference in docker-compose.yml:

```yaml
environment:
  - NODE_ENV=${NODE_ENV}
  - CUSTOM_VAR=${CUSTOM_VAR}
```

## Networking

All services are on the `mcp-network` bridge network and can communicate:

```bash
# From git-workflow to code-quality
curl http://code-quality:3000/health
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs code-quality

# Check container status
docker-compose ps

# Restart service
docker-compose restart code-quality
```

### Port Already in Use

```bash
# Change ports in docker-compose.yml
ports:
  - "3010:3000"  # Host:Container
```

### Permission Issues

```bash
# Run as current user
docker-compose run --user $(id -u):$(id -g) code-quality sh
```

### Clean Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose build --no-cache
./scripts/docker-start.sh
```

## Production Deployment

### Build for Production

```bash
# Build optimized images
docker-compose build code-quality git-workflow doc-generator
```

### Tag and Push

```bash
# Tag images
docker tag devworkflow-code-quality:latest your-registry/code-quality:v1.0.0

# Push to registry
docker push your-registry/code-quality:v1.0.0
```

### Deploy

```bash
# On production server
docker-compose -f docker-compose.prod.yml up -d
```

## Advanced Configuration

### Custom Dockerfile

Create `docker-compose.override.yml` for local overrides:

```yaml
services:
  code-quality:
    build:
      dockerfile: Dockerfile.custom
```

### Health Checks

Add health checks to services:

```yaml
services:
  code-quality:
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Resource Limits

```yaml
services:
  code-quality:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `docker-build.sh` | Build all Docker images |
| `docker-start.sh` | Start all services (production) |
| `docker-stop.sh` | Stop all services |
| `docker-dev.sh` | Start development environment |
| `docker-logs.sh [service]` | View logs |

## Best Practices

1. **Use .dockerignore** - Exclude unnecessary files from builds
2. **Multi-stage builds** - Keep production images small
3. **Named volumes** - Persist data between restarts
4. **Health checks** - Monitor service health
5. **Resource limits** - Prevent resource exhaustion
6. **Non-root user** - Run containers as non-root
7. **Secrets management** - Use Docker secrets or env files

## Next Steps

- Read [Getting Started](01-getting-started.md)
- Learn about [MCP Basics](02-mcp-basics.md)
- Explore [Goose Recipes](03-goose-recipes.md)
