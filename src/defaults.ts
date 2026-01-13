import { Url2PdfCliOptions } from './types';

// Default options for production CLI (kept minimal)
export const DEFAULT_URL2PDF_OPTIONS: Url2PdfCliOptions = {
  url: undefined,
  title: undefined,
  batch: undefined,
  debug: false,
};

// Defaults used in dev mode for hot-reload iteration
export const DEFAULT_DEV_URL2PDF_OPTIONS: Url2PdfCliOptions = {
  url: 'https://example.com',
  title: 'example',
  batch: undefined,
  debug: true,
};
