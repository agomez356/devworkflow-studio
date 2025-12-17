# Simple API - Example Project

## Project Overview

**Purpose**: Educational REST API demonstrating DevWorkflow Studio MCP server integration

**Tech Stack**:
- Runtime: Node.js 18+
- Language: TypeScript 5.3+
- Framework: Express 4.18
- Container: Docker + Docker Compose

**Status**: ✅ Fully functional example (educational purposes)

---

## Development Environment

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional)
- DevWorkflow Studio MCP servers installed

### Quick Start

**Option 1: Local Development**
```bash
npm install
cp .env.example .env
npm run dev
```

**Option 2: Docker Development**
```bash
docker compose up
```

Server runs on `http://localhost:3000`

### MCP Server Integration

This example uses all three DevWorkflow Studio MCP servers:

**Configuration** (in parent `.claude/mcp-config.json`):
- code-quality: Linting and formatting
- git-workflow: Branch management and commits
- doc-generator: Documentation automation

---

## Architecture

### Directory Structure
```
simple-api/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/
│   │   └── users.ts          # User route definitions
│   ├── controllers/
│   │   └── userController.ts # CRUD logic
│   ├── models/
│   │   └── User.ts           # TypeScript interfaces
│   └── middleware/
│       ├── errorHandler.ts   # Global error handler
│       └── logger.ts         # Request logging
├── Dockerfile                # Multi-stage build
├── docker-compose.yml        # Container orchestration
└── package.json              # Dependencies and scripts
```

### Design Patterns
- **MVC Pattern**: Separation of routes, controllers, and models
- **Middleware Chain**: Express middleware for cross-cutting concerns
- **Error Handling**: Centralized error handler with proper status codes
- **Type Safety**: Full TypeScript coverage with strict mode

### Data Flow
```
Request → Logger Middleware → Routes → Controller → Model → Response
                ↓ (on error)
           Error Handler Middleware
```

---

## Common Commands

### Development
```bash
npm run dev          # Start with hot reload (ts-node-dev)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled code
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm test             # Run Jest tests
```

### Docker
```bash
docker compose up                    # Start dev container
docker compose up --profile production  # Start prod container
docker compose down                  # Stop all containers
docker compose logs -f api           # Follow logs
docker compose exec api sh           # Shell into container
```

### Using MCP Tools

**Code Quality:**
```bash
# Via Claude Code or Goose:
"Lint the src directory"          → Uses lint_code tool
"Format all TypeScript files"     → Uses format_code tool
"Analyze controller complexity"   → Uses analyze_complexity tool
```

**Git Workflow:**
```bash
"Create a feature branch for pagination"  → Uses create_branch tool
"Generate a commit message"               → Uses generate_commit_msg tool
```

**Documentation:**
```bash
"Update the README"               → Uses generate_readme tool
"Generate API documentation"      → Uses generate_api_docs tool
```

---

## Key Files

### `src/index.ts`
Main application file. Sets up Express server, middleware, routes, and error handling.

**Key sections**:
- Middleware configuration (cors, json parser, logger)
- Route mounting
- Health check endpoint
- Error handler registration

### `src/routes/users.ts`
Defines RESTful routes for user resource. Maps HTTP methods to controller actions.

**Routes**:
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### `src/controllers/userController.ts`
Business logic for user CRUD operations. Currently uses in-memory array.

**Methods**: getAllUsers, getUserById, createUser, updateUser, deleteUser

**Note**: Replace in-memory storage with database (PostgreSQL, MongoDB) for production.

### `src/models/User.ts`
TypeScript interfaces for type safety.

**Exports**:
- `User`: Main user interface
- `CreateUserDto`: Data transfer object for creation
- `UpdateUserDto`: Data transfer object for updates

### `Dockerfile`
Multi-stage build with development and production targets.

**Stages**:
- `base`: Install deps and build TypeScript
- `production`: Minimal image with only runtime deps
- `development`: Includes dev tools and hot reload

### `docker-compose.yml`
Defines two services:
- `api`: Development server (port 3000)
- `api-prod`: Production server (port 3001, profile-based)

---

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "2025-12-17T..." }
```

### List Users
```
GET /api/users
Response: {
  "success": true,
  "count": 2,
  "data": [{ id, name, email, createdAt }, ...]
}
```

### Get User
```
GET /api/users/:id
Response: { "success": true, "data": { id, name, email, createdAt } }
Error: 404 if not found
```

### Create User
```
POST /api/users
Body: { "name": "John Doe", "email": "john@example.com" }
Response: { "success": true, "data": { id, name, email, createdAt } }
Error: 400 if name or email missing
```

### Update User
```
PUT /api/users/:id
Body: { "name": "Jane Doe" } (partial update)
Response: { "success": true, "data": { id, name, email, createdAt } }
Error: 404 if not found
```

### Delete User
```
DELETE /api/users/:id
Response: { "success": true, "message": "User deleted successfully" }
Error: 404 if not found
```

---

## Testing Guidelines

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Automated Tests
```bash
npm test  # Run Jest tests (to be implemented)
```

### Using MCP Tools for Testing
```bash
# Lint before committing
Use lint_code tool: path="src", linter="auto"

