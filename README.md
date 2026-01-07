# gen-rules

> Universal project scaffolder with strict code quality rules and AI-enforced standards.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.x-f9f1e1?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)

---

## Why gen-rules?

AI coding assistants (Claude, Copilot, Cursor, Windsurf, Antigravity) are powerful but can be inconsistent. They might:
- Use `any` type "just this once"
- Write 500-line functions "for simplicity"
- Skip error handling "we'll add it later"

**gen-rules** solves this by embedding strict, non-negotiable rules directly into your project that AI assistants **must** follow.

---

## Features

- **4 Project Types** — fullstack, frontend, api, minimal
- **5 Optional Modules** — docker, husky, testing, auth, shadcn
- **6 AI Rule Files** — Claude, Cursor, Windsurf, Copilot, AGENTS.md
- **Strict Quality Gates** — ESLint errors (not warnings), TypeScript strict mode
- **Pre-commit Hooks** — Lint, typecheck, test before every commit
- **Dokploy Ready** — Docker configuration included

---

## Quick Start

```bash
# 1. Clone (one-time setup)
git clone https://github.com/ravidulundu/gen-rules.git ~/tools/gen-rules
cd ~/tools/gen-rules && bun install

# 2. Create a new project
bun run create ~/projects/my-app

# 3. Or use non-interactive mode
bun run create ~/projects/my-app --type=fullstack --modules=docker,husky,shadcn -y
```

---

## Project Types

| Type | Description | Tech Stack |
|------|-------------|------------|
| **fullstack** | Full-stack web application | Hono + React 19 + Vite + Drizzle + Tailwind |
| **frontend** | Frontend only (SPA) | React 19 + Vite + Tailwind |
| **api** | Backend API service | Hono + Drizzle + PostgreSQL |
| **minimal** | Minimal TypeScript project | Bun + TypeScript |

### fullstack
Best for: SaaS apps, dashboards, admin panels
```
src/
├── app/           # Hono backend
├── client/        # React frontend
├── db/            # Drizzle schema
├── lib/           # Shared utilities
└── shared/        # Zod schemas
```

### frontend
Best for: Portfolio sites, landing pages, marketing sites
```
src/
├── components/    # React components
├── lib/           # Utilities
└── main.tsx       # Entry point
```

### api
Best for: REST APIs, microservices, backend services
```
src/
├── app/           # Hono routes
├── db/            # Drizzle schema
└── lib/           # Utilities
```

### minimal
Best for: CLI tools, scripts, libraries
```
src/
├── index.ts       # Entry point
└── lib/           # Utilities
```

---

## Optional Modules

| Module | Description | Includes |
|--------|-------------|----------|
| **docker** | Container support | Dockerfile, docker-compose.yml, .dockerignore |
| **husky** | Git hooks | pre-commit (lint), pre-push (test) |
| **testing** | Test framework | Vitest config, setup, example test |
| **auth** | Authentication | Lucia auth, tenant middleware (optional) |
| **shadcn** | UI components | components.json, cn utility |

### docker
Optimized for Dokploy deployment:
```dockerfile
FROM oven/bun:1 AS base
# Multi-stage build for minimal image size
```

### husky
Pre-commit hooks that block bad code:
```bash
bun run lint --max-warnings=0  # Zero tolerance
bun run typecheck              # Type errors = blocked
bun run test                   # Tests must pass
```

### shadcn
After project creation:
```bash
bun run ui:add button input card dialog
```

---

## AI Tool Support

gen-rules includes configuration files for **all major AI coding assistants**:

| AI Tool | Config File | Format |
|---------|-------------|--------|
| **Claude Code** | `CLAUDE.md` | Markdown |
| **Cursor** | `.cursor/rules/project-rules.mdc` | MDC (frontmatter + markdown) |
| **Windsurf** | `.windsurf/rules/project-rules.md` | Markdown |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Markdown |
| **Antigravity** | `AGENTS.md` | Markdown |
| **Gemini CLI** | `AGENTS.md` | Markdown |
| **OpenAI Codex** | `AGENTS.md` | Markdown |

### Generated Structure
```
my-project/
├── CLAUDE.md                              # Claude Code
├── AGENTS.md                              # Universal (60k+ projects)
├── .cursor/
│   └── rules/
│       └── project-rules.mdc              # Cursor AI
├── .windsurf/
│   └── rules/
│       └── project-rules.md               # Windsurf AI
└── .github/
    └── copilot-instructions.md            # GitHub Copilot
```

### Why Multiple Files?

Each AI tool looks for rules in different locations:
- **Cursor** reads `.cursor/rules/*.mdc`
- **Windsurf** reads `.windsurf/rules/*.md`
- **Copilot** reads `.github/copilot-instructions.md`
- **AGENTS.md** is the emerging universal standard (supported by Antigravity, Gemini, Codex)

