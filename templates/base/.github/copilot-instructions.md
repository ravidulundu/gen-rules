# GitHub Copilot Instructions

These are the project coding standards. All suggestions must comply.

## Philosophy: Good Taste

> "Good taste is the ability to identify and select solutions that are
> not only correct but also elegant, maintainable, and idiomatic." — Linus Torvalds

Principles:
- Elegance over cleverness (readable > clever)
- Simplicity over complexity (simple > complex)
- Early returns over nesting (flat > nested)
- Small functions over monoliths (small > large)

"Fix later" = WRONG. "Do it right now" = CORRECT.

## TypeScript Requirements

- NEVER suggest `any` type - use `unknown` with type guards
- NEVER suggest `@ts-ignore` or `@ts-expect-error`
- NEVER suggest unsafe type casting like `as unknown as X`
- ALWAYS include explicit return types for functions

## Code Quality Standards

### Size Limits
- Maximum 300 lines per file
- Maximum 100 lines per function
- Maximum 3 levels of nesting
- Maximum 4 parameters per function

### Forbidden Patterns
- `console.log` - use `Logger` from `src/lib/logger.ts`
- Commented-out code blocks
- TODO/FIXME comments without issue references
- Magic numbers (define as named constants)
- Empty catch blocks

### Required Patterns
- Early returns to reduce nesting
- Const assertions for literal types
- Discriminated unions for state management
- Zod schemas for runtime validation

## Project Structure

```
src/
├── app/        # Hono API backend
├── client/     # React frontend
│   └── components/
│       └── ui/  # shadcn/ui components
├── lib/        # Shared utilities (cn, logger, etc.)
├── db/         # Drizzle ORM
└── shared/     # Zod schemas
```

## shadcn/ui Usage

- Add components: `bun run ui:add button input card`
- UI components: `src/client/components/ui/`
- Custom components: `src/client/components/`
- Use `cn()` from `src/lib/utils.ts` for class merging

## Commit Messages

Use conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `docs:` - Documentation

## Reference

See `CLAUDE.md` in project root for full documentation.
