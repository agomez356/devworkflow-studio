# Claude Code Setup Guide

## ✅ Estado

Los servidores MCP están compilados y listos para usar con Claude Code.

## 🚀 Inicio Rápido

### 1. Configuración Automática

El archivo de configuración MCP ya está creado en `.claude/mcp-config.json`. Claude Code debería detectarlo automáticamente cuando trabajes en este proyecto.

### 2. Configuración Manual (si es necesaria)

Si Claude Code no detecta automáticamente la configuración, añade esto a tu `~/.claude/settings.json` o al archivo de configuración de Claude Code:

```json
{
  "mcpServers": {
    "code-quality": {
      "command": "node",
      "args": ["/home/edev/Desarrollo/devworkflow-studio/mcp-servers/code-quality/dist/index.js"],
      "cwd": "/home/edev/Desarrollo/devworkflow-studio"
    },
    "git-workflow": {
      "command": "node",
      "args": ["/home/edev/Desarrollo/devworkflow-studio/mcp-servers/git-workflow/dist/index.js"],
      "cwd": "/home/edev/Desarrollo/devworkflow-studio"
    },
    "doc-generator": {
      "command": "node",
      "args": ["/home/edev/Desarrollo/devworkflow-studio/mcp-servers/doc-generator/dist/index.js"],
      "cwd": "/home/edev/Desarrollo/devworkflow-studio"
    }
  }
}
```

## 🛠️ Herramientas Disponibles

### Code Quality Server (9 herramientas)

1. **lint_code** - Ejecutar linter (ESLint, Pylint)
2. **format_code** - Formatear código (Prettier, Black)
3. **analyze_complexity** - Analizar complejidad del código

### Git Workflow Server (3 herramientas + 1 prompt)

1. **create_branch** - Crear branch con convenciones de nombres
2. **generate_commit_msg** - Generar mensaje de commit desde diff
3. **analyze_pr** - Analizar PR para problemas comunes
4. **pr-review-template** - Template de PR review (prompt)

### Doc Generator Server (3 herramientas + 1 recurso)

1. **generate_readme** - Generar/actualizar README desde código
2. **generate_api_docs** - Generar documentación de API
3. **update_changelog** - Actualizar CHANGELOG desde commits
4. **docs://project-info** - Metadata del proyecto (recurso)

## 🧪 Probar los Servidores

Puedes probar manualmente cada servidor:

```bash
# Listar herramientas del servidor code-quality
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  node mcp-servers/code-quality/dist/index.js

# Listar herramientas del servidor git-workflow
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  node mcp-servers/git-workflow/dist/index.js

# Listar herramientas del servidor doc-generator
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  node mcp-servers/doc-generator/dist/index.js
```

## 💡 Uso con Claude Code

Una vez configurado, puedes pedirle a Claude Code que use las herramientas directamente:

**Ejemplos:**

```
"Lint all TypeScript files in the src directory"
→ Usará la herramienta lint_code del servidor code-quality

"Generate a commit message for my staged changes"
→ Usará generate_commit_msg del servidor git-workflow

"Update the README based on the current code"
→ Usará generate_readme del servidor doc-generator

"Analyze the complexity of src/index.ts"
→ Usará analyze_complexity del servidor code-quality
```

## 🔄 Recompilar Después de Cambios

Si modificas el código de los servidores:

```bash
npm run build
```

Los cambios estarán disponibles inmediatamente para Claude Code.

## 🐳 Opción Docker (alternativa)

También puedes usar Docker para ejecutar los servidores (aunque requiere arreglar el Dockerfile):

```bash
# Iniciar con docker compose
./scripts/docker-start.sh

# Ver logs
./scripts/docker-logs.sh code-quality

# Detener
./scripts/docker-stop.sh
```

## 📚 Más Información

- **AGENTS.md** - Documentación completa del proyecto
- **docs/docker-guide.md** - Guía completa de Docker
- **.goosehints** - Contexto del proyecto para Goose
- **goose.yaml** - Configuración de Goose con MCP servers

## 🎯 Próximos Pasos

1. ✅ Servidores compilados y configurados
2. ⏭️ Probar las herramientas en Claude Code
3. ⏭️ Explorar las Goose recipes en `goose-recipes/`
4. ⏭️ Personalizar y extender los servidores
