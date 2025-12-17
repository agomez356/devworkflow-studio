#!/usr/bin/env node

/**
 * Code Quality MCP Server
 * Provides tools for code analysis, linting, formatting, and quality metrics
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { lintCodeTool, executeLintCode } from "./tools/lint.js";
import { formatCodeTool, executeFormatCode } from "./tools/format.js";
import { analyzeComplexityTool, executeAnalyzeComplexity } from "./tools/analyze.js";

// Server configuration
const SERVER_NAME = "code-quality";
const SERVER_VERSION = "1.0.0";

class CodeQualityServer {
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
          resources: {},
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
        tools: [lintCodeTool, formatCodeTool, analyzeComplexityTool],
      };
    });

    // Execute tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "lint_code":
            return await executeLintCode(args || {});
          case "format_code":
            return await executeFormatCode(args || {});
          case "analyze_complexity":
            return await executeAnalyzeComplexity(args || {});
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

    // List resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "code://metrics",
            name: "Code Metrics",
            description: "Current project code quality metrics",
            mimeType: "application/json",
          },
        ],
      };
    });

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === "code://metrics") {
        // In a real implementation, this would calculate actual metrics
        const metrics = {
          linesOfCode: 0,
          complexity: 0,
          coverage: 0,
          lastAnalyzed: new Date().toISOString(),
        };

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
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
const server = new CodeQualityServer();
server.run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
