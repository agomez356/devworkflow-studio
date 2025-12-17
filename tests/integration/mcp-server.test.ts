/**
 * Integration tests for MCP servers
 * Tests complete server startup, protocol handling, and tool execution
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';

describe('MCP Server Integration Tests', () => {
  let codeQualityServer: ChildProcess;
  let gitWorkflowServer: ChildProcess;
  let docGeneratorServer: ChildProcess;

  beforeAll(async () => {
    // Start MCP servers
    codeQualityServer = spawn('node', [
      'mcp-servers/code-quality/dist/index.js',
    ]);
    gitWorkflowServer = spawn('node', [
      'mcp-servers/git-workflow/dist/index.js',
    ]);
    docGeneratorServer = spawn('node', [
      'mcp-servers/doc-generator/dist/index.js',
    ]);

    // Wait for servers to start
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    // Stop servers
    codeQualityServer?.kill();
    gitWorkflowServer?.kill();
    docGeneratorServer?.kill();
  });

  describe('Code Quality Server', () => {
    it('should respond to tools/list request', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendMCPRequest(codeQualityServer, request);
      expect(response).toHaveProperty('result');
      expect(response.result.tools).toBeInstanceOf(Array);
      expect(response.result.tools.length).toBeGreaterThan(0);
    });

    it('should execute lint_code tool', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'lint_code',
          arguments: {
            path: 'tests/fixtures/sample.ts',
            linter: 'auto',
            fix: false,
          },
        },
      };

      const response = await sendMCPRequest(codeQualityServer, request);
      expect(response).toHaveProperty('result');
    });
  });

  describe('Git Workflow Server', () => {
    it('should list available tools', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/list',
        params: {},
      };

      const response = await sendMCPRequest(gitWorkflowServer, request);
      expect(response.result.tools).toContainEqual(
        expect.objectContaining({ name: 'create_branch' })
      );
      expect(response.result.tools).toContainEqual(
        expect.objectContaining({ name: 'generate_commit_msg' })
      );
    });

    it('should list available prompts', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 4,
        method: 'prompts/list',
        params: {},
      };

      const response = await sendMCPRequest(gitWorkflowServer, request);
      expect(response.result.prompts).toContainEqual(
        expect.objectContaining({ name: 'pr-review-template' })
      );
    });
  });

  describe('Doc Generator Server', () => {
    it('should expose project-info resource', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 5,
        method: 'resources/list',
        params: {},
      };

      const response = await sendMCPRequest(docGeneratorServer, request);
      expect(response.result.resources).toContainEqual(
        expect.objectContaining({ uri: 'docs://project-info' })
      );
    });

    it('should generate README', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: {
          name: 'generate_readme',
          arguments: {
            path: '.',
            sections: ['overview', 'installation'],
          },
        },
      };

      const response = await sendMCPRequest(docGeneratorServer, request);
      expect(response).toHaveProperty('result');
    });
  });
});

/**
 * Helper function to send MCP request and get response
 */
async function sendMCPRequest(
  server: ChildProcess,
  request: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 5000);

    server.stdout?.once('data', (data) => {
      clearTimeout(timeout);
      try {
        const response = JSON.parse(data.toString());
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

    server.stdin?.write(JSON.stringify(request) + '\n');
  });
}
