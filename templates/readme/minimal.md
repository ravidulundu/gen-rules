# {{PROJECT_NAME}}

> Minimal TypeScript project powered by Bun.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Validation** | [Zod](https://zod.dev) |

---

## Getting Started

```bash
# Install dependencies
bun install

# Run the application
bun run dev

# Or run directly
bun run src/index.ts
```

---

## Project Structure

```
src/
├── lib/                 # Utilities
│   └── logger.ts        # Logging utility
└── index.ts             # Entry point
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start with hot reload |
| `bun run start` | Run the application |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run tests |

---

## Usage

### Entry Point
```typescript
// src/index.ts
import { Logger } from './lib/logger';

function main(): void {
  Logger.info('Application started');
  // Your code here
}

main();
```

### Logging
Use the Logger utility instead of `console.log`:

```typescript
import { Logger } from '@/lib/logger';

Logger.info('Info message');
Logger.error('Error message', { details: 'error data' });
Logger.warn('Warning message');
Logger.debug('Debug message');
```

---

## Code Quality

This project enforces strict code quality rules:

- **ESLint** with zero-warning tolerance
- **TypeScript** strict mode
- **No `any` types** - use `unknown` + type guards
- **Max 300 lines** per file
- **Max 100 lines** per function

See `CLAUDE.md` for full coding standards.

---

## Building for Production

```bash
# Bundle with Bun
bun build src/index.ts --outdir=dist --target=bun

# Run the bundle
bun run dist/index.js
```

---

## License

MIT
