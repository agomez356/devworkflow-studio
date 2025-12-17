/**
 * Unit tests for generate_commit_msg tool
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeGenerateCommitMsg } from '../../../mcp-servers/git-workflow/src/tools/commit-helper';

describe('generate_commit_msg tool', () => {
  beforeEach(() => {
    // Mock git commands
    vi.mock('child_process', () => ({
      exec: vi.fn(),
    }));
  });

  it('should generate commit message with type', async () => {
    const result = await executeGenerateCommitMsg({
      type: 'feat',
      scope: undefined,
      includeBreaking: false,
    });

    expect(result.content[0].text).toContain('feat:');
  });

  it('should include scope in commit message', async () => {
    const result = await executeGenerateCommitMsg({
      type: 'fix',
      scope: 'api',
      includeBreaking: false,
    });

    expect(result.content[0].text).toContain('fix(api):');
  });

  it('should add breaking change footer', async () => {
    const result = await executeGenerateCommitMsg({
      type: 'feat',
      scope: 'auth',
      includeBreaking: true,
    });

    const message = JSON.parse(result.content[0].text);
    expect(message.commitMessage).toContain('BREAKING CHANGE');
  });

  it('should throw error when type is missing', async () => {
    await expect(
      executeGenerateCommitMsg({
        type: undefined as any,
        scope: undefined,
        includeBreaking: false,
      })
    ).rejects.toThrow('Missing required parameter: type');
  });
});
