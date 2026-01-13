import { z } from 'zod';
import { UriInfo } from '../types';

/**
 * Schema for validating a single URI info object
 * Used for both single URL mode and batch file entries
 */
export const uriInfoSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().optional(),
});

/**
 * Schema for validating an array of URI info objects
 * Used for batch file validation
 */
export const uriListSchema = z.array(uriInfoSchema);

/**
 * Type-safe validation result
 */
export type ValidationResult<T> = z.SafeParseReturnType<T, T>;

/**
 * Validate a single URI object
 * @param uri URI object to validate
 * @returns Validation result with success status and data or error
 */
export function validateUri(uri: unknown): ValidationResult<UriInfo> {
  return uriInfoSchema.safeParse(uri);
}

/**
 * Validate an array of URI objects
 * @param uris Array of URI objects to validate
 * @returns Validation result with success status and data or error
 */
export function validateUriList(uris: unknown): ValidationResult<UriInfo[]> {
  return uriListSchema.safeParse(uris);
}
