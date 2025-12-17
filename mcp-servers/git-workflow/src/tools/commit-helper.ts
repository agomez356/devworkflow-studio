/**
 * Commit Helper Tool
 * Generate semantic commit messages from staged changes
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const generateCommitMsgTool = {
  name: "generate_commit_msg",
  description:
    "Generate semantic commit message from staged changes following Conventional Commits specification.",
  inputSchema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf"],
        description: "Type of change",
      },
      scope: {
        type: "string",
        description: "Scope of the change (optional)",
      },
      includeBreaking: {
        type: "boolean",
        description: "Include breaking change footer",
        default: false,
      },
    },
    required: ["type"],
  },
};

async function getStagedDiff(): Promise<string> {
  try {
    const { stdout } = await execAsync("git diff --staged");
    return stdout;
  } catch (error) {
    throw new Error("Failed to get staged diff. Are there any staged changes?");
  }
}

async function getStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync("git diff --staged --name-only");
    return stdout.trim().split("\n").filter(Boolean);
  } catch (error) {
    return [];
  }
}

function analyzeChanges(diff: string, files: string[]): {
  additions: number;
  deletions: number;
  filesChanged: number;
  summary: string;
} {
  const lines = diff.split("\n");
  const additions = lines.filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .length;
  const deletions = lines.filter((line) => line.startsWith("-") && !line.startsWith("---"))
    .length;

  // Simple summary based on file patterns
  const hasTests = files.some((f) => f.includes("test") || f.includes("spec"));
  const hasDocs = files.some((f) => f.includes("README") || f.endsWith(".md"));
  const hasConfig = files.some(
    (f) =>
      f.includes("config") ||
      f.includes("package.json") ||
      f.includes("tsconfig") ||
      f.includes("docker")
  );

  let summary = `Modified ${files.length} file${files.length > 1 ? "s" : ""}`;
  if (hasTests) summary += ", including tests";
  if (hasDocs) summary += ", including documentation";
  if (hasConfig) summary += ", including configuration";

  return {
    additions,
    deletions,
    filesChanged: files.length,
    summary,
  };
}

function generateDescription(
  type: string,
  scope: string | undefined
): string {
  const descriptions: Record<string, string> = {
    feat: "Add new feature",
    fix: "Fix bug or issue",
    docs: "Update documentation",
    style: "Improve code style",
    refactor: "Refactor code",
    test: "Add or update tests",
    chore: "Update build or auxiliary tool",
    perf: "Improve performance",
  };

  const baseDesc = descriptions[type] || "Make changes";
  return scope ? `${baseDesc} in ${scope}` : baseDesc;
}

export async function executeGenerateCommitMsg(args: Record<string, any>) {
  const { type, scope, includeBreaking = false } = args;

  if (!type) {
    throw new Error("Missing required parameter: type");
  }

  try {
    // Get staged changes
    const diff = await getStagedDiff();
    const files = await getStagedFiles();

    if (files.length === 0) {
      throw new Error("No staged changes found. Stage your changes first with: git add");
    }

    // Analyze changes
    const analysis = analyzeChanges(diff, files);

    // Generate commit message
    const scopePart = scope ? `(${scope})` : "";
    const breakingPart = includeBreaking ? "!" : "";
    const description = generateDescription(type, scope);

    const commitMessage = `${type}${scopePart}${breakingPart}: ${description}

${analysis.summary}

Changes:
${files.map((f) => `- ${f}`).join("\n")}

Stats: +${analysis.additions} -${analysis.deletions}`;

    const breakingFooter = includeBreaking
      ? "\n\nBREAKING CHANGE: [Describe the breaking change here]"
      : "";

    const fullMessage = commitMessage + breakingFooter;

    const result = {
      success: true,
      commitMessage: fullMessage,
      type,
      scope: scope || null,
      filesChanged: analysis.filesChanged,
      additions: analysis.additions,
      deletions: analysis.deletions,
      suggestedCommand: `git commit -m "${type}${scopePart}${breakingPart}: ${description}"`,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Failed to generate commit message: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
