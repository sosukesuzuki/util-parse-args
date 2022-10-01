import ObjectHasOwn from "object.hasown";

export function objectGetOwn(obj, prop) {
  if (ObjectHasOwn(obj, prop)) {
    return obj[prop];
  }
}
