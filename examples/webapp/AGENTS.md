# WebApp - React Example

## Project Overview

**Purpose**: React webapp demonstrating DevWorkflow Studio MCP server integration
**Tech Stack**: React 18, TypeScript 5.3, Vite 5.0, Docker
**Status**: ✅ Fully functional example

## Quick Start

**Local**: `npm install && npm run dev`  
**Docker**: `docker compose up`  
**URL**: http://localhost:5173

## Architecture

- **React Components**: Functional components with hooks
- **State Management**: React useState (local state)
- **Styling**: Modular CSS with light/dark theme support
- **Build Tool**: Vite with HMR (Hot Module Replacement)

## Key Components

- `App.tsx`: Main app component with user state
- `UserList.tsx`: Display and delete users
- `AddUserForm.tsx`: Form for creating users
- `User.ts`: TypeScript type definitions

## MCP Integration

### Using MCP Tools

**Code Quality:**
- "Lint all React components" → lint_code tool
- "Format TypeScript files" → format_code tool
- "Analyze component complexity" → analyze_complexity tool

**Git Workflow:**
- "Create feature branch for search" → create_branch tool
- "Generate commit message" → generate_commit_msg tool

**Documentation:**
- "Update README" → generate_readme tool
- "Generate API docs" → generate_api_docs tool

## Development

```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # ESLint check
npm run format   # Prettier formatting
```

## Docker

```bash
docker compose up                       # Dev server
docker compose --profile production up  # Production build
```

## Project Structure

```
webapp/
├── src/
│   ├── App.tsx              # Main component
│   ├── main.tsx             # Entry point
│   ├── components/          # React components
│   ├── types/               # TypeScript types
│   └── styles/              # CSS modules
├── public/                  # Static assets
├── Dockerfile               # Multi-stage build
└── docker-compose.yml       # Container config
```

## Features

- User CRUD operations
- Responsive design
- Light/dark theme support
- Form validation
- TypeScript strict mode

## Extending

### Add New Component

1. Create `src/components/ComponentName.tsx`
2. Add types in `src/types/`
3. Import in `App.tsx`
4. Use MCP tools: `lint_code`, `format_code`

### Add New Feature

1. Create branch: Use `create_branch` tool
2. Implement feature
3. Lint: Use `lint_code` tool
4. Commit: Use `generate_commit_msg` tool
5. Update docs: Use `generate_readme` tool

## Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [DevWorkflow Studio](../../README.md)
