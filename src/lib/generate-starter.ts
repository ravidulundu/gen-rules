/**
 * Starter file generation for gen-rules CLI
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, '..', '..', 'templates');

export function generateStarterFiles(targetPath: string, projectType: string, projectName: string): void {
  const loggerContent = `/* eslint-disable no-console */
/**
 * Centralized logging utility
 * Use this instead of console.log to comply with linting rules.
 */
export const Logger = {
  info: (message: string, data?: unknown): void => {
    console.log(\`[INFO] \${message}\`, data ?? '');
  },
  error: (message: string, data?: unknown): void => {
    console.error(\`[ERROR] \${message}\`, data ?? '');
  },
  warn: (message: string, data?: unknown): void => {
    console.warn(\`[WARN] \${message}\`, data ?? '');
  },
  debug: (message: string, data?: unknown): void => {
    console.log(\`[DEBUG] \${message}\`, data ?? '');
  },
};
/* eslint-enable no-console */
`;

  const libDir = join(targetPath, 'src', 'lib');
  if (!existsSync(libDir)) {
    mkdirSync(libDir, { recursive: true });
  }
  writeFileSync(join(libDir, 'logger.ts'), loggerContent);

  if (projectType === 'fullstack' || projectType === 'api') {
    generateBackendFiles(targetPath, projectType);
  }

  if (projectType === 'fullstack' || projectType === 'frontend') {
    generateFrontendFiles(targetPath, projectType, libDir);
  }

  if (projectType === 'minimal') {
    generateMinimalFiles(targetPath);
  }

  if (projectType === 'fullstack' || projectType === 'api') {
    generateDatabaseFiles(targetPath);
  }

  generateReadme(targetPath, projectType, projectName);
}

function generateBackendFiles(targetPath: string, projectType: string): void {
  const appDir = join(targetPath, 'src', projectType === 'fullstack' ? 'app' : '');
  if (!existsSync(appDir)) {
    mkdirSync(appDir, { recursive: true });
  }

  const indexContent = `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Logger } from '${projectType === 'fullstack' ? '../lib/logger' : './lib/logger'}';

const DEFAULT_PORT = 3000;

const app = new Hono()
  .use('*', cors())
  .get('/api/health', (c) => c.json({ status: 'healthy', runtime: 'bun' }));

const PORT = process.env['PORT'] ?? DEFAULT_PORT;

Logger.info(\`Server running on http://localhost:\${PORT}\`);

export default {
  port: PORT,
  fetch: app.fetch,
};

export type AppType = typeof app;
`;
  writeFileSync(join(appDir, 'index.ts'), indexContent);
}

function generateFrontendFiles(targetPath: string, projectType: string, libDir: string): void {
  const clientDir = join(targetPath, 'src', projectType === 'fullstack' ? 'client' : '');
  if (!existsSync(clientDir)) {
    mkdirSync(clientDir, { recursive: true });
  }

  const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

  const appContent = `import React from 'react';

export default function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-surface text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome</h1>
        <p className="text-gray-400">Your project is ready.</p>
      </div>
    </div>
  );
}
`;

  const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface text-white antialiased;
  }
}
`;

  writeFileSync(join(clientDir, 'main.tsx'), mainContent);
  writeFileSync(join(clientDir, 'App.tsx'), appContent);
  writeFileSync(join(clientDir, 'index.css'), cssContent);

  const utilsContent = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`;
  writeFileSync(join(libDir, 'utils.ts'), utilsContent);

  const isFullstack = projectType === 'fullstack';
  const componentsJsonContent = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: true,
    tailwind: {
      config: 'tailwind.config.ts',
      css: isFullstack ? 'src/client/index.css' : 'src/index.css',
      baseColor: 'zinc',
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      components: isFullstack ? '@/client/components' : '@/components',
      utils: '@/lib/utils',
      ui: isFullstack ? '@/client/components/ui' : '@/components/ui',
      lib: '@/lib',
      hooks: isFullstack ? '@/client/hooks' : '@/hooks',
    },
    iconLibrary: 'lucide',
  };
  writeFileSync(join(targetPath, 'components.json'), JSON.stringify(componentsJsonContent, null, 2));
}

function generateMinimalFiles(targetPath: string): void {
  const srcDir = join(targetPath, 'src');
  if (!existsSync(srcDir)) {
    mkdirSync(srcDir, { recursive: true });
  }

  const indexContent = `import { Logger } from './lib/logger';

function main(): void {
  Logger.info('Application started');
}

main();
`;
  writeFileSync(join(srcDir, 'index.ts'), indexContent);
}

function generateDatabaseFiles(targetPath: string): void {
  const dbDir = join(targetPath, 'src', 'db');
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const schemaContent = `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
`;
  writeFileSync(join(dbDir, 'schema.ts'), schemaContent);
}

function generateReadme(targetPath: string, projectType: string, projectName: string): void {
  const readmeTemplatePath = join(TEMPLATES_DIR, 'readme', `${projectType}.md`);

  if (!existsSync(readmeTemplatePath)) {
    return;
  }

  const template = readFileSync(readmeTemplatePath, 'utf-8');
  const readme = template.replace(/\{\{PROJECT_NAME\}\}/g, projectName);

  writeFileSync(join(targetPath, 'README.md'), readme);
}
