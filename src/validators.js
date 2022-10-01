import ArrayPrototypeIncludes from "array-includes";
import ObjectHasOwn from "object.hasown";

/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L261
 */
export function validateArray(value, name, minLength = 0) {
  if (!Array.isArray(value)) {
    throw new Error(`The argument ${name} is invalid.`);
  }
  if (value.length < minLength) {
    const reason = `must be longer than ${minLength}`;
    throw new Error(`The argument ${name} ${reason}.`);
  }
}

/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L215
 */
export function validateBoolean(value, name) {
  if (typeof value !== "boolean") {
    throw new Error(`The argument ${name} is invalid.`);
  }
}

function getOwnPropertyValueOrDefault(options, key, defaultValue) {
  return options == null || !ObjectHasOwn(options, key)
    ? defaultValue
    : options[key];
}
/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L238
 */
export function validateObject(value, name, options = null) {
  const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
  const allowFunction = getOwnPropertyValueOrDefault(
    options,
    "allowFunction",
    false
  );
  const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
  if (
    (!nullable && value === null) ||
    (!allowArray && Array.isArray(value)) ||
    (typeof value !== "object" &&
      (!allowFunction || typeof value !== "function"))
  ) {
    throw new Error(`The argument ${name} is invalid.`);
  }
}

/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L400
 */
export const validateUnion = (value, name, union) => {
  if (ArrayPrototypeIncludes(union, value)) {
    throw new Error(`The argument ${name} is invalid.`);
  }
};

/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L159
 */
export function validateString(value, name) {
  if (typeof value !== "string") {
    throw new Error(`The argument ${name} is invalid.`);
  }
}
