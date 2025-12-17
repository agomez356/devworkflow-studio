/**
 * Format Code Tool
 * Formats code files using Prettier, Black, etc.
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

const execAsync = promisify(exec);

export const formatCodeTool = {
  name: "format_code",
  description:
    "Format code files using Prettier for JS/TS, Black for Python. Can check formatting or write changes.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File or directory path to format",
      },
      formatter: {
        type: "string",
        enum: ["prettier", "black", "auto"],
        description: 'Formatter to use. "auto" detects based on file type',
        default: "auto",
      },
      write: {
        type: "boolean",
        description: "Write formatted code to files (true) or just check (false)",
        default: false,
      },
    },
    required: ["path"],
  },
};

async function detectFormatter(filePath: string): Promise<string> {
  const ext = path.extname(filePath);
  if ([".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".css", ".html"].includes(ext)) {
    return "prettier";
  } else if (ext === ".py") {
    return "black";
  }
  return "prettier"; // default
}

async function runPrettier(targetPath: string, write: boolean): Promise<string> {
  try {
    const writeFlag = write ? "--write" : "--check";
    const { stdout } = await execAsync(`npx prettier ${writeFlag} "${targetPath}"`);

    if (write) {
      return JSON.stringify(
        {
          formatter: "prettier",
          path: targetPath,
          action: "formatted",
          message: "Code formatted successfully",
          output: stdout || "Files formatted",
        },
        null,
        2
      );
    } else {
      return JSON.stringify(
        {
          formatter: "prettier",
          path: targetPath,
          action: "checked",
          message: "Code is properly formatted",
          output: stdout || "All files formatted correctly",
        },
        null,
        2
      );
    }
  } catch (error) {
    if (error instanceof Error && 'stdout' in error) {
      const errorWithOutput = error as Error & { stdout?: string; stderr?: string };
      // Prettier exits with code 1 when files need formatting (in check mode)
      if (!write && errorWithOutput.stderr?.includes("Code style issues")) {
        return JSON.stringify(
          {
            formatter: "prettier",
            path: targetPath,
            action: "checked",
            needsFormatting: true,
            message: "Code needs formatting",
            output: errorWithOutput.stdout || errorWithOutput.stderr,
          },
          null,
          2
        );
      }
    }
    throw new Error(`Prettier failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runBlack(targetPath: string, write: boolean): Promise<string> {
  try {
    const checkFlag = write ? "" : "--check";
    const { stdout, stderr } = await execAsync(`black ${checkFlag} "${targetPath}"`);

    return JSON.stringify(
      {
        formatter: "black",
        path: targetPath,
        action: write ? "formatted" : "checked",
        message: write ? "Code formatted successfully" : "Code is properly formatted",
        output: stdout || stderr || "Success",
      },
      null,
      2
    );
  } catch (error) {
    if (error instanceof Error && 'stdout' in error) {
      const errorWithOutput = error as Error & { stdout?: string };
      // Black exits with code 1 when files need formatting (in check mode)
      if (!write && errorWithOutput.stdout) {
        return JSON.stringify(
          {
            formatter: "black",
            path: targetPath,
            action: "checked",
            needsFormatting: true,
            message: "Code needs formatting",
            output: errorWithOutput.stdout,
          },
          null,
          2
        );
      }
    }
    throw new Error(`Black failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function executeFormatCode(args: Record<string, any>) {
  const { path: targetPath, formatter = "auto", write = false } = args;

  if (!targetPath) {
    throw new Error("Missing required parameter: path");
  }

  // Validate path exists
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(`Path does not exist: ${targetPath}`);
  }

  // Determine which formatter to use
  const selectedFormatter =
    formatter === "auto" ? await detectFormatter(targetPath) : formatter;

  // Run appropriate formatter
  let result: string;
  switch (selectedFormatter) {
    case "prettier":
      result = await runPrettier(targetPath, write);
      break;
    case "black":
      result = await runBlack(targetPath, write);
      break;
    default:
      throw new Error(`Unsupported formatter: ${selectedFormatter}`);
  }

  return {
    content: [
      {
        type: "text",
        text: result,
      },
    ],
  };
}
