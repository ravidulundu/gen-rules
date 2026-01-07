#!/usr/bin/env bun
/**
 * gen-rules CLI Scaffolder
 * Creates new projects with predefined quality rules and configurations.
 */

import { $ } from 'bun';
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve, basename } from 'path';
import * as readline from 'readline';

// ============================================
// TYPES
// ============================================

interface ProjectConfig {
  name: string;
  description: string;
  folders: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  files: Record<string, boolean>;
}

interface ModuleConfig {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  files: string[];
}

interface CliOptions {
  targetPath: string;
  projectType: 'fullstack' | 'frontend' | 'api' | 'minimal';
  modules: string[];
  projectName: string;
}

// ============================================
// CONSTANTS
// ============================================

const SCRIPT_DIR = dirname(import.meta.path);
const TEMPLATES_DIR = join(SCRIPT_DIR, '..', 'templates');
const BASE_DIR = join(TEMPLATES_DIR, 'base');
const CONFIGS_DIR = join(TEMPLATES_DIR, 'configs');
const MODULES_DIR = join(TEMPLATES_DIR, 'modules');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// ============================================
// UTILITIES
// ============================================

function log(message: string, color: keyof typeof COLORS = 'reset'): void {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logStep(step: number, total: number, message: string): void {
  log(`[${step}/${total}] ${message}`, 'cyan');
}

function logSuccess(message: string): void {
  log(`✓ ${message}`, 'green');
}

function logError(message: string): void {
  log(`✗ ${message}`, 'red');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${COLORS.yellow}? ${question}${COLORS.reset} `, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function select(question: string, options: string[]): Promise<string> {
  log(`\n${question}`, 'yellow');
  options.forEach((opt, i) => {
    log(`  ${i + 1}) ${opt}`, 'reset');
  });
  const answer = await prompt('Select (1-' + options.length + '):');
  const index = parseInt(answer, 10) - 1;
  if (index >= 0 && index < options.length) {
    return options[index];
  }
  return options[0]; // Default to first option
}

async function multiSelect(question: string, options: string[]): Promise<string[]> {
  log(`\n${question} (comma-separated, e.g., 1,2,3 or 'all' or 'none')`, 'yellow');
  options.forEach((opt, i) => {
    log(`  ${i + 1}) ${opt}`, 'reset');
  });
  const answer = await prompt('Select:');

  if (answer.toLowerCase() === 'all') {
    return options;
  }
  if (answer.toLowerCase() === 'none' || answer === '') {
    return [];
  }

  const indices = answer.split(',').map((s) => parseInt(s.trim(), 10) - 1);
  return indices.filter((i) => i >= 0 && i < options.length).map((i) => options[i]);
}

function copyDirRecursive(src: string, dest: string): void {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// ============================================
// CORE FUNCTIONS
// ============================================

function loadProjectConfig(projectType: string): ProjectConfig {
  const configPath = join(CONFIGS_DIR, `${projectType}.json`);
  if (!existsSync(configPath)) {
    throw new Error(`Project type "${projectType}" not found`);
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function loadModuleConfig(moduleName: string): ModuleConfig | null {
  const configPath = join(MODULES_DIR, moduleName, 'config.json');
  if (!existsSync(configPath)) {
    return null;
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function createFolders(targetPath: string, folders: string[]): void {
  for (const folder of folders) {
    const fullPath = join(targetPath, folder);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }
}

function copyBaseFiles(targetPath: string): void {
  copyDirRecursive(BASE_DIR, targetPath);
}

function copyModuleFiles(targetPath: string, moduleName: string): void {
  const modulePath = join(MODULES_DIR, moduleName);
  const entries = readdirSync(modulePath);

  for (const entry of entries) {
    if (entry === 'config.json') continue; // Skip config file

    const srcPath = join(modulePath, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, join(targetPath, entry));
    } else {
      // Determine destination based on file type
      let destPath: string;
      if (entry.endsWith('.ts') && !entry.includes('config')) {
        // TypeScript files go to appropriate src folder
        if (entry.includes('middleware')) {
          destPath = join(targetPath, 'src', 'middleware', entry);
        } else if (entry.includes('auth')) {
          destPath = join(targetPath, 'src', 'lib', entry);
        } else if (entry.includes('setup') || entry.includes('test')) {
          destPath = join(targetPath, 'src', 'test', entry);
        } else {
          destPath = join(targetPath, 'src', 'lib', entry);
        }
      } else if (entry.startsWith('pre-')) {
        // Git hooks
        destPath = join(targetPath, '.husky', entry);
      } else {
        // Other files go to root
        destPath = join(targetPath, entry);
      }

      const destDir = dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(srcPath, destPath);
    }
  }
}

function generatePackageJson(
  targetPath: string,
  projectName: string,
  config: ProjectConfig,
  modules: ModuleConfig[],
): void {
  // Merge all dependencies
  const dependencies: Record<string, string> = { ...config.dependencies };
  const devDependencies: Record<string, string> = { ...config.devDependencies };
  const scripts: Record<string, string> = { ...config.scripts };

  for (const mod of modules) {
    if (mod.dependencies) {
      Object.assign(dependencies, mod.dependencies);
    }
    if (mod.devDependencies) {
      Object.assign(devDependencies, mod.devDependencies);
    }
    if (mod.scripts) {
      Object.assign(scripts, mod.scripts);
    }
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
  };

  writeFileSync(join(targetPath, 'package.json'), JSON.stringify(packageJson, null, 2));
}

function generateAdditionalFiles(targetPath: string, config: ProjectConfig): void {
  // Generate vite.config.ts if needed
  if (config.files['vite.config.ts']) {
    const viteConfig = `import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
