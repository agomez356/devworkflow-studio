# Multi-stage build for Simple API Example

FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm install --only=production

# Copy built code from base
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]

# Development stage
FROM base AS development

# Install dev tools
RUN npm install -g nodemon ts-node-dev

# Expose port
EXPOSE 3000

# Start in dev mode with hot reload
CMD ["npm", "run", "dev"]
