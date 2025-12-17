/**
 * API Documentation Generator Tool
 * Generate API documentation from code
 */

import * as fs from "fs/promises";
import * as path from "path";

export const generateApiDocsTool = {
  name: "generate_api_docs",
  description:
    "Generate API documentation from source code. Analyzes functions, classes, and exports.",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to source code directory",
        default: "./src",
      },
      outputPath: {
        type: "string",
        description: "Path to output documentation",
        default: "./docs/api",
      },
      format: {
        type: "string",
        enum: ["markdown", "json", "html"],
        description: "Output format",
        default: "markdown",
      },
    },
  },
};

async function findSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !["node_modules", "dist", "build", ".git"].includes(entry.name)) {
        files.push(...(await findSourceFiles(fullPath)));
      } else if (entry.isFile() && /\.(ts|js|tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }

  return files;
}

async function analyzeFile(filePath: string): Promise<{
  functions: string[];
  classes: string[];
  exports: string[];
}> {
  try {
    const content = await fs.readFile(filePath, "utf-8");

    // Simple regex-based analysis (can be improved with AST parsing)
    const functionMatches = content.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g) || [];
    const classMatches = content.match(/(?:export\s+)?class\s+(\w+)/g) || [];
    const exportMatches = content.match(/export\s+(?:const|let|var)\s+(\w+)/g) || [];

    return {
      functions: functionMatches.map((m) => m.replace(/.*function\s+/, "")),
      classes: classMatches.map((m) => m.replace(/.*class\s+/, "")),
      exports: exportMatches.map((m) => m.replace(/export\s+(?:const|let|var)\s+/, "")),
    };
  } catch {
    return { functions: [], classes: [], exports: [] };
  }
}

function generateMarkdownDocs(
  fileAnalysis: Map<string, { functions: string[]; classes: string[]; exports: string[] }>
): string {
  let markdown = `# API Documentation

Generated on: ${new Date().toISOString()}

`;

  for (const [filePath, analysis] of fileAnalysis.entries()) {
    const relativePath = filePath.replace(process.cwd(), ".");

    markdown += `## ${relativePath}

`;

    if (analysis.classes.length > 0) {
      markdown += `### Classes

${analysis.classes.map((c) => `- \`${c}\``).join("\n")}

`;
    }

    if (analysis.functions.length > 0) {
      markdown += `### Functions

${analysis.functions.map((f) => `- \`${f}()\``).join("\n")}

`;
    }

    if (analysis.exports.length > 0) {
      markdown += `### Exports

${analysis.exports.map((e) => `- \`${e}\``).join("\n")}

`;
    }
  }

  return markdown;
}

export async function executeGenerateApiDocs(args: Record<string, any>) {
  const { inputPath = "./src", outputPath = "./docs/api", format = "markdown" } = args;

  try {
    // Find all source files
    const sourceFiles = await findSourceFiles(inputPath);

    if (sourceFiles.length === 0) {
      throw new Error(`No source files found in ${inputPath}`);
    }

    // Analyze each file
    const fileAnalysis = new Map();
    for (const file of sourceFiles) {
      const analysis = await analyzeFile(file);
      if (
        analysis.functions.length > 0 ||
        analysis.classes.length > 0 ||
        analysis.exports.length > 0
      ) {
        fileAnalysis.set(file, analysis);
      }
    }

    // Generate documentation
    let docContent: string;
    let outputFile: string;

    switch (format) {
      case "markdown":
        docContent = generateMarkdownDocs(fileAnalysis);
        outputFile = path.join(outputPath, "index.md");
        break;
      case "json":
        docContent = JSON.stringify(Object.fromEntries(fileAnalysis), null, 2);
        outputFile = path.join(outputPath, "api.json");
        break;
      case "html":
        docContent = `<!DOCTYPE html>
<html>
<head><title>API Documentation</title></head>
<body>
<h1>API Documentation</h1>
<pre>${generateMarkdownDocs(fileAnalysis)}</pre>
</body>
</html>`;
        outputFile = path.join(outputPath, "index.html");
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });

    // Write documentation
    await fs.writeFile(outputFile, docContent, "utf-8");

    const result = {
      success: true,
      message: "API documentation generated successfully",
      inputPath,
      outputFile,
      format,
      filesAnalyzed: sourceFiles.length,
      itemsDocumented: Array.from(fileAnalysis.values()).reduce(
        (sum, analysis) =>
          sum + analysis.functions.length + analysis.classes.length + analysis.exports.length,
        0
      ),
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
      `Failed to generate API docs: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
