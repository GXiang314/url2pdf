# url2pdf

A lightweight CLI tool to convert web pages to PDF files with batch processing support.

## Features

- 🚀 Simple one-command conversion for single URLs
- 📦 Batch processing from JSON files
- 🎯 Automatic or custom PDF naming
- ⚡ Fast Puppeteer-based rendering

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Convert a single URL
node dist/cli.js --url "https://example.com" --title "example"

# Batch convert from JSON file
node dist/cli.js --batch urls.json
```

## Documentation

- **[CLI Usage Guide](./docs/cli-usage.md)** - Complete command reference and examples
- **[Development Guide](./docs/development.md)** - Setup, project structure, and testing
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project

## Basic Commands

```bash
# Development with hot reload
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Execute built CLI
pnpm start
```

## Batch JSON Format

Create a JSON array with URL objects:

```json
[
  { "url": "https://example.com", "title": "example" },
  { "url": "https://github.com" }
]
```

## Output

PDFs are saved to `outputs/<timestamp>/` with automatic title generation from page titles when not specified.

## License

MIT
