# Contributing to url2pdf

Thanks for your interest in improving url2pdf! This guide explains how to get set up, propose changes, and keep contributions smooth.

## Ways to Contribute

- Fix bugs or improve error handling.
- Enhance documentation or examples.
- Add tests that cover new or edge cases.
- Propose small features that improve the CLI or developer experience.

## Development Setup

- Node.js 18 or higher
- `pnpm` (recommended) or `npm`

Install dependencies:

```bash
pnpm install
```

Helpful scripts:

- `pnpm dev` — Hot-reload dev flow for rapid iteration.
- `pnpm build` — Bundle the CLI to `dist/cli.js` (required before `pnpm start`).
- `pnpm test` — Run the Vitest suite.

## Working Style

- Base changes off `main` unless a maintainer requests a branch.
- Keep PRs focused and small; include context on the problem and solution.
- Update or add tests when altering validation, options, or output behavior.
- Document user-facing changes in `docs/` when relevant.

## Reporting Issues

When filing an issue, include:

- Expected vs actual behavior
- Steps to reproduce
- CLI command(s) used and sample input JSON if applicable
- Environment details (OS, Node version)

## Pull Requests

- Run `pnpm test` before submitting.
- Provide before/after behavior in the description.
- Note any follow-up work if the change is incremental.

Thanks for helping make url2pdf better!