# Check code formatting
Use format_code tool: path="src", write=false

# Analyze complexity
Use analyze_complexity tool: path="src/controllers/userController.ts"
```

---

## Code Style

### TypeScript Conventions
- Use interfaces for data shapes
- Enable strict mode
- Explicit return types on functions
- Async/await over callbacks
- No `any` types

### Naming Conventions
- Files: camelCase (userController.ts)
- Classes: PascalCase (UserController)
- Interfaces: PascalCase (User, CreateUserDto)
- Functions: camelCase (getUserById)
- Constants: UPPER_SNAKE_CASE

### Error Handling
- Use try-catch in async functions
- Pass errors to next() middleware
- Return proper HTTP status codes
- Provide meaningful error messages

---

## Extending the API

### Adding a New Resource

1. **Create Model** (`src/models/Post.ts`)
```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}
```

2. **Create Controller** (`src/controllers/postController.ts`)
```typescript
export class PostController {
  async getAllPosts(req, res, next) { ... }
  // ... other methods
}
```

3. **Create Routes** (`src/routes/posts.ts`)
```typescript
const router = Router();
const postController = new PostController();
router.get('/', postController.getAllPosts);
export { router as postRoutes };
```

4. **Register in Main App** (`src/index.ts`)
```typescript
import { postRoutes } from './routes/posts';
app.use('/api/posts', postRoutes);
```

5. **Use MCP Tools**
```bash
# Lint new code
"Lint the new post files"

# Generate commit
"Generate commit message for new post feature"

# Update docs
"Update README with new posts endpoint"
```

---

## MCP Workflow Examples

### Feature Development Workflow

1. **Create Branch**
   - Use: `create_branch` tool
   - Example: type="feature", name="add-pagination"

2. **Write Code**
   - Implement pagination in userController.ts
   - Add query params to routes

3. **Check Quality**
   - Use: `lint_code` tool on src/
   - Use: `format_code` tool with write=true
   - Use: `analyze_complexity` tool on modified files

4. **Generate Commit**
   - Use: `generate_commit_msg` tool
   - Type: "feat", scope: "api"

5. **Update Docs**
   - Use: `generate_api_docs` tool
   - Use: `update_changelog` tool

### Code Review with MCP

1. **Analyze PR**
   - Use: `analyze_pr` tool

2. **Check Quality**
   - Use: `lint_code` tool
   - Use `code://metrics` resource

3. **Use PR Template**
   - Use: `pr-review-template` prompt

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### TypeScript Build Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Docker Issues
```bash
# Rebuild containers
docker compose build --no-cache

# Remove all containers
docker compose down -v

# Check logs
docker compose logs -f api
```

### MCP Servers Not Working
- Verify servers are built: `npm run build` in root
- Check `.claude/mcp-config.json` paths
- Test servers manually (see MCP_SERVERS_TEST_RESULTS.md)

---

## Production Considerations

**⚠️ This is an educational example. For production:**

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Add JWT or session-based auth
3. **Validation**: Use Joi or Zod for input validation
4. **Rate Limiting**: Implement with express-rate-limit
5. **CORS**: Configure proper allowed origins
6. **Logging**: Use Winston or Pino instead of console.log
7. **Environment**: Use dotenv for configuration
8. **Error Tracking**: Integrate Sentry or similar
9. **Tests**: Add comprehensive unit and integration tests
10. **CI/CD**: Set up GitHub Actions for automated testing

---

## Learning Objectives

This example demonstrates:

✅ Express.js API structure
✅ TypeScript with strict mode
✅ MVC pattern implementation
✅ Docker multi-stage builds
✅ MCP server integration
✅ RESTful API design
✅ Error handling middleware
✅ Request logging
✅ Code quality automation with MCP tools

---

## Next Steps

1. **Add Database**: Integrate PostgreSQL with TypeORM
2. **Add Tests**: Write Jest unit and integration tests
3. **Add Auth**: Implement JWT authentication
4. **Add Validation**: Use Zod for schema validation
5. **Use Goose Recipes**: Automate workflows with recipes from parent project

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [DevWorkflow Studio](../../README.md)
- [MCP Documentation](https://modelcontextprotocol.io)
- [REST API Best Practices](https://restfulapi.net/)

---

**Last Updated**: 2025-12-17
**MCP Integration**: ✅ Fully integrated with DevWorkflow Studio
