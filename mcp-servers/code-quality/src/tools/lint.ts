/**
 * Lint Code Tool
 * Runs linters on code files to detect issues
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

const execAsync = promisify(exec);

export const lintCodeTool = {
  name: "lint_code",
  description:
    "Run linter on specified files or directories. Supports ESLint for JavaScript/TypeScript, Pylint for Python.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File or directory path to lint",
      },
      linter: {
        type: "string",
        enum: ["eslint", "pylint", "auto"],
        description: 'Linter to use. "auto" detects based on file extension',
        default: "auto",
      },
      fix: {
        type: "boolean",
        description: "Attempt to auto-fix issues",
        default: false,
      },
    },
    required: ["path"],
  },
};

async function detectLinter(filePath: string): Promise<string> {
  const ext = path.extname(filePath);
  if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
    return "eslint";
  } else if (ext === ".py") {
    return "pylint";
  }
  return "eslint"; // default
}

async function runESLint(targetPath: string, fix: boolean): Promise<string> {
  try {
    const fixFlag = fix ? "--fix" : "";
    const { stdout, stderr } = await execAsync(`npx eslint ${fixFlag} "${targetPath}" --format json`);

    if (stderr && !stderr.includes("warning")) {
      throw new Error(stderr);
    }

    const results = stdout ? JSON.parse(stdout) : [];
    const totalErrors = results.reduce((sum: number, file: any) => sum + file.errorCount, 0);
    const totalWarnings = results.reduce((sum: number, file: any) => sum + file.warningCount, 0);

    const issues = results.flatMap((file: any) =>
      file.messages.map((msg: any) => ({
        file: file.filePath,
        line: msg.line,
        column: msg.column,
        severity: msg.severity === 2 ? "error" : "warning",
        message: msg.message,
        rule: msg.ruleId,
      }))
    );

    return JSON.stringify(
      {
        linter: "eslint",
        path: targetPath,
        fixed: fix,
        summary: {
          errors: totalErrors,
          warnings: totalWarnings,
          total: totalErrors + totalWarnings,
        },
        issues: issues.slice(0, 50), // Limit to first 50 issues
      },
      null,
      2
    );
  } catch (error) {
    // ESLint exits with code 1 when it finds issues
    if (error instanceof Error && 'stdout' in error) {
      const errorWithOutput = error as Error & { stdout?: string };
      if (errorWithOutput.stdout) {
        try {
          const results = JSON.parse(errorWithOutput.stdout);
          const totalErrors = results.reduce((sum: number, file: any) => sum + file.errorCount, 0);
          const totalWarnings = results.reduce((sum: number, file: any) => sum + file.warningCount, 0);

          const issues = results.flatMap((file: any) =>
            file.messages.map((msg: any) => ({
              file: file.filePath,
              line: msg.line,
              column: msg.column,
              severity: msg.severity === 2 ? "error" : "warning",
              message: msg.message,
              rule: msg.ruleId,
            }))
          );

          return JSON.stringify(
            {
              linter: "eslint",
              path: targetPath,
              fixed: fix,
              summary: {
                errors: totalErrors,
                warnings: totalWarnings,
                total: totalErrors + totalWarnings,
              },
              issues: issues.slice(0, 50),
            },
            null,
            2
          );
        } catch (parseError) {
          throw error;
        }
      }
    }
    throw error;
  }
}

async function runPylint(targetPath: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`pylint "${targetPath}" --output-format=json`);
    const results = JSON.parse(stdout);

    const issues = results.map((issue: any) => ({
      file: issue.path,
      line: issue.line,
      column: issue.column,
      severity: issue.type,
      message: issue.message,
      rule: issue["message-id"],
    }));

    return JSON.stringify(
      {
        linter: "pylint",
        path: targetPath,
        summary: {
          total: issues.length,
        },
        issues: issues.slice(0, 50),
      },
      null,
      2
    );
  } catch (error) {
    throw new Error(`Pylint failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function executeLintCode(args: Record<string, any>) {
  const { path: targetPath, linter = "auto", fix = false } = args;

  if (!targetPath) {
    throw new Error("Missing required parameter: path");
  }

  // Validate path exists
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(`Path does not exist: ${targetPath}`);
  }

  // Determine which linter to use
  const selectedLinter = linter === "auto" ? await detectLinter(targetPath) : linter;

  // Run appropriate linter
  let result: string;
  switch (selectedLinter) {
    case "eslint":
      result = await runESLint(targetPath, fix);
      break;
    case "pylint":
      result = await runPylint(targetPath);
      break;
    default:
      throw new Error(`Unsupported linter: ${selectedLinter}`);
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
