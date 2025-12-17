# DevWorkflow Studio Tests

## Test Structure

```
tests/
├── unit/              # Unit tests for individual tools
│   ├── code-quality/
│   ├── git-workflow/
│   └── doc-generator/
├── integration/       # Integration tests for MCP servers
├── fixtures/          # Test fixtures and sample files
└── setup.ts          # Test utilities and setup
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- tests/unit
```

### Integration Tests Only
```bash
npm test -- tests/integration
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm run test:coverage
```

## Test Categories

### Unit Tests
- Test individual MCP tools in isolation
- Mock external dependencies (git, filesystem, etc.)
- Fast execution (<1s per test)
- Located in `tests/unit/`

### Integration Tests
- Test complete MCP server startup and protocol
- Test tool execution end-to-end
- Slower execution (1-5s per test)
- Located in `tests/integration/`

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { executeLintCode } from '../../../mcp-servers/code-quality/src/tools/lint';

describe('lint_code tool', () => {
  it('should lint JavaScript files', async () => {
    const result = await executeLintCode({
      path: 'tests/fixtures/sample.js',
      linter: 'eslint',
      fix: false,
    });

    expect(result.success).toBe(true);
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest';

describe('MCP Server', () => {
  it('should respond to tools/list', async () => {
    const response = await sendMCPRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {},
    });

    expect(response.result.tools).toBeDefined();
  });
});
```

## Test Fixtures

Sample files for testing are located in `tests/fixtures/`:
- `sample.ts` - TypeScript code for linting/formatting tests
- `sample.js` - JavaScript code for testing
- More fixtures as needed

## CI/CD Integration

Tests run automatically on:
- Every push to main
- Pull requests
- Pre-commit hooks (optional)

See `.github/workflows/test.yml` for CI configuration.

## Coverage Goals

- Unit tests: >80% coverage
- Integration tests: Cover all MCP protocol operations
- E2E tests: Cover all major workflows

## Known Issues

- Integration tests require built MCP servers (`npm run build`)
- Some tests require Git repository context
- File system tests may be platform-specific

## Contributing

When adding new tools or features:
1. Add unit tests for the tool logic
2. Add integration test for MCP protocol handling
3. Update test fixtures if needed
4. Ensure tests pass before committing
