# Integration Patterns

## Overview

This guide covers common patterns for integrating MCP servers, Goose recipes, and AGENTS.md in real-world projects.

---

## Pattern 1: Code Quality Workflow

### Scenario
Enforce code quality standards before commits.

### Components
- **MCP Server**: code-quality
- **Goose Recipe**: pre-commit-check
- **Git Hook**: pre-commit

### Implementation

**1. Install pre-commit hook**:
```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
goose run pre-commit-check auto_fix=true run_tests=true
