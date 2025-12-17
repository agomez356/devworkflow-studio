/**
 * Error handling utilities for MCP servers
 */

import { MCPError, MCPToolResult } from "./types.js";

export class ValidationError extends MCPError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class ExecutionError extends MCPError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "EXECUTION_ERROR", details);
    this.name = "ExecutionError";
  }
}

export class ResourceNotFoundError extends MCPError {
  constructor(resource: string, details?: Record<string, any>) {
    super(`Resource not found: ${resource}`, "RESOURCE_NOT_FOUND", details);
    this.name = "ResourceNotFoundError";
  }
}

/**
 * Wraps a function execution with error handling
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  errorContext?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof MCPError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    const context = errorContext ? `${errorContext}: ${message}` : message;

    throw new ExecutionError(context, {
      originalError: error instanceof Error ? error.stack : undefined,
    });
  }
}

/**
 * Validates required parameters
 */
export function validateRequired(
  params: Record<string, any>,
  required: string[]
): void {
  const missing = required.filter((key) => !(key in params) || params[key] === undefined);

  if (missing.length > 0) {
    throw new ValidationError(`Missing required parameters: ${missing.join(", ")}`, {
      missing,
      provided: Object.keys(params),
    });
  }
}

/**
 * Validates parameter types
 */
export function validateTypes(
  params: Record<string, any>,
  schema: Record<string, string>
): void {
  const errors: string[] = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    if (key in params) {
      const actualType = typeof params[key];
      if (actualType !== expectedType) {
        errors.push(`${key}: expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Type validation failed: ${errors.join("; ")}`, {
      errors,
    });
  }
}

/**
 * Creates a success tool result
 */
export function successResult(text: string): MCPToolResult {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

/**
 * Creates an error tool result
 */
export function errorResult(error: Error | MCPError): MCPToolResult {
  const errorData = error instanceof MCPError ? error.toJSON() : {
    error: error.name,
    message: error.message,
    stack: error.stack,
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(errorData, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Sanitizes file paths to prevent path traversal
 */
export function sanitizePath(path: string, allowedDir?: string): string {
  // Remove any .. or absolute paths
  const normalized = path.replace(/\.\./g, "").replace(/^\/+/, "");

  if (allowedDir && !normalized.startsWith(allowedDir)) {
    throw new ValidationError(`Path must be within ${allowedDir}`, {
      provided: path,
      normalized,
    });
  }

  return normalized;
}

/**
 * Logs errors consistently
 */
export function logError(error: Error | MCPError, context?: string): void {
  const prefix = context ? `[${context}]` : "";
  console.error(`${prefix} Error:`, error.message);

  if (error instanceof MCPError && error.details) {
    console.error("Details:", error.details);
  }

  if (error.stack) {
    console.error("Stack:", error.stack);
  }
}
