# Development

Guidance for customizing url2pdf, understanding the project layout, and running the tool in dev and test modes.

## Prerequisites

- Node.js 18 or higher
- `pnpm` (recommended) or `npm`
- Puppeteer downloads Chromium automatically on install; no extra setup required.

## Setup

```bash
pnpm install
```

## Project Structure

- `src/cli.ts` — CLI entry; parses options and orchestrates runs.
- `src/dev.ts` — Dev entry; hot-reload friendly single-URL flow with defaults.
- `src/defaults.ts` — Default options for prod and dev runs.
- `src/services/module.service.ts` — Puppeteer-based conversion pipeline and output handling.
- `src/helpers/` — CLI wiring (`cli-program.ts`), batch parser, and filename helpers.
- `src/utils/validation.ts` — Zod schemas for URL and batch validation.
- `outputs/` — Timestamped PDF outputs and failure logs.

## Commands

- `pnpm dev` — Runs `src/dev.ts` with hot reload (`tsx watch`); uses `DEFAULT_DEV_URL2PDF_OPTIONS` unless overridden via flags.
- `pnpm build` — Bundles the CLI to `dist/cli.js` via Rollup.
- `pnpm start` — Executes `dist/cli.js` (requires prior build).
- `pnpm test` — Runs the Vitest suite (unit + integration).

## Developing Locally

1. Update defaults if desired: edit `DEFAULT_DEV_URL2PDF_OPTIONS` in `src/defaults.ts`.
2. Run `pnpm dev` to use the default URL (configured in `src/defaults.ts`).
3. Inspect output under `outputs/<timestamp>/` and iterate.

## Validation and Inputs

- Single runs and batch runs share the Zod schemas in `src/utils/validation.ts`.
- Batch files must be JSON arrays of `{ url: string; title?: string }`.
- On validation errors, the CLI exits with code `1` after printing field-level messages.

## Testing

```bash
pnpm test
```

The suite covers option parsing, validation, batch parsing, and filename handling. Run tests after changing CLI flags, validation rules, or output behavior.
