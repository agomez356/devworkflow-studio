# Goose Recipes Guide

## Overview

Goose recipes are YAML-based workflow automation files that orchestrate MCP server tools to perform complex multi-step tasks.

## Available Recipes

### 1. code-review.yaml

**Purpose**: Comprehensive code review automation

**What it does**:
- Analyzes PR changes
- Runs linting and formatting
- Checks code complexity
- Generates review report

**Usage**:
```bash
goose run code-review
```

**Parameters**:
- None required (uses current branch)

---

### 2. setup-feature.yaml

**Purpose**: Scaffold new features automatically

**What it does**:
- Creates Git branch
- Generates directory structure
- Creates boilerplate code
- Generates test templates
- Runs lint/format

**Usage**:
```bash
goose run setup-feature \
  feature_name="user-authentication" \
  feature_type="fullstack" \
  include_tests=true \
  include_docs=true
```

**Parameters**:
- `feature_name` (required): Feature name
- `feature_type` (required): frontend, backend, or fullstack
- `include_tests` (optional): Generate test files (default: true)
- `include_docs` (optional): Generate documentation (default: true)

---

### 3. pre-commit-check.yaml

**Purpose**: Quality gates before committing

**What it does**:
- Lints staged files
- Checks formatting
- Runs tests
- Scans for sensitive data
- Validates commit message
- Suggests semantic commit

**Usage**:
```bash
goose run pre-commit-check \
  auto_fix=true \
  run_tests=true \
  check_coverage=false
```

**Parameters**:
- `auto_fix` (optional): Auto-fix issues (default: true)
- `run_tests` (optional): Run test suite (default: true)
- `check_coverage` (optional): Check test coverage (default: false)
- `coverage_threshold` (optional): Min coverage % (default: 80)

---

### 4. update-docs.yaml

**Purpose**: Synchronize documentation with code

**What it does**:
- Updates README from code
- Generates CHANGELOG from commits
- Creates API documentation
- Checks doc coverage
- Scans for broken links

**Usage**:
```bash
goose run update-docs \
  update_readme=true \
  update_changelog=true \
  update_api_docs=true \
  api_docs_format="markdown"
```

**Parameters**:
- `update_readme` (optional): Update README (default: true)
- `update_changelog` (optional): Update CHANGELOG (default: true)
- `update_api_docs` (optional): Generate API docs (default: true)
- `api_docs_format` (optional): markdown, json, or html (default: markdown)
- `output_dir` (optional): Output directory (default: docs/api)

---

## Creating Custom Recipes

### Recipe Structure

```yaml
name: my-recipe
description: "What this recipe does"
version: "1.0.0"

parameters:
  - name: param_name
    description: "Parameter description"
    required: true
    type: string

steps:
  - name: step_name
    description: "What this step does"
    server: code-quality
    tool: lint_code
    params:
      path: "{{ param_name }}"
    on_success: continue
    on_error: fail

summary:
  template: |
    ✅ Recipe completed!
    Result: {{ result }}
```

### Best Practices

1. **Descriptive Names**: Use clear, action-oriented names
2. **Parameters**: Provide sensible defaults
3. **Error Handling**: Use on_success/on_error
4. **Validation**: Add validation steps
5. **Summary**: Provide clear output

---

## Recipe Patterns

### Sequential Steps

```yaml
steps:
  - name: step1
    tool: lint_code
    on_success: continue  # Go to step2
    
  - name: step2
    tool: format_code
    on_success: continue  # Go to step3
```

### Conditional Steps

```yaml
steps:
  - name: optional_step
    condition: "{{ run_tests }}"
    tool: some_tool
```

### Error Handling

```yaml
steps:
  - name: risky_step
    tool: some_tool
    on_success: continue
    on_error: warn  # Continue despite error
    
  - name: critical_step
    tool: important_tool
    on_error: fail  # Stop on error
```

### Multiple Servers

```yaml
steps:
  - name: lint
    server: code-quality
    tool: lint_code
    
  - name: create_branch
    server: git-workflow
    tool: create_branch
    
  - name: generate_docs
    server: doc-generator
    tool: generate_readme
```

---

## Integration with MCP

Recipes can use all MCP server capabilities:

### Tools
```yaml
tool: lint_code
params:
  path: "src"
  linter: "auto"
```

### Resources
```yaml
action: read_resource
resource: "code://metrics"
```

### Prompts
```yaml
action: use_prompt
prompt: "pr-review-template"
```

---

## Examples

See `goose-recipes/` directory for complete examples.

---

## Troubleshooting

**Recipe not found**:
- Check `goose-recipes/` directory
- Verify `goose.yaml` configuration

**MCP server error**:
- Ensure servers are built: `npm run build`
- Test servers: `./scripts/test-integration.sh`

**Parameter errors**:
- Check required parameters
- Verify parameter types

---

For more information, see `goose.yaml` and individual recipe files.
