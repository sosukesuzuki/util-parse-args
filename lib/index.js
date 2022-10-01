"use strict";

var _require = require("./primordials"),
    ArrayPrototypeForEach = _require.ArrayPrototypeForEach,
    ArrayPrototypeIncludes = _require.ArrayPrototypeIncludes,
    ArrayPrototypeMap = _require.ArrayPrototypeMap,
    ArrayPrototypePush = _require.ArrayPrototypePush,
    ArrayPrototypePushApply = _require.ArrayPrototypePushApply,
    ArrayPrototypeShift = _require.ArrayPrototypeShift,
    ArrayPrototypeSlice = _require.ArrayPrototypeSlice,
    ArrayPrototypeUnshiftApply = _require.ArrayPrototypeUnshiftApply,
    ObjectEntries = _require.ObjectEntries,
    ObjectHasOwn = _require.ObjectHasOwn,
    StringPrototypeCharAt = _require.StringPrototypeCharAt,
    StringPrototypeIndexOf = _require.StringPrototypeIndexOf,
    StringPrototypeSlice = _require.StringPrototypeSlice,
    StringPrototypeStartsWith = _require.StringPrototypeStartsWith;

var _require2 = require("./validators"),
    validateArray = _require2.validateArray,
    validateBoolean = _require2.validateBoolean,
    validateObject = _require2.validateObject,
    validateString = _require2.validateString,
    validateUnion = _require2.validateUnion;

var _require3 = require("./utils"),
    findLongOptionForShort = _require3.findLongOptionForShort,
    isLoneLongOption = _require3.isLoneLongOption,
    isLoneShortOption = _require3.isLoneShortOption,
    isLongOptionAndValue = _require3.isLongOptionAndValue,
    isOptionValue = _require3.isOptionValue,
    isOptionLikeValue = _require3.isOptionLikeValue,
    isShortOptionAndValue = _require3.isShortOptionAndValue,
    isShortOptionGroup = _require3.isShortOptionGroup,
    objectGetOwn = _require3.objectGetOwn,
    optionsGetOwn = _require3.optionsGetOwn,
    kEmptyObject = _require3.kEmptyObject;

var _require4 = require("./errors"),
    _require4$codes = _require4.codes,
    ERR_INVALID_ARG_VALUE = _require4$codes.ERR_INVALID_ARG_VALUE,
    ERR_PARSE_ARGS_INVALID_OPTION_VALUE = _require4$codes.ERR_PARSE_ARGS_INVALID_OPTION_VALUE,
    ERR_PARSE_ARGS_UNKNOWN_OPTION = _require4$codes.ERR_PARSE_ARGS_UNKNOWN_OPTION,
    ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL = _require4$codes.ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL;

function getMainArgs() {
  // Work out where to slice process.argv for user supplied arguments.
  // Check node options for scenarios where user CLI args follow executable.
  var execArgv = process.execArgv;

  if (ArrayPrototypeIncludes(execArgv, "-e") || ArrayPrototypeIncludes(execArgv, "--eval") || ArrayPrototypeIncludes(execArgv, "-p") || ArrayPrototypeIncludes(execArgv, "--print")) {
    return ArrayPrototypeSlice(process.argv, 1);
  } // Normally first two arguments are executable and script, then CLI arguments


  return ArrayPrototypeSlice(process.argv, 2);
}
/**
 * In strict mode, throw for possible usage errors like --foo --bar
 *
 * @param {object} token - from tokens as available from parseArgs
 */


function checkOptionLikeValue(token) {
  if (!token.inlineValue && isOptionLikeValue(token.value)) {
    // Only show short example if user used short option.
    var example = StringPrototypeStartsWith(token.rawName, "--") ? `'${token.rawName}=-XYZ'` : `'--${token.name}=-XYZ' or '${token.rawName}-XYZ'`;
    var errorMessage = `Option '${token.rawName}' argument is ambiguous.
Did you forget to specify the option argument for '${token.rawName}'?
To specify an option argument starting with a dash use ${example}.`;
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(errorMessage);
  }
}
/**
 * In strict mode, throw for usage errors.
 *
 * @param {object} config - from config passed to parseArgs
 * @param {object} token - from tokens as available from parseArgs
 */


