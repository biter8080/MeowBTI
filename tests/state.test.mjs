import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  answerQuestion,
  goBackOneQuestion,
  loadLastResult,
  loadSession,
  saveLastResult
} from "../js/core/state.js";

const questionScoreMap = { A: 2, B: 1, C: -1, D: -2 };

const questions = [
  {
    id: "Q1",
    dimension: "S",
    scoreMap: questionScoreMap
  },
  {
    id: "Q2",
    dimension: "E",
    scoreMap: questionScoreMap
  }
];

test("answerQuestion records answer, updates score and advances index", () => {
  const state = createInitialState();
  const next = answerQuestion(state, questions, "Q1", "B");

  assert.equal(next.currentQuestionIndex, 1);
  assert.equal(next.answers.Q1, "B");
  assert.equal(next.scores.S, 1);
});

test("goBackOneQuestion reverses the last score contribution", () => {
  const first = answerQuestion(createInitialState(), questions, "Q1", "A");
  const previous = goBackOneQuestion(first, questions);

  assert.equal(previous.currentQuestionIndex, 0);
  assert.equal(previous.answers.Q1, undefined);
  assert.equal(previous.scores.S, 0);
});

test("loadSession returns a safe fallback for broken JSON", () => {
  const storage = { getItem: () => "{broken" };
  const state = loadSession(storage);
  assert.equal(state.currentQuestionIndex, 0);
});

test("saveLastResult and loadLastResult round-trip result payload", () => {
  let storedValue = "";
  const storage = {
    setItem: (_key, value) => {
      storedValue = value;
    },
    getItem: () => storedValue
  };

  saveLastResult(storage, { typeCode: "S+A+O+D+", name: "权威猫" });
  const result = loadLastResult(storage);
  assert.equal(result?.name, "权威猫");
});
