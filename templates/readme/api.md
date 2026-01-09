# {{PROJECT_NAME}}

> Backend API service built with Hono and Drizzle ORM.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Framework** | [Hono](https://hono.dev) |
| **Database** | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL |
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

# Start development server
bun run dev

# API is running at http://localhost:3000
```

---

## Project Structure

```
src/
├── routes/              # API route handlers
├── middleware/          # Custom middleware
├── db/                  # Database
│   └── schema.ts        # Drizzle schema
├── lib/                 # Utilities
│   └── logger.ts        # Logging utility
├── shared/              # Shared types
│   └── schemas/         # Zod validation schemas
└── index.ts             # Entry point
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run tests |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |

---

## API Routes

### Health Check
```
GET /api/health
Response: { "status": "healthy", "runtime": "bun" }
```

### Adding Routes

```typescript
// src/routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const users = new Hono()
  .get('/', (c) => c.json({ users: [] }))
  .post('/',
    zValidator('json', z.object({ email: z.string().email() })),
    (c) => {
      const { email } = c.req.valid('json');
      return c.json({ email }, 201);
    }
  );

export default users;
```

---

## Database

### Schema Definition
```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Commands
```bash
# Push schema changes
bun run db:push

# Open database GUI
bun run db:studio
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
```

---

## Middleware

### Adding Custom Middleware
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono()
  .use('*', cors())
  .use('*', logger());
```

---

## Error Handling

```typescript
import { HTTPException } from 'hono/http-exception';

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: 'Internal Server Error' }, 500);
});
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

## Deployment

### Docker
```bash
docker build -t {{PROJECT_NAME}} .
docker run -p 3000:3000 {{PROJECT_NAME}}
```

### Environment
Ensure these environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)

---

## License

MIT
