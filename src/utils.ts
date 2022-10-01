export function objectGetOwn<T extends object, S extends keyof T>(
  obj: T,
  prop: S
) {
  if (Object.hasOwn(obj, prop)) {
    return obj[prop];
  }
}
