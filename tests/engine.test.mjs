import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyScores,
  applyAnswer,
  resolveTypeCode,
  resolveAuxiliaryCode,
  resolveResultByType
} from "../js/core/engine.js";
import { RESULTS } from "../js/data/content.js";

test("applyAnswer adds score to the targeted dimension", () => {
  const next = applyAnswer(createEmptyScores(), {
    dimension: "S",
    optionKey: "A",
    scoreMap: { A: 2, B: 1, C: -1, D: -2 }
  });

  assert.equal(next.S, 2);
  assert.equal(next.E, 0);
});

test("resolveTypeCode treats zero as positive", () => {
  const typeCode = resolveTypeCode({
    S: 0,
    A: -2,
    O: 3,
    D: -1,
    E: 0,
    P: 0
  });

  assert.equal(typeCode, "S+A-O+D-");
});

test("resolveAuxiliaryCode builds the expected E/P suffix", () => {
  const code = resolveAuxiliaryCode({
    S: 0,
    A: 0,
    O: 0,
    D: 0,
    E: -1,
    P: 5
  });

  assert.equal(code, "E-P+");
});

test("resolveResultByType maps the type code to content", () => {
  const result = resolveResultByType(RESULTS, "S+A+O+D-");
  assert.equal(result?.name, "打工猫");
});
