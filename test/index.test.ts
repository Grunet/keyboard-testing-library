import { expect, test } from "@jest/globals";
import { sum } from "../dist/index.js";

test("basic", () => {
  expect(sum(1, 2)).toBe(3);
});
