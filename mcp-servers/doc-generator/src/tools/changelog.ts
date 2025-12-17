/**
 * Changelog Generator Tool
 * Update CHANGELOG.md from git commits
 */

import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const updateChangelogTool = {
  name: "update_changelog",
  description:
    "Update CHANGELOG.md file from git commits following Keep a Changelog format.",
  inputSchema: {
    type: "object",
    properties: {
      version: {
        type: "string",
        description: "Version number for the changelog entry",
      },
      fromTag: {
        type: "string",
        description: "Start from this git tag (optional)",
      },
      unreleased: {
        type: "boolean",
        description: "Add to [Unreleased] section",
        default: true,
      },
    },
  },
};

async function getCommitsSince(fromTag?: string): Promise<
  Array<{ hash: string; type: string; message: string; date: string }>
> {
  try {
    const range = fromTag ? `${fromTag}..HEAD` : "HEAD";
    const { stdout } = await execAsync(
      `git log ${range} --pretty=format:"%H|%s|%ad" --date=short`
    );

    if (!stdout.trim()) {
      return [];
    }

    return stdout
      .trim()
      .split("\n")
      .map((line) => {
        const [hash, message, date] = line.split("|");
        const typeMatch = message.match(/^(\w+)(\(.+\))?:/);
        const type = typeMatch ? typeMatch[1] : "other";

        return {
          hash: hash.substring(0, 7),
          type,
          message: message.replace(/^(\w+)(\(.+\))?:\s*/, ""),
          date,
        };
      });
  } catch {
    return [];
  }
}

function categorizeCommits(commits: Array<{ type: string; message: string; hash: string }>) {
  const categories: Record<string, Array<{ message: string; hash: string }>> = {
    Added: [],
    Changed: [],
    Fixed: [],
    Deprecated: [],
    Removed: [],
    Security: [],
  };

  commits.forEach((commit) => {
    const entry = { message: commit.message, hash: commit.hash };

    switch (commit.type) {
      case "feat":
        categories.Added.push(entry);
        break;
      case "fix":
        categories.Fixed.push(entry);
        break;
      case "refactor":
      case "perf":
        categories.Changed.push(entry);
        break;
      case "security":
        categories.Security.push(entry);
        break;
      default:
        // Ignore docs, style, test, chore for changelog
        break;
    }
  });

  return categories;
}

function generateChangelogEntry(
  version: string,
  date: string,
  categories: Record<string, Array<{ message: string; hash: string }>>
): string {
  let entry = `## [${version}] - ${date}\n\n`;

  for (const [category, items] of Object.entries(categories)) {
    if (items.length > 0) {
      entry += `### ${category}\n\n`;
      items.forEach((item) => {
        entry += `- ${item.message} (${item.hash})\n`;
      });
      entry += "\n";
    }
  }

  return entry;
}

async function readExistingChangelog(changelogPath: string): Promise<string> {
  try {
    return await fs.readFile(changelogPath, "utf-8");
  } catch {
    return "";
  }
}

function createNewChangelog(): string {
  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

`;
}

export async function executeUpdateChangelog(args: Record<string, any>) {
  const { version, fromTag, unreleased = true } = args;

  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");

  try {
    // Get commits
    const commits = await getCommitsSince(fromTag);

    if (commits.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                message: "No commits found to add to changelog",
                fromTag: fromTag || "beginning",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Categorize commits
    const categories = categorizeCommits(commits);

    // Generate changelog entry
    const today = new Date().toISOString().split("T")[0];
    const versionString = unreleased ? "Unreleased" : version || "Unreleased";
    const entry = generateChangelogEntry(versionString, today, categories);

    // Read existing changelog or create new one
    let changelog = await readExistingChangelog(changelogPath);
    if (!changelog) {
      changelog = createNewChangelog();
    }

    // Insert new entry after the header
    const lines = changelog.split("\n");
    const insertIndex =
      lines.findIndex((line) => line.startsWith("## ")) !== -1
        ? lines.findIndex((line) => line.startsWith("## "))
        : lines.length;

    lines.splice(insertIndex, 0, entry);
    const updatedChangelog = lines.join("\n");

    // Write changelog
    await fs.writeFile(changelogPath, updatedChangelog, "utf-8");

    const result = {
      success: true,
      message: "CHANGELOG.md updated successfully",
      path: changelogPath,
      version: versionString,
      commitsProcessed: commits.length,
      categoriesAdded: Object.values(categories).filter((items) => items.length > 0).length,
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
      `Failed to update changelog: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
