#!/usr/bin/env node

/**
 * Doc Generator MCP Server
 * Provides tools for automated documentation generation and maintenance
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { generateReadmeTool, executeGenerateReadme } from "./tools/readme-gen.js";
import { generateApiDocsTool, executeGenerateApiDocs } from "./tools/api-docs.js";
import { updateChangelogTool, executeUpdateChangelog } from "./tools/changelog.js";
import { getProjectInfo } from "./resources/project-info.js";

// Server configuration
const SERVER_NAME = "doc-generator";
const SERVER_VERSION = "1.0.0";

class DocGeneratorServer {
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
        tools: [generateReadmeTool, generateApiDocsTool, updateChangelogTool],
      };
    });

    // Execute tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "generate_readme":
            return await executeGenerateReadme(args || {});
          case "generate_api_docs":
            return await executeGenerateApiDocs(args || {});
          case "update_changelog":
            return await executeUpdateChangelog(args || {});
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
            uri: "docs://project-info",
            name: "Project Information",
            description: "Project metadata, statistics, and structure",
            mimeType: "application/json",
          },
        ],
      };
    });

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === "docs://project-info") {
        const projectInfo = await getProjectInfo();
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(projectInfo, null, 2),
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
const server = new DocGeneratorServer();
server.run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
