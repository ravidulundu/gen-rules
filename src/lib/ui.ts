/**
 * Terminal UI utilities for gen-rules CLI
 */

import * as readline from 'readline';

export const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
} as const;

type ColorKey = keyof typeof COLORS;

export function log(message: string, color: ColorKey = 'reset'): void {
  // eslint-disable-next-line no-console
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

export function logStep(step: number, total: number, message: string): void {
  log(`[${step}/${total}] ${message}`, 'cyan');
}

export function logSuccess(message: string): void {
  log(`✓ ${message}`, 'green');
}

export function logError(message: string): void {
  log(`✗ ${message}`, 'red');
}

export function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${COLORS.yellow}? ${question}${COLORS.reset} `, (answer) => {
      resolve(answer.trim());
    });
  });
}

export async function select(
  rl: readline.Interface,
  question: string,
  options: string[],
): Promise<string> {
  log(`\n${question}`, 'yellow');
  options.forEach((opt, i) => {
    log(`  ${i + 1}) ${opt}`, 'reset');
  });
  const answer = await prompt(rl, `Select (1-${options.length}):`);
  const index = parseInt(answer, 10) - 1;
  if (index >= 0 && index < options.length) {
    return options[index];
  }
  return options[0];
}

export async function multiSelect(
  rl: readline.Interface,
  question: string,
  options: string[],
): Promise<string[]> {
  log(`\n${question} (comma-separated, e.g., 1,2,3 or 'all' or 'none')`, 'yellow');
  options.forEach((opt, i) => {
    log(`  ${i + 1}) ${opt}`, 'reset');
  });
  const answer = await prompt(rl, 'Select:');

  if (answer.toLowerCase() === 'all') {
    return options;
  }
  if (answer.toLowerCase() === 'none' || answer === '') {
    return [];
  }

  const indices = answer.split(',').map((s) => parseInt(s.trim(), 10) - 1);
  return indices.filter((i) => i >= 0 && i < options.length).map((i) => options[i]);
}
