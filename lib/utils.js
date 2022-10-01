"use strict";

var _require = require("./primordials"),
    ObjectFreeze = _require.ObjectFreeze,
    ObjectCreate = _require.ObjectCreate;

var _require2 = require("./primordials"),
    ArrayPrototypeFind = _require2.ArrayPrototypeFind,
    ObjectEntries = _require2.ObjectEntries,
    ObjectHasOwn = _require2.ObjectHasOwn,
    StringPrototypeCharAt = _require2.StringPrototypeCharAt,
    StringPrototypeIncludes = _require2.StringPrototypeIncludes,
    StringPrototypeStartsWith = _require2.StringPrototypeStartsWith;

var _require3 = require("./validators"),
    validateObject = _require3.validateObject;

var kEmptyObject = ObjectFreeze(ObjectCreate(null));

function objectGetOwn(obj, prop) {
  if (ObjectHasOwn(obj, prop)) return obj[prop];
}

function optionsGetOwn(options, longOption, prop) {
  if (ObjectHasOwn(options, longOption)) return objectGetOwn(options[longOption], prop);
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
  return arg.length === 2 && StringPrototypeCharAt(arg, 0) === "-" && StringPrototypeCharAt(arg, 1) !== "-";
}

function isLoneLongOption(arg) {
  return arg.length > 2 && StringPrototypeStartsWith(arg, "--") && !StringPrototypeIncludes(arg, "=", 3);
}

function isLongOptionAndValue(arg) {
  return arg.length > 2 && StringPrototypeStartsWith(arg, "--") && StringPrototypeIncludes(arg, "=", 3);
}

function isShortOptionGroup(arg, options) {
  if (arg.length <= 2) return false;
  if (StringPrototypeCharAt(arg, 0) !== "-") return false;
  if (StringPrototypeCharAt(arg, 1) === "-") return false;
  var firstShort = StringPrototypeCharAt(arg, 1);
  var longOption = findLongOptionForShort(firstShort, options);
  return optionsGetOwn(options, longOption, "type") !== "string";
}

function isShortOptionAndValue(arg, options) {
  validateObject(options, "options");
  if (arg.length <= 2) return false;
  if (StringPrototypeCharAt(arg, 0) !== "-") return false;
  if (StringPrototypeCharAt(arg, 1) === "-") return false;
  var shortOption = StringPrototypeCharAt(arg, 1);
  var longOption = findLongOptionForShort(shortOption, options);
  return optionsGetOwn(options, longOption, "type") === "string";
}

function findLongOptionForShort(shortOption, options) {
  var _longOptionEntry$;

  validateObject(options, "options");
  var longOptionEntry = ArrayPrototypeFind(ObjectEntries(options), function (_ref) {
    var optionConfig = _ref[1];
    return objectGetOwn(optionConfig, "short") === shortOption;
  });
  return (_longOptionEntry$ = longOptionEntry === null || longOptionEntry === void 0 ? void 0 : longOptionEntry[0]) !== null && _longOptionEntry$ !== void 0 ? _longOptionEntry$ : shortOption;
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
  kEmptyObject
};