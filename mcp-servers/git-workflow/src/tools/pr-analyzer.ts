/**
 * PR Analyzer Tool
 * Analyze pull requests for common issues and best practices
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const analyzePRTool = {
  name: "analyze_pr",
  description:
    "Analyze a pull request for common issues, code quality, and adherence to best practices. Can work with current branch or specific PR number.",
  inputSchema: {
    type: "object",
    properties: {
      prNumber: {
        type: "number",
        description: "PR number to analyze (optional, uses current branch if not provided)",
      },
      baseBranch: {
        type: "string",
        description: "Base branch to compare against",
        default: "main",
      },
      checkConventions: {
        type: "boolean",
        description: "Check commit message conventions",
        default: true,
      },
    },
  },
};

async function getCurrentBranch(): Promise<string> {
  const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD");
  return stdout.trim();
}

async function getDiffStats(baseBranch: string, currentBranch: string): Promise<{
  filesChanged: number;
  additions: number;
  deletions: number;
  files: string[];
}> {
  const { stdout: diffStat } = await execAsync(
    `git diff --shortstat ${baseBranch}...${currentBranch}`
  );
  const { stdout: filesList } = await execAsync(
    `git diff --name-only ${baseBranch}...${currentBranch}`
  );

  const files = filesList.trim().split("\n").filter(Boolean);
  const match = diffStat.match(/(\d+) files? changed(?:, (\d+) insertions?)?(?:, (\d+) deletions?)?/);

  return {
    filesChanged: match ? parseInt(match[1]) : 0,
    additions: match && match[2] ? parseInt(match[2]) : 0,
    deletions: match && match[3] ? parseInt(match[3]) : 0,
    files,
  };
}

async function getCommits(baseBranch: string, currentBranch: string): Promise<
  Array<{ hash: string; message: string; author: string }>
> {
  const { stdout } = await execAsync(
    `git log ${baseBranch}..${currentBranch} --pretty=format:"%H|%s|%an"`
  );

  if (!stdout.trim()) {
    return [];
  }

  return stdout
    .trim()
    .split("\n")
    .map((line) => {
      const [hash, message, author] = line.split("|");
      return { hash, message, author };
    });
}

function checkCommitConventions(commits: Array<{ message: string }>): {
  compliant: boolean;
  issues: string[];
} {
  const conventionalPattern = /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?!?: .+/;
  const issues: string[] = [];

  commits.forEach((commit, index) => {
    if (!conventionalPattern.test(commit.message)) {
      issues.push(`Commit ${index + 1}: "${commit.message}" doesn't follow Conventional Commits`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
}

function analyzeFileChanges(files: string[]): {
  categories: Record<string, number>;
  warnings: string[];
} {
  const categories: Record<string, number> = {
    source: 0,
    tests: 0,
    docs: 0,
    config: 0,
    other: 0,
  };

  const warnings: string[] = [];

  files.forEach((file) => {
    if (file.match(/\.(ts|tsx|js|jsx|py|go|rs)$/) && !file.includes("test")) {
      categories.source++;
    } else if (file.includes("test") || file.includes("spec")) {
      categories.tests++;
    } else if (file.match(/\.(md|txt)$/i) || file.includes("README")) {
      categories.docs++;
    } else if (
      file.includes("package.json") ||
      file.includes("tsconfig") ||
      file.includes("docker") ||
      file.includes("config")
    ) {
      categories.config++;
    } else {
      categories.other++;
    }
  });

  // Generate warnings
  if (categories.source > 0 && categories.tests === 0) {
    warnings.push("⚠️  No test files modified despite source code changes");
  }

  if (categories.source > 20) {
    warnings.push("⚠️  Large number of source files changed - consider breaking into smaller PRs");
  }

  if (categories.docs === 0 && categories.source > 5) {
    warnings.push("⚠️  No documentation updated despite significant code changes");
  }

  return { categories, warnings };
}

export async function executeAnalyzePR(args: Record<string, any>) {
  const { prNumber, baseBranch = "main", checkConventions = true } = args;

  try {
    // Get current branch if PR number not provided
    const currentBranch = await getCurrentBranch();

    if (currentBranch === baseBranch) {
      throw new Error(`Currently on base branch (${baseBranch}). Switch to a feature branch first.`);
    }

    // Get diff stats
    const diffStats = await getDiffStats(baseBranch, currentBranch);

    // Get commits
    const commits = await getCommits(baseBranch, currentBranch);

    // Check commit conventions
    const conventionCheck = checkConventions
      ? checkCommitConventions(commits)
      : { compliant: true, issues: [] };

    // Analyze file changes
    const fileAnalysis = analyzeFileChanges(diffStats.files);

    // Calculate complexity score (simple heuristic)
    const complexityScore = Math.min(
      100,
      diffStats.filesChanged * 2 + (diffStats.additions + diffStats.deletions) / 10
    );

    let complexity: string;
    if (complexityScore < 30) complexity = "Low";
    else if (complexityScore < 60) complexity = "Moderate";
    else if (complexityScore < 80) complexity = "High";
    else complexity = "Very High";

    const result = {
      success: true,
      branch: currentBranch,
      baseBranch,
      prNumber: prNumber || null,
      stats: {
        commits: commits.length,
        filesChanged: diffStats.filesChanged,
        additions: diffStats.additions,
        deletions: diffStats.deletions,
        complexity,
        complexityScore: Math.round(complexityScore),
      },
      fileCategories: fileAnalysis.categories,
      commits: commits.map((c) => ({ hash: c.hash.substring(0, 7), message: c.message })),
      conventionalCommits: conventionCheck,
      warnings: fileAnalysis.warnings,
      recommendations: [
        diffStats.filesChanged > 20 && "Consider splitting into smaller, focused PRs",
        commits.length > 10 && "Consider squashing commits for cleaner history",
        !conventionCheck.compliant && "Update commit messages to follow Conventional Commits",
        fileAnalysis.categories.tests === 0 &&
          fileAnalysis.categories.source > 0 &&
          "Add tests for code changes",
      ].filter(Boolean),
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
      `Failed to analyze PR: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
