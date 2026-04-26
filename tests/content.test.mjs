import test from "node:test";
import assert from "node:assert/strict";
import { loadAppScripts } from "./helpers/loadAppScripts.mjs";

const { QUESTIONS, RESULTS, AUXILIARY_COPY } = await loadAppScripts();

test("QUESTIONS contains 25 prompts with unique ids", () => {
  assert.equal(QUESTIONS.length, 25);
  assert.equal(new Set(QUESTIONS.map((item) => item.id)).size, 25);
  assert.ok(QUESTIONS.every((item) => item.options.length === 4));
});

test("QUESTIONS starts with the funny zero-score opener", () => {
  assert.equal(QUESTIONS[0].id, "Q1");
  assert.equal(QUESTIONS[0].dimension, "S");
  assert.equal(QUESTIONS[0].prompt, "喵喵喵喵喵喵喵喵？");
  assert.deepEqual(
    QUESTIONS[0].options.map((item) => item.text),
    ["喵喵喵喵，喵呜", "喵呜，喵喵喵喵", "喵呜", "喵喵呜"]
  );
  assert.deepEqual(QUESTIONS[0].scoreMap, { A: 0, B: 0, C: 0, D: 0 });
  assert.deepEqual(
    QUESTIONS[0].options.map((item) => item.image),
    [
      "./resources/quiz-options/q01/a.png",
      "./resources/quiz-options/q01/b.png",
      "./resources/quiz-options/q01/c.png",
      "./resources/quiz-options/q01/d.png"
    ]
  );
});

test("RESULTS contains 16 type definitions with unique type codes", () => {
  assert.equal(RESULTS.length, 16);
  assert.equal(new Set(RESULTS.map((item) => item.typeCode)).size, 16);
});

test("RESULTS shareText avoids repeating the resolved result name", () => {
  assert.equal(RESULTS.length, 16);
  assert.ok(RESULTS.every((item) => !item.shareText.includes(item.name)));
  assert.ok(
    RESULTS.every((item) => typeof item.shareText === "string" && item.shareText.length > 0)
  );
});

test("AUXILIARY_COPY exposes all four E/P combinations", () => {
  assert.deepEqual(Object.keys(AUXILIARY_COPY).sort(), [
    "E+P+",
    "E+P-",
    "E-P+",
    "E-P-"
  ]);
});
