/**
 * Create command for gen-rules CLI
 */

import { $ } from 'bun';
import { existsSync, mkdirSync } from 'fs';
import { resolve, basename, join } from 'path';
import type * as readline from 'readline';

import type { ProjectType, ModuleConfig } from '../lib/types';
import { VALID_PROJECT_TYPES, AVAILABLE_MODULES, PROJECT_TYPE_DESCRIPTIONS } from '../lib/types';
import { log, logStep, logSuccess, prompt, select, multiSelect } from '../lib/ui';
import { loadProjectConfig, loadModuleConfig } from '../lib/config';
import { createFolders, copyBaseFiles, copyModuleFiles } from '../lib/copy';
import { generatePackageJson, generateAdditionalFiles, generateStarterFiles } from '../lib/generate';

interface CreateFlags {
  type?: string;
  modules?: string;
  yes?: string;
}

export async function createCommand(
  rl: readline.Interface,
  positionalArgs: string[],
  flags: CreateFlags,
): Promise<void> {
  const targetPath = resolve(positionalArgs[0]);
  const projectName = basename(targetPath);
  const skipConfirm = flags.yes === 'true';

  if (existsSync(targetPath)) {
    if (skipConfirm) {
      log('Directory exists. Overwriting (--yes flag).', 'yellow');
    } else {
      const overwrite = await prompt(rl, `Directory "${targetPath}" exists. Overwrite? (y/N):`);
      if (overwrite.toLowerCase() !== 'y') {
        log('Aborted.', 'red');
        return;
      }
    }
  }

  let projectType: ProjectType;

  if (flags.type && VALID_PROJECT_TYPES.includes(flags.type as ProjectType)) {
    projectType = flags.type as ProjectType;
  } else {
    const typeOptions = VALID_PROJECT_TYPES.map((t) => PROJECT_TYPE_DESCRIPTIONS[t]);
    const selectedType = await select(rl, 'Select project type:', typeOptions);
    projectType = selectedType.split(' - ')[0] as ProjectType;
  }

  let selectedModules: string[];

  if (flags.modules !== undefined) {
    selectedModules = flags.modules.split(',').filter((m) => AVAILABLE_MODULES.includes(m));
  } else {
    selectedModules = await multiSelect(rl, 'Select modules to include:', AVAILABLE_MODULES);
  }

  log(`\n📦 Creating project: ${projectName}`, 'bright');
  log(`📁 Location: ${targetPath}`, 'reset');
  log(`📋 Type: ${projectType}`, 'reset');
  log(`🔧 Modules: ${selectedModules.length > 0 ? selectedModules.join(', ') : 'none'}`, 'reset');

  if (!skipConfirm) {
    const confirm = await prompt(rl, '\nProceed? (Y/n):');
    if (confirm.toLowerCase() === 'n') {
      log('Aborted.', 'red');
      return;
    }
  }

  const totalSteps = 6;

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

  logStep(2, totalSteps, 'Creating directory structure...');
  mkdirSync(targetPath, { recursive: true });
  createFolders(targetPath, projectConfig.folders);
  logSuccess('Directory structure created');

  logStep(3, totalSteps, 'Copying base configuration files...');
  copyBaseFiles(targetPath, projectType);
  logSuccess('Base files copied');

  logStep(4, totalSteps, 'Copying module files...');
  for (const mod of selectedModules) {
    copyModuleFiles(targetPath, mod);
    logSuccess(`Module "${mod}" added`);
  }

  logStep(5, totalSteps, 'Generating project files...');
  generatePackageJson(targetPath, projectName, projectConfig, moduleConfigs);
  generateAdditionalFiles(targetPath, projectConfig, projectType);
  generateStarterFiles(targetPath, projectType, projectName);
  logSuccess('Project files generated');

  logStep(6, totalSteps, 'Initializing project...');
  process.chdir(targetPath);
  await $`git init`.quiet();

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
}
