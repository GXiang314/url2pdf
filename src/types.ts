export interface Url2PdfCliOptions {
  // Target URL to convert to PDF
  url?: string;

  // Custom title for the PDF file
  title?: string;

  // Batch process URLs from a JSON file
  batch?: string;

  // Debug mode, outputs more logs
  debug: boolean;
}

export interface Url2PdfAppOptions extends Url2PdfCliOptions {
  // Internal use only
}

export interface UriInfo {
  url: string;
  title?: string;
}

export type CommandInput = UriInfo[];
