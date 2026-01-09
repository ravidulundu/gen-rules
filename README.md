# gen-rules

> Universal project scaffolder with strict code quality rules and AI-enforced standards.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.x-f9f1e1?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)

---

## Why gen-rules?

AI coding assistants (Claude, Copilot, Cursor, Windsurf, Gemini) are powerful but can be inconsistent. They might:
- Use `any` type "just this once"
- Write 500-line functions "for simplicity"
- Skip error handling "we'll add it later"

**gen-rules** solves this by embedding strict, non-negotiable rules directly into your project that AI assistants **must** follow.

---

## Features

- **4 Project Types** — fullstack, frontend, api, minimal
- **4 Optional Modules** — docker, husky, testing, auth
- **Built-in shadcn/ui** — Ready to use with `bun run ui:add`
- **6 AI Rule Files** — Claude, Cursor, Windsurf, Copilot, AGENTS.md
- **Strict Quality Gates** — ESLint errors (not warnings), TypeScript strict mode
- **Pre-commit Hooks** — Lint, typecheck, test before every commit
- **Auto-generated README** — Project-specific documentation

---

## Quick Start

```bash
# 1. Clone (one-time setup)
git clone https://github.com/ravidulundu/gen-rules.git ~/tools/gen-rules
cd ~/tools/gen-rules && bun install

# 2. Create a new project (interactive)
bun run create ~/projects/my-app

# 3. Or use non-interactive mode
bun run create ~/projects/my-app --type=fullstack --modules=docker,husky -y
```

---

## Project Types

| Type | Best For | Tech Stack |
|------|----------|------------|
| **fullstack** | SaaS, dashboards, admin panels | Hono + React 19 + Vite + Drizzle + Tailwind + shadcn/ui |
| **frontend** | Portfolio, landing pages, SPAs | React 19 + Vite + Tailwind + shadcn/ui |
| **api** | REST APIs, microservices | Hono + Drizzle + PostgreSQL |
| **minimal** | CLI tools, scripts, libraries | Bun + TypeScript |

### fullstack
```
src/
├── app/                 # Hono backend
├── client/              # React frontend
│   └── components/ui/   # shadcn/ui components
├── db/                  # Drizzle schema
├── lib/                 # Shared utilities (cn, logger)
└── shared/              # Zod schemas
```

### frontend
```
src/
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities (cn, logger)
└── main.tsx             # Entry point
```

### api
```
src/
├── routes/              # API routes
├── db/                  # Drizzle schema
├── lib/                 # Utilities
└── index.ts             # Entry point
```

### minimal
```
src/
├── lib/                 # Utilities
└── index.ts             # Entry point
```

---

## Optional Modules

| Module | Description | Includes |
|--------|-------------|----------|
| **docker** | Container support | Dockerfile, docker-compose.yml, .dockerignore |
| **husky** | Git hooks | pre-commit (lint), pre-push (test) |
| **testing** | Test framework | Vitest config, setup, example test |
| **auth** | Authentication | Lucia auth, tenant middleware |

### docker
Optimized for Dokploy deployment with multi-stage builds.

### husky
Pre-commit hooks that block bad code:
```bash
bun run lint --max-warnings=0  # Zero tolerance
bun run typecheck              # Type errors = blocked
bun run test                   # Tests must pass
```

---

## Built-in shadcn/ui

All frontend projects (fullstack, frontend) come with shadcn/ui pre-configured:

```bash
# Add components after project creation
cd my-project
bun run ui:add button input card dialog toast
```

Components are installed to:
- **fullstack**: `src/client/components/ui/`
- **frontend**: `src/components/ui/`

---

## AI Tool Support

gen-rules includes configuration files for **all major AI coding assistants**:

| AI Tool | Config File | Format |
|---------|-------------|--------|
| **Claude Code** | `CLAUDE.md` | Markdown |
| **Cursor** | `.cursor/rules/project-rules.mdc` | MDC |
| **Windsurf** | `.windsurf/rules/project-rules.md` | Markdown |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Markdown |
| **Gemini / Codex** | `AGENTS.md` | Markdown |

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

### Good Taste Rules (ESLint Enforced)

| Rule | Description | Rationale |
|------|-------------|-----------|
| `no-nested-ternary` | No `a ? b : c ? d : e` | Hard to read |
| `no-else-return` | No `else` after `return` | Use early returns |
| `no-lonely-if` | No lonely `if` in `else` | Flatten to `else if` |
| `no-unneeded-ternary` | No `x ? true : false` | Simplify to `!!x` |
| `prefer-template` | No `'a' + b + 'c'` | Use template literals |
| `object-shorthand` | No `{ name: name }` | Use `{ name }` |
| `prefer-arrow-callback` | No `function()` callbacks | Use arrow functions |
| `arrow-body-style` | No `() => { return x }` | Use `() => x` |
| `consistent-return` | All paths must return | Predictable functions |

### Code Quality

| Rule | Rationale |
|------|-----------|
| No `console.log` | Use Logger utility |
| No commented-out code | Use git history |
| No TODO comments | Complete or create issue |
| No magic numbers | Define as constants |

---

## CLI Usage

### Interactive Mode
```bash
bun run create ~/projects/my-app
```

You'll be prompted for:
1. Project type (with descriptions)
2. Modules to include
3. Confirmation

### Non-Interactive Mode
```bash
bun run create ~/projects/my-app \
  --type=fullstack \
  --modules=docker,husky,testing \
  -y
```

### Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--type=<type>` | Project type | `--type=fullstack` |
| `--modules=<list>` | Comma-separated modules | `--modules=docker,husky` |
| `--modules=` | No modules | `--modules=` |
| `-y, --yes` | Skip confirmation | `-y` |

---

## Generated Project Structure

```
my-project/
├── README.md                    # Project-specific documentation
├── CLAUDE.md                    # Claude Code rules
├── AGENTS.md                    # Universal AI rules
├── .cursor/rules/               # Cursor AI rules
├── .windsurf/rules/             # Windsurf AI rules
├── .github/copilot-instructions.md
├── src/
│   ├── app/                     # Backend (Hono)
│   ├── client/                  # Frontend (React)
│   │   └── components/ui/       # shadcn/ui
│   ├── db/                      # Database (Drizzle)
│   └── lib/                     # Utilities
├── components.json              # shadcn config
├── eslint.config.js
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
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

## gen-rules Repository Structure

```
gen-rules/
├── src/
│   ├── cli.ts                   # Entry point
│   ├── commands/
│   │   └── create.ts            # Create command
│   └── lib/
│       ├── types.ts             # Type definitions
│       ├── ui.ts                # Terminal UI
│       ├── config.ts            # Config loading
│       ├── copy.ts              # File copying
│       ├── generate.ts          # Config generation
│       └── generate-starter.ts  # Starter files
├── templates/
│   ├── base/                    # Shared configs
│   ├── configs/                 # Project type configs
│   ├── modules/                 # Optional modules
│   └── readme/                  # README templates
├── RULES.md                     # Quality manifesto
└── README.md
```

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
