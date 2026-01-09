/**
 * Configuration loading utilities for gen-rules CLI
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import type { ProjectConfig, ModuleConfig } from './types';

const SCRIPT_DIR = dirname(import.meta.path);
export const TEMPLATES_DIR = join(SCRIPT_DIR, '..', '..', 'templates');
export const BASE_DIR = join(TEMPLATES_DIR, 'base');
export const CONFIGS_DIR = join(TEMPLATES_DIR, 'configs');
export const MODULES_DIR = join(TEMPLATES_DIR, 'modules');

export function loadProjectConfig(projectType: string): ProjectConfig {
  const configPath = join(CONFIGS_DIR, `${projectType}.json`);
  if (!existsSync(configPath)) {
    throw new Error(`Project type "${projectType}" not found`);
  }
  const content = readFileSync(configPath, 'utf-8');
  return JSON.parse(content) as ProjectConfig;
}

export function loadModuleConfig(moduleName: string): ModuleConfig | null {
  const configPath = join(MODULES_DIR, moduleName, 'config.json');
  if (!existsSync(configPath)) {
    return null;
  }
  const content = readFileSync(configPath, 'utf-8');
  return JSON.parse(content) as ModuleConfig;
}