function checkOptionUsage(config, token) {
  if (!ObjectHasOwn(config.options, token.name)) {
    throw new ERR_PARSE_ARGS_UNKNOWN_OPTION(token.rawName, config.allowPositionals);
  }

  var short = optionsGetOwn(config.options, token.name, "short");
  var shortAndLong = `${short ? `-${short}, ` : ""}--${token.name}`;
  var type = optionsGetOwn(config.options, token.name, "type");

  if (type === "string" && typeof token.value !== "string") {
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(`Option '${shortAndLong} <value>' argument missing`);
  } // (Idiomatic test for undefined||null, expecting undefined.)


  if (type === "boolean" && token.value != null) {
    throw new ERR_PARSE_ARGS_INVALID_OPTION_VALUE(`Option '${shortAndLong}' does not take an argument`);
  }
}
/**
 * Store the option value in `values`.
 *
 * @param {string} longOption - long option name e.g. 'foo'
 * @param {string|undefined} optionValue - value from user args
 * @param {object} options - option configs, from parseArgs({ options })
 * @param {object} values - option values returned in `values` by parseArgs
 */


function storeOption(longOption, optionValue, options, values) {
  if (longOption === "__proto__") {
    return; // No. Just no.
  } // We store based on the option value rather than option type,
  // preserving the users intent for author to deal with.


  var newValue = optionValue !== null && optionValue !== void 0 ? optionValue : true;

  if (optionsGetOwn(options, longOption, "multiple")) {
    // Always store value in array, including for boolean.
    // values[longOption] starts out not present,
    // first value is added as new array [newValue],
    // subsequent values are pushed to existing array.
    // (note: values has null prototype, so simpler usage)
    if (values[longOption]) {
      ArrayPrototypePush(values[longOption], newValue);
    } else {
      values[longOption] = [newValue];
    }
  } else {
    values[longOption] = newValue;
  }
}
/**
 * Process args and turn into identified tokens:
 * - option (along with value, if any)
 * - positional
 * - option-terminator
 *
 * @param {string[]} args - from parseArgs({ args }) or mainArgs
 * @param {object} options - option configs, from parseArgs({ options })
 */


function argsToTokens(args, options) {
  var tokens = [];
  var index = -1;
  var groupCount = 0;
  var remainingArgs = ArrayPrototypeSlice(args);

  while (remainingArgs.length > 0) {
    var arg = ArrayPrototypeShift(remainingArgs);
    var nextArg = remainingArgs[0];
    if (groupCount > 0) groupCount--;else index++; // Check if `arg` is an options terminator.
    // Guideline 10 in https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html

    if (arg === "--") {
      // Everything after a bare '--' is considered a positional argument.
      ArrayPrototypePush(tokens, {
        kind: "option-terminator",
        index
      });
      ArrayPrototypePushApply(tokens, ArrayPrototypeMap(remainingArgs, function (arg) {
        return {
          kind: "positional",
          index: ++index,
          value: arg
        };
      }));
      break; // Finished processing args, leave while loop.
    }

    if (isLoneShortOption(arg)) {
      // e.g. '-f'
      var shortOption = StringPrototypeCharAt(arg, 1);
      var longOption = findLongOptionForShort(shortOption, options);
      var value = void 0;
      var inlineValue = void 0;

      if (optionsGetOwn(options, longOption, "type") === "string" && isOptionValue(nextArg)) {
        // e.g. '-f', 'bar'
        value = ArrayPrototypeShift(remainingArgs);
        inlineValue = false;
      }

      ArrayPrototypePush(tokens, {
        kind: "option",
        name: longOption,
        rawName: arg,
        index,
        value,
        inlineValue
      });
      if (value != null) ++index;
      continue;
    }

    if (isShortOptionGroup(arg, options)) {
      // Expand -fXzy to -f -X -z -y
      var expanded = [];

      for (var _index = 1; _index < arg.length; _index++) {
        var _shortOption = StringPrototypeCharAt(arg, _index);

        var _longOption = findLongOptionForShort(_shortOption, options);

        if (optionsGetOwn(options, _longOption, "type") !== "string" || _index === arg.length - 1) {
          // Boolean option, or last short in group. Well formed.
          ArrayPrototypePush(expanded, `-${_shortOption}`);
        } else {
          // String option in middle. Yuck.
          // Expand -abfFILE to -a -b -fFILE
          ArrayPrototypePush(expanded, `-${StringPrototypeSlice(arg, _index)}`);
          break; // finished short group
        }
      }

      ArrayPrototypeUnshiftApply(remainingArgs, expanded);
      groupCount = expanded.length;
      continue;
    }

    if (isShortOptionAndValue(arg, options)) {
      // e.g. -fFILE
      var _shortOption2 = StringPrototypeCharAt(arg, 1);

      var _longOption2 = findLongOptionForShort(_shortOption2, options);

      var _value = StringPrototypeSlice(arg, 2);

      ArrayPrototypePush(tokens, {
        kind: "option",
        name: _longOption2,
        rawName: `-${_shortOption2}`,
        index,
        value: _value,
        inlineValue: true
      });
      continue;
    }

    if (isLoneLongOption(arg)) {
      // e.g. '--foo'
      var _longOption3 = StringPrototypeSlice(arg, 2);

      var _value2 = void 0;

      var _inlineValue = void 0;

      if (optionsGetOwn(options, _longOption3, "type") === "string" && isOptionValue(nextArg)) {
        // e.g. '--foo', 'bar'
        _value2 = ArrayPrototypeShift(remainingArgs);
        _inlineValue = false;
      }

      ArrayPrototypePush(tokens, {
        kind: "option",
        name: _longOption3,
        rawName: arg,
        index,
        value: _value2,
        inlineValue: _inlineValue
      });
      if (_value2 != null) ++index;
      continue;
    }

    if (isLongOptionAndValue(arg)) {
      // e.g. --foo=bar
      var equalIndex = StringPrototypeIndexOf(arg, "=");

      var _longOption4 = StringPrototypeSlice(arg, 2, equalIndex);

      var _value3 = StringPrototypeSlice(arg, equalIndex + 1);

      ArrayPrototypePush(tokens, {
        kind: "option",
        name: _longOption4,
        rawName: `--${_longOption4}`,
        index,
        value: _value3,
        inlineValue: true
      });
      continue;
    }

    ArrayPrototypePush(tokens, {
      kind: "positional",
      index,
      value: arg
    });
  }

  return tokens;
}

