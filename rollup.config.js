import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

// Single CLI build configuration
const cliConfig = {
  input: 'src/cli.ts',
  output: {
    file: 'dist/cli.js',
    format: 'es',
    banner: '#!/usr/bin/env node',
    sourcemap: false,
  },
  external: [
    'puppeteer',
    'fs',
    'path',
    'child_process',
    'os',
    'util',
    'events',
    'stream',
    'buffer',
    'crypto',
    'http',
    'https',
    'url',
    'zlib',
    'net',
    'tls',
    'readline',
    'commander',
    'zod',
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    json(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false,
      compilerOptions: {
        module: 'esnext',
      },
    }),
  ],
};

export default cliConfig;
