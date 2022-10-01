import ObjectHasOwn from "object.hasown";

export function objectGetOwn<T extends object, S extends keyof T>(
  obj: T,
  prop: S
) {
  if (ObjectHasOwn(obj, prop)) {
    return obj[prop];
  }
}
