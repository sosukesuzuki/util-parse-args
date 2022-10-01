"use strict";

module.exports = {
  ArrayPrototypeForEach: require("array.prototype.foreach"),
  ArrayPrototypeIncludes: require("array-includes"),
  ArrayPrototypeMap: require("array.prototype.map"),
  ArrayPrototypePush: require("array.prototype.push"),
  ArrayPrototypePushApply: function (thisArg, args) {
    const push = require("array.prototype.push");
    return push.apply(void 0, [thisArg].concat(args));
  },
  ArrayPrototypeShift: function () {
    const args = Array.prototype.slice.call(arguments);
    args.shift();
    return Array.prototype.shift.apply(arguments[0], args);
  },
  ArrayPrototypeSlice: require("array.prototype.slice"),
  ArrayPrototypeJoin: require("array.prototype.join"),
  ArrayPrototypeUnshiftApply: function (thisArg, args) {
    const unshift = require("array.prototype.unshift");
    return unshift.apply(void 0, [thisArg].concat(args));
  },
  ArrayPrototypeFind: require("array.prototype.find"),
  ArrayIsArray: Array.isArray,
  ObjectEntries: require("object.entries"),
  ObjectHasOwn: require("object.hasown"),
  ObjectFreeze: Object.freeze,
  ObjectCreate: Object.create,
  StringPrototypeCharAt: function () {
    const args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.charAt.apply(arguments[0], args);
  },
  StringPrototypeIndexOf: function () {
    const args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.indexOf.apply(arguments[0], args);
  },
  StringPrototypeSlice: function () {
    const args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.slice.apply(arguments[0], args);
  },
  StringPrototypeStartsWith: require("string.prototype.startswith"),
  StringPrototypeIncludes: require("string.prototype.includes"),
};
