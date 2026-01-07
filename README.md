# gen-rules

Universal project scaffolder with strict code quality rules and AI-enforced standards.

## Quick Start

```bash
# Clone the repository (one-time setup)
git clone https://github.com/ravidulundu/gen-rules.git ~/tools/gen-rules
cd ~/tools/gen-rules && bun install

# Create a new project
bun run create ~/projects/my-new-app
```

## Features

- **4 Project Types**: fullstack, frontend, api, minimal
- **Strict Quality Rules**: ESLint + TypeScript strict mode
- **AI Enforcement**: CLAUDE.md, AGENTS.md, .cursorrules for AI assistants
- **Pre-commit Hooks**: Husky with lint + typecheck + test
- **Docker Ready**: Dockerfile + docker-compose for Dokploy

## Project Types

| Type | Description | Stack |
|------|-------------|-------|
| `fullstack` | Full-stack web app | Hono + React + Drizzle + Tailwind |
| `frontend` | Frontend only | React + Vite + Tailwind |
| `api` | Backend only | Hono + Drizzle |
| `minimal` | Minimal TypeScript | Bun + TypeScript |

## Optional Modules

- **docker**: Dockerfile, docker-compose.yml, .dockerignore
- **husky**: Pre-commit and pre-push hooks
- **testing**: Vitest configuration
- **auth**: Lucia authentication with optional tenant support

## Quality Rules

### Code Limits (Non-Negotiable)

| Metric | Limit |
|--------|-------|
| Lines per file | Max 300 |
| Lines per function | Max 100 |
| Nesting depth | Max 3 |
| Parameters per function | Max 4 |
| Cyclomatic complexity | Max 10 |

### TypeScript (Non-Negotiable)

- `any` type: **FORBIDDEN**
- `@ts-ignore`: **FORBIDDEN**
- `@ts-expect-error`: **FORBIDDEN**
- Unsafe casting: **FORBIDDEN**

### Code Quality

- `console.log`: Use `Logger` utility instead
- Commented-out code: Delete it
- TODO comments: Complete the work or create an issue
- Magic numbers: Define as named constants

## AI Enforcement

This scaffolder includes configuration files for AI assistants:

| File | For |
|------|-----|
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | Gemini, Antigravity, etc. |
| `.cursorrules` | Cursor AI |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.windsurfrules` | Windsurf/Codeium |

**These rules are non-negotiable.** Even if the user asks to bypass them, AI assistants should:
1. Refuse to break the rules
2. Explain why the rule exists
3. Suggest the correct approach

## Directory Structure

```
gen-rules/
├── templates/
│   ├── base/           # Shared config files
│   ├── configs/        # Project type configurations
│   └── modules/        # Optional modules
├── src/
│   └── cli.ts          # Scaffolder CLI
├── package.json
└── README.md
```

## License

MIT
