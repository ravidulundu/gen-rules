/**
 * File generation utilities for gen-rules CLI
 */

import { writeFileSync } from 'fs';
import { join, basename } from 'path';
import type { ProjectConfig, ModuleConfig } from './types';

// Re-export from generate-starter
export { generateStarterFiles } from './generate-starter';

export function generatePackageJson(
  targetPath: string,
  projectName: string,
  config: ProjectConfig,
  modules: ModuleConfig[],
): void {
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

export function generateAdditionalFiles(
  targetPath: string,
  config: ProjectConfig,
  projectType: string,
): void {
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

  if (config.files['index.html']) {
    const mainPath = projectType === 'fullstack' ? '/src/client/main.tsx' : '/src/main.tsx';
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${basename(targetPath)}</title>
  </head>
  <body class="bg-surface">
    <div id="root"></div>
    <script type="module" src="${mainPath}"></script>
  </body>
</html>
`;
    writeFileSync(join(targetPath, 'index.html'), indexHtml);
  }
}
