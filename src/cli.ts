#!/usr/bin/env bun
/**
 * gen-rules CLI Scaffolder
 * Creates new projects with predefined quality rules and configurations.
 */

import { log, logError, createReadlineInterface } from './lib/ui';
import { createCommand } from './commands/create';

function showHelp(): void {
  log('Usage: bun run create <target-path> [options]', 'yellow');
  log('\nOptions:', 'reset');
  log('  --type=<type>     Project type: fullstack, frontend, api, minimal', 'cyan');
  log('  --modules=<list>  Modules: docker,husky,testing,auth,shadcn (comma-separated)', 'cyan');
  log('  --yes, -y         Skip confirmation prompt', 'cyan');
  log('\nExamples:', 'reset');
  log('  bun run create ~/projects/my-app', 'cyan');
  log('  bun run create ~/projects/my-app --type=fullstack --modules=docker,husky -y', 'cyan');
}

async function main(): Promise<void> {
  log('\n╔════════════════════════════════════════╗', 'magenta');
  log('║       gen-rules Project Scaffolder     ║', 'magenta');
  log('╚════════════════════════════════════════╝\n', 'magenta');

  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

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

  const rl = createReadlineInterface();

  try {
    await createCommand(rl, positionalArgs, flags);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  logError(`Error: ${err.message}`);
  process.exit(1);
});