var parseArgs = function parseArgs() {
  var _objectGetOwn, _objectGetOwn2, _objectGetOwn3, _objectGetOwn4, _objectGetOwn5;

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : kEmptyObject;
  var args = (_objectGetOwn = objectGetOwn(config, "args")) !== null && _objectGetOwn !== void 0 ? _objectGetOwn : getMainArgs();
  var strict = (_objectGetOwn2 = objectGetOwn(config, "strict")) !== null && _objectGetOwn2 !== void 0 ? _objectGetOwn2 : true;
  var allowPositionals = (_objectGetOwn3 = objectGetOwn(config, "allowPositionals")) !== null && _objectGetOwn3 !== void 0 ? _objectGetOwn3 : !strict;
  var returnTokens = (_objectGetOwn4 = objectGetOwn(config, "tokens")) !== null && _objectGetOwn4 !== void 0 ? _objectGetOwn4 : false;
  var options = (_objectGetOwn5 = objectGetOwn(config, "options")) !== null && _objectGetOwn5 !== void 0 ? _objectGetOwn5 : {
    __proto__: null
  }; // Bundle these up for passing to strict-mode checks.

  var parseConfig = {
    args,
    strict,
    options,
    allowPositionals
  }; // Validate input configuration.

  validateArray(args, "args");
  validateBoolean(strict, "strict");
  validateBoolean(allowPositionals, "allowPositionals");
  validateBoolean(returnTokens, "tokens");
  validateObject(options, "options");
  ArrayPrototypeForEach(ObjectEntries(options), function (_ref) {
    var longOption = _ref[0],
        optionConfig = _ref[1];
    validateObject(optionConfig, `options.${longOption}`); // type is required

    validateUnion(objectGetOwn(optionConfig, "type"), `options.${longOption}.type`, ["string", "boolean"]);

    if (ObjectHasOwn(optionConfig, "short")) {
      var shortOption = optionConfig.short;
      validateString(shortOption, `options.${longOption}.short`);

      if (shortOption.length !== 1) {
        throw new ERR_INVALID_ARG_VALUE(`options.${longOption}.short`, shortOption, "must be a single character");
      }
    }

    if (ObjectHasOwn(optionConfig, "multiple")) {
      validateBoolean(optionConfig.multiple, `options.${longOption}.multiple`);
    }
  }); // Phase 1: identify tokens

  var tokens = argsToTokens(args, options); // Phase 2: process tokens into parsed option values and positionals

  var result = {
    values: {
      __proto__: null
    },
    positionals: []
  };

  if (returnTokens) {
    result.tokens = tokens;
  }

  ArrayPrototypeForEach(tokens, function (token) {
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
  parseArgs
};