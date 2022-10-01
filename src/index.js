"use strict";

const {
  ArrayPrototypeForEach,
  ArrayPrototypeIncludes,
  ArrayPrototypeMap,
  ArrayPrototypePush,
  ArrayPrototypePushApply,
  ArrayPrototypeShift,
  ArrayPrototypeSlice,
  ArrayPrototypeUnshiftApply,
  ObjectEntries,
  ObjectHasOwn,
  StringPrototypeCharAt,
  StringPrototypeIndexOf,
  StringPrototypeSlice,
  StringPrototypeStartsWith,
} = require("./primordials");

const {
  validateArray,
  validateBoolean,
  validateObject,
  validateString,
  validateUnion,
} = require("./validators");

const {
  findLongOptionForShort,
  isLoneLongOption,
  isLoneShortOption,
  isLongOptionAndValue,
  isOptionValue,
  isOptionLikeValue,
  isShortOptionAndValue,
  isShortOptionGroup,
  objectGetOwn,
  optionsGetOwn,

  // internal/utils
  kEmptyObject,
} = require("./utils");

const {
  codes: {
    ERR_INVALID_ARG_VALUE,
    ERR_PARSE_ARGS_INVALID_OPTION_VALUE,
    ERR_PARSE_ARGS_UNKNOWN_OPTION,
    ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL,
  },
} = require("./errors");

function getMainArgs() {
  const execArgv = process.execArgv;
  if (
    ArrayPrototypeIncludes(execArgv, "-e") ||
    ArrayPrototypeIncludes(execArgv, "--eval") ||
    ArrayPrototypeIncludes(execArgv, "-p") ||
    ArrayPrototypeIncludes(execArgv, "--print")
  ) {
    return ArrayPrototypeSlice(process.argv, 1);
  }
  return ArrayPrototypeSlice(process.argv, 2);
}

function checkOptionLikeValue(token) {
  if (!token.inlineValue && isOptionLikeValue(token.value)) {
    // Only show short example if user used short option.
    const example = StringPrototypeStartsWith(token.rawName, "--")
      ? `'${token.rawName}=-XYZ'`
      : `'--${token.name}=-XYZ' or '${token.rawName}-XYZ'`;
    const errorMessage = `Option '${token.rawName}' argument is ambiguous.
Did you forget to specify the option argument for '${token.rawName}'?
To specify an option argument starting with a dash use ${example}.`;
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(errorMessage);
  }
}

function checkOptionUsage(config, token) {
  if (!ObjectHasOwn(config.options, token.name)) {
    throw new ERR_PARSE_ARGS_UNKNOWN_OPTION(
      token.rawName,
      config.allowPositionals
    );
  }

  const short = optionsGetOwn(config.options, token.name, "short");
  const shortAndLong = `${short ? `-${short}, ` : ""}--${token.name}`;
  const type = optionsGetOwn(config.options, token.name, "type");
  if (type === "string" && typeof token.value !== "string") {
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(
      `Option '${shortAndLong} <value>' argument missing`
    );
  }
  if (type === "boolean" && token.value != null) {
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(
      `Option '${shortAndLong}' does not take an argument`
    );
  }
}

function storeOption(longOption, optionValue, options, values) {
  if (longOption === "__proto__") {
    return; // No. Just no.
  }

  const newValue = optionValue ?? true;
  if (optionsGetOwn(options, longOption, "multiple")) {
    if (values[longOption]) {
      ArrayPrototypePush(values[longOption], newValue);
    } else {
      values[longOption] = [newValue];
    }
  } else {
    values[longOption] = newValue;
  }
}

