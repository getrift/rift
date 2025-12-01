import chalk from 'chalk';

export const $ = {
  brand: chalk.hex('#00FF99').bold,
  command: chalk.white.bgHex('#1A1A1A').bold,
  path: chalk.gray,
  success: chalk.black.bgHex('#00FF99').bold,
  error: chalk.white.bgHex('#FF3333').bold,
  key: chalk.cyan,
  value: chalk.white,
  dim: chalk.gray,
};

const prefix = $.brand('rift');

export function logInfo(message: string): void {
  console.log(prefix, message);
}

export function logSuccess(message: string): void {
  console.log($.success(' SUCCESS '), message);
}

export function logError(message: string): void {
  console.error($.error(' ERROR '), message);
}

export function logPath(path: string): void {
  console.log(prefix, $.path(path));
}

export function logKeyValue(key: string, value: string): void {
  console.log(prefix, `${$.key(key)}: ${$.value(value)}`);
}
