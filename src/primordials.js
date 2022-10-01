"use strict";

module.exports = {
  ArrayPrototypeForEach: require("array.prototype.foreach"),
  ArrayPrototypeIncludes: require("array-includes"),
  ArrayPrototypeMap: require("array.prototype.map"),
  ArrayPrototypePush: require("array.prototype.push"),
  ArrayPrototypePushApply: require("array.prototype.push").apply,
  ArrayPrototypeShift: Array.prototype.shift.call,
  ArrayPrototypeSlice: require("array.prototype.slice"),
  ArrayPrototypeJoin: require("array.prototype.join"),
  ArrayPrototypeUnshiftApply: require("array.prototype.unshift").apply,
  ArrayPrototypeFind: require("array.prototype.find"),
  ArrayIsArray: Array.isArray,
  ObjectEntries: require("object.entries"),
  ObjectHasOwn: require("object.hasown"),
  ObjectFreeze: Object.freeze,
  ObjectCreate: Object.create,
  StringPrototypeCharAt: String.prototype.charAt.call,
  StringPrototypeIndexOf: String.prototype.indexOf,
  StringPrototypeSlice: String.prototype.slice,
  StringPrototypeStartsWith: require("string.prototype.startswith"),
  StringPrototypeIncludes: require("string.prototype.includes"),
};
