import { ModuleService } from './services/module.service';
import { getCliProgram } from './helpers/cli-program';
import { Url2PdfCliOptions, CommandInput } from './types';
import { DEFAULT_DEV_URL2PDF_OPTIONS } from './defaults';
import { validateUri } from './utils/validation';

const program = getCliProgram();

program.action(async (options: Url2PdfCliOptions) => {
  const moduleService = new ModuleService();

  // Merge defaults for rapid iteration
  const devOptions: Url2PdfCliOptions = {
    ...DEFAULT_DEV_URL2PDF_OPTIONS,
    ...options,
  };

  if (devOptions.debug) {
    console.log('Dev mode: debug enabled');
  }

  try {
    // Always single URL mode in dev
    const urlValidation = validateUri({
      url: devOptions.url,
      title: devOptions.title,
    });

    if (!urlValidation.success) {
      console.error('Validation error:');
      urlValidation.error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      process.exit(1);
    }

    const data: CommandInput = [urlValidation.data];
    console.log(`Dev mode processing URL: ${devOptions.url}`);

    await moduleService.execute(data);
    console.log('Dev command completed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

program.parse();
