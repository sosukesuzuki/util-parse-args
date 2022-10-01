import ArrayPrototypeIncludes from "array-includes";

/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L261
 */
export function validateArray(
  value: unknown,
  name: string,
  minLength = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): asserts value is Array<any> {
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
export function validateBoolean(
  value: unknown,
  name: string
): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(`The argument ${name} is invalid.`);
  }
}

function getOwnPropertyValueOrDefault<T extends object, S extends keyof T>(
  options: T | null,
  key: S,
  defaultValue: NonNullable<T[S]>
): NonNullable<T[S]> {
  return options == null || !Object.hasOwn(options, key)
    ? defaultValue
    : (options[key] as NonNullable<T[S]>);
}
/**
 * https://github.com/nodejs/node/blob/2a4452a53af65a13db4efae474162a7dcfd38dd5/lib/internal/validators.js#L238
 */
export function validateObject(
  value: unknown,
  name: string,
  options: {
    allowArray?: boolean;
    allowFunction?: boolean;
    nullable?: boolean;
  } | null = null
): asserts value is object {
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
export const validateUnion = <T>(value: T, name: string, union: T[]) => {
  if (ArrayPrototypeIncludes(union, value)) {
    throw new Error(`The argument ${name} is invalid.`);
  }
};
