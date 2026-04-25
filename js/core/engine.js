(function (global) {
const MaoBTI = global.MaoBTI || (global.MaoBTI = {});
const DIMENSIONS = ["S", "E", "A", "O", "D", "P"];

function createEmptyScores() {
  return Object.fromEntries(DIMENSIONS.map((key) => [key, 0]));
}

function applyAnswer(scores, question) {
  const next = { ...scores };
  next[question.dimension] += question.scoreMap[question.optionKey];
  return next;
}

function axisSuffix(value) {
  return value >= 0 ? "+" : "-";
}

function resolveTypeCode(scores) {
  return [
    `S${axisSuffix(scores.S)}`,
    `A${axisSuffix(scores.A)}`,
    `O${axisSuffix(scores.O)}`,
    `D${axisSuffix(scores.D)}`
  ].join("");
}

function resolveAuxiliaryCode(scores) {
  return `E${axisSuffix(scores.E)}P${axisSuffix(scores.P)}`;
}

function resolveResultByType(results, typeCode) {
  return results.find((item) => item.typeCode === typeCode) ?? null;
}

Object.assign(MaoBTI, {
  applyAnswer,
  createEmptyScores,
  resolveAuxiliaryCode,
  resolveResultByType,
  resolveTypeCode
});
})(globalThis);
