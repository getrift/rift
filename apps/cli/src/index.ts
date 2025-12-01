#!/usr/bin/env node
import { Command } from 'commander';
import { logError, logSuccess } from './utils/logger.js';
import { runInit } from './commands/init.js';
import { runPull } from './commands/pull.js';
import { runFromCode } from './commands/fromCode.js';

const program = new Command();

program
  .name('rift')
  .description('Rift CLI')
  .version('0.0.1');

program
  .command('init')
  .description('Bootstrap the .rift spec directory')
  .option('-f, --force', 'Overwrite existing spec files')
  .action(async (options: { force?: boolean }) => {
    try {
      await runInit(process.cwd(), { force: options.force });
      logSuccess('Initialized .rift spec');
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('pull')
  .description('Mocked pull of design tokens/typography from Figma')
  .argument('[figmaFileId]', 'Figma File ID (optional)')
  .action(async (figmaFileId?: string) => {
    try {
      await runPull(process.cwd(), {
        figmaFileId,
        figmaToken: process.env.FIGMA_TOKEN,
      });
      logSuccess('Pull complete');
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('from-code')
  .description('Infer design rules from code using regex')
  .argument('[path]', 'Path to scan (relative to project root)')
  .action(async (scanPath?: string) => {
    try {
      await runFromCode(process.cwd(), { path: scanPath });
      logSuccess('Updated design rules from code');
    } catch (error) {
      handleError(error);
    }
  });

program.parseAsync(process.argv).catch(handleError);

function handleError(error: unknown): void {
  if (error instanceof Error) {
    logError(error.message);
  } else {
    logError('Unknown error occurred.');
  }
  process.exitCode = 1;
}
