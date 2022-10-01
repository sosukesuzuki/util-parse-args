import { describe, it, expect } from "vitest";

import { validateArray, validateString } from "../../src/validators";

describe("validateArray", () => {
  it("throws an error when value is not an array", () => {
    expect(() =>
      validateArray("this is not an array", "nonarray")
    ).toThrowError(`The argument nonarray is invalid.`);
  });

  it("throws an error when value is too long array", () => {
    expect(() => validateArray([1, 2, 3], "tooShortArray", 4)).toThrowError(
      `The argument tooShortArray must be longer than 4.`
    );
  });

  it("doesn't throw an error when value is an array", () => {
    expect(() => validateArray([1, 2, 3], "array")).not.toThrowError();
  });
});

describe("validateString", () => {
  it("throws an error when value is not a string", () => {
    expect(() => validateString(3, "three")).toThrowError(
      `The argument three is invalid.`
    );
  });

  it("doesn't throw an error when value is a string", () => {
    expect(() => validateString("3", "three")).not.toThrowError();
  });
});
