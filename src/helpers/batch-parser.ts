import fs from 'fs';
import path from 'path';
import { CommandInput } from '../types';
import { uriListSchema, validateUri, validateUriList } from '../utils/validation';

// Re-export validation functions for backward compatibility
export { validateUri, validateUriList } from '../utils/validation';

/**
 * Parse batch JSON file and return validated URI list
 * @param filePath Path to the batch JSON file
 * @returns Validated CommandInput array
 * @throws Error if file not found or validation fails
 */
export function parseBatchFile(filePath: string): CommandInput {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Batch file not found: ${resolvedPath}`);
  }

  const fileContent = fs.readFileSync(resolvedPath, 'utf8');
  const batchData = JSON.parse(fileContent);
  
  return uriListSchema.parse(batchData);
}
