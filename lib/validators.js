"use strict";

var _require = require("./primordials"),
    ObjectHasOwn = _require.ObjectHasOwn,
    ArrayIsArray = _require.ArrayIsArray,
    ArrayPrototypeJoin = _require.ArrayPrototypeJoin,
    ArrayPrototypeIncludes = _require.ArrayPrototypeIncludes;

var _require2 = require("./errors"),
    _require2$codes = _require2.codes,
    ERR_INVALID_ARG_TYPE = _require2$codes.ERR_INVALID_ARG_TYPE,
    ERR_INVALID_ARG_VALUE = _require2$codes.ERR_INVALID_ARG_VALUE;

function validateBoolean(value, name) {
  if (typeof value !== "boolean") throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
}

var validateArray = function validateArray(value, name) {
  var minLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!ArrayIsArray(value)) {
    throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
  }

  if (value.length < minLength) {
    var reason = `must be longer than ${minLength}`;
    throw new ERR_INVALID_ARG_VALUE(name, value, reason);
  }
};

function getOwnPropertyValueOrDefault(options, key, defaultValue) {
  return options == null || !ObjectHasOwn(options, key) ? defaultValue : options[key];
}

var validateObject = function validateObject(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
  var allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
  var nullable = getOwnPropertyValueOrDefault(options, "nullable", false);

  if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
    throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
  }
};

function validateString(value, name) {
  if (typeof value !== "string") throw new ERR_INVALID_ARG_TYPE(name, "string", value);
}

function validateUnion(value, name, union) {
  if (!ArrayPrototypeIncludes(union, value)) {
    throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
  }
}

module.exports = {
  validateArray,
  validateBoolean,
  validateObject,
  validateString,
  validateUnion
};