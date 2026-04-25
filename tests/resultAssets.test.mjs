import test from "node:test";
import assert from "node:assert/strict";
import { RESULTS } from "../js/data/content.js";
import { getResultImagePath } from "../js/data/resultAssets.js";

test("every result resolves to a local meme image path", () => {
  const paths = RESULTS.map((item) => getResultImagePath(item));

  assert.equal(paths.length, 16);
  assert.ok(
    paths.every((value) =>
      value.startsWith("./resources/personalities-main/")
    )
  );
  assert.equal(new Set(paths).size, 16);
});