`;
    writeFileSync(join(targetPath, 'vite.config.ts'), viteConfig);
  }

  // Generate drizzle.config.ts if needed
  if (config.files['drizzle.config.ts']) {
    const drizzleConfig = `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
`;
    writeFileSync(join(targetPath, 'drizzle.config.ts'), drizzleConfig);
  }

  // Generate tailwind.config.ts if needed
  if (config.files['tailwind.config.ts']) {
    const tailwindConfig = `import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        surface: '#030712',
        elevated: '#111827',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
`;
    writeFileSync(join(targetPath, 'tailwind.config.ts'), tailwindConfig);
  }

  // Generate postcss.config.cjs if needed
  if (config.files['postcss.config.cjs']) {
    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    writeFileSync(join(targetPath, 'postcss.config.cjs'), postcssConfig);
  }

  // Generate index.html if needed
  if (config.files['index.html']) {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${basename(targetPath)}</title>
  </head>
  <body class="bg-surface">
    <div id="root"></div>
    <script type="module" src="/src/client/main.tsx"></script>
  </body>
</html>
`;
    writeFileSync(join(targetPath, 'index.html'), indexHtml);
  }
}

function generateStarterFiles(targetPath: string, projectType: string): void {
  // Logger utility (always needed)
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
    if (process.env.NODE_ENV !== 'production') {
      console.log(\`[DEBUG] \${message}\`, data ?? '');
    }
  },
};
/* eslint-enable no-console */
`;

  const libDir = join(targetPath, 'src', 'lib');
  if (!existsSync(libDir)) {
    mkdirSync(libDir, { recursive: true });
  }
  writeFileSync(join(libDir, 'logger.ts'), loggerContent);

  // Entry point based on project type
  if (projectType === 'fullstack' || projectType === 'api') {
    const appDir = join(targetPath, 'src', projectType === 'fullstack' ? 'app' : '');
    if (!existsSync(appDir)) {
      mkdirSync(appDir, { recursive: true });
    }

    const indexContent = `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Logger } from '${projectType === 'fullstack' ? '../lib/logger' : './lib/logger'}';

const app = new Hono()
  .use('*', cors())
  .get('/api/health', (c) => c.json({ status: 'healthy', runtime: 'bun' }));

const PORT = process.env.PORT ?? 3000;

Logger.info(\`Server running on http://localhost:\${PORT}\`);

export default {
  port: PORT,
  fetch: app.fetch,
};

export type AppType = typeof app;
`;
    writeFileSync(join(appDir, 'index.ts'), indexContent);
  }

  if (projectType === 'fullstack' || projectType === 'frontend') {
    // React entry point
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
  }

  if (projectType === 'minimal') {
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

  // Database schema for fullstack and api
  if (projectType === 'fullstack' || projectType === 'api') {
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
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  log('\n╔════════════════════════════════════════╗', 'magenta');
  log('║       gen-rules Project Scaffolder     ║', 'magenta');
  log('╚════════════════════════════════════════╝\n', 'magenta');

  // Parse arguments
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('Usage: bun run create <target-path> [options]', 'yellow');
    log('\nOptions:', 'reset');
    log('  --type=<type>     Project type: fullstack, frontend, api, minimal', 'cyan');
    log('  --modules=<list>  Modules: docker,husky,testing,auth (comma-separated)', 'cyan');
    log('  --yes, -y         Skip confirmation prompt', 'cyan');
    log('\nExamples:', 'reset');
    log('  bun run create ~/projects/my-app', 'cyan');
    log('  bun run create ~/projects/my-app --type=fullstack --modules=docker,husky -y', 'cyan');
    rl.close();
    process.exit(0);
  }

  // Parse flags
  const flags: Record<string, string> = {};
  const positionalArgs: string[] = [];

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value ?? 'true';
    } else if (arg === '-y') {
      flags['yes'] = 'true';
    } else {
      positionalArgs.push(arg);
    }
  }

  const targetPath = resolve(positionalArgs[0]);
  const projectName = basename(targetPath);

  const skipConfirm = flags['yes'] === 'true';

  // Check if target exists
  if (existsSync(targetPath)) {
    if (skipConfirm) {
      log('Directory exists. Overwriting (--yes flag).', 'yellow');
    } else {
      const overwrite = await prompt(`Directory "${targetPath}" exists. Overwrite? (y/N):`);
      if (overwrite.toLowerCase() !== 'y') {
        log('Aborted.', 'red');
        rl.close();
        process.exit(1);
      }
    }
  }

  // Get project type (from flag or interactive)
  let projectType: CliOptions['projectType'];
  const validTypes = ['fullstack', 'frontend', 'api', 'minimal'];

  if (flags['type'] && validTypes.includes(flags['type'])) {
    projectType = flags['type'] as CliOptions['projectType'];
  } else {
    projectType = (await select('Select project type:', validTypes)) as CliOptions['projectType'];
  }

  // Get modules (from flag or interactive)
  const availableModules = ['docker', 'husky', 'testing', 'auth'];
  let selectedModules: string[];

  if (flags['modules']) {
    selectedModules = flags['modules'].split(',').filter((m) => availableModules.includes(m));
  } else {
    selectedModules = await multiSelect('Select modules to include:', availableModules);
  }

  log(`\n📦 Creating project: ${projectName}`, 'bright');
  log(`📁 Location: ${targetPath}`, 'reset');
  log(`📋 Type: ${projectType}`, 'reset');
  log(`🔧 Modules: ${selectedModules.length > 0 ? selectedModules.join(', ') : 'none'}`, 'reset');

  if (!skipConfirm) {
    const confirm = await prompt('\nProceed? (Y/n):');
    if (confirm.toLowerCase() === 'n') {
      log('Aborted.', 'red');
      rl.close();
      process.exit(1);
    }
  }

  const totalSteps = 6;

  // Step 1: Load configurations
  logStep(1, totalSteps, 'Loading configurations...');
  const projectConfig = loadProjectConfig(projectType);
  const moduleConfigs: ModuleConfig[] = [];
  for (const mod of selectedModules) {
    const config = loadModuleConfig(mod);
    if (config) {
      moduleConfigs.push(config);
    }
  }
  logSuccess('Configurations loaded');

  // Step 2: Create directory structure
  logStep(2, totalSteps, 'Creating directory structure...');
  mkdirSync(targetPath, { recursive: true });
  createFolders(targetPath, projectConfig.folders);
  logSuccess('Directory structure created');

  // Step 3: Copy base files
  logStep(3, totalSteps, 'Copying base configuration files...');
  copyBaseFiles(targetPath);
  logSuccess('Base files copied');

  // Step 4: Copy module files
  logStep(4, totalSteps, 'Copying module files...');
  for (const mod of selectedModules) {
    copyModuleFiles(targetPath, mod);
    logSuccess(`Module "${mod}" added`);
  }

  // Step 5: Generate project files
  logStep(5, totalSteps, 'Generating project files...');
  generatePackageJson(targetPath, projectName, projectConfig, moduleConfigs);
  generateAdditionalFiles(targetPath, projectConfig);
  generateStarterFiles(targetPath, projectType);
  logSuccess('Project files generated');

  // Step 6: Initialize git and install dependencies
  logStep(6, totalSteps, 'Initializing project...');
  process.chdir(targetPath);
  await $`git init`.quiet();

  // Make husky scripts executable
  if (selectedModules.includes('husky')) {
    const huskyDir = join(targetPath, '.husky');
    if (existsSync(join(huskyDir, 'pre-commit'))) {
      await $`chmod +x ${join(huskyDir, 'pre-commit')}`.quiet();
    }
    if (existsSync(join(huskyDir, 'pre-push'))) {
      await $`chmod +x ${join(huskyDir, 'pre-push')}`.quiet();
    }
  }

  logSuccess('Git initialized');

  // Success message
  log('\n╔════════════════════════════════════════╗', 'green');
  log('║          Project Created!              ║', 'green');
  log('╚════════════════════════════════════════╝\n', 'green');

  log('Next steps:', 'yellow');
  log(`  1. cd ${targetPath}`, 'cyan');
  log('  2. bun install', 'cyan');
  log('  3. bun run dev', 'cyan');

  if (projectType === 'fullstack' || projectType === 'api') {
    log('\nDatabase setup:', 'yellow');
    log('  1. Set DATABASE_URL in .env', 'cyan');
    log('  2. bun run db:push', 'cyan');
  }

  log('\n📖 Read CLAUDE.md for coding standards', 'magenta');

  rl.close();
}

main().catch((err) => {
  logError(`Error: ${err.message}`);
  rl.close();
  process.exit(1);
});
