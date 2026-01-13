import { ModuleService } from './services/module.service';
import { getCliProgram } from './helpers/cli-program';
import { Url2PdfCliOptions, CommandInput } from './types';
import { parseBatchFile, validateUri, validateUriList } from './helpers/batch-parser';
import { z } from 'zod';

const program = getCliProgram();

program.action(async (options: Url2PdfCliOptions) => {
    const moduleService = new ModuleService();
    let data: CommandInput = [];

    if (options.debug) {
        console.log('Debug mode enabled');
    }

    try {
        // Batch mode
        if (options.batch) {
            data = parseBatchFile(options.batch);
            console.log(`Processing ${data.length} URLs from batch file...`);
        }
        // Single URL mode
        else if (options.url) {
            // Validate URL format first
            const urlValidation = validateUri({
                url: options.url,
                title: options.title
            });
            
            if (!urlValidation.success) {
                console.error('Validation error:');
                urlValidation.error.issues.forEach(issue => {
                    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
                });
                process.exit(1);
            }
            
            data = [urlValidation.data];
            
            console.log(`Processing single URL: ${options.url}`);
        }
        // No valid options provided
        else {
            console.error('Error: Please provide either --url or --batch option');
            process.exit(1);
        }

        // Execute the conversion
        await moduleService.execute(data);
        
        console.log('Command completed');
        process.exit(0);

    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Validation error:');
            err.issues.forEach(issue => {
                console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
            });
        } else if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
});

program.parse();
