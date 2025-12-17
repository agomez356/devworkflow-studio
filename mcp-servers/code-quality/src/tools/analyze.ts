/**
 * Analyze Complexity Tool
 * Calculates cyclomatic complexity and other code metrics
 */

import * as fs from "fs/promises";

export const analyzeComplexityTool = {
  name: "analyze_complexity",
  description:
    "Analyze code complexity metrics including cyclomatic complexity, lines of code, and function count.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File path to analyze",
      },
    },
    required: ["path"],
  },
};

/**
 * Simple complexity analyzer
 * Counts decision points: if, else, while, for, case, catch, &&, ||, ?
 */
function analyzeComplexity(code: string): {
  complexity: number;
  linesOfCode: number;
  functions: number;
  details: string[];
} {
  const lines = code.split("\n");
  const linesOfCode = lines.filter((line) => line.trim() && !line.trim().startsWith("//")).length;

  // Count functions (simplified)
  const functionMatches = code.match(/function\s+\w+|=>\s*{|class\s+\w+/g) || [];
  const functions = functionMatches.length;

  // Count complexity points
  const complexityPatterns = [
    /\bif\s*\(/g,
    /\belse\s+if\s*\(/g,
    /\belse\s*{/g,
    /\bwhile\s*\(/g,
    /\bfor\s*\(/g,
    /\bcase\s+/g,
    /\bcatch\s*\(/g,
    /&&/g,
    /\|\|/g,
    /\?/g,
  ];

  let complexity = 1; // Base complexity
  const details: string[] = [];

  for (const pattern of complexityPatterns) {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
      details.push(`${pattern.source}: ${matches.length}`);
    }
  }

  return {
    complexity,
    linesOfCode,
    functions,
    details,
  };
}

export async function executeAnalyzeComplexity(args: Record<string, any>) {
  const { path: filePath } = args;

  if (!filePath) {
    throw new Error("Missing required parameter: path");
  }

  // Validate path exists and is a file
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error("Path must be a file, not a directory");
    }
  } catch (error) {
    throw new Error(`Cannot access file: ${filePath}`);
  }

  // Read file content
  const content = await fs.readFile(filePath, "utf-8");

  // Analyze complexity
  const analysis = analyzeComplexity(content);

  // Determine complexity rating
  let rating: string;
  let recommendation: string;

  if (analysis.complexity <= 10) {
    rating = "Low";
    recommendation = "Code is simple and easy to maintain";
  } else if (analysis.complexity <= 20) {
    rating = "Moderate";
    recommendation = "Consider refactoring if code becomes more complex";
  } else if (analysis.complexity <= 50) {
    rating = "High";
    recommendation = "Consider breaking down into smaller functions";
  } else {
    rating = "Very High";
    recommendation = "Strongly recommend refactoring to reduce complexity";
  }

  const result = {
    file: filePath,
    metrics: {
      cyclomaticComplexity: analysis.complexity,
      linesOfCode: analysis.linesOfCode,
      functionCount: analysis.functions,
    },
    rating,
    recommendation,
    complexityBreakdown: analysis.details,
    analyzedAt: new Date().toISOString(),
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
