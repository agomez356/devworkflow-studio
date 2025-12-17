# Multi-stage Dockerfile for DevWorkflow Studio MCP Servers

FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    py3-pip \
    bash

# Set working directory
WORKDIR /app

# Copy package files (root and all servers for workspace resolution)
COPY package*.json ./
COPY tsconfig.json ./
COPY mcp-servers/code-quality/package.json ./mcp-servers/code-quality/
COPY mcp-servers/git-workflow/package.json ./mcp-servers/git-workflow/
COPY mcp-servers/doc-generator/package.json ./mcp-servers/doc-generator/

# Install dependencies (workspace-aware)
RUN npm install

# Copy shared modules
COPY mcp-servers/shared ./mcp-servers/shared

# Copy all MCP servers source code
COPY mcp-servers/code-quality ./mcp-servers/code-quality
COPY mcp-servers/git-workflow ./mcp-servers/git-workflow
COPY mcp-servers/doc-generator ./mcp-servers/doc-generator

# Build stage
FROM base AS builder

# Build all TypeScript code
RUN npm run build

# Production stage for code-quality server
FROM node:18-alpine AS code-quality

WORKDIR /app

RUN apk add --no-cache git

# Copy only production dependencies
COPY --from=base /app/package*.json ./
RUN npm install --only=production

# Copy built code-quality server
COPY --from=builder /app/mcp-servers/code-quality/dist ./mcp-servers/code-quality/dist
COPY --from=builder /app/mcp-servers/code-quality/package.json ./mcp-servers/code-quality/
COPY --from=builder /app/mcp-servers/shared ./mcp-servers/shared

WORKDIR /app/mcp-servers/code-quality

CMD ["node", "dist/index.js"]

# Production stage for git-workflow server
FROM node:18-alpine AS git-workflow

WORKDIR /app

RUN apk add --no-cache git

COPY --from=base /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/mcp-servers/git-workflow/dist ./mcp-servers/git-workflow/dist
COPY --from=builder /app/mcp-servers/git-workflow/package.json ./mcp-servers/git-workflow/
COPY --from=builder /app/mcp-servers/shared ./mcp-servers/shared

WORKDIR /app/mcp-servers/git-workflow

CMD ["node", "dist/index.js"]

# Production stage for doc-generator server
FROM node:18-alpine AS doc-generator

WORKDIR /app

RUN apk add --no-cache git

COPY --from=base /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/mcp-servers/doc-generator/dist ./mcp-servers/doc-generator/dist
COPY --from=builder /app/mcp-servers/doc-generator/package.json ./mcp-servers/doc-generator/
COPY --from=builder /app/mcp-servers/shared ./mcp-servers/shared

WORKDIR /app/mcp-servers/doc-generator

CMD ["node", "dist/index.js"]

# Development stage
FROM base AS development

# Install development tools
RUN apk add --no-cache \
    vim \
    curl \
    bash-completion

# Install global development tools
RUN npm install -g nodemon typescript

WORKDIR /app

# Expose ports for development
EXPOSE 3000 3001 3002

CMD ["npm", "run", "dev"]
