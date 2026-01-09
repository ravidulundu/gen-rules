# {{PROJECT_NAME}}

> Full-stack web application built with Hono, React 19, and Drizzle ORM.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Backend** | [Hono](https://hono.dev) |
| **Frontend** | [React 19](https://react.dev) + [Vite](https://vitejs.dev) |
| **Database** | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Validation** | [Zod](https://zod.dev) |

---

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
bun run db:push

# Start development
bun run dev
```

---

## Project Structure

```
src/
├── app/                 # Backend API (Hono)
│   └── index.ts         # API entry point
├── client/              # Frontend (React)
│   ├── components/      # React components
│   │   └── ui/          # shadcn/ui components
│   ├── features/        # Feature modules
│   ├── hooks/           # Custom hooks
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── db/                  # Database
│   └── schema.ts        # Drizzle schema
├── lib/                 # Shared utilities
│   ├── logger.ts        # Logging utility
│   └── utils.ts         # Helper functions (cn)
└── shared/              # Shared types
    └── schemas/         # Zod validation schemas
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start both API and frontend |
| `bun run dev:api` | Start only API server |
| `bun run dev:ui` | Start only Vite dev server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run tests |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run ui:add` | Add shadcn/ui components |

---

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) for UI components.

```bash
# Add components
bun run ui:add button input card dialog

# Components are added to src/client/components/ui/
```

---

## Database

### Schema Location
Database schema is defined in `src/db/schema.ts` using Drizzle ORM.

### Commands
```bash
# Push schema changes to database
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## API Routes

API is built with [Hono](https://hono.dev) and runs on the Bun runtime.

```typescript
// src/app/index.ts
app.get('/api/health', (c) => c.json({ status: 'healthy' }));
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

## License

MIT
