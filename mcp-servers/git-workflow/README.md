# Git Workflow MCP Server

MCP server for intelligent Git operations, branch management, and PR workflows.

## Features

### Tools

- **`create_branch`** - Create branches with naming conventions
- **`generate_commit_msg`** - AI-generated commit messages from diff
- **`analyze_pr`** - Analyze PR for common issues and suggestions

### Prompts

- **`pr-review-template`** - Structured PR review prompt template
- **`commit-message-guide`** - Commit message best practices guide

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

Add to your Claude Desktop config (`~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "git-workflow": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"]
    }
  }
}
```

## Tool Examples

### create_branch

```json
{
  "name": "feature/user-authentication",
  "type": "feature",
  "from": "main"
}
```

### generate_commit_msg

```json
{
  "type": "feat",
  "scope": "auth",
  "includeBreaking": false
}
```

### analyze_pr

```json
{
  "prNumber": 123,
  "checkConventions": true
}
```

## Development

```bash
npm install
npm run build
npm run dev    # Watch mode
npm test
```

## Architecture

- **index.ts** - Main MCP server entry point
- **tools/** - Tool implementations
  - **branch-ops.ts** - Branch management
  - **commit-helper.ts** - Commit message generation
  - **pr-analyzer.ts** - PR analysis
- **prompts/** - Prompt templates
  - **pr-review.ts** - PR review template

## License

MIT
