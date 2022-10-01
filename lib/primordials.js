"use strict";

module.exports = {
  ArrayPrototypeForEach: require("array.prototype.foreach"),
  ArrayPrototypeIncludes: require("array-includes"),
  ArrayPrototypeMap: require("array.prototype.map"),
  ArrayPrototypePush: require("array.prototype.push"),
  ArrayPrototypePushApply: function ArrayPrototypePushApply(thisArg, args) {
    var push = require("array.prototype.push");

    return push.apply(void 0, [thisArg].concat(args));
  },
  ArrayPrototypeShift: function ArrayPrototypeShift() {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    return Array.prototype.shift.apply(arguments[0], args);
  },
  ArrayPrototypeSlice: require("array.prototype.slice"),
  ArrayPrototypeJoin: require("array.prototype.join"),
  ArrayPrototypeUnshiftApply: function ArrayPrototypeUnshiftApply(thisArg, args) {
    var unshift = require("array.prototype.unshift");

    return unshift.apply(void 0, [thisArg].concat(args));
  },
  ArrayPrototypeFind: require("array.prototype.find"),
  ArrayIsArray: Array.isArray,
  ObjectEntries: require("object.entries"),
  ObjectHasOwn: require("object.hasown"),
  ObjectFreeze: Object.freeze,
  ObjectCreate: Object.create,
  StringPrototypeCharAt: function StringPrototypeCharAt() {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.charAt.apply(arguments[0], args);
  },
  StringPrototypeIndexOf: function StringPrototypeIndexOf() {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.indexOf.apply(arguments[0], args);
  },
  StringPrototypeSlice: function StringPrototypeSlice() {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    return String.prototype.slice.apply(arguments[0], args);
  },
  StringPrototypeStartsWith: require("string.prototype.startswith"),
  StringPrototypeIncludes: require("string.prototype.includes")
};