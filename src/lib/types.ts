/**
 * Type definitions for gen-rules CLI
 */

export interface ProjectConfig {
  name: string;
  description: string;
  folders: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  files: Record<string, boolean>;
}

export interface ModuleConfig {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  files: string[];
}

export interface CliOptions {
  targetPath: string;
  projectType: ProjectType;
  modules: string[];
  projectName: string;
}

export type ProjectType = 'fullstack' | 'frontend' | 'api' | 'minimal';

export const VALID_PROJECT_TYPES: ProjectType[] = ['fullstack', 'frontend', 'api', 'minimal'];
export const AVAILABLE_MODULES = ['docker', 'husky', 'testing', 'auth', 'shadcn'];

export const PROJECT_TYPE_DESCRIPTIONS: Record<ProjectType, string> = {
  fullstack: 'fullstack - SaaS, dashboard, full-stack web app',
  frontend: 'frontend - Portfolio, landing page, SPA',
  api: 'api - REST API, microservice, backend',
  minimal: 'minimal - CLI tool, library, script',
};
