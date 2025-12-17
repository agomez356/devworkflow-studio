/**
 * Base class for MCP servers
 * Provides common functionality and patterns for all MCP server implementations
 */

import { MCPServerConfig, MCPTool, MCPResource, MCPPrompt, MCPToolResult } from "./types.js";
import { errorResult, logError, safeExecute } from "./error-handling.js";

export abstract class MCPServerBase {
  protected config: MCPServerConfig;
  protected tools: Map<string, MCPTool> = new Map();
  protected resources: Map<string, MCPResource> = new Map();
  protected prompts: Map<string, MCPPrompt> = new Map();

  constructor(config: MCPServerConfig) {
    this.config = config;
    this.initialize();
  }

  /**
   * Initialize the server - register tools, resources, and prompts
   * Must be implemented by subclasses
   */
  protected abstract initialize(): void;

  /**
   * Execute a tool by name
   * Must be implemented by subclasses
   */
  protected abstract executeTool(
    toolName: string,
    params: Record<string, any>
  ): Promise<MCPToolResult>;

  /**
   * Register a tool
   */
  protected registerTool(tool: MCPTool): void {
    if (this.tools.has(tool.name)) {
      console.warn(`Tool ${tool.name} is already registered. Overwriting.`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Register a resource
   */
  protected registerResource(resource: MCPResource): void {
    if (this.resources.has(resource.uri)) {
      console.warn(`Resource ${resource.uri} is already registered. Overwriting.`);
    }
    this.resources.set(resource.uri, resource);
  }

  /**
   * Register a prompt
   */
  protected registerPrompt(prompt: MCPPrompt): void {
    if (this.prompts.has(prompt.name)) {
      console.warn(`Prompt ${prompt.name} is already registered. Overwriting.`);
    }
    this.prompts.set(prompt.name, prompt);
  }

  /**
   * Get all registered tools
   */
  public getTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get all registered resources
   */
  public getResources(): MCPResource[] {
    return Array.from(this.resources.values());
  }

  /**
   * Get all registered prompts
   */
  public getPrompts(): MCPPrompt[] {
    return Array.from(this.prompts.values());
  }

  /**
   * Execute a tool with error handling
   */
  public async execute(toolName: string, params: Record<string, any>): Promise<MCPToolResult> {
    try {
      // Validate tool exists
      if (!this.tools.has(toolName)) {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Execute tool with error handling
      return await safeExecute(
        () => this.executeTool(toolName, params),
        `Tool execution: ${toolName}`
      );
    } catch (error) {
      logError(error as Error, this.config.name);
      return errorResult(error as Error);
    }
  }

  /**
   * Get server information
   */
  public getInfo(): MCPServerConfig {
    return {
      ...this.config,
    };
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    try {
      // Basic health check - can be overridden by subclasses
      return {
        healthy: true,
        message: `${this.config.name} v${this.config.version} is running`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Get resource by URI
   */
  public async getResource(uri: string): Promise<any> {
    const resource = this.resources.get(uri);

    if (!resource) {
      throw new Error(`Resource not found: ${uri}`);
    }

    // This should be implemented by subclasses to fetch actual resource data
    return resource;
  }

  /**
   * Get prompt by name with optional arguments
   */
  public async getPrompt(
    name: string,
    args?: Record<string, string>
  ): Promise<{ messages: Array<{ role: string; content: string }> }> {
    const prompt = this.prompts.get(name);

    if (!prompt) {
      throw new Error(`Prompt not found: ${name}`);
    }

    // This should be implemented by subclasses to generate actual prompt
    return {
      messages: [
        {
          role: "user",
          content: `Prompt: ${name}`,
        },
      ],
    };
  }

  /**
   * Shutdown hook for cleanup
   */
  public async shutdown(): Promise<void> {
    // Override in subclasses if needed
    console.log(`Shutting down ${this.config.name}...`);
  }
}
