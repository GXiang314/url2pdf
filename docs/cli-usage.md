# CLI Command Reference

Complete command-line parameters and basic usage for the url2pdf CLI.

## Prerequisites

- Node.js 18 or higher
- `pnpm` (recommended) or `npm`

## Installation

```bash
pnpm install
```

## Build the CLI

```bash
pnpm build
```

This produces `dist/cli.js`, which the commands below invoke.

## Quick Start

### Single URL

```bash
node dist/cli.js --url "https://example.com" --title "example"
```

- `--url` is required for single-URL runs.
- `--title` is optional; if omitted, the page title is used.

### Batch JSON

Create a JSON file containing an array of URL objects:

```json
[
  { "url": "https://example.com", "title": "example" },
  { "url": "https://github.com", "title": "github" }
]
```

Run the CLI in batch mode:

```bash
node dist/cli.js --batch urls.json
```

## CLI Options

- `-u, --url <url>` — Target URL to convert to PDF (required for single runs).
- `-t, --title <title>` — Custom title for the PDF file; falls back to the page title.
- `-b, --batch <file>` — Path to a JSON file containing an array of `{ url, title? }` objects.
- `--debug` — Enable verbose logging.
- `-V, --version` — Show the CLI version.
- `-h, --help` — Display help.

## Input Validation

- URLs must be valid absolute URLs; invalid entries stop execution with clear validation errors.
- Batch files must be valid JSON arrays matching `{ url: string; title?: string }`.
- The CLI exits with code `1` if validation or file parsing fails.

## Output

- PDFs are written to `outputs/<timestamp>/`.
- Failed entries (if any) are recorded in `outputs/<timestamp>_failed.json`.
- Filenames use the provided title; otherwise they derive from the page title.

## Debug Mode

Pass `--debug` to print additional logs while running conversions.

## Examples

```bash
# Single URL with auto title
node dist/cli.js --url "https://developer.mozilla.org"

# Batch conversion
node dist/cli.js --batch urls.json

# Verbose run
node dist/cli.js --url "https://example.com" --debug
```