function argsToTokens(args, options) {
  const tokens = [];
  let index = -1;
  let groupCount = 0;

  const remainingArgs = ArrayPrototypeSlice(args);
  while (remainingArgs.length > 0) {
    const arg = ArrayPrototypeShift(remainingArgs);
    const nextArg = remainingArgs[0];
    if (groupCount > 0) groupCount--;
    else index++;

    if (arg === "--") {
      ArrayPrototypePush(tokens, { kind: "option-terminator", index });
      ArrayPrototypePushApply(
        tokens,
        ArrayPrototypeMap(remainingArgs, (arg) => {
          return { kind: "positional", index: ++index, value: arg };
        })
      );
      break;
    }

    if (isLoneShortOption(arg)) {
      const shortOption = StringPrototypeCharAt(arg, 1);
      const longOption = findLongOptionForShort(shortOption, options);
      let value;
      let inlineValue;
      if (
        optionsGetOwn(options, longOption, "type") === "string" &&
        isOptionValue(nextArg)
      ) {
        value = ArrayPrototypeShift(remainingArgs);
        inlineValue = false;
      }
      ArrayPrototypePush(tokens, {
        kind: "option",
        name: longOption,
        rawName: arg,
        index,
        value,
        inlineValue,
      });
      if (value != null) ++index;
      continue;
    }

    if (isShortOptionGroup(arg, options)) {
      const expanded = [];
      for (let index = 1; index < arg.length; index++) {
        const shortOption = StringPrototypeCharAt(arg, index);
        const longOption = findLongOptionForShort(shortOption, options);
        if (
          optionsGetOwn(options, longOption, "type") !== "string" ||
          index === arg.length - 1
        ) {
          ArrayPrototypePush(expanded, `-${shortOption}`);
        } else {
          ArrayPrototypePush(expanded, `-${StringPrototypeSlice(arg, index)}`);
          break;
        }
      }
      ArrayPrototypeUnshiftApply(remainingArgs, expanded);
      groupCount = expanded.length;
      continue;
    }

    if (isShortOptionAndValue(arg, options)) {
      const shortOption = StringPrototypeCharAt(arg, 1);
      const longOption = findLongOptionForShort(shortOption, options);
      const value = StringPrototypeSlice(arg, 2);
      ArrayPrototypePush(tokens, {
        kind: "option",
        name: longOption,
        rawName: `-${shortOption}`,
        index,
        value,
        inlineValue: true,
      });
      continue;
    }

    if (isLoneLongOption(arg)) {
      const longOption = StringPrototypeSlice(arg, 2);
      let value;
      let inlineValue;
      if (
        optionsGetOwn(options, longOption, "type") === "string" &&
        isOptionValue(nextArg)
      ) {
        value = ArrayPrototypeShift(remainingArgs);
        inlineValue = false;
      }
      ArrayPrototypePush(tokens, {
        kind: "option",
        name: longOption,
        rawName: arg,
        index,
        value,
        inlineValue,
      });
      if (value != null) ++index;
      continue;
    }

    if (isLongOptionAndValue(arg)) {
      const equalIndex = StringPrototypeIndexOf(arg, "=");
      const longOption = StringPrototypeSlice(arg, 2, equalIndex);
      const value = StringPrototypeSlice(arg, equalIndex + 1);
      ArrayPrototypePush(tokens, {
        kind: "option",
        name: longOption,
        rawName: `--${longOption}`,
        index,
        value,
        inlineValue: true,
      });
      continue;
    }

    ArrayPrototypePush(tokens, { kind: "positional", index, value: arg });
  }
  return tokens;
}

const parseArgs = (config = kEmptyObject) => {
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
  ArrayPrototypeForEach(
    ObjectEntries(options),
    ({ 0: longOption, 1: optionConfig }) => {
      validateObject(optionConfig, `options.${longOption}`);

      validateUnion(
        objectGetOwn(optionConfig, "type"),
        `options.${longOption}.type`,
        ["string", "boolean"]
      );

      if (ObjectHasOwn(optionConfig, "short")) {
        const shortOption = optionConfig.short;
        validateString(shortOption, `options.${longOption}.short`);
        if (shortOption.length !== 1) {
          throw new ERR_INVALID_ARG_VALUE(
            `options.${longOption}.short`,
            shortOption,
            "must be a single character"
          );
        }
      }

      if (ObjectHasOwn(optionConfig, "multiple")) {
        validateBoolean(
          optionConfig.multiple,
          `options.${longOption}.multiple`
        );
      }
    }
  );

  const tokens = argsToTokens(args, options);

  const result = {
    values: { __proto__: null },
    positionals: [],
  };
  if (returnTokens) {
    result.tokens = tokens;
  }
  ArrayPrototypeForEach(tokens, (token) => {
    if (token.kind === "option") {
      if (strict) {
        checkOptionUsage(parseConfig, token);
        checkOptionLikeValue(token);
      }
      storeOption(token.name, token.value, options, result.values);
    } else if (token.kind === "positional") {
      if (!allowPositionals) {
        throw new ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL(token.value);
      }
      ArrayPrototypePush(result.positionals, token.value);
    }
  });

  return result;
};

module.exports = {
  parseArgs,
};
