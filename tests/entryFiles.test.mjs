import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function normalizeIndexHtml(source) {
  return source
    .replace(/<script[^>]*><\/script>/, "<script></script>")
    .replace(/\r\n/g, "\n")
    .trim();
}

test("index.html and index.dev.html keep the same shell markup", async () => {
  const [indexHtml, indexDevHtml] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../index.dev.html", import.meta.url), "utf8")
  ]);

  assert.equal(
    normalizeIndexHtml(indexHtml),
    normalizeIndexHtml(indexDevHtml)
  );
});
