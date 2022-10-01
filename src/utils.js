"use strict";

const { ObjectFreeze, ObjectCreate } = require("./primordials");
const {
  ArrayPrototypeFind,
  ObjectEntries,
  ObjectHasOwn,
  StringPrototypeCharAt,
  StringPrototypeIncludes,
  StringPrototypeStartsWith,
} = require("./primordials");
const { validateObject } = require("./validators");

const kEmptyObject = ObjectFreeze(ObjectCreate(null));

function objectGetOwn(obj, prop) {
  if (ObjectHasOwn(obj, prop)) return obj[prop];
}

function optionsGetOwn(options, longOption, prop) {
  if (ObjectHasOwn(options, longOption))
    return objectGetOwn(options[longOption], prop);
}

function isOptionValue(value) {
  if (value == null) return false;
  return true;
}

function isOptionLikeValue(value) {
  if (value == null) return false;

  return value.length > 1 && StringPrototypeCharAt(value, 0) === "-";
}

function isLoneShortOption(arg) {
  return (
    arg.length === 2 &&
    StringPrototypeCharAt(arg, 0) === "-" &&
    StringPrototypeCharAt(arg, 1) !== "-"
  );
}

function isLoneLongOption(arg) {
  return (
    arg.length > 2 &&
    StringPrototypeStartsWith(arg, "--") &&
    !StringPrototypeIncludes(arg, "=", 3)
  );
}

function isLongOptionAndValue(arg) {
  return (
    arg.length > 2 &&
    StringPrototypeStartsWith(arg, "--") &&
    StringPrototypeIncludes(arg, "=", 3)
  );
}

function isShortOptionGroup(arg, options) {
  if (arg.length <= 2) return false;
  if (StringPrototypeCharAt(arg, 0) !== "-") return false;
  if (StringPrototypeCharAt(arg, 1) === "-") return false;

  const firstShort = StringPrototypeCharAt(arg, 1);
  const longOption = findLongOptionForShort(firstShort, options);
  return optionsGetOwn(options, longOption, "type") !== "string";
}

function isShortOptionAndValue(arg, options) {
  validateObject(options, "options");

  if (arg.length <= 2) return false;
  if (StringPrototypeCharAt(arg, 0) !== "-") return false;
  if (StringPrototypeCharAt(arg, 1) === "-") return false;

  const shortOption = StringPrototypeCharAt(arg, 1);
  const longOption = findLongOptionForShort(shortOption, options);
  return optionsGetOwn(options, longOption, "type") === "string";
}

function findLongOptionForShort(shortOption, options) {
  validateObject(options, "options");
  const longOptionEntry = ArrayPrototypeFind(
    ObjectEntries(options),
    ({ 1: optionConfig }) => objectGetOwn(optionConfig, "short") === shortOption
  );
  return longOptionEntry?.[0] ?? shortOption;
}

module.exports = {
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

  kEmptyObject,
};
