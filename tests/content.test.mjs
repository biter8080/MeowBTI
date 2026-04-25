import test from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, RESULTS, AUXILIARY_COPY } from "../js/data/content.js";

test("QUESTIONS contains 24 prompts with unique ids", () => {
  assert.equal(QUESTIONS.length, 24);
  assert.equal(new Set(QUESTIONS.map((item) => item.id)).size, 24);
  assert.ok(QUESTIONS.every((item) => item.options.length === 4));
});

test("RESULTS contains 16 type definitions with unique type codes", () => {
  assert.equal(RESULTS.length, 16);
  assert.equal(new Set(RESULTS.map((item) => item.typeCode)).size, 16);
});

test("AUXILIARY_COPY exposes all four E/P combinations", () => {
  assert.deepEqual(Object.keys(AUXILIARY_COPY).sort(), [
    "E+P+",
    "E+P-",
    "E-P+",
    "E-P-"
  ]);
});
