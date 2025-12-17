/**
 * Project Info Resource
 * Provides project metadata and statistics
 */

import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getProjectInfo(): Promise<{
  name: string;
  version: string;
  description: string;
  repository: string | null;
  license: string | null;
  dependencies: number;
  devDependencies: number;
  scripts: string[];
  structure: {
    directories: number;
    files: number;
    sourceFiles: number;
    testFiles: number;
    docFiles: number;
  };
  git: {
    branch: string;
    commits: number;
    contributors: number;
    lastCommit: string;
  } | null;
  generatedAt: string;
}> {
  const projectRoot = process.cwd();

  // Read package.json
  let pkg: any = {};
  try {
    const packagePath = path.join(projectRoot, "package.json");
    const content = await fs.readFile(packagePath, "utf-8");
    pkg = JSON.parse(content);
  } catch {
    // No package.json
  }

  // Analyze project structure
  const structure = await analyzeStructure(projectRoot);

  // Get git info
  const git = await getGitInfo();

  return {
    name: pkg.name || "Unknown",
    version: pkg.version || "0.0.0",
    description: pkg.description || "",
    repository:
      typeof pkg.repository === "string"
        ? pkg.repository
        : pkg.repository?.url || null,
    license: pkg.license || null,
    dependencies: Object.keys(pkg.dependencies || {}).length,
    devDependencies: Object.keys(pkg.devDependencies || {}).length,
    scripts: Object.keys(pkg.scripts || {}),
    structure,
    git,
    generatedAt: new Date().toISOString(),
  };
}

async function analyzeStructure(dir: string): Promise<{
  directories: number;
  files: number;
  sourceFiles: number;
  testFiles: number;
  docFiles: number;
}> {
  const stats = {
    directories: 0,
    files: 0,
    sourceFiles: 0,
    testFiles: 0,
    docFiles: 0,
  };

  async function walk(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        // Skip node_modules, .git, dist, build
        if (["node_modules", ".git", "dist", "build", ".next"].includes(entry.name)) {
          continue;
        }

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          stats.directories++;
          await walk(fullPath);
        } else if (entry.isFile()) {
          stats.files++;

          if (/\.(ts|tsx|js|jsx|py|go|rs)$/.test(entry.name)) {
            if (entry.name.includes("test") || entry.name.includes("spec")) {
              stats.testFiles++;
            } else {
              stats.sourceFiles++;
            }
          } else if (/\.(md|txt)$/i.test(entry.name)) {
            stats.docFiles++;
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  await walk(dir);
  return stats;
}

async function getGitInfo(): Promise<{
  branch: string;
  commits: number;
  contributors: number;
  lastCommit: string;
} | null> {
  try {
    const { stdout: branch } = await execAsync("git rev-parse --abbrev-ref HEAD");
    const { stdout: commitCount } = await execAsync("git rev-list --count HEAD");
    const { stdout: contributors } = await execAsync(
      'git shortlog -sn --all | wc -l'
    );
    const { stdout: lastCommit } = await execAsync(
      'git log -1 --format="%h - %s (%ar)"'
    );

    return {
      branch: branch.trim(),
      commits: parseInt(commitCount.trim()),
      contributors: parseInt(contributors.trim()),
      lastCommit: lastCommit.trim(),
    };
  } catch {
    return null;
  }
}
