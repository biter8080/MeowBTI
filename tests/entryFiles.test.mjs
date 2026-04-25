import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index.html loads the app through native ES modules", async () => {
  const indexHtml = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8"
  );

  assert.match(
    indexHtml,
    /<script\s+type="module"\s+src="\.\/js\/main\.js"><\/script>/
  );
});
