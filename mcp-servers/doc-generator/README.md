# Doc Generator MCP Server

MCP server for automated documentation generation, README creation, and changelog management.

## Features

### Tools

- **`generate_readme`** - Generate or update README from code structure
- **`generate_api_docs`** - Generate API documentation from code
- **`update_changelog`** - Update CHANGELOG from git commits

### Resources

- **`docs://project-info`** - Project metadata and statistics

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
    "doc-generator": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"]
    }
  }
}
```

## Tool Examples

### generate_readme

```json
{
  "projectPath": "./",
  "sections": ["features", "installation", "usage", "api"],
  "overwrite": false
}
```

### generate_api_docs

```json
{
  "inputPath": "./src",
  "outputPath": "./docs/api",
  "format": "markdown"
}
```

### update_changelog

```json
{
  "version": "1.0.0",
  "fromTag": "v0.9.0",
  "unreleased": true
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
  - **readme-gen.ts** - README generation
  - **api-docs.ts** - API documentation
  - **changelog.ts** - CHANGELOG management
- **resources/** - Resource providers
  - **project-info.ts** - Project metadata

## License

MIT
