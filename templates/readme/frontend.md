# {{PROJECT_NAME}}

> Frontend application built with React 19, Vite, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Framework** | [React 19](https://react.dev) |
| **Build Tool** | [Vite](https://vitejs.dev) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Validation** | [Zod](https://zod.dev) |

---

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:5173
```

---

## Project Structure

```
src/
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── features/            # Feature modules
├── hooks/               # Custom hooks
├── lib/                 # Utilities
│   ├── logger.ts        # Logging utility
│   └── utils.ts         # Helper functions (cn)
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript type checking |
| `bun run ui:add` | Add shadcn/ui components |

---

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) for UI components.

```bash
# Add components
bun run ui:add button input card dialog toast

# Components are added to src/components/ui/
```

---

## Styling

### Tailwind CSS
Global styles are in `src/index.css`. Tailwind configuration is in `tailwind.config.ts`.

### CSS Variables
Theme colors are defined as CSS variables in `index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    /* ... */
  }
}
```

### Utility Function
Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />
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

```bash
# Build for production
bun run build

# Output is in dist/
# Deploy to any static hosting (Vercel, Netlify, Cloudflare Pages)
```

---

## License

MIT
