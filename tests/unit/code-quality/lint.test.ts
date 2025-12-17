/**
 * Unit tests for lint_code tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { executeLintCode } from '../../../mcp-servers/code-quality/src/tools/lint';

describe('lint_code tool', () => {
  beforeEach(() => {
    // Setup test environment
  });

  afterEach(() => {
    // Cleanup
  });

  it('should lint JavaScript files with ESLint', async () => {
    const result = await executeLintCode({
      path: 'tests/fixtures/sample.js',
      linter: 'eslint',
      fix: false,
    });

    expect(result).toHaveProperty('success');
    expect(result.content).toBeDefined();
  });

  it('should auto-fix linting issues when fix=true', async () => {
    const result = await executeLintCode({
      path: 'tests/fixtures/sample.js',
      linter: 'eslint',
      fix: true,
    });

    expect(result.success).toBe(true);
  });

  it('should detect linter automatically', async () => {
    const result = await executeLintCode({
      path: 'tests/fixtures/sample.ts',
      linter: 'auto',
      fix: false,
    });

    expect(result).toHaveProperty('linter');
  });

  it('should handle missing files gracefully', async () => {
    await expect(
      executeLintCode({
        path: 'nonexistent/file.js',
        linter: 'auto',
        fix: false,
      })
    ).rejects.toThrow();
  });
});
