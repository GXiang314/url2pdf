// Helper functions for filename generation
// Extracted for testing purposes

export function sanitizeFileName(fileName: string): string {
  const invalidCharsRegex = /[\\\/:*?"<>|,]+/g;
  return fileName.replace(invalidCharsRegex, '_');
}

export function urlToFilename(url: string): string {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export function titleToFilename(title: string): string {
  // decode html symbol
  const decodedTitle = title
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return sanitizeFileName(decodedTitle).replace(/\s+/g, ' ').trim();
}
