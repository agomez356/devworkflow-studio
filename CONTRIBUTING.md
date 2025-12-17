# Contributing to DevWorkflow Studio

Thank you for your interest in contributing! DevWorkflow Studio is an educational project designed to help people learn about MCP, Goose, and AGENTS.md. Contributions that enhance the learning experience are especially welcome.

---

## 🎯 Project Goals

This project aims to:
1. **Educate**: Teach MCP, Goose, and AGENTS.md concepts
2. **Demonstrate**: Show real-world integration patterns
3. **Inspire**: Encourage agentic AI development
4. **Support**: Provide templates and examples

---

## 🤝 How to Contribute

### Types of Contributions

We welcome:
- 📚 **Documentation improvements**
- 🐛 **Bug fixes**
- ✨ **New MCP tools** (educational value)
- 🔄 **New Goose recipes** (common workflows)
- 🎓 **Learning resources** (tutorials, guides)
- 📦 **Example projects** (demonstrating integration)
- 🧪 **Tests** (improving coverage)
- 🎨 **Code quality** (refactoring, optimization)

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/devworkflow-studio.git
cd devworkflow-studio
```

### 2. Setup Development Environment

```bash
# Run bootstrap script
./scripts/bootstrap.sh

# Or manually:
npm install
npm run build
npm test
```

### 3. Create a Branch

```bash
# Use our branch naming convention
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Strict mode, explicit types
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)
- **Naming**: camelCase for variables, PascalCase for classes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(mcp): add new analyze_imports tool
fix(goose): resolve recipe parameter validation
docs(readme): update installation instructions
test(mcp): add unit tests for lint_code tool
```

### Testing

- Write tests for new features
- Maintain or improve test coverage
- Run tests before committing: `npm test`

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Coverage
npm run test:coverage
```

---

## 🛠️ Adding New Features

### Adding an MCP Tool

1. **Create tool file**:
```typescript
// mcp-servers/code-quality/src/tools/my-tool.ts
export const myTool = {
  name: "my_tool",
  description: "What the tool does",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "File path" }
    },
    required: ["path"]
  }
};

export async function executeMyTool(args: Record<string, any>) {
  // Implementation
}
```

2. **Register in server**:
```typescript
// mcp-servers/code-quality/src/index.ts
import { myTool, executeMyTool } from './tools/my-tool';
// ... register the tool
```

3. **Write tests**:
```typescript
// tests/unit/code-quality/my-tool.test.ts
describe('my_tool', () => {
  it('should work correctly', async () => {
    // Test implementation
  });
});
```

4. **Update documentation**:
- Add to `AGENTS.md`
- Update `MCP_SERVERS_TEST_RESULTS.md`
- Document in server README

### Adding a Goose Recipe

1. **Create recipe file**:
```yaml
# goose-recipes/my-recipe.yaml
name: my-recipe
description: "What the recipe does"
version: "1.0.0"

parameters:
  - name: param1
    description: "Parameter description"
    required: true
    type: string

steps:
  - name: step1
    server: code-quality
    tool: some_tool
    params:
      path: "{{ param1 }}"
```

2. **Test the recipe**:
```bash
goose run my-recipe param1="test"
```

3. **Document**:
- Add to `docs/03-goose-recipes.md`
- Update `goose.yaml` if needed

### Adding an Example Project

1. **Create project structure**:
```bash
mkdir -p examples/my-example/src
```

2. **Add required files**:
- `AGENTS.md` - Complete documentation
- `.goosehints` - Goose AI context
- `README.md` - Quick overview
- `package.json` - Dependencies
- `Dockerfile` - Docker setup (optional)

3. **Demonstrate MCP integration**:
- Show how to use MCP tools
- Include Goose recipe examples
- Document workflows

---

## 📚 Documentation Guidelines

### Writing AGENTS.md

Follow the standard sections:
1. Project Overview
2. Development Environment
3. Architecture
4. Common Commands
5. Key Files
6. Testing Guidelines
7. Code Style

See our [AGENTS.md Guide](docs/04-agents-md-guide.md).

### Writing Guides

- Use clear, concise language
- Include code examples
- Provide context for beginners
- Link to related resources
- Update table of contents

---

## 🧪 Testing Guidelines

### Unit Tests

- Test individual functions/tools
- Mock external dependencies
- Focus on edge cases
- Located in `tests/unit/`

### Integration Tests

- Test complete workflows
- Test MCP protocol compliance
- Test end-to-end scenarios
- Located in `tests/integration/`

### Test Coverage Goals

- Unit tests: >80% coverage
- Integration tests: All MCP operations
- E2E tests: Major workflows

---

## 🔍 Pull Request Process

### Before Submitting

1. **Run quality checks**:
```bash
npm run lint
npm run format
npm test
./scripts/test-integration.sh
```

2. **Update documentation**:
- Update AGENTS.md if needed
- Add to CHANGELOG.md
- Update relevant docs/

3. **Test thoroughly**:
- Manual testing
- Automated tests pass
- No new warnings

### Submitting

1. **Push to your fork**:
```bash
git push origin feature/your-feature
```

2. **Create Pull Request**:
- Use a descriptive title
- Reference any related issues
- Describe changes clearly
- Include testing notes

3. **PR Template** (use this format):
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Test

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

### Review Process

- Maintainers will review your PR
- Address feedback promptly
- Keep discussion constructive
- Be patient (we're volunteers!)

---

## 🌟 Good First Issues

Looking to contribute but not sure where to start?

Check issues labeled:
- `good first issue`
- `documentation`
- `help wanted`

Or consider:
- Fixing typos in documentation
- Adding more test coverage
- Improving code comments
- Creating tutorial content

---

## 💡 Feature Requests

Have an idea? Great!

1. **Check existing issues** first
2. **Open a discussion** on GitHub
3. **Describe the use case**
4. **Explain the educational value**

---

## 🐛 Bug Reports

Found a bug?

1. **Check if it's already reported**
2. **Create a detailed issue**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, Node version, etc.)
   - Screenshots (if applicable)

---

## 📖 Documentation Contributions

Documentation improvements are always welcome!

Areas to improve:
- Clarifying existing docs
- Adding more examples
- Creating tutorials
- Fixing broken links
- Improving AGENTS.md

---

## 🎓 Educational Contributions

Since this is an educational project, we especially value:

- **Tutorials**: Step-by-step guides
- **Examples**: Real-world use cases
- **Explanations**: Complex concepts made simple
- **Learning paths**: Structured learning sequences

---

## 🛡️ Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on education
- Provide constructive feedback
- Help others learn

### Not Acceptable

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private info
- Unprofessional conduct

---

## 📞 Getting Help

Need help contributing?

- **GitHub Discussions**: Ask questions
- **Issues**: Report bugs or request features
- **Documentation**: Check `docs/` directory

---

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Project documentation

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Create a new issue

---

Thank you for contributing to DevWorkflow Studio! 🚀

Your contributions help others learn about agentic AI development.

---

**Happy Contributing!**
