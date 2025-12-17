/**
 * README Generator Tool
 * Generate or update README.md files from project structure
 */

import * as fs from "fs/promises";
import * as path from "path";

export const generateReadmeTool = {
  name: "generate_readme",
  description:
    "Generate or update README.md file based on project structure, package.json, and existing documentation.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Path to the project directory",
        default: ".",
      },
      sections: {
        type: "array",
        items: { type: "string" },
        description: "Sections to include: features, installation, usage, api, contributing",
        default: ["features", "installation", "usage"],
      },
      overwrite: {
        type: "boolean",
        description: "Overwrite existing README.md",
        default: false,
      },
    },
  },
};

async function readPackageJson(projectPath: string): Promise<any> {
  try {
    const packagePath = path.join(projectPath, "package.json");
    const content = await fs.readFile(packagePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function analyzeProjectStructure(projectPath: string): Promise<{
  hasTests: boolean;
  hasDocs: boolean;
  hasDocker: boolean;
  mainDirs: string[];
}> {
  try {
    const entries = await fs.readdir(projectPath, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    return {
      hasTests: dirs.some((d) => d.includes("test") || d.includes("spec")),
      hasDocs: dirs.includes("docs") || dirs.includes("documentation"),
      hasDocker:
        entries.some((e) => e.name === "Dockerfile") ||
        entries.some((e) => e.name === "docker-compose.yml"),
      mainDirs: dirs
        .filter((d) => !d.startsWith(".") && !["node_modules", "dist", "build"].includes(d))
        .slice(0, 5),
    };
  } catch {
    return {
      hasTests: false,
      hasDocs: false,
      hasDocker: false,
      mainDirs: [],
    };
  }
}

function generateReadmeContent(
  pkg: any,
  structure: { hasTests: boolean; hasDocs: boolean; hasDocker: boolean; mainDirs: string[] },
  sections: string[]
): string {
  const projectName = pkg?.name || "Project";
  const description = pkg?.description || "Add project description";
  const version = pkg?.version || "1.0.0";

  let content = `# ${projectName}

> ${description}

**Version:** ${version}

`;

  if (sections.includes("features")) {
    content += `## Features

- Feature 1
- Feature 2
- Feature 3

`;
  }

  if (sections.includes("installation")) {
    content += `## Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${projectName}

# Install dependencies
npm install
`;

    if (structure.hasDocker) {
      content += `
# Or use Docker
docker-compose up -d
`;
    }

    content += `\`\`\`

`;
  }

  if (sections.includes("usage")) {
    content += `## Usage

\`\`\`bash
# Start the application
npm start

# Run in development mode
npm run dev
\`\`\`

`;
  }

  if (sections.includes("api") && pkg?.main) {
    content += `## API

Main entry point: \`${pkg.main}\`

See [API Documentation](./docs/api.md) for details.

`;
  }

  if (sections.includes("contributing")) {
    content += `## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

`;
  }

  // Add project structure
  if (structure.mainDirs.length > 0) {
    content += `## Project Structure

\`\`\`
${projectName}/
${structure.mainDirs.map((dir) => `├── ${dir}/`).join("\n")}
\`\`\`

`;
  }

  // Add badges if package.json has relevant info
  if (pkg?.license) {
    content += `## License

${pkg.license}

`;
  }

  return content;
}

export async function executeGenerateReadme(args: Record<string, any>) {
  const { projectPath = ".", sections = ["features", "installation", "usage"], overwrite = false } =
    args;

  try {
    // Check if README exists
    const readmePath = path.join(projectPath, "README.md");
    const readmeExists = await fs
      .access(readmePath)
      .then(() => true)
      .catch(() => false);

    if (readmeExists && !overwrite) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                message: "README.md already exists. Use overwrite:true to replace it.",
                path: readmePath,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Read project information
    const pkg = await readPackageJson(projectPath);
    const structure = await analyzeProjectStructure(projectPath);

    // Generate README content
    const content = generateReadmeContent(pkg, structure, sections);

    // Write README
    await fs.writeFile(readmePath, content, "utf-8");

    const result = {
      success: true,
      message: readmeExists ? "README.md updated successfully" : "README.md created successfully",
      path: readmePath,
      sections,
      projectName: pkg?.name || "Unknown",
      linesGenerated: content.split("\n").length,
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
      `Failed to generate README: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
