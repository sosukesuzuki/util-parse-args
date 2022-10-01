import ArrayPrototypeIncludes from "array-includes";
import ObjectEntries from "object.entries";

import { Config } from "./types";
import { objectGetOwn } from "./utils";
import {
  validateArray,
  validateBoolean,
  validateObject,
  validateUnion,
} from "./validators";

function getMainArgs() {
  const execArgv = process.execArgv;
  if (
    ArrayPrototypeIncludes(execArgv, "-e") ||
    ArrayPrototypeIncludes(execArgv, "--eval") ||
    ArrayPrototypeIncludes(execArgv, "-p") ||
    ArrayPrototypeIncludes(execArgv, "--print")
  ) {
    return process.argv.slice(1);
  }
  return process.argv.slice(2);
}

/**
 * https://github.com/nodejs/node/blob/main/lib/internal/util/parse_args/parse_args.js
 */
export const parseArgs = <T extends Config>(config: T) => {
  const args = objectGetOwn(config, "args") ?? getMainArgs();
  const strict = objectGetOwn(config, "strict") ?? true;
  const allowPositionals = objectGetOwn(config, "allowPositionals") ?? !strict;
  const returnTokens = objectGetOwn(config, "tokens") ?? false;

  const options = objectGetOwn(config, "options") ?? { __proto__: null };

  const parseConfig = { args, strict, options, allowPositionals };

  validateArray(args, "args");
  validateBoolean(strict, "strict");
  validateBoolean(allowPositionals, "allowPositionals");
  validateBoolean(returnTokens, "tokens");
  validateObject(options, "options");

  ObjectEntries(options).forEach(({ 0: longOption, 1: optionConfig }) => {
    validateObject(optionConfig, `options.${longOption}`);

    validateUnion(
      objectGetOwn(optionConfig, "type"),
      `options.${longOption}.type`,
      ["string", "boolean"]
    );
  });

  console.log(parseConfig);
};
