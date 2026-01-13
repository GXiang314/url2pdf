import { Command } from 'commander';
import packageJson from '../../package.json';

export function getCliProgram(): Command {
  const program = new Command();

  return program
    .name('url2pdf')
    .description('CLI tool to convert web pages to PDF')
    .version(packageJson.version)
    .usage('[options]')
    .showHelpAfterError()
    .option('-u, --url <url>', 'Target URL to convert to PDF')
    .option('-t, --title <title>', 'Custom title for the PDF file')
    .option('-b, --batch <file>', 'Batch process URLs from a JSON file')
    .option('--debug', 'Debug mode, outputs more logs', false);
}
