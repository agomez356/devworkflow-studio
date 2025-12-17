/**
 * PR Review Prompt Template
 * Structured template for conducting thorough PR reviews
 */

export const prReviewPrompt = {
  name: "pr-review-template",
  description: "Structured template for conducting comprehensive pull request reviews",
  arguments: [
    {
      name: "prNumber",
      description: "Pull request number",
      required: false,
    },
    {
      name: "focus",
      description: "Specific area to focus on (security, performance, style, etc.)",
      required: false,
    },
  ],
};

export function getPRReviewPrompt(args?: Record<string, string>) {
  const prNumber = args?.prNumber || "[PR Number]";
  const focus = args?.focus || "all aspects";

  const promptContent = `You are conducting a comprehensive code review for Pull Request #${prNumber}.

## Review Checklist

### 1. Code Quality
- [ ] Code is clean, readable, and well-structured
- [ ] Naming conventions are consistent and descriptive
- [ ] No commented-out code or debug statements
- [ ] No obvious code smells or anti-patterns
- [ ] DRY principle followed (no unnecessary duplication)

### 2. Functionality
- [ ] Changes match the PR description and requirements
- [ ] Edge cases are handled appropriately
- [ ] Error handling is robust and informative
- [ ] No breaking changes without proper migration path

### 3. Testing
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests cover critical paths
- [ ] Tests are meaningful and cover edge cases
- [ ] All tests pass successfully
- [ ] Test coverage meets project standards

### 4. Security
- [ ] No sensitive data exposed (API keys, passwords, etc.)
- [ ] Input validation is thorough
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Dependencies are secure and up-to-date

### 5. Performance
- [ ] No obvious performance bottlenecks
- [ ] Database queries are optimized
- [ ] No N+1 query problems
- [ ] Appropriate use of caching
- [ ] Resource usage is reasonable

### 6. Documentation
- [ ] Code comments explain "why", not "what"
- [ ] Public APIs are documented
- [ ] README updated if needed
- [ ] CHANGELOG updated with notable changes
- [ ] Migration guide provided for breaking changes

### 7. Style & Conventions
- [ ] Follows project coding style
- [ ] Linter passes without warnings
- [ ] Formatter has been applied
- [ ] Commit messages follow conventions
- [ ] Branch name follows conventions

## Focus Area: ${focus}

${focus !== "all aspects" ? `Pay special attention to ${focus}-related concerns.` : ""}

## Review Process

1. **Read the PR description** - Understand the intent and context
2. **Check CI/CD status** - Ensure all automated checks pass
3. **Review the diff** - Look at changes file by file
4. **Test locally** - Pull the branch and test the changes
5. **Provide feedback** - Use the checklist above
6. **Suggest improvements** - Be constructive and specific

## Feedback Template

### Summary
[Brief overview of the changes and your overall assessment]

### Strengths
- [What was done well]
- [Positive aspects of the implementation]

### Issues Found
- **[Severity]** [Issue description and location]
- **[Severity]** [Another issue if any]

Severity levels: Critical, Major, Minor, Suggestion

### Recommendations
1. [Specific actionable recommendation]
2. [Another recommendation]

### Questions
- [Any clarifications needed]

### Approval Status
- [ ] Approve - Ready to merge
- [ ] Approve with comments - Minor issues that can be addressed later
- [ ] Request changes - Must be addressed before merging
- [ ] Comment - Providing feedback without blocking

---

Begin your review below:`;

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: promptContent,
        },
      },
    ],
  };
}
