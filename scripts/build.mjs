#!/usr/bin/env node

/*eslint-env es2022*/

import { build } from "esbuild";

/** @type {import('esbuild').BuildOptions} */
const baseOptions = {
  entryPoints: ["./src/index.js"],
  minify: true,
  bundle: true,
  target: "node6",
  platform: "node",
};

/** @type {import('esbuild').BuildOptions} */
const cjsOptions = {
  ...baseOptions,
  format: "cjs",
  outfile: "./dist/index.js",
};

/** @type {import('esbuild').BuildOptions} */
const esmOptions = {
  ...baseOptions,
  format: "esm",
  outfile: "./dist/index.mjs",
};

await Promise.all([build(cjsOptions), build(esmOptions)]).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
