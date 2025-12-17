# Code Quality MCP Server

MCP server for code quality analysis, linting, formatting, and complexity metrics.

## Features

### Tools

- **`lint_code`** - Run linters (ESLint, Pylint) on code files
- **`format_code`** - Format code with Prettier, Black, etc.
- **`analyze_complexity`** - Calculate cyclomatic complexity of code
- **`check_coverage`** - Get test coverage metrics

### Resources

- **`code://metrics`** - Current project code metrics

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
    "code-quality": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"]
    }
  }
}
```

### Standalone Testing

```bash
# Build the server
npm run build

# Run the server
node dist/index.js
```

## Tool Examples

### lint_code

```json
{
  "path": "./src/index.ts",
  "linter": "eslint",
  "fix": false
}
```

### format_code

```json
{
  "path": "./src",
  "formatter": "prettier",
  "write": true
}
```

### analyze_complexity

```json
{
  "path": "./src/index.ts"
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## Architecture

- **index.ts** - Main MCP server entry point
- **tools/** - Tool implementations
  - **lint.ts** - Linting tool
  - **format.ts** - Formatting tool
  - **analyze.ts** - Complexity analysis tool

## License

MIT
