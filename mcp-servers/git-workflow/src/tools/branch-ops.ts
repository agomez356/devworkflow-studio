/**
 * Branch Operations Tool
 * Create and manage Git branches with naming conventions
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const createBranchTool = {
  name: "create_branch",
  description:
    "Create a new Git branch with proper naming conventions. Supports feature/, bugfix/, hotfix/, release/ prefixes.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Branch name (without prefix)",
      },
      type: {
        type: "string",
        enum: ["feature", "bugfix", "hotfix", "release", "custom"],
        description: "Type of branch to create",
        default: "feature",
      },
      from: {
        type: "string",
        description: "Base branch to create from (default: current branch)",
      },
      checkout: {
        type: "boolean",
        description: "Checkout the new branch after creation",
        default: true,
      },
    },
    required: ["name"],
  },
};

function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getBranchPrefix(type: string): string {
  switch (type) {
    case "feature":
      return "feature/";
    case "bugfix":
      return "bugfix/";
    case "hotfix":
      return "hotfix/";
    case "release":
      return "release/";
    case "custom":
      return "";
    default:
      return "feature/";
  }
}

export async function executeCreateBranch(args: Record<string, any>) {
  const { name, type = "feature", from, checkout = true } = args;

  if (!name) {
    throw new Error("Missing required parameter: name");
  }

  // Sanitize and format branch name
  const sanitizedName = sanitizeBranchName(name);
  const prefix = getBranchPrefix(type);
  const fullBranchName = `${prefix}${sanitizedName}`;

  try {
    // Check if branch already exists
    const { stdout: existingBranches } = await execAsync("git branch --list");
    if (existingBranches.includes(fullBranchName)) {
      throw new Error(`Branch ${fullBranchName} already exists`);
    }

    // Get current branch
    const { stdout: currentBranch } = await execAsync("git rev-parse --abbrev-ref HEAD");
    const baseBranch = from || currentBranch.trim();

    // Create branch
    await execAsync(`git branch "${fullBranchName}" "${baseBranch}"`);

    // Checkout if requested
    if (checkout) {
      await execAsync(`git checkout "${fullBranchName}"`);
    }

    const result = {
      success: true,
      branch: fullBranchName,
      baseBranch: baseBranch,
      checkedOut: checkout,
      message: checkout
        ? `Created and checked out branch ${fullBranchName} from ${baseBranch}`
        : `Created branch ${fullBranchName} from ${baseBranch}`,
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
      `Failed to create branch: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
