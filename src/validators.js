"use strict";

const {
  ObjectHasOwn,
  ArrayIsArray,
  ArrayPrototypeJoin,
  ArrayPrototypeIncludes,
} = require("./primordials");

const {
  codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE },
} = require("./errors");

function validateBoolean(value, name) {
  if (typeof value !== "boolean")
    throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
}

const validateArray = (value, name, minLength = 0) => {
  if (!ArrayIsArray(value)) {
    throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
  }
  if (value.length < minLength) {
    const reason = `must be longer than ${minLength}`;
    throw new ERR_INVALID_ARG_VALUE(name, value, reason);
  }
};

function getOwnPropertyValueOrDefault(options, key, defaultValue) {
  return options == null || !ObjectHasOwn(options, key)
    ? defaultValue
    : options[key];
}
const validateObject = (value, name, options = null) => {
  const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
  const allowFunction = getOwnPropertyValueOrDefault(
    options,
    "allowFunction",
    false
  );
  const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
  if (
    (!nullable && value === null) ||
    (!allowArray && ArrayIsArray(value)) ||
    (typeof value !== "object" &&
      (!allowFunction || typeof value !== "function"))
  ) {
    throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
  }
};

function validateString(value, name) {
  if (typeof value !== "string")
    throw new ERR_INVALID_ARG_TYPE(name, "string", value);
}

function validateUnion(value, name, union) {
  if (!ArrayPrototypeIncludes(union, value)) {
    throw new ERR_INVALID_ARG_TYPE(
      name,
      `('${ArrayPrototypeJoin(union, "|")}')`,
      value
    );
  }
}

module.exports = {
  validateArray,
  validateBoolean,
  validateObject,
  validateString,
  validateUnion,
};
