/**
 * File copying utilities for gen-rules CLI
 */

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { BASE_DIR, MODULES_DIR } from './config';

export function copyDirRecursive(src: string, dest: string): void {
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

export function createFolders(targetPath: string, folders: string[]): void {
  for (const folder of folders) {
    const fullPath = join(targetPath, folder);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }
}

export function copyBaseFiles(targetPath: string, projectType: string): void {
  const entries = readdirSync(BASE_DIR);
  const isReactProject = projectType === 'fullstack' || projectType === 'frontend';

  for (const entry of entries) {
    const srcPath = join(BASE_DIR, entry);
    const stat = statSync(srcPath);

    // Skip the wrong ESLint config
    if (entry === 'eslint.config.js' && !isReactProject) continue;
    if (entry === 'eslint.config.api.js' && isReactProject) continue;

    // Rename api config to standard name
    const destName = entry === 'eslint.config.api.js' ? 'eslint.config.js' : entry;
    const destPath = join(targetPath, destName);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

export function copyModuleFiles(targetPath: string, moduleName: string): void {
  const modulePath = join(MODULES_DIR, moduleName);
  const entries = readdirSync(modulePath);

  for (const entry of entries) {
    if (entry === 'config.json') continue;

    const srcPath = join(modulePath, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, join(targetPath, entry));
    } else {
      let destPath: string;
      if (entry.endsWith('.ts') && !entry.includes('config')) {
        if (entry.includes('middleware')) {
          destPath = join(targetPath, 'src', 'middleware', entry);
        } else if (entry.includes('auth')) {
          destPath = join(targetPath, 'src', 'lib', entry);
        } else if (entry.includes('setup') || entry.includes('test')) {
          destPath = join(targetPath, 'src', 'test', entry);
        } else if (entry === 'utils.ts' && moduleName === 'shadcn') {
          destPath = join(targetPath, 'src', 'lib', entry);
        } else {
          destPath = join(targetPath, 'src', 'lib', entry);
        }
      } else if (entry.startsWith('pre-')) {
        destPath = join(targetPath, '.husky', entry);
      } else {
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
