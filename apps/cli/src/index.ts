#!/usr/bin/env node
import { Command } from 'commander';
import { logError, logHeader } from './utils/logger.js';
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
    logHeader('init');
    try {
      await runInit(process.cwd(), { force: options.force });
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('pull')
  .description('Mocked pull of design tokens/typography from Figma')
  .argument('[figmaFileId]', 'Figma File ID (optional)')
  .action(async (figmaFileId?: string) => {
    logHeader('pull');
    try {
      await runPull(process.cwd(), {
        figmaFileId,
        figmaToken: process.env.FIGMA_TOKEN,
      });
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('from-code')
  .description('Infer design rules from code using regex')
  .argument('[path]', 'Path to scan (relative to project root)')
  .option('--dry-run', 'Scan code and print planned diffs without writing files')
  .action(async (scanPath: string | undefined, options: { dryRun?: boolean }) => {
    logHeader('from-code');
    try {
      await runFromCode(process.cwd(), { path: scanPath, dryRun: options.dryRun });
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