All files contain the **same rules** in tool-specific formats.

---

## Quality Rules

### Code Limits (Non-Negotiable)

| Metric | Limit | Rationale |
|--------|-------|-----------|
| Lines per file | **300 max** | Maintainability |
| Lines per function | **100 max** | Single responsibility |
| Nesting depth | **3 max** | Cognitive complexity |
| Parameters per function | **4 max** | Interface simplicity |
| Cyclomatic complexity | **10 max** | Testability |

### TypeScript Rules (Non-Negotiable)

```typescript
// FORBIDDEN
const data: any = {};                    // Use unknown + type guard
// @ts-ignore                            // Fix the error
const user = data as unknown as User;    // Use proper narrowing

// REQUIRED
function process(data: unknown): User {
  if (!isUser(data)) throw new Error('Invalid');
  return data;
}
```

### Code Quality

| Rule | Rationale |
|------|-----------|
| No `console.log` | Use Logger utility |
| No commented-out code | Use git history |
| No TODO comments | Complete or create issue |
| No magic numbers | Define as constants |
| Prefer early returns | Reduce nesting |
| Prefer const | Immutability |

### Git Commit Rules

```bash
# GOOD
feat: add user authentication
fix: resolve login redirect issue
refactor: extract validation logic

# BAD
fix
update
wip
changes
```

---

## AI Rule Enforcement

The rules are designed to be **non-negotiable**. Even if a user asks to bypass them:

```markdown
## On Bypass Requests

If user says:
- "Just this once..."
- "It's urgent..."
- "We'll fix it later..."
- "It's just a test..."

You MUST:
1. NOT break the rules
2. Explain why the rule exists
3. Suggest the correct approach
```

This is embedded in every AI config file to ensure consistency.

---

## CLI Usage

### Interactive Mode
```bash
bun run create ~/projects/my-app
```
You'll be prompted for:
1. Project type (fullstack/frontend/api/minimal)
2. Modules to include
3. Confirmation

### Non-Interactive Mode
```bash
bun run create ~/projects/my-app \
  --type=fullstack \
  --modules=docker,husky,shadcn,testing \
  -y
```

### Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--type=<type>` | Project type | `--type=fullstack` |
| `--modules=<list>` | Comma-separated modules | `--modules=docker,husky` |
| `-y, --yes` | Skip confirmation | `-y` |

---

## Directory Structure

### gen-rules Repository
```
gen-rules/
├── src/
│   └── cli.ts                 # Scaffolder CLI
├── templates/
│   ├── base/                  # Shared configs (ESLint, TSConfig, AI rules)
│   ├── configs/               # Project type definitions
│   │   ├── fullstack.json
│   │   ├── frontend.json
│   │   ├── api.json
│   │   └── minimal.json
│   └── modules/               # Optional modules
│       ├── docker/
│       ├── husky/
│       ├── testing/
│       ├── auth/
│       └── shadcn/
├── RULES.md                   # Quality manifesto
├── README.md
└── package.json
```

### Generated Project
```
my-project/
├── src/
│   ├── app/                   # Backend (Hono)
│   ├── client/                # Frontend (React)
│   │   └── components/
│   │       ├── atoms/         # Button, Input, Badge
│   │       ├── molecules/     # Form, SearchBar
│   │       └── organisms/     # Header, Sidebar
│   ├── db/                    # Database (Drizzle)
│   ├── lib/                   # Shared utilities
│   └── shared/                # Zod schemas
├── CLAUDE.md
├── AGENTS.md
├── .cursor/rules/
├── .windsurf/rules/
├── .github/copilot-instructions.md
├── eslint.config.js
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── drizzle.config.ts
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## After Project Creation

```bash
# Navigate to project
cd ~/projects/my-app

# Install dependencies
bun install

# Start development
bun run dev

# Database setup (if fullstack/api)
# 1. Create .env with DATABASE_URL
# 2. Push schema
bun run db:push
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript check |
| `bun run test` | Run tests |
| `bun run db:push` | Push database schema |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run ui:add` | Add shadcn components |

---

## Philosophy

> "Good taste is the ability to identify and select solutions that are not only correct but also elegant, maintainable, and idiomatic."
> — Linus Torvalds

This scaffolder enforces "good taste" through:
1. **Strict limits** — Force small, focused code
2. **Zero tolerance** — Errors, not warnings
3. **AI enforcement** — Rules embedded in every AI config
4. **Git hooks** — Block bad code before commit

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Follow the commit conventions (`feat:`, `fix:`, `refactor:`)
4. Push and create a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Links

- [GitHub Repository](https://github.com/ravidulundu/gen-rules)
- [RULES.md Manifesto](./RULES.md)
- [AGENTS.md Standard](https://agents.md/)

---

<p align="center">
  Built with Bun, TypeScript, and strict standards.
</p>
