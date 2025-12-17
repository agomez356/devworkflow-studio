#!/usr/bin/env node

/**
 * Git Workflow MCP Server
 * Provides tools for Git operations, branch management, and PR workflows
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createBranchTool, executeCreateBranch } from "./tools/branch-ops.js";
import { generateCommitMsgTool, executeGenerateCommitMsg } from "./tools/commit-helper.js";
import { analyzePRTool, executeAnalyzePR } from "./tools/pr-analyzer.js";
import { prReviewPrompt, getPRReviewPrompt } from "./prompts/pr-review.js";

// Server configuration
const SERVER_NAME = "git-workflow";
const SERVER_VERSION = "1.0.0";

class GitWorkflowServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [createBranchTool, generateCommitMsgTool, analyzePRTool],
      };
    });

    // Execute tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "create_branch":
            return await executeCreateBranch(args || {});
          case "generate_commit_msg":
            return await executeGenerateCommitMsg(args || {});
          case "analyze_pr":
            return await executeAnalyzePR(args || {});
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Tool execution failed",
                  tool: name,
                  message: errorMessage,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });

    // List prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [prReviewPrompt],
      };
    });

    // Get prompt
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "pr-review-template":
          return getPRReviewPrompt(args);
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`);
  }
}

// Start server
const server = new GitWorkflowServer();
server.run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
